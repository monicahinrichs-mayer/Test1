---
id: MOD-fragenkatalog
title: Der Fragenkatalog des Antrags
folder: src/fragenkatalog/
realises:
  - DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS
  - JEDE FRAGE HAT IHRE ANTWORTART
  - JEDE FRAGE ERKLÄRT SICH
follows:
  - ARC-001
uses:
provides:
  - Frage
  - Abschnitt
  - katalogAusMarkdown
  - ladeKatalog
---
# MOD-fragenkatalog Der Fragenkatalog des Antrags

## Verantwortung

Liest die Tabellen `docs/antragsfragen.md` und `docs/erklaerungen.md` und liefert die Abschnitte des Antrags mit ihren
Fragen, in der Reihenfolge der Tabellen. Es kennt keine Frage selbst: jede Frage kommt aus der Tabelle.

## Daten

- `Frage = { nr, text, art, moeglichkeiten, pflicht, erklaerung }`
  - `art`: `"Text"`, `"Datum"`, `"Auswahl"` oder `"Hinweis"`.
  - `moeglichkeiten`: aus `Auswahl: A · B · C`, sonst leer.
  - `pflicht`: aus der Spalte *Pflicht* — `ja` → `{ immer: true }`, `nein` → `{ immer: false }`,
    `wenn V1 = Ja` → `{ wenn: "V1", ist: "Ja" }`.
- `Abschnitt = { titel, fragen: Frage[] }` — eine Überschrift `##` der Tabelle der Fragen.
- `docs/erklaerungen.md` — eine Tabelle `| Nr | Erklärung |`, eine Zeile je Frage.

## Schnittstellen

- `katalogAusMarkdown(fragen: string, erklaerungen: string) -> Abschnitt[]` — ohne Netz, für Tests. Fehler:
  `KatalogFehler` mit der Zeile, wenn eine Zeile keine bekannte Antwortart oder Pflicht hat, eine Nummer doppelt ist,
  eine Bedingung eine unbekannte Nummer nennt oder eine Frage keine Erklärung hat.
- `ladeKatalog(basis: URL) -> Promise<Abschnitt[]>` — lädt beide Dateien vom Ursprung der Seite (`basis` ist
  `../docs/`) und gibt sie an `katalogAusMarkdown`.

## Dateien

- `src/fragenkatalog/index.mjs`

## Benutzt

Nichts außer `fetch` des Browsers.
