---
id: MOD-pruefung
title: Pflicht, Gültigkeit und Fortschritt der Antworten
folder: src/pruefung/
realises:
  - PFLICHTFELDER
  - EINE PFLICHTFRAGE IST BEANTWORTET, WENN IHRE ANTWORT GÜLTIG IST
  - DIE FORTSCHRITTSLEISTE ZEIGT DEN ANTEIL DER BEANTWORTETEN PFLICHTFRAGEN
  - JEDE LASCHE ZEIGT, OB SIE VOLLSTÄNDIG IST
follows:
  - ARC-001
uses:
  - MOD-fragenkatalog.Frage
  - MOD-fragenkatalog.Abschnitt
provides:
  - istPflicht
  - istBeantwortet
  - fehlendePflichtfragen
  - fortschritt
---
# MOD-pruefung Pflicht, Gültigkeit und Fortschritt der Antworten

## Verantwortung

Sagt, welche Frage bei gegebenen Antworten Pflicht ist, welche Pflichtfrage unbeantwortet und welcher Anteil der
Pflichtfragen beantwortet ist. Es zeichnet nichts und speichert nichts.

## Daten

- `Antworten = { [nr]: string }` — wie MOD-zwischenstand sie hält: bei einer Auswahl der Text der gewählten
  Möglichkeit, bei einem Datum `JJJJ-MM-TT`, bei einem Hinweis `"ja"` oder fehlend.
- `Fortschritt = { beantwortet, pflicht, prozent }` — Anzahl der beantworteten und der gerade geltenden Pflichtfragen,
  und `prozent = ⌊100 · beantwortet / pflicht⌋`; ohne Pflichtfrage `100`.

## Schnittstellen

- `istPflicht(frage, antworten) -> boolean` — `{ immer }` gibt `immer`; `{ wenn, ist }` gibt `antworten[wenn] === ist`.
- `istBeantwortet(frage, antwort) -> boolean` — Text: enthält ein Zeichen außer Leerraum; Datum: `JJJJ-MM-TT` eines
  Tages, den es im Kalender gibt; Auswahl: eine der `moeglichkeiten`; Hinweis: `"ja"`.
- `fehlendePflichtfragen(abschnitte, antworten) -> Frage[]` — jede Frage, die Pflicht und nicht beantwortet ist, in der
  Reihenfolge des Katalogs.
- `fortschritt(abschnitte, antworten) -> Fortschritt` — über die gegebenen Abschnitte: dem ganzen Antrag für die Leiste,
  den Abschnitten einer Lasche für ihr Häkchen. Abgerundet, damit 100 % nie erscheint, solange etwas fehlt.

## Dateien

- `src/pruefung/index.mjs`

## Benutzt

- MOD-fragenkatalog: die Formen `Frage` und `Abschnitt`.
