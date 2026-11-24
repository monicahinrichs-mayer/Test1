// DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS, JEDE FRAGE HAT IHRE ANTWORTART, JEDE FRAGE ERKLÄRT SICH.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { ladeFormular, starteUmgebung, tabelle } from "./hilfen.mjs";

// Was das Formular zeigt: je Abschnitt seine Überschrift, je Frage Nummer, Text, Feld, Möglichkeiten und Erklärung.
const imFormular = (seite) =>
  seite.evaluate(() =>
    [...document.querySelectorAll("form fieldset.abschnitt")].map((abschnitt) => ({
      titel: abschnitt.querySelector(":scope > legend").textContent.trim(),
      fragen: [...abschnitt.querySelectorAll("[data-nr]")].map((frage) => {
        const nr = frage.dataset.nr;
        const feld = document.getElementById(`feld-${nr}`);
        const optionen = [...frage.querySelectorAll('input[type="radio"]')];
        const details = frage.querySelector("details");
        return {
          nr,
          nummer: frage.querySelector(".frage-titel .nr")?.textContent,
          text: frage.querySelector(".frage-titel .text")?.textContent,
          feld: feld ? `${feld.tagName.toLowerCase()}:${feld.type ?? ""}` : null,
          optionen: optionen.map((o) => ({ wert: o.value, name: o.name, beschriftung: o.labels[0]?.textContent.trim() })),
          erklaerung: details
            ? { offen: details.open, zusammenfassung: details.querySelector("summary")?.textContent ?? "", text: details.querySelector("p")?.textContent.trim() ?? "" }
            : null,
        };
      }),
    })),
  );

describe("Die Fragen des Formulars", () => {
  let umgebung;
  let seite;
  let gezeigt;
  before(async () => {
    umgebung = await starteUmgebung();
    ({ seite } = await umgebung.neueSeite());
    await ladeFormular(seite, umgebung.adresse);
    gezeigt = await imFormular(seite);
  });
  after(() => umgebung?.schliesse());

  test("DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS — in derselben Reihenfolge, unter ihrem Abschnitt", () => {
    const erwartet = tabelle().map((a) => ({ titel: a.titel, fragen: a.fragen.map((f) => [f.nr, f.text]) }));
    const tatsaechlich = gezeigt.map((a) => ({ titel: a.titel, fragen: a.fragen.map((f) => [f.nummer, f.text]) }));
    assert.deepEqual(tatsaechlich, erwartet);
    assert.equal(gezeigt.flatMap((a) => a.fragen).length, 39);
  });

  test("JEDE FRAGE HAT IHRE ANTWORTART — Antwortart und Möglichkeiten jedes Feldes gleichen der Tabelle", () => {
    const felder = new Map(gezeigt.flatMap((a) => a.fragen).map((f) => [f.nr, f]));
    for (const frage of tabelle().flatMap((a) => a.fragen)) {
      const feld = felder.get(frage.nr);
      const erwartet = { Text: "textarea:textarea", Datum: "input:date", Auswahl: "fieldset:fieldset", Hinweis: "input:checkbox" }[frage.art];
      assert.equal(feld.feld, erwartet, `${frage.nr} (${frage.art})`);
      assert.deepEqual(
        feld.optionen,
        frage.moeglichkeiten.map((m) => ({ wert: m, name: frage.nr, beschriftung: m })),
        `${frage.nr}: Möglichkeiten`,
      );
    }
  });

  test("Eine Auswahl hat höchstens eine gewählte Möglichkeit", async () => {
    for (const frage of tabelle().flatMap((a) => a.fragen).filter((f) => f.art === "Auswahl")) {
      for (const moeglichkeit of frage.moeglichkeiten) {
        await seite.locator(`input[name="${frage.nr}"][value="${moeglichkeit}"]`).check();
        const gewaehlt = await seite.locator(`input[name="${frage.nr}"]:checked`).evaluateAll((os) => os.map((o) => o.value));
        assert.deepEqual(gewaehlt, [moeglichkeit], frage.nr);
      }
    }
  });

  test("Eine Frage mit Text nimmt Freitext an, eine mit Datum ein Datum", async () => {
    await seite.locator("#feld-K3").fill("Ein Freitext\nüber zwei Zeilen");
    assert.equal(await seite.locator("#feld-K3").inputValue(), "Ein Freitext\nüber zwei Zeilen");
    await seite.locator("#feld-K1").fill("2026-11-24");
    assert.equal(await seite.locator("#feld-K1").inputValue(), "2026-11-24");
  });

  test("JEDE FRAGE ERKLÄRT SICH — jede Frage hat eine eingeklappte, nicht leere Erklärung", async () => {
    // Frisch geladen, damit kein vorheriger Test eine Erklärung aufgeklappt hat.
    const { seite: frisch, kontext } = await umgebung.neueSeite();
    await ladeFormular(frisch, umgebung.adresse);
    for (const frage of (await imFormular(frisch)).flatMap((a) => a.fragen)) {
      assert.ok(frage.erklaerung, `${frage.nr} hat eine Erklärung`);
      assert.equal(frage.erklaerung.offen, false, `${frage.nr} ist eingeklappt`);
      assert.match(frage.erklaerung.zusammenfassung, /Erklärung/, frage.nr);
      assert.ok(frage.erklaerung.text.length > 0, `${frage.nr} ist nicht leer`);
    }
    const unsichtbar = await frisch.locator('[data-nr="K1"] details p').isVisible();
    assert.equal(unsichtbar, false, "eingeklappt heißt: nicht sichtbar");
    await frisch.locator('[data-nr="K1"] summary').click();
    assert.equal(await frisch.locator('[data-nr="K1"] details p').isVisible(), true, "aufklappbar");
    await kontext.close();
  });
});
