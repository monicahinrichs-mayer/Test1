// Gemeinsame Hilfen der Tests: ein kleiner statischer Dateiserver über der Wurzel des Repositorys (so lösen sich /src/
// und /docs/ auf), ein Chromium über Playwright und die Tabelle der Fragen, unabhängig vom Code des Formulars gelesen.

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

export const WURZEL = fileURLToPath(new URL("..", import.meta.url));

const TYPEN = {
  ".html": "text/html; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
};

/** Liefert die Dateien des Repositorys aus, wie GitHub Pages es täte; nur auf 127.0.0.1. */
export async function starteServer() {
  const wurzel = normalize(WURZEL.endsWith(sep) ? WURZEL : WURZEL + sep);
  const server = createServer(async (anfrage, antwort) => {
    try {
      let pfad = decodeURIComponent(new URL(anfrage.url, "http://localhost").pathname);
      if (pfad.endsWith("/")) pfad += "index.html";
      const datei = normalize(join(wurzel, pfad));
      if (!datei.startsWith(wurzel)) throw new Error("außerhalb der Wurzel");
      const inhalt = await readFile(datei);
      antwort.writeHead(200, { "content-type": TYPEN[extname(datei)] ?? "application/octet-stream" });
      antwort.end(inhalt);
    } catch {
      antwort.writeHead(404, { "content-type": "text/plain" });
      antwort.end("nicht gefunden");
    }
  });
  await new Promise((fertig) => server.listen(0, "127.0.0.1", fertig));
  const ursprung = `http://127.0.0.1:${server.address().port}`;
  return {
    ursprung,
    adresse: `${ursprung}/src/`,
    schliesse: () =>
      new Promise((fertig) => {
        server.closeAllConnections();
        server.close(() => fertig());
      }),
  };
}

// Läuft in jeder Seite vor ihren eigenen Skripten: hält fest, welche Datei per Download-Link gespeichert und welche
// mailto:-Adresse geöffnet wird, in dieser Reihenfolge. Die mailto:-Navigation wird angehalten, damit der Test
// weiterläuft.
function beobachter() {
  window.__ereignisse = [];
  document.addEventListener(
    "click",
    (ereignis) => {
      const link = ereignis.target instanceof Element ? ereignis.target.closest("a[download]") : null;
      if (link) window.__ereignisse.push({ art: "datei", name: link.download, adresse: link.href });
    },
    true,
  );
  if (window.navigation) {
    window.navigation.addEventListener("navigate", (ereignis) => {
      if (ereignis.destination.url.startsWith("mailto:")) {
        window.__ereignisse.push({ art: "mailto", adresse: ereignis.destination.url });
        ereignis.preventDefault();
      }
    });
  }
}

/** Ist die Adresse auf einem anderen Ursprung als dem der Seite? data: und blob: der Seite gelten als eigen. */
export function istFremd(adresse, ursprung) {
  if (adresse.startsWith("data:")) return false;
  return new URL(adresse).origin !== ursprung;
}

/** Server und Chromium für eine Testdatei; neueSeite() gibt je Aufruf einen frischen Browserkontext. */
export async function starteUmgebung() {
  const server = await starteServer();
  const browser = await chromium.launch();
  return {
    ...server,
    browser,
    async neueSeite({ breite = 1280, hoehe = 800 } = {}) {
      const kontext = await browser.newContext({ viewport: { width: breite, height: hoehe }, acceptDownloads: true });
      const anfragen = [];
      kontext.on("request", (anfrage) => anfragen.push(anfrage.url()));
      // Nichts verlässt den Rechner: jede Anfrage an einen fremden Ursprung wird abgebrochen (aber oben gezählt).
      await kontext.route((url) => url.origin !== server.ursprung, (route) => route.abort());
      await kontext.addInitScript(beobachter);
      const seite = await kontext.newPage();
      return { kontext, seite, anfragen };
    },
    async schliesse() {
      await browser.close();
      await server.schliesse();
    },
  };
}

/** Öffnet das Formular und wartet, bis es gezeichnet ist. */
export async function ladeFormular(seite, adresse) {
  await seite.goto(adresse);
  await seite.waitForSelector("#feld-K1");
}

/** Füllt Antworten { Nr: Wert } in die Felder, je nach Antwortart des Feldes. */
export async function fuelleAus(seite, antworten) {
  for (const [nr, wert] of Object.entries(antworten)) {
    const feld = seite.locator(`#feld-${nr}`);
    const typ = await feld.evaluate((element) => element.type);
    if (typ === "fieldset") await seite.locator(`input[name="${nr}"][value="${wert}"]`).check();
    else if (typ === "checkbox") await (wert === "ja" ? feld.check() : feld.uncheck());
    else await feld.fill(wert);
  }
}

/** Die Tabelle docs/antragsfragen.md, unabhängig vom Code des Formulars gelesen: Abschnitte mit ihren Fragen. */
export function tabelle() {
  const text = readFileSync(join(WURZEL, "docs", "antragsfragen.md"), "utf8");
  const abschnitte = [];
  for (const zeile of text.split(/\r?\n/)) {
    if (zeile.startsWith("## ")) {
      abschnitte.push({ titel: zeile.slice(3).trim(), fragen: [] });
      continue;
    }
    if (!zeile.startsWith("|")) continue;
    const [nr, frage, antwort, pflicht] = zeile.split("|").slice(1, -1).map((zelle) => zelle.trim());
    if (!/^[A-Z]\d+$/.test(nr)) continue;
    const auswahl = antwort.startsWith("Auswahl:");
    abschnitte.at(-1).fragen.push({
      nr,
      text: frage,
      art: auswahl ? "Auswahl" : antwort,
      moeglichkeiten: auswahl ? antwort.slice("Auswahl:".length).split("·").map((m) => m.trim()) : [],
      pflicht,
    });
  }
  return abschnitte;
}

/** Alle Fragen der Tabelle in Reihenfolge. */
export const alleFragen = () => tabelle().flatMap((abschnitt) => abschnitt.fragen);

/** Ein vollständiger Antrag: jede Frage beantwortet, jede Auswahl mit ihrer ersten Möglichkeit. */
export function vollstaendigeAntworten() {
  const antworten = {};
  for (const frage of alleFragen()) {
    if (frage.art === "Text") antworten[frage.nr] = `Antwort_${frage.nr}_q7x`;
    else if (frage.art === "Datum") antworten[frage.nr] = "2026-11-24";
    else if (frage.art === "Auswahl") antworten[frage.nr] = frage.moeglichkeiten[0];
    else antworten[frage.nr] = "ja";
  }
  return antworten;
}

/** Prüft, dass jedes Teil in dieser Reihenfolge im Text steht. */
export function stehtInReihenfolge(text, teile) {
  let ab = 0;
  for (const teil of teile) {
    const stelle = text.indexOf(teil, ab);
    if (stelle < 0) return `fehlt oder steht nicht in Reihenfolge: ${teil}`;
    ab = stelle + teil.length;
  }
  return null;
}

/** Leerraum zu einem Leerzeichen, wie ihn Zeilenumbrüche in Word und PDF hinterlassen. */
export const glaette = (text) => text.replace(/\s+/g, " ").trim();
