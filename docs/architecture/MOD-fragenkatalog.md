---
id: MOD-fragenkatalog
title: Der Fragenkatalog des Antrags
folder: src/fragenkatalog/
realises:
  - DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS
  - JEDE FRAGE HAT IHRE ANTWORTART
  - JEDE FRAGE ERKLÄRT SICH
  - DAS FORMULAR IST AUF FÜNF LASCHEN VERTEILT
  - NACH DEM EINREICHEN STEHT EINE CHECKLISTE DER ANHÄNGE
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

Liest die Tabellen `docs/antragsfragen.md`, `docs/erklaerungen.md` und `docs/beilagen.md` und liefert die Abschnitte des
Antrags mit ihren Fragen, in der Reihenfolge der Tabellen, ihre Verteilung auf Laschen und die Beilagen, die eine
Antwort ankündigt. Es kennt keine Frage, keine Lasche und keine Beilage selbst: jede kommt aus einer Tabelle.

## Daten

- `Frage = { nr, text, art, moeglichkeiten, pflicht, erklaerung, beilagen }`
  - `art`: `"Text"`, `"Datum"`, `"Auswahl"` oder `"Hinweis"`.
  - `moeglichkeiten`: aus `Auswahl: A · B · C`, sonst leer.
  - `pflicht`: aus der Spalte *Pflicht* — `ja` → `{ immer: true }`, `nein` → `{ immer: false }`,
    `wenn V1 = Ja` → `{ wenn: "V1", ist: "Ja" }`.
- `Abschnitt = { titel, lasche, fragen: Frage[] }` — eine Überschrift `##` der Tabelle der Fragen; `lasche` ist der
  Name aus der letzten Überschrift `# Lasche: …` davor.
- `Lasche = { titel, abschnitte: Abschnitt[] }` — die Abschnitte einer Lasche, in Reihenfolge.
- `docs/erklaerungen.md` — eine Tabelle `| Nr | Erklärung |`, eine Zeile je Frage.
- `docs/beilagen.md` — eine Tabelle `| Nr | Antwort | Beilage |`; daraus `frage.beilagen = [{ antwort, text }]`, leer bei
  einer Frage ohne Zeile.

## Schnittstellen

- `katalogAusMarkdown(fragen: string, erklaerungen: string, beilagen: string = "") -> Abschnitt[]` — ohne Netz, für
  Tests. Fehler: `KatalogFehler` mit der Zeile, wenn eine Zeile keine bekannte Antwortart oder Pflicht hat, eine Nummer doppelt ist,
  eine Bedingung eine unbekannte Nummer nennt, eine Frage keine Erklärung hat oder ein Abschnitt vor der ersten
  Überschrift `# Lasche: …` steht, oder wenn eine Beilage eine unbekannte Nummer oder eine Antwort nennt, die ihre Frage
  nicht haben kann.
- `KatalogFehler` — ein `Error` mit der Eigenschaft `zeile`.
- `laschen(abschnitte: Abschnitt[]) -> Lasche[]` — fasst aufeinanderfolgende Abschnitte derselben Lasche zusammen.
- `ladeKatalog(basis: URL) -> Promise<Abschnitt[]>` — lädt die drei Dateien vom Ursprung der Seite (`basis` ist
  `../docs/`) und gibt sie an `katalogAusMarkdown`.

## Dateien

- `src/fragenkatalog/index.mjs`

## Benutzt

Nichts außer `fetch` des Browsers.
