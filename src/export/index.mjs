// MOD-export: macht aus Katalog und Antworten ein schlichtes Dokument, als Word (.docx) oder als PDF.
// Word und PDF geben denselben Inhalt wieder (DER EXPORT ENTHÄLT JEDE FRAGE MIT IHRER ANTWORT); die Bibliotheken in
// src/vendor/ werden erst beim Aufruf geladen (DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN).

import { fehlendePflichtfragen, istBeantwortet } from "../pruefung/index.mjs";

/** @typedef {{ art: "titel" | "vermerk" | "abschnitt" | "frage", text: string, antwort?: string }} Zeile */

const TITEL = "Antrag auf ein neues IuK-Projekt";
const VERMERK = "Entwurf – unvollständig";
const NICHT_BEANTWORTET = "nicht beantwortet";

// Die Antwort, wie sie im Dokument steht: bei einer Auswahl die gewählte Möglichkeit, ein Datum als TT.MM.JJJJ,
// ein Hinweis als „beigefügt“; sonst „nicht beantwortet“ (UC-002 3, 3a).
function anzeige(frage, antwort) {
  if (!istBeantwortet(frage, antwort)) return NICHT_BEANTWORTET;
  if (frage.art === "Datum") return antwort.split("-").reverse().join(".");
  if (frage.art === "Hinweis") return "beigefügt";
  return antwort;
}

/**
 * Der Inhalt eines Dokuments, unabhängig vom Format. Der Vermerk steht genau dann an zweiter Stelle, wenn eine
 * Pflichtfrage unbeantwortet ist (EIN UNVOLLSTÄNDIGER EXPORT IST ALS ENTWURF GEKENNZEICHNET).
 * @returns {Zeile[]}
 */
export function zeilen(abschnitte, antworten) {
  const ergebnis = [{ art: "titel", text: TITEL }];
  if (fehlendePflichtfragen(abschnitte, antworten).length > 0) ergebnis.push({ art: "vermerk", text: VERMERK });
  for (const abschnitt of abschnitte) {
    ergebnis.push({ art: "abschnitt", text: abschnitt.titel });
    for (const frage of abschnitt.fragen) {
      ergebnis.push({ art: "frage", text: `${frage.nr} ${frage.text}`, antwort: anzeige(frage, antworten[frage.nr]) });
    }
  }
  return ergebnis;
}

/**
 * DER ANTRAG WIRD ALS WORD-DOKUMENT EXPORTIERT — mit docx aus src/vendor/.
 * @param {Zeile[]} zeilen
 * @returns {Promise<Blob>}
 */
export async function alsWord(zeilen) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = (await import("../vendor/docx.mjs")).default;
  // Mehrzeilige Antworten behalten ihre Zeilenumbrüche.
  const laeufe = (text, art = {}) =>
    text.split(/\r?\n/).map((teil, i) => new TextRun({ text: teil, break: i > 0 ? 1 : undefined, ...art }));
  const absaetze = zeilen.flatMap((zeile) => {
    switch (zeile.art) {
      case "titel":
        return [new Paragraph({ heading: HeadingLevel.TITLE, children: laeufe(zeile.text) })];
      case "vermerk":
        return [new Paragraph({ children: laeufe(zeile.text, { bold: true }) })];
      case "abschnitt":
        return [new Paragraph({ heading: HeadingLevel.HEADING_1, children: laeufe(zeile.text) })];
      default:
        return [
          new Paragraph({ children: laeufe(zeile.text, { bold: true }) }),
          new Paragraph({ children: laeufe(zeile.antwort, zeile.antwort === NICHT_BEANTWORTET ? { italics: true } : {}) }),
        ];
    }
  });
  const dokument = new Document({ title: TITEL, sections: [{ children: absaetze }] });
  return Packer.toBlob(dokument);
}

/**
 * DER ANTRAG WIRD ALS PDF EXPORTIERT — mit jsPDF aus src/vendor/; A4, Standardschrift Helvetica (WinAnsi: ä ö ü ß „ “ –),
 * Zeilen- und Seitenumbruch.
 * @param {Zeile[]} zeilen
 * @returns {Promise<Blob>}
 */
export async function alsPdf(zeilen) {
  const { jsPDF } = (await import("../vendor/jspdf.mjs")).default;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const rand = 20;
  const breite = pdf.internal.pageSize.getWidth() - 2 * rand;
  const unten = pdf.internal.pageSize.getHeight() - rand;
  let y = rand;

  const schreibe = (text, { groesse = 11, stil = "normal", davor = 0 } = {}) => {
    pdf.setFont("helvetica", stil);
    pdf.setFontSize(groesse);
    const hoehe = groesse * 0.3528 * 1.25; // Punkt in mm, mal Zeilenabstand
    y += davor;
    for (const teil of text.split(/\r?\n/).flatMap((absatz) => pdf.splitTextToSize(absatz, breite))) {
      if (y + hoehe > unten) {
        pdf.addPage();
        y = rand;
      }
      y += hoehe;
      pdf.text(teil, rand, y);
    }
  };

  for (const zeile of zeilen) {
    if (zeile.art === "titel") schreibe(zeile.text, { groesse: 18, stil: "bold" });
    else if (zeile.art === "vermerk") schreibe(zeile.text, { groesse: 12, stil: "bold", davor: 3 });
    else if (zeile.art === "abschnitt") schreibe(zeile.text, { groesse: 14, stil: "bold", davor: 6 });
    else {
      schreibe(zeile.text, { stil: "bold", davor: 3 });
      schreibe(zeile.antwort, { stil: zeile.antwort === NICHT_BEANTWORTET ? "italic" : "normal" });
    }
  }
  return pdf.output("blob");
}

/**
 * Dateiname IuK-Antrag_<JJJJ-MM-TT>.<endung> mit dem heutigen Datum.
 * @param {"docx" | "pdf"} endung
 */
export function dateiname(endung, heute = new Date()) {
  const zwei = (n) => String(n).padStart(2, "0");
  return `IuK-Antrag_${heute.getFullYear()}-${zwei(heute.getMonth() + 1)}-${zwei(heute.getDate())}.${endung}`;
}

/**
 * Speichert die Datei über einen Download-Link, ohne Netz (KEIN SERVER, KEINE ANTWORT STEHT IN EINER ADRESSE).
 * @param {Blob} blob
 * @param {string} dateiname
 */
export function speichere(blob, dateiname) {
  const adresse = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = adresse;
  link.download = dateiname;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(adresse), 10_000);
}
