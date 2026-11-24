// DER ANTRAG WIRD ALS WORD-DOKUMENT EXPORTIERT, DER ANTRAG WIRD ALS PDF EXPORTIERT,
// DER EXPORT ENTHÄLT JEDE FRAGE MIT IHRER ANTWORT, EIN UNVOLLSTÄNDIGER EXPORT IST ALS ENTWURF GEKENNZEICHNET.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
GlobalWorkerOptions.workerSrc = import.meta.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
import { katalogAusMarkdown } from "../src/fragenkatalog/index.mjs";
import { zeilen } from "../src/export/index.mjs";
import {
  WURZEL,
  fuelleAus,
  glaette,
  ladeFormular,
  starteUmgebung,
  stehtInReihenfolge,
  tabelle,
  vollstaendigeAntworten,
} from "./hilfen.mjs";

const TITEL = "Antrag auf ein neues IuK-Projekt";
const VERMERK = "Entwurf – unvollständig";
const NICHT = "nicht beantwortet";

// Was im Dokument stehen muss, in Reihenfolge: je Abschnitt seine Überschrift, je Frage „Nr Text“ und ihre Antwort.
function erwartet(antworten) {
  const teile = [];
  for (const abschnitt of tabelle()) {
    teile.push(abschnitt.titel);
    for (const frage of abschnitt.fragen) {
      teile.push(`${frage.nr} ${frage.text}`);
      const antwort = antworten[frage.nr];
      if (!antwort || !antwort.trim()) teile.push(NICHT);
      else if (frage.art === "Datum") teile.push(antwort.split("-").reverse().join("."));
      else if (frage.art === "Hinweis") teile.push("beigefügt");
      else teile.push(antwort);
    }
  }
  return teile.map(glaette);
}

// Der Text eines Word-Dokuments, Absatz für Absatz; zugleich der Beweis, dass es sich als Word-Dokument öffnet.
async function wordText(pfad) {
  const zip = await JSZip.loadAsync(await readFile(pfad));
  const typen = await zip.file("[Content_Types].xml")?.async("string");
  assert.ok(typen?.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"), "Word-Inhaltstyp");
  const xml = await zip.file("word/document.xml").async("string");
  const entitaet = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
  return xml
    .split("</w:p>")
    .map((absatz) =>
      [...absatz.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:br\/>/g)]
        .map((m) => (m[1] === undefined ? " " : m[1].replace(/&(amp|lt|gt|quot|apos);/g, (_, e) => entitaet[e])))
        .join(""),
    )
    .map(glaette)
    .filter(Boolean);
}

// Der Text eines PDF, Zeile für Zeile; zugleich der Beweis, dass es sich als PDF öffnet.
async function pdfText(pfad) {
  const daten = new Uint8Array(await readFile(pfad));
  assert.equal(new TextDecoder("latin1").decode(daten.slice(0, 5)), "%PDF-");
  const pdf = await getDocument({ data: daten, isEvalSupported: false, useSystemFonts: false, verbosity: 0 }).promise;
  assert.ok(pdf.numPages >= 1);
  const zeilen = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    let y = null;
    for (const teil of (await (await pdf.getPage(n)).getTextContent()).items) {
      if (!("str" in teil)) continue;
      const neueZeile = y === null || Math.abs(teil.transform[5] - y) > 1;
      if (neueZeile) zeilen.push(teil.str);
      else zeilen[zeilen.length - 1] += teil.str;
      y = teil.transform[5];
    }
  }
  await pdf.destroy();
  return zeilen.map(glaette).filter(Boolean);
}

describe("zeilen ohne Bibliothek", () => {
  const lese = (datei) => readFileSync(join(WURZEL, "docs", datei), "utf8");
  const katalog = katalogAusMarkdown(lese("antragsfragen.md"), lese("erklaerungen.md"));

  test("der Vermerk steht genau dann an zweiter Stelle, wenn eine Pflichtfrage unbeantwortet ist", () => {
    const leer = zeilen(katalog, {});
    assert.deepEqual(leer.slice(0, 2), [
      { art: "titel", text: TITEL },
      { art: "vermerk", text: VERMERK },
    ]);
    const voll = zeilen(katalog, vollstaendigeAntworten());
    assert.equal(voll[0].art, "titel");
    assert.ok(!voll.some((z) => z.art === "vermerk"));
  });

  test("jede Frage in Reihenfolge, mit Antwort oder „nicht beantwortet“", () => {
    const antworten = { K3: "Moodle", K2: "Einführung" };
    const text = zeilen(katalog, antworten).flatMap((z) => [z.text, z.antwort ?? ""].filter(Boolean)).map(glaette).join(" ");
    assert.equal(stehtInReihenfolge(text, erwartet(antworten)), null);
  });
});

describe("Export im Browser", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  // Exportiert den Antrag mit diesen Antworten als Word und PDF und gibt den Text beider Dateien.
  async function exportiere(antworten) {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    await fuelleAus(seite, antworten);
    const texte = {};
    for (const [knopf, endung, lese] of [["#als-word", "docx", wordText], ["#als-pdf", "pdf", pdfText]]) {
      const datei = seite.waitForEvent("download");
      await seite.locator(knopf).click(); // ein Klick
      const download = await datei;
      assert.match(download.suggestedFilename(), new RegExp(`^IuK-Antrag_\\d{4}-\\d{2}-\\d{2}\\.${endung}$`));
      texte[endung] = await lese(await download.path());
    }
    await kontext.close();
    return texte;
  }

  test("ein unvollständiger Antrag: Word und PDF beginnen mit dem Vermerk und enthalten jede Frage mit ihrer Antwort", async () => {
    const antworten = { K1: "2026-11-24", K2: "Einführung", K3: "Lernplattform Moodle", P5: "ja", D1: "Ja", I1: "Vertraulichkeit: hoch – Integrität: normal" };
    const texte = await exportiere(antworten);
    for (const [format, absaetze] of Object.entries(texte)) {
      assert.deepEqual(absaetze.slice(0, 2), [TITEL, VERMERK], `${format} beginnt mit dem Vermerk`);
      assert.equal(stehtInReihenfolge(absaetze.join(" "), erwartet(antworten)), null, format);
    }
  });

  test("Gegenprobe: Word und PDF eines vollständigen Antrags enthalten den Vermerk nicht", async () => {
    const antworten = vollstaendigeAntworten();
    const texte = await exportiere(antworten);
    for (const [format, absaetze] of Object.entries(texte)) {
      assert.equal(absaetze[0], TITEL, format);
      assert.ok(!absaetze.join("\n").includes(VERMERK), `${format} ohne Vermerk`);
      assert.ok(!absaetze.join("\n").includes("Entwurf"), `${format} ohne Entwurf`);
      assert.equal(stehtInReihenfolge(absaetze.join(" "), erwartet(antworten)), null, format);
    }
  });
});
