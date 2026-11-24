// DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN — ein Browser lädt die Seite; die letzte Anfrage endet vor Ablauf von drei
// Sekunden.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { starteUmgebung } from "./hilfen.mjs";

describe("DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  test("die letzte Anfrage endet vor Ablauf von drei Sekunden", async () => {
    const { seite, kontext } = await umgebung.neueSeite(); // frischer Kontext: nichts im Zwischenspeicher
    await seite.goto(umgebung.adresse, { waitUntil: "networkidle" });
    await seite.waitForSelector("#feld-K1");
    // Zeiten in Millisekunden ab Beginn des Aufrufs (performance.timeOrigin).
    const { anfragen, geladen } = await seite.evaluate(() => ({
      anfragen: performance.getEntriesByType("resource").map((e) => ({ name: e.name, ende: e.responseEnd })),
      geladen: performance.getEntriesByType("navigation")[0].loadEventEnd,
    }));
    const letzte = Math.max(geladen, ...anfragen.map((a) => a.ende));
    assert.ok(anfragen.some((a) => a.name.endsWith("/docs/antragsfragen.md")), "der Katalog wurde geladen");
    assert.ok(letzte > 0 && letzte < 3000, `letzte Anfrage endet nach ${Math.round(letzte)} ms`);
    await kontext.close();
  });
});
