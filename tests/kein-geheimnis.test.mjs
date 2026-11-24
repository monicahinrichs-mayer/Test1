// KEIN GEHEIMNIS IM REPOSITORY — kein Dateiinhalt gleicht dem Muster eines Schlüssels oder Tokens;
// Gegenprobe: eine eingeschleuste Datei mit github_pat_… schlägt fehl.

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { WURZEL } from "./hilfen.mjs";

// Muster bekannter Schlüssel und Token.
const MUSTER = [
  /github_pat_[A-Za-z0-9_]{20,}/, // GitHub, fein granular
  /\bgh[pousr]_[A-Za-z0-9]{30,}/, // GitHub, klassisch, OAuth, App
  /\bAKIA[0-9A-Z]{16}\b/, // AWS-Zugangsschlüssel
  /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{32,}/, // Anthropic, OpenAI
  /\bAIza[0-9A-Za-z_-]{35}\b/, // Google
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/, // Slack
  /\bglpat-[A-Za-z0-9_-]{20,}/, // GitLab
  /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----/, // privater Schlüssel
  /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|password|passwort|secret)\s*[:=]\s*["'][A-Za-z0-9+/_\-]{16,}["']/i, // Zuweisung
];

const AUSGENOMMEN = new Set([".git", "node_modules"]);

async function* dateien(verzeichnis) {
  for (const eintrag of await readdir(verzeichnis, { withFileTypes: true })) {
    if (AUSGENOMMEN.has(eintrag.name)) continue;
    const pfad = join(verzeichnis, eintrag.name);
    if (eintrag.isDirectory()) yield* dateien(pfad);
    else if (eintrag.isFile()) yield pfad;
  }
}

/** Jede Datei unter dem Verzeichnis, deren Inhalt einem Muster gleicht, mit dem Muster. */
async function findeGeheimnisse(verzeichnis) {
  const funde = [];
  for await (const pfad of dateien(verzeichnis)) {
    const inhalt = (await readFile(pfad)).toString("latin1");
    for (const muster of MUSTER) if (muster.test(inhalt)) funde.push(`${pfad}: ${muster}`);
  }
  return funde;
}

describe("KEIN GEHEIMNIS IM REPOSITORY", () => {
  test("kein Dateiinhalt gleicht dem Muster eines Schlüssels oder Tokens", async () => {
    assert.deepEqual(await findeGeheimnisse(WURZEL), []);
  });

  test("Gegenprobe: eine eingeschleuste Datei mit github_pat_… schlägt fehl", async () => {
    const verzeichnis = await mkdtemp(join(tmpdir(), "kein-geheimnis-"));
    try {
      // Das Token wird erst hier zusammengesetzt, damit diese Datei selbst kein Muster trifft.
      const token = ["github", "pat", "11ABCDEFG0123456789_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123"].join("_");
      await writeFile(join(verzeichnis, "konfiguration.txt"), `TOKEN=${token}\n`);
      const funde = await findeGeheimnisse(verzeichnis);
      assert.equal(funde.length, 1);
      assert.match(funde[0], /github_pat_/);
    } finally {
      await rm(verzeichnis, { recursive: true, force: true });
    }
  });
});
