---
id: MOD-export
title: Der Antrag als Word-Dokument und PDF
folder: src/export/
realises:
  - DER ANTRAG WIRD ALS WORD-DOKUMENT EXPORTIERT
  - DER ANTRAG WIRD ALS PDF EXPORTIERT
  - DER EXPORT ENTHÄLT JEDE FRAGE MIT IHRER ANTWORT
  - EIN UNVOLLSTÄNDIGER EXPORT IST ALS ENTWURF GEKENNZEICHNET
follows:
  - ARC-001
uses:
  - MOD-pruefung.fehlendePflichtfragen
provides:
  - zeilen
  - alsWord
  - alsPdf
  - speichere
---
# MOD-export Der Antrag als Word-Dokument und PDF

## Verantwortung

Macht aus Katalog und Antworten ein schlichtes Dokument: Titel, gegebenenfalls der Vermerk „Entwurf – unvollständig“,
dann je Abschnitt seine Überschrift und je Frage ihren Text und ihre Antwort oder „nicht beantwortet“. Word und PDF
geben denselben Inhalt wieder; nur ihr Format unterscheidet sich.

## Daten

- `Zeile = { art, text, antwort? }` mit `art` `"titel"`, `"vermerk"`, `"abschnitt"` oder `"frage"` — der Inhalt eines
  Dokuments, unabhängig vom Format.

## Schnittstellen

- `zeilen(abschnitte, antworten) -> Zeile[]` — ohne Bibliothek, für Tests; der Vermerk steht genau dann an zweiter
  Stelle, wenn `fehlendePflichtfragen` nicht leer ist.
- `alsWord(zeilen) -> Promise<Blob>` — mit `docx` aus `src/vendor/`, erst beim Aufruf geladen.
- `alsPdf(zeilen) -> Promise<Blob>` — mit `jsPDF` aus `src/vendor/`, erst beim Aufruf geladen; mit deutschen Umlauten,
  Zeilen- und Seitenumbruch.
- `speichere(blob, dateiname) -> void` — Download über einen Link mit `URL.createObjectURL`, ohne Netz. Dateiname
  `IuK-Antrag_<JJJJ-MM-TT>.docx` bzw. `.pdf`.

## Dateien

- `src/export/index.mjs`
- `src/vendor/docx.mjs`, `src/vendor/jspdf.mjs` und `src/vendor/VERSIONS.md` mit Version, Lizenz und SHA-256 jeder
  Bibliothek.

## Benutzt

- MOD-pruefung: `fehlendePflichtfragen` für den Vermerk.
