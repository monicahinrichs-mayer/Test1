---
id: MOD-zwischenstand
title: Der Zwischenstand im Browser
folder: src/zwischenstand/
realises:
  - EINGABEN BLEIBEN IM BROWSER ERHALTEN
  - DER ZWISCHENSTAND LIEGT IM LOCALSTORAGE
  - LÖSCHEN LÖSCHT WIRKLICH
follows:
  - ARC-001
uses:
provides:
  - SCHLUESSEL
  - lies
  - schreibe
  - loesche
---
# MOD-zwischenstand Der Zwischenstand im Browser

## Verantwortung

Hält die Antworten unter genau einem Schlüssel in `localStorage`. Es berührt keinen anderen Schlüssel und setzt kein
Cookie.

## Daten

- Schlüssel `iuk-antrag:v1`, Wert JSON `{ "<Nr>": "<Antwort>" }` (MOD-pruefung, `Antworten`).

## Schnittstellen

- `SCHLUESSEL = "iuk-antrag:v1"`.
- `lies(speicher = localStorage) -> Antworten` — `{}`, wenn nichts gespeichert ist, der Wert kein JSON-Objekt ist oder
  der Speicher nicht zugänglich ist (privater Modus).
- `schreibe(antworten, speicher = localStorage) -> boolean` — `false`, wenn der Speicher nicht zugänglich oder voll ist;
  MOD-formular sagt dann, dass der Entwurf nicht gespeichert wird.
- `loesche(speicher = localStorage) -> void` — entfernt `SCHLUESSEL` und nichts sonst.

## Dateien

- `src/zwischenstand/index.mjs`

## Benutzt

Nichts außer `localStorage` des Browsers.
