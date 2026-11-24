// MOD-fragenkatalog: liest die Tabellen docs/antragsfragen.md und docs/erklaerungen.md und liefert die Abschnitte des
// Antrags mit ihren Fragen, in der Reihenfolge der Tabellen. Keine Frage steht im Code (ARC-001, „Nichts doppelt“).

/** @typedef {{ immer: boolean } | { wenn: string, ist: string }} Pflicht */
/** @typedef {{ nr: string, text: string, art: string, moeglichkeiten: string[], pflicht: Pflicht, erklaerung: string }} Frage */
/** @typedef {{ titel: string, fragen: Frage[] }} Abschnitt */

const ARTEN = ["Text", "Datum", "Auswahl", "Hinweis"];
const NUMMER = /^[A-Z]\d+$/;

/** Fehler im Katalog, mit der betroffenen Zeile. */
export class KatalogFehler extends Error {
  constructor(meldung, zeile) {
    super(`${meldung}: ${zeile}`);
    this.name = "KatalogFehler";
    this.zeile = zeile;
  }
}

// Eine Tabellenzeile „| a | b | c |“ in ihre Zellen; null, wenn die Zeile keine Zeile mit einer Fragennummer ist.
function zellen(zeile) {
  const z = zeile.trim();
  if (!z.startsWith("|") || !z.endsWith("|")) return null;
  const teile = z.slice(1, -1).split("|").map((t) => t.trim());
  return NUMMER.test(teile[0]) ? teile : null;
}

// Spalte „Antwort“: Text, Datum, Hinweis oder „Auswahl: A · B · C“ (JEDE FRAGE HAT IHRE ANTWORTART).
function antwortart(spalte, zeile) {
  const auswahl = /^Auswahl:\s*(.+)$/.exec(spalte);
  if (auswahl) {
    const moeglichkeiten = auswahl[1].split("·").map((m) => m.trim()).filter(Boolean);
    if (moeglichkeiten.length < 2) throw new KatalogFehler("Auswahl ohne Möglichkeiten", zeile);
    return { art: "Auswahl", moeglichkeiten };
  }
  if (ARTEN.includes(spalte) && spalte !== "Auswahl") return { art: spalte, moeglichkeiten: [] };
  throw new KatalogFehler("Unbekannte Antwortart", zeile);
}

// Spalte „Pflicht“: ja, nein oder „wenn V1 = Ja“ (PFLICHTFELDER).
function pflicht(spalte, zeile) {
  if (spalte === "ja") return { immer: true };
  if (spalte === "nein") return { immer: false };
  const wenn = /^wenn\s+([A-Z]\d+)\s*=\s*(.+)$/.exec(spalte);
  if (wenn) return { wenn: wenn[1], ist: wenn[2].trim() };
  throw new KatalogFehler("Unbekannte Pflicht", zeile);
}

/**
 * Baut den Katalog aus dem Text beider Tabellen, ohne Netz.
 * @param {string} fragen Inhalt von docs/antragsfragen.md
 * @param {string} erklaerungen Inhalt von docs/erklaerungen.md
 * @returns {Abschnitt[]}
 */
export function katalogAusMarkdown(fragen, erklaerungen) {
  // Erklärungen: | Nr | Erklärung | (JEDE FRAGE ERKLÄRT SICH)
  const erklaerungJe = new Map();
  for (const zeile of erklaerungen.split(/\r?\n/)) {
    const z = zellen(zeile);
    if (z && z[1]) erklaerungJe.set(z[0], z[1]);
  }

  // Fragen: je Überschrift „##“ ein Abschnitt, je Tabellenzeile eine Frage (DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS)
  const abschnitte = [];
  const zeileJe = new Map();
  for (const zeile of fragen.split(/\r?\n/)) {
    const ueberschrift = /^##\s+(.+?)\s*$/.exec(zeile);
    if (ueberschrift) {
      abschnitte.push({ titel: ueberschrift[1], fragen: [] });
      continue;
    }
    const z = zellen(zeile);
    if (!z) continue;
    if (z.length !== 4 || abschnitte.length === 0) throw new KatalogFehler("Unerwartete Zeile", zeile);
    const [nr, text] = z;
    if (zeileJe.has(nr)) throw new KatalogFehler("Doppelte Nummer", zeile);
    zeileJe.set(nr, zeile);
    const erklaerung = erklaerungJe.get(nr);
    if (!erklaerung) throw new KatalogFehler("Frage ohne Erklärung", zeile);
    abschnitte.at(-1).fragen.push({ nr, text, ...antwortart(z[2], zeile), pflicht: pflicht(z[3], zeile), erklaerung });
  }

  // Eine Bedingung darf nur eine bekannte Nummer nennen.
  for (const abschnitt of abschnitte) {
    for (const frage of abschnitt.fragen) {
      if ("wenn" in frage.pflicht && !zeileJe.has(frage.pflicht.wenn)) {
        throw new KatalogFehler("Bedingung nennt unbekannte Nummer", zeileJe.get(frage.nr));
      }
    }
  }
  return abschnitte.filter((a) => a.fragen.length > 0);
}

/**
 * Lädt beide Tabellen vom Ursprung der Seite (KEIN SERVER: nur statische Dateien).
 * @param {URL} basis die URL von docs/, z. B. new URL("../docs/", location.href)
 * @returns {Promise<Abschnitt[]>}
 */
export async function ladeKatalog(basis) {
  const [fragen, erklaerungen] = await Promise.all(
    ["antragsfragen.md", "erklaerungen.md"].map(async (datei) => {
      const antwort = await fetch(new URL(datei, basis));
      if (!antwort.ok) throw new Error(`${datei} konnte nicht geladen werden (${antwort.status})`);
      return antwort.text();
    }),
  );
  return katalogAusMarkdown(fragen, erklaerungen);
}
