// MOD-einreichen: führt „Einreichen“ aus (UC-003) — prüft die Pflichtfragen, speichert dann das Word-Dokument und öffnet
// danach das Mailprogramm. Die mailto:-Adresse ist eine Konstante; keine Antwort gelangt hinein
// (KEINE ANTWORT STEHT IN EINER ADRESSE).

import { fehlendePflichtfragen } from "../pruefung/index.mjs";
import { alsWord, dateiname, speichere, zeilen } from "../export/index.mjs";

/** DAS FORMULAR NENNT, WOHIN ES SENDET: auch der Text am Bedienelement. */
export const EMPFAENGER = "cio-office@fau.de";

/** Betreff der Mail; MOD-formular zeigt ihn zum Kopieren, falls sich kein Mailprogramm öffnet (UC-003 5a). */
export const BETREFF = "Antrag neues IuK-Projekt";

const TEXT =
  "Guten Tag,\r\n\r\n" +
  "hiermit reiche ich einen Antrag auf ein neues IuK-Projekt ein.\r\n\r\n" +
  "Bitte hängen Sie vor dem Senden das eben gespeicherte Word-Dokument (IuK-Antrag_JJJJ-MM-TT.docx in Ihrem " +
  "Download-Ordner) an diese Mail an.";

/** DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT: Empfänger, Betreff und Text, nie eine Antwort. */
export const MAILTO = `mailto:${EMPFAENGER}?subject=${encodeURIComponent(BETREFF)}&body=${encodeURIComponent(TEXT)}`;

/**
 * EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS: fehlt eine Pflichtfrage, wird nichts gespeichert und nichts
 * geöffnet. Sonst wird zuerst das Word-Dokument gespeichert und danach oeffne(MAILTO) gerufen.
 * @param {(adresse: string) => void} oeffne setzt im Browser location.href; ein Test übergibt sein eigenes
 * @returns {Promise<{ fehlend: import("../fragenkatalog/index.mjs").Frage[] }>}
 */
export async function reicheEin(abschnitte, antworten, oeffne) {
  const fehlend = fehlendePflichtfragen(abschnitte, antworten);
  if (fehlend.length > 0) return { fehlend }; // UC-003 3a
  speichere(await alsWord(zeilen(abschnitte, antworten)), dateiname("docx")); // UC-003 4
  oeffne(MAILTO); // UC-003 5
  return { fehlend: [] };
}
