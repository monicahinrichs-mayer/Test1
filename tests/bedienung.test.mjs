// DAS FORMULAR HAT EINEN STIL UND FUNKTIONIERT AUF DEM HANDY, DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { ladeFormular, starteUmgebung } from "./hilfen.mjs";

const BREITEN = [
  { name: "Handy", breite: 320, hoehe: 640 },
  { name: "Desktop", breite: 1280, hoehe: 800 },
];
const MINDESTGROESSE = 24; // WCAG 2.2, Erfolgskriterium 2.5.8, in CSS-Pixeln

// Stylesheets der Seite: nur das eigene, kein <style>, kein style-Attribut.
const fremdeStile = (seite, ursprung) =>
  seite.evaluate((ursprung) => {
    const fremd = [...document.styleSheets].map((s) => s.href).filter((href) => href !== `${ursprung}/src/formular/formular.css`);
    const attribute = [...document.querySelectorAll("[style]")].map((e) => e.tagName);
    return [...fremd.map((href) => `Stylesheet ${href ?? "<style>"}`), ...attribute.map((t) => `style-Attribut an ${t}`)];
  }, ursprung);

// Sichtbare Bedienelemente unter 24 × 24 px.
const zuKleineZiele = (seite, mindest) =>
  seite.evaluate((mindest) => {
    const ziele = document.querySelectorAll("button, a[href], input, select, textarea, summary");
    return [...ziele]
      .filter((e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== "hidden")
      .map((e) => ({ e, r: e.getBoundingClientRect() }))
      .filter(({ r }) => r.width < mindest - 0.01 || r.height < mindest - 0.01)
      .map(({ e, r }) => `${e.tagName}#${e.id} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }, mindest);

// Elemente, die über das Fenster hinausragen, und seitliches Scrollen (1.4.10).
const zuBreit = (seite) =>
  seite.evaluate(() => {
    const fenster = document.documentElement.clientWidth;
    const breit = [...document.body.querySelectorAll("*")]
      .filter((e) => e.getClientRects().length > 0)
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > fenster + 0.5 || r.right > fenster + 0.5 || r.left < -0.5;
      })
      .map((e) => `${e.tagName}#${e.id}.${e.className}`);
    if (document.documentElement.scrollWidth > fenster) breit.push(`seitliches Scrollen: ${document.documentElement.scrollWidth} > ${fenster}`);
    return breit;
  });

describe("DAS FORMULAR HAT EINEN STIL UND FUNKTIONIERT AUF DEM HANDY", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  for (const { name, breite, hoehe } of BREITEN) {
    test(`${name} (${breite} px): nur die eigenen Stylesheets, kein Ziel unter der Mindestgröße, nichts zu breit`, async () => {
      const { seite, kontext } = await umgebung.neueSeite({ breite, hoehe });
      await ladeFormular(seite, umgebung.adresse);
      // Alles zeigen, was es gibt: jede Erklärung aufgeklappt, die Liste fehlender Pflichtfragen nach einem Einreichen.
      await seite.locator("#einreichen").click();
      await seite.waitForSelector("#fehlend a");
      await seite.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));

      assert.deepEqual(await fremdeStile(seite, umgebung.ursprung), []);
      assert.deepEqual(await zuKleineZiele(seite, MINDESTGROESSE), []);
      assert.deepEqual(await zuBreit(seite), []);
      await kontext.close();
    });
  }

  test("Gegenprobe: ein eingeschleustes zu breites Element schlägt fehl", async () => {
    const { seite, kontext } = await umgebung.neueSeite({ breite: 320, hoehe: 640 });
    await ladeFormular(seite, umgebung.adresse);
    await seite.evaluate(() => {
      const breit = document.createElement("div");
      breit.id = "zu-breit";
      breit.style.width = "1000px";
      breit.textContent = "zu breit";
      document.querySelector("main").append(breit);
    });
    assert.ok((await zuBreit(seite)).some((e) => e.includes("zu-breit")));
    await kontext.close();
  });
});

describe("DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  test("nach dem Laden ist das erste Feld fokussiert", async () => {
    const { seite, kontext } = await umgebung.neueSeite();
    await ladeFormular(seite, umgebung.adresse);
    const erstesFeld = await seite.evaluate(() => document.querySelector("form [data-nr]").dataset.nr);
    assert.equal(erstesFeld, "K1");
    assert.equal(await seite.evaluate(() => document.activeElement?.id), "feld-K1");
    await kontext.close();
  });
});
