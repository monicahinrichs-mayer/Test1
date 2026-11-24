---
id: MOD-pruefung
title: Pflicht und Gültigkeit der Antworten
folder: src/pruefung/
realises:
  - PFLICHTFELDER
  - EINE PFLICHTFRAGE IST BEANTWORTET, WENN IHRE ANTWORT GÜLTIG IST
follows:
  - ARC-001
uses:
  - MOD-fragenkatalog.Frage
  - MOD-fragenkatalog.Abschnitt
provides:
  - istPflicht
  - istBeantwortet
  - fehlendePflichtfragen
---
# MOD-pruefung Pflicht und Gültigkeit der Antworten

## Verantwortung

Sagt, welche Frage bei gegebenen Antworten Pflicht ist und welche Pflichtfrage unbeantwortet. Es zeichnet nichts und
speichert nichts.

## Daten

- `Antworten = { [nr]: string }` — wie MOD-zwischenstand sie hält: bei einer Auswahl der Text der gewählten
  Möglichkeit, bei einem Datum `JJJJ-MM-TT`, bei einem Hinweis `"ja"` oder fehlend.

## Schnittstellen

- `istPflicht(frage, antworten) -> boolean` — `{ immer }` gibt `immer`; `{ wenn, ist }` gibt `antworten[wenn] === ist`.
- `istBeantwortet(frage, antwort) -> boolean` — Text: enthält ein Zeichen außer Leerraum; Datum: `JJJJ-MM-TT` eines
  Tages, den es im Kalender gibt; Auswahl: eine der `moeglichkeiten`; Hinweis: `"ja"`.
- `fehlendePflichtfragen(abschnitte, antworten) -> Frage[]` — jede Frage, die Pflicht und nicht beantwortet ist, in der
  Reihenfolge des Katalogs.

## Dateien

- `src/pruefung/index.mjs`

## Benutzt

- MOD-fragenkatalog: die Formen `Frage` und `Abschnitt`.
