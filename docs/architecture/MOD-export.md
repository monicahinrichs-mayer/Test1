---
id: MOD-export
title: Der Antrag als Word-Dokument und PDF
folder: src/export/
realises:
  - DER ANTRAG WIRD ALS WORD-DOKUMENT EXPORTIERT
  - DER ANTRAG WIRD ALS PDF EXPORTIERT
  - DER EXPORT ENTHÄLT JEDE FRAGE MIT IHRER ANTWORT
  - EIN UNVOLLSTÄNDIGER EXPORT IST ALS ENTWURF GEKENNZEICHNET
  - DAS FORMULAR TRÄGT DEN TITEL DES ANTRAGS
  - DAS DATUM DER ANTRAGSTELLUNG IST DER TAG DES EXPORTS
follows:
  - ARC-001
uses:
  - MOD-pruefung.fehlendePflichtfragen
provides:
  - TITEL
  - zeilen
  - alsWord
  - alsPdf
  - dateiname
  - speichere
---
# MOD-export Der Antrag als Word-Dokument und PDF

## Verantwortung

Macht aus Katalog und Antworten ein schlichtes Dokument: Titel, gegebenenfalls der Vermerk „Entwurf – unvollständig“,
das Datum der Antragstellung, dann je Abschnitt seine Überschrift und je Frage ihren Text und ihre Antwort oder „nicht
beantwortet“. Word und PDF geben denselben Inhalt wieder; nur ihr Format unterscheidet sich. Es hält den Titel des
Antrags, den auch die Seite trägt.

## Daten

- `Zeile = { art, text, antwort? }` mit `art` `"titel"`, `"vermerk"`, `"datum"`, `"abschnitt"` oder `"frage"` — der
  Inhalt eines Dokuments, unabhängig vom Format.

## Schnittstellen

- `TITEL = "Antrag gem. §5 Abs. 4 CIO-Ordnung an das CIO-Gremium zur Einführung eines IuK-Projekts"` —
  auch die Hauptüberschrift der Seite (MOD-formular).
- `zeilen(abschnitte, antworten, heute: Date = new Date()) -> Zeile[]` — ohne Bibliothek, für Tests; der Vermerk steht
  genau dann an zweiter Stelle, wenn `fehlendePflichtfragen` nicht leer ist; danach die Zeile `datum` mit
  „Datum der Antragstellung: TT.MM.JJJJ“ von `heute`.
- `alsWord(zeilen) -> Promise<Blob>` — mit `docx` aus `src/vendor/`, erst beim Aufruf geladen.
- `alsPdf(zeilen) -> Promise<Blob>` — mit `jsPDF` aus `src/vendor/`, erst beim Aufruf geladen; mit deutschen Umlauten,
  Zeilen- und Seitenumbruch.
- `dateiname(endung: "docx" | "pdf", heute: Date = new Date()) -> string` — `IuK-Antrag_<JJJJ-MM-TT>.docx` bzw. `.pdf`.
- `speichere(blob, dateiname) -> void` — Download über einen Link mit `URL.createObjectURL`, ohne Netz.

## Dateien

- `src/export/index.mjs`
- `src/vendor/docx.mjs`, `src/vendor/jspdf.mjs` und `src/vendor/VERSIONS.md` mit Version, Lizenz und SHA-256 jeder
  Bibliothek.

## Benutzt

- MOD-pruefung: `fehlendePflichtfragen` für den Vermerk.
