// PFLICHTFELDER, EINE PFLICHTFRAGE IST BEANTWORTET, WENN IHRE ANTWORT GÜLTIG IST, JEDE PFLICHTFRAGE IST GEKENNZEICHNET.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { katalogAusMarkdown } from "../src/fragenkatalog/index.mjs";
import { fehlendePflichtfragen, istBeantwortet, istPflicht } from "../src/pruefung/index.mjs";
import { WURZEL, alleFragen, fuelleAus, ladeFormular, starteUmgebung, vollstaendigeAntworten } from "./hilfen.mjs";

const lese = (datei) => readFileSync(join(WURZEL, "docs", datei), "utf8");
const katalog = katalogAusMarkdown(lese("antragsfragen.md"), lese("erklaerungen.md"));
const frageJe = new Map(katalog.flatMap((a) => a.fragen).map((f) => [f.nr, f]));

describe("PFLICHTFELDER", () => {
  test("die Pflicht jeder Frage gleicht der Spalte Pflicht der Tabelle", () => {
    for (const zeile of alleFragen()) {
      const frage = frageJe.get(zeile.nr);
      if (zeile.pflicht === "ja") assert.equal(istPflicht(frage, {}), true, zeile.nr);
      else if (zeile.pflicht === "nein") assert.equal(istPflicht(frage, {}), false, zeile.nr);
      else {
        const [, ausloeser, wert] = /^wenn ([A-Z]\d+) = (.+)$/.exec(zeile.pflicht);
        assert.equal(wert, "Ja", zeile.nr);
        assert.equal(istPflicht(frage, { [ausloeser]: "Ja" }), true, `${zeile.nr} bei ${ausloeser} = Ja`);
        assert.equal(istPflicht(frage, { [ausloeser]: "Nein" }), false, `${zeile.nr} bei ${ausloeser} = Nein`);
        assert.equal(istPflicht(frage, {}), false, `${zeile.nr} ohne Antwort auf ${ausloeser}`);
      }
    }
  });

  test("V2, V4 und C5 hängen an V1, V3 und C4; nur P5 und P6 sind nie Pflicht", () => {
    const bedingt = alleFragen().filter((f) => f.pflicht.startsWith("wenn")).map((f) => [f.nr, f.pflicht]);
    assert.deepEqual(bedingt, [
      ["V2", "wenn V1 = Ja"],
      ["V4", "wenn V3 = Ja"],
      ["C5", "wenn C4 = Ja"],
    ]);
    assert.deepEqual(alleFragen().filter((f) => f.pflicht === "nein").map((f) => f.nr), ["P5", "P6"]);
  });

  test("fehlendePflichtfragen nennt jede unbeantwortete Pflichtfrage in Reihenfolge", () => {
    const erwartet = alleFragen().filter((f) => f.pflicht === "ja").map((f) => f.nr);
    assert.deepEqual(fehlendePflichtfragen(katalog, {}).map((f) => f.nr), erwartet);
    assert.deepEqual(fehlendePflichtfragen(katalog, vollstaendigeAntworten()), []);
    const ohneV2 = { ...vollstaendigeAntworten(), V2: "  " };
    assert.deepEqual(fehlendePflichtfragen(katalog, ohneV2).map((f) => f.nr), ["V2"]);
    assert.deepEqual(fehlendePflichtfragen(katalog, { ...ohneV2, V1: "Nein" }), []);
  });
});

