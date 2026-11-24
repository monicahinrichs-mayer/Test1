// KEIN SERVER — beim Laden, Ausfüllen, Exportieren und Einreichen geht keine Anfrage an einen anderen Ursprung als den
// der Seite; Gegenprobe: eine eingeschleuste Anfrage an einen fremden Ursprung schlägt fehl.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { fuelleAus, istFremd, ladeFormular, starteUmgebung, vollstaendigeAntworten } from "./hilfen.mjs";

describe("KEIN SERVER", () => {
  let umgebung;
  before(async () => {
    umgebung = await starteUmgebung();
  });
  after(() => umgebung?.schliesse());

  // Lädt, füllt aus, exportiert als Word und PDF und reicht ein; gibt jede Anfrage der Seite.
  async function ganzerAblauf(seite, anfragen) {
    await ladeFormular(seite, umgebung.adresse);
    await fuelleAus(seite, vollstaendigeAntworten());
    for (const knopf of ["#als-word", "#als-pdf", "#einreichen"]) {
      const datei = seite.waitForEvent("download");
      await seite.locator(knopf).click();
      await datei;
    }
    await seite.waitForFunction(() => window.__ereignisse.some((e) => e.art === "mailto"));
    return anfragen;
  }

  test("keine Anfrage an einen anderen Ursprung als den der Seite", async () => {
    const { seite, kontext, anfragen } = await umgebung.neueSeite();
    await ganzerAblauf(seite, anfragen);
    assert.ok(anfragen.some((a) => a.endsWith("/src/vendor/docx.umd.js")), "die Bibliotheken kommen vom Ursprung der Seite");
    assert.ok(anfragen.some((a) => a.endsWith("/src/vendor/jspdf.umd.min.js")));
    assert.deepEqual(anfragen.filter((a) => istFremd(a, umgebung.ursprung)), []);
    await kontext.close();
  });

  test("Gegenprobe: eine eingeschleuste Anfrage an einen fremden Ursprung schlägt fehl", async () => {
    const { seite, kontext, anfragen } = await umgebung.neueSeite();
    await ganzerAblauf(seite, anfragen);
    await seite.evaluate(() => fetch("https://fremder-ursprung.invalid/antrag").catch(() => null));
    assert.deepEqual(anfragen.filter((a) => istFremd(a, umgebung.ursprung)), ["https://fremder-ursprung.invalid/antrag"]);
    await kontext.close();
  });
});
