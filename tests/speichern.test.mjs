// EINGABEN BLEIBEN IM BROWSER ERHALTEN, DER ZWISCHENSTAND LIEGT IM LOCALSTORAGE, LÖSCHEN LÖSCHT WIRKLICH,
// KEINE ANTWORT STEHT IN EINER ADRESSE.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { SCHLUESSEL, lies, loesche, schreibe } from "../src/zwischenstand/index.mjs";
import { alleFragen, fuelleAus, ladeFormular, starteUmgebung, vollstaendigeAntworten } from "./hilfen.mjs";

// Ein Speicher wie localStorage, ohne Browser.
function speicher(eintraege = {}) {
  const daten = new Map(Object.entries(eintraege));
  return {
    daten,
    getItem: (k) => (daten.has(k) ? daten.get(k) : null),
    setItem: (k, v) => daten.set(k, String(v)),
    removeItem: (k) => daten.delete(k),
  };
}
const gesperrt = {
  getItem() {
    throw new Error("SecurityError");
  },
  setItem() {
    throw new Error("QuotaExceededError");
  },
  removeItem() {
    throw new Error("SecurityError");
  },
};

const EINIGE = {
  K1: "2026-11-24",
  K2: "Einstellung",
  K3: "Ein Text\nmit Zeilenumbruch",
  P5: "ja",
  D3: "Ja, wird nachgereicht",
  V1: "Ja",
  V2: "Gespräch mit dem RRZE",
};

// Die Werte aller Felder, wie das Formular sie zeigt.
const werte = (seite) =>
  seite.evaluate(() => {
    const ergebnis = {};
    for (const frage of document.querySelectorAll("form [data-nr]")) {
      const nr = frage.dataset.nr;
      const feld = document.getElementById(`feld-${nr}`);
      if (feld.type === "fieldset") ergebnis[nr] = frage.querySelector("input:checked")?.value ?? "";
      else if (feld.type === "checkbox") ergebnis[nr] = feld.checked ? "ja" : "";
      else ergebnis[nr] = feld.value;
    }
    return ergebnis;
  });
const leer = () => Object.fromEntries(alleFragen().map((f) => [f.nr, ""]));

describe("MOD-zwischenstand ohne Browser", () => {
  test("lies, schreibe und loesche halten genau einen Schlüssel", () => {
    const s = speicher({ "andere:einstellung": "bleibt" });
    assert.equal(SCHLUESSEL, "iuk-antrag:v1");
    assert.deepEqual(lies(s), {});
    assert.equal(schreibe({ K3: "Text" }, s), true);
    assert.deepEqual(lies(s), { K3: "Text" });
    assert.deepEqual(JSON.parse(s.daten.get(SCHLUESSEL)), { K3: "Text" });
    loesche(s);
    assert.deepEqual([...s.daten.keys()], ["andere:einstellung"]);
  });

  test("lies gibt {} bei keinem JSON-Objekt oder gesperrtem Speicher; schreibe gibt dann false", () => {
    assert.deepEqual(lies(speicher({ [SCHLUESSEL]: "kein JSON" })), {});
    assert.deepEqual(lies(speicher({ [SCHLUESSEL]: "[1,2]" })), {});
    assert.deepEqual(lies(speicher({ [SCHLUESSEL]: "null" })), {});
    assert.deepEqual(lies(gesperrt), {});
    assert.equal(schreibe({ K3: "Text" }, gesperrt), false);
    assert.doesNotThrow(() => loesche(gesperrt));
  });
});