describe("EINE PFLICHTFRAGE IST BEANTWORTET, WENN IHRE ANTWORT GÜLTIG IST", () => {
  test("Text: ein Zeichen außer Leerraum", () => {
    const frage = frageJe.get("K3");
    assert.equal(istBeantwortet(frage, "Moodle"), true);
    assert.equal(istBeantwortet(frage, "  x "), true);
    assert.equal(istBeantwortet(frage, "   "), false, "nur Leerzeichen");
    assert.equal(istBeantwortet(frage, " \n\t "), false, "nur Leerraum");
    assert.equal(istBeantwortet(frage, ""), false);
    assert.equal(istBeantwortet(frage, undefined), false);
  });

  test("Datum: ein gültiges Kalenderdatum", () => {
    const frage = frageJe.get("K1");
    assert.equal(istBeantwortet(frage, "2026-11-24"), true);
    assert.equal(istBeantwortet(frage, "2024-02-29"), true, "Schalttag");
    assert.equal(istBeantwortet(frage, "2026-02-31"), false, "31.02.");
    assert.equal(istBeantwortet(frage, "2026-02-29"), false, "kein Schaltjahr");
    assert.equal(istBeantwortet(frage, "2026-13-01"), false);
    assert.equal(istBeantwortet(frage, "31.02.2026"), false);
    assert.equal(istBeantwortet(frage, ""), false);
  });

  test("Auswahl: eine ihrer Möglichkeiten", () => {
    const frage = frageJe.get("D3");
    assert.equal(istBeantwortet(frage, "Ja, wird nachgereicht"), true);
    assert.equal(istBeantwortet(frage, "Vielleicht"), false);
    assert.equal(istBeantwortet(frage, ""), false);
    assert.equal(istBeantwortet(frage, undefined), false);
  });
});

describe("JEDE PFLICHTFRAGE IST GEKENNZEICHNET", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  // Probleme der Kennzeichnung einer Frage: das Feld trägt aria-required="true", der Titel einen sichtbaren Hinweis
  // in Text oder Zeichen („*“ oder „Pflicht“) — Farbe allein genügt nicht.
  const kennzeichnung = (seite, nr) =>
    seite.evaluate((nr) => {
      const probleme = [];
      const feld = document.getElementById(`feld-${nr}`);
      if (feld?.getAttribute("aria-required") !== "true") probleme.push("aria-required fehlt");
      const titel = document.querySelector(`[data-nr="${nr}"] .frage-titel`);
      const zeichen = [...(titel?.querySelectorAll("*") ?? [])].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility === "visible" && /\*|Pflicht/.test(e.textContent);
      });
      if (zeichen.length === 0) probleme.push("kein sichtbarer Hinweis in Text oder Zeichen");
      return probleme;
    }, nr);

  test("jedes Feld einer Pflichtfrage trägt aria-required und einen sichtbaren Hinweis", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    for (const frage of alleFragen()) {
      const probleme = await kennzeichnung(seite, frage.nr);
      if (frage.pflicht === "ja") assert.deepEqual(probleme, [], frage.nr);
      else assert.equal(probleme.length, 2, `${frage.nr} ist anfangs keine Pflichtfrage`);
    }
    // Die Folgefragen werden Pflicht mit „Ja“ und nicht mit „Nein“.
    for (const [ausloeser, folge] of [["V1", "V2"], ["V3", "V4"], ["C4", "C5"]]) {
      await fuelleAus(seite, { [ausloeser]: "Ja" });
      assert.deepEqual(await kennzeichnung(seite, folge), [], `${folge} bei ${ausloeser} = Ja`);
      await fuelleAus(seite, { [ausloeser]: "Nein" });
      assert.equal((await kennzeichnung(seite, folge)).length, 2, `${folge} bei ${ausloeser} = Nein`);
    }
    await kontext.close();
  });

  test("Gegenprobe: ein Feld, das nur durch Farbe gekennzeichnet ist, schlägt fehl", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    await seite.evaluate(() => {
      const frage = document.createElement("div");
      frage.className = "frage";
      frage.dataset.nr = "X9";
      const titel = document.createElement("label");
      titel.className = "frage-titel";
      titel.htmlFor = "feld-X9";
      titel.textContent = "X9 Eine Frage, nur rot markiert";
      titel.style.color = "#c00";
      const feld = document.createElement("textarea");
      feld.id = "feld-X9";
      feld.style.borderColor = "#c00";
      frage.append(titel, feld);
      document.querySelector("form").append(frage);
    });
    assert.notDeepEqual(await kennzeichnung(seite, "X9"), []);
    await kontext.close();
  });
});
