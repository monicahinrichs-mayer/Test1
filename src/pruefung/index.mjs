// MOD-pruefung: sagt, welche Frage bei gegebenen Antworten Pflicht ist und welche Pflichtfrage unbeantwortet.
// Zeichnet nichts und speichert nichts.

/** @typedef {import("../fragenkatalog/index.mjs").Frage} Frage */
/** @typedef {import("../fragenkatalog/index.mjs").Abschnitt} Abschnitt */
/** @typedef {{ [nr: string]: string }} Antworten */

/**
 * PFLICHTFELDER: { immer } gibt immer; { wenn, ist } gibt antworten[wenn] === ist.
 * @param {Frage} frage
 * @param {Antworten} antworten
 */
export function istPflicht(frage, antworten) {
  if ("immer" in frage.pflicht) return frage.pflicht.immer;
  return antworten[frage.pflicht.wenn] === frage.pflicht.ist;
}

// Datum JJJJ-MM-TT eines Tages, den es im Kalender gibt (also nicht 31.02.).
function istGueltigesDatum(wert) {
  const teile = /^(\d{4})-(\d{2})-(\d{2})$/.exec(wert);
  if (!teile) return false;
  const [jahr, monat, tag] = teile.slice(1).map(Number);
  const datum = new Date(Date.UTC(jahr, monat - 1, tag));
  return datum.getUTCFullYear() === jahr && datum.getUTCMonth() === monat - 1 && datum.getUTCDate() === tag;
}

/**
 * EINE PFLICHTFRAGE IST BEANTWORTET, WENN IHRE ANTWORT GÜLTIG IST.
 * @param {Frage} frage
 * @param {string | undefined} antwort
 */
export function istBeantwortet(frage, antwort) {
  if (typeof antwort !== "string") return false;
  switch (frage.art) {
    case "Text":
      return /\S/.test(antwort);
    case "Datum":
      return istGueltigesDatum(antwort);
    case "Auswahl":
      return frage.moeglichkeiten.includes(antwort);
    case "Hinweis":
      return antwort === "ja";
    default:
      return false;
  }
}

/**
 * Jede Frage, die Pflicht und nicht beantwortet ist, in der Reihenfolge des Katalogs (UC-003 Schritt 3).
 * @param {Abschnitt[]} abschnitte
 * @param {Antworten} antworten
 * @returns {Frage[]}
 */
export function fehlendePflichtfragen(abschnitte, antworten) {
  return abschnitte
    .flatMap((abschnitt) => abschnitt.fragen)
    .filter((frage) => istPflicht(frage, antworten) && !istBeantwortet(frage, antworten[frage.nr]));
}
