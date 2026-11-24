// EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS, DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT,
// DAS FORMULAR NENNT, WOHIN ES SENDET.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { EMPFAENGER, MAILTO } from "../src/einreichen/index.mjs";
import { alleFragen, fuelleAus, ladeFormular, starteUmgebung, vollstaendigeAntworten } from "./hilfen.mjs";

// Empfänger, Betreff und Text einer mailto:-Adresse.
function teile(adresse) {
  const url = new URL(adresse);
  return { schema: url.protocol, empfaenger: decodeURIComponent(url.pathname), felder: [...url.searchParams] };
}

describe("Die mailto:-Adresse", () => {
  test("nennt genau Empfänger, Betreff und einen Text, der bittet, das gespeicherte Word-Dokument anzuhängen", () => {
    assert.equal(EMPFAENGER, "cio-office@fau.de");
    const { schema, empfaenger, felder } = teile(MAILTO);
    assert.equal(schema, "mailto:");
    assert.equal(empfaenger, "cio-office@fau.de");
    assert.deepEqual(felder.map(([name]) => name), ["subject", "body"]);
    assert.equal(felder[0][1], "Antrag neues IuK-Projekt");
    assert.match(felder[1][1], /eben gespeicherte Word-Dokument/);
    assert.match(felder[1][1], /an diese Mail an/);
  });
});

describe("Einreichen im Browser", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  test("DAS FORMULAR NENNT, WOHIN ES SENDET — der Empfänger steht sichtbar am Bedienelement", async () => {
    const { seite, kontext } = await umgebung.neueSeite({ breite: 320, hoehe: 640 });
    await ladeFormular(seite, umgebung.adresse);
    const knopf = seite.getByRole("button", { name: "Einreichen" });
    await knopf.scrollIntoViewIfNeeded();
    const daneben = seite.locator(".einreichen", { has: knopf });
    assert.equal(await daneben.isVisible(), true);
    assert.match(await daneben.innerText(), /cio-office@fau\.de/);
    const beschreibung = seite.locator(`#${await knopf.getAttribute("aria-describedby")}`);
    assert.equal(await beschreibung.isVisible(), true);
    assert.match(await beschreibung.innerText(), /an cio-office@fau\.de/);
    await kontext.close();
  });

  test("mit unbeantworteten Pflichtfragen: keine Datei, keine mailto:-Adresse, die Liste nennt genau sie, Fokus in der ersten", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    // K3 leer, Z1 nur Leerraum, K1 ein Datum, das es nicht gibt, V2 Pflicht durch V1 = Ja, aber leer.
    const antworten = { ...vollstaendigeAntworten(), Z1: "   ", V1: "Ja" };
    delete antworten.K3;
    delete antworten.K1;
    delete antworten.V2;
    await fuelleAus(seite, antworten);
    await seite.evaluate(() => {
      // 31.02. kann ein Datumsfeld nicht annehmen; der gespeicherte Stand könnte es dennoch enthalten.
      const stand = JSON.parse(localStorage.getItem("iuk-antrag:v1"));
      localStorage.setItem("iuk-antrag:v1", JSON.stringify({ ...stand, K1: "2026-02-31" }));
    });
    await seite.reload();
    await seite.waitForSelector("#feld-K1");

    let dateien = 0;
    seite.on("download", () => dateien++);
    await seite.locator("#einreichen").click(); // ein Klick
    await seite.waitForSelector("#fehlend a");
    await seite.waitForTimeout(1500); // Zeit für eine Datei, die nicht entstehen darf

    assert.equal(dateien, 0, "keine Datei");
    assert.deepEqual(await seite.evaluate(() => window.__ereignisse), [], "keine Datei und keine mailto:-Adresse");
    const genannt = await seite.locator("#fehlend a").evaluateAll((links) => links.map((a) => [a.dataset.ziel, a.textContent]));
    const text = new Map(alleFragen().map((f) => [f.nr, f.text]));
    assert.deepEqual(
      genannt,
      ["K1", "K3", "Z1", "V2"].map((nr) => [nr, `${nr} ${text.get(nr)}`]),
    );
    assert.equal(await seite.locator("#fehlend").getAttribute("role"), "alert");
    assert.equal(await seite.evaluate(() => document.activeElement?.id), "feld-K1", "Fokus in der ersten");
    await kontext.close();
  });

  test("ein Klick auf einen vollständigen Antrag ergibt zuerst eine Datei .docx, dann die mailto:-Adresse ohne Eingabe", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    const antworten = vollstaendigeAntworten();
    await fuelleAus(seite, antworten);

    const datei = seite.waitForEvent("download");
    await seite.locator("#einreichen").click(); // ein Klick
    const download = await datei;
    await seite.waitForFunction(() => window.__ereignisse.some((e) => e.art === "mailto"));
    const ereignisse = await seite.evaluate(() => window.__ereignisse);

    assert.deepEqual(ereignisse.map((e) => e.art), ["datei", "mailto"], "zuerst die Datei, dann das Mailprogramm");
    assert.match(ereignisse[0].name, /^IuK-Antrag_\d{4}-\d{2}-\d{2}\.docx$/);
    assert.match(download.suggestedFilename(), /\.docx$/);
    const inhalt = await readFile(await download.path());
    assert.equal(inhalt.subarray(0, 2).toString("latin1"), "PK", "ein Word-Dokument ist ein ZIP-Archiv");

    const adresse = ereignisse[1].adresse;
    assert.deepEqual(teile(adresse), teile(MAILTO), "genau Empfänger, Betreff und Text");
    const entschluesselt = decodeURIComponent(adresse);
    for (const eingabe of Object.values(antworten).filter((wert) => wert.length > 4)) {
      assert.ok(!entschluesselt.includes(eingabe), `„${eingabe}“ steht in der mailto:-Adresse`);
    }
    await kontext.close();
  });
});
