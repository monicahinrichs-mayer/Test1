// DAS FORMULAR DIENT EINEM SCREENREADER — eine automatische Prüfung gegen WCAG 2.2 AA findet keinen Verstoß;
// Gegenprobe: eine eingeschleuste Schaltfläche ohne Namen schlägt fehl.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { AxeBuilder } from "@axe-core/playwright";
import { ladeFormular, starteUmgebung } from "./hilfen.mjs";

const STUFEN = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const pruefe = async (seite) => {
  const ergebnis = await new AxeBuilder({ page: seite }).withTags(STUFEN).analyze();
  return ergebnis.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
};

describe("DAS FORMULAR DIENT EINEM SCREENREADER", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  for (const breite of [320, 1280]) {
    test(`keine Verstöße gegen WCAG 2.2 AA (${breite} px), auch mit aufgeklappten Erklärungen und fehlenden Pflichtfragen`, async () => {
      const { seite, kontext } = await umgebung.neueSeite({ breite, hoehe: 800 });
      await ladeFormular(seite, umgebung.adresse);
      assert.deepEqual(await pruefe(seite), []);

      await seite.locator('input[name="V1"][value="Ja"]').check(); // V2 wird Pflicht
      await seite.locator("#einreichen").click();
      await seite.waitForSelector("#fehlend a");
      await seite.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
      assert.deepEqual(await pruefe(seite), []);
      await kontext.close();
    });
  }

  test("Landmarken, Überschriften in Reihenfolge und das Logo mit Textalternative", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    const { landmarken, ebenen, alt } = await seite.evaluate(() => ({
      landmarken: [...document.querySelectorAll("body > header, body > main")].map((e) => e.tagName),
      ebenen: [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((h) => Number(h.tagName[1])),
      alt: document.querySelector("header img").alt,
    }));
    assert.deepEqual(landmarken, ["HEADER", "MAIN"]);
    assert.equal(ebenen[0], 1);
    assert.ok(ebenen.every((ebene, i) => i === 0 || ebene <= ebenen[i - 1] + 1), "keine Ebene übersprungen");
    assert.equal(alt, "Friedrich-Alexander-Universität Erlangen-Nürnberg");
    await kontext.close();
  });

  test("Gegenprobe: eine eingeschleuste Schaltfläche ohne Namen schlägt fehl", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    await seite.evaluate(() => {
      const knopf = document.createElement("button");
      knopf.type = "button";
      knopf.id = "ohne-namen";
      document.querySelector("main").append(knopf);
    });
    const verstoesse = await pruefe(seite);
    assert.ok(verstoesse.some((v) => v.startsWith("button-name")), verstoesse.join("\n"));
    await kontext.close();
  });
});
