---
id: MOD-fragenkatalog
title: Der Fragenkatalog des Antrags
folder: src/fragenkatalog/
realises:
  - DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS
  - JEDE FRAGE HAT IHRE ANTWORTART
  - JEDE FRAGE ERKLÄRT SICH
  - DAS FORMULAR IST AUF FÜNF LASCHEN VERTEILT
follows:
  - ARC-001
uses:
provides:
  - Frage
  - Abschnitt
  - Lasche
  - KatalogFehler
  - katalogAusMarkdown
  - laschen
  - ladeKatalog
---
# MOD-fragenkatalog Der Fragenkatalog des Antrags

## Verantwortung

Liest die Tabellen `docs/antragsfragen.md` und `docs/erklaerungen.md` und liefert die Abschnitte des Antrags mit ihren
Fragen, in der Reihenfolge der Tabellen, und ihre Verteilung auf Laschen. Es kennt keine Frage und keine Lasche selbst:
jede kommt aus der Tabelle.

## Daten

- `Frage = { nr, text, art, moeglichkeiten, pflicht, erklaerung }`
  - `art`: `"Text"`, `"Datum"`, `"Auswahl"` oder `"Hinweis"`.
  - `moeglichkeiten`: aus `Auswahl: A · B · C`, sonst leer.
  - `pflicht`: aus der Spalte *Pflicht* — `ja` → `{ immer: true }`, `nein` → `{ immer: false }`,
    `wenn V1 = Ja` → `{ wenn: "V1", ist: "Ja" }`.
- `Abschnitt = { titel, lasche, fragen: Frage[] }` — eine Überschrift `##` der Tabelle der Fragen; `lasche` ist der
  Name aus der letzten Überschrift `# Lasche: …` davor.
- `Lasche = { titel, abschnitte: Abschnitt[] }` — die Abschnitte einer Lasche, in Reihenfolge.
- `docs/erklaerungen.md` — eine Tabelle `| Nr | Erklärung |`, eine Zeile je Frage.

## Schnittstellen

- `katalogAusMarkdown(fragen: string, erklaerungen: string) -> Abschnitt[]` — ohne Netz, für Tests. Fehler:
  `KatalogFehler` mit der Zeile, wenn eine Zeile keine bekannte Antwortart oder Pflicht hat, eine Nummer doppelt ist,
  eine Bedingung eine unbekannte Nummer nennt, eine Frage keine Erklärung hat oder ein Abschnitt vor der ersten
  Überschrift `# Lasche: …` steht.
- `KatalogFehler` — ein `Error` mit der Eigenschaft `zeile`.
- `laschen(abschnitte: Abschnitt[]) -> Lasche[]` — fasst aufeinanderfolgende Abschnitte derselben Lasche zusammen.
- `ladeKatalog(basis: URL) -> Promise<Abschnitt[]>` — lädt beide Dateien vom Ursprung der Seite (`basis` ist
  `../docs/`) und gibt sie an `katalogAusMarkdown`.

## Dateien

- `src/fragenkatalog/index.mjs`

## Benutzt

Nichts außer `fetch` des Browsers.
