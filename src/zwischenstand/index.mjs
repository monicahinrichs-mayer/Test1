// MOD-zwischenstand: hält die Antworten unter genau einem Schlüssel in localStorage
// (EINGABEN BLEIBEN IM BROWSER ERHALTEN, DER ZWISCHENSTAND LIEGT IM LOCALSTORAGE, LÖSCHEN LÖSCHT WIRKLICH).
// Berührt keinen anderen Schlüssel und setzt kein Cookie.

export const SCHLUESSEL = "iuk-antrag:v1";

// localStorage des Browsers; undefined, wenn er nicht zugänglich ist (privater Modus, gesperrter Speicher).
function browserSpeicher() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Die gespeicherten Antworten; {} wenn nichts gespeichert, kein JSON-Objekt oder der Speicher nicht zugänglich ist.
 * @returns {{ [nr: string]: string }}
 */
export function lies(speicher = browserSpeicher()) {
  try {
    const wert = JSON.parse(speicher.getItem(SCHLUESSEL));
    if (!wert || typeof wert !== "object" || Array.isArray(wert)) return {};
    return Object.fromEntries(Object.entries(wert).filter(([, antwort]) => typeof antwort === "string"));
  } catch {
    return {};
  }
}

/**
 * Schreibt die Antworten; false, wenn der Speicher nicht zugänglich oder voll ist.
 * @param {{ [nr: string]: string }} antworten
 */
export function schreibe(antworten, speicher = browserSpeicher()) {
  try {
    speicher.setItem(SCHLUESSEL, JSON.stringify(antworten));
    return true;
  } catch {
    return false;
  }
}

/** Entfernt SCHLUESSEL und nichts sonst (UC-001 5a). */
export function loesche(speicher = browserSpeicher()) {
  try {
    speicher.removeItem(SCHLUESSEL);
  } catch {
    // Speicher nicht zugänglich: dann liegt dort auch kein Zwischenstand.
  }
}