describe("Zwischenspeichern im Browser", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  test("EINGABEN BLEIBEN IM BROWSER ERHALTEN — Eingaben, Neuladen der Seite, dieselben Eingaben", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    await fuelleAus(seite, EINIGE);
    const vorher = await werte(seite);
    assert.deepEqual(vorher, { ...leer(), ...EINIGE });
    await seite.reload();
    await seite.waitForSelector("#feld-K1");
    assert.deepEqual(await werte(seite), vorher);
    await kontext.close();
  });

  test("DER ZWISCHENSTAND LIEGT IM LOCALSTORAGE — localStorage hält den Stand, document.cookie ist leer", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    await fuelleAus(seite, EINIGE);
    const stand = await seite.evaluate((s) => JSON.parse(localStorage.getItem(s)), SCHLUESSEL);
    assert.deepEqual(stand, EINIGE);
    assert.equal(await seite.evaluate(() => document.cookie), "");
    assert.deepEqual(await kontext.cookies(), []);
    await kontext.close();
  });

  test("LÖSCHEN LÖSCHT WIRKLICH — nach der Rückfrage kein Eintrag des Formulars, nach dem Neuladen alle Felder leer", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    await seite.evaluate(() => localStorage.setItem("andere:einstellung", "bleibt"));
    await fuelleAus(seite, EINIGE);

    // Abbrechen der Rückfrage lässt alles, wie es war.
    seite.once("dialog", (dialog) => dialog.dismiss());
    await seite.locator("#entwurf-loeschen").click();
    assert.deepEqual(await werte(seite), { ...leer(), ...EINIGE });
    assert.notEqual(await seite.evaluate((s) => localStorage.getItem(s), SCHLUESSEL), null);

    // Bestätigen leert jedes Feld und entfernt genau den Schlüssel des Formulars.
    let rueckfrage = "";
    seite.once("dialog", (dialog) => {
      rueckfrage = dialog.type();
      dialog.accept();
    });
    await seite.locator("#entwurf-loeschen").click();
    assert.equal(rueckfrage, "confirm");
    assert.deepEqual(await werte(seite), leer());
    const schluessel = await seite.evaluate(() => Object.keys(localStorage));
    assert.deepEqual(schluessel, ["andere:einstellung"]);

    await seite.reload();
    await seite.waitForSelector("#feld-K1");
    assert.deepEqual(await werte(seite), leer());
    await kontext.close();
  });

  test("KEINE ANTWORT STEHT IN EINER ADRESSE — nach Ausfüllen, Exportieren und Einreichen", async () => {
    const { seite, kontext, anfragen } = await umgebung.neueSeite();
    const navigationen = [];
    seite.on("framenavigated", (rahmen) => navigationen.push(rahmen.url()));
    await ladeFormular(seite, umgebung.adresse);
    const antworten = { ...vollstaendigeAntworten(), K3: "Geheimes Projekt Zebra", I1: "Vertraulichkeit hoch, Integrität normal" };
    await fuelleAus(seite, antworten);

    for (const knopf of ["#als-word", "#als-pdf", "#einreichen"]) {
      const datei = seite.waitForEvent("download");
      await seite.locator(knopf).click();
      await datei;
    }
    await seite.waitForFunction(() => window.__ereignisse.some((e) => e.art === "mailto"));
    const ereignisse = await seite.evaluate(() => window.__ereignisse);

    const adressen = [...anfragen, ...navigationen, seite.url(), ...ereignisse.map((e) => e.adresse)];
    assert.ok(adressen.some((a) => a.startsWith("mailto:")), "die mailto:-Adresse wird mitgeprüft");
    // Jede Eingabe außer den kurzen festen Wörtern „Ja“/„Nein“, roh und kodiert.
    const eingaben = Object.values(antworten).filter((wert) => wert.length > 4);
    for (const adresse of adressen) {
      let entschluesselt = adresse;
      try {
        entschluesselt = decodeURIComponent(adresse);
      } catch {
        // bleibt roh
      }
      for (const eingabe of eingaben) {
        assert.ok(!adresse.includes(eingabe) && !entschluesselt.includes(eingabe), `„${eingabe}“ steht in ${adresse}`);
        const datum = eingabe.split("-").reverse().join(".");
        assert.ok(!entschluesselt.includes(datum), `„${datum}“ steht in ${adresse}`);
      }
    }
    await kontext.close();
  });
});
