---
id: MOD-formular
title: Die Seite des Formulars
folder: src/formular/
realises:
  - KEIN SERVER
  - DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS
  - JEDE FRAGE HAT IHRE ANTWORTART
  - JEDE FRAGE ERKLÄRT SICH
  - JEDE PFLICHTFRAGE IST GEKENNZEICHNET
  - DAS FORMULAR TRÄGT DAS ERSCHEINUNGSBILD DER FAU
  - DAS FORMULAR HAT EINEN STIL UND FUNKTIONIERT AUF DEM HANDY
  - DAS FORMULAR DIENT EINEM SCREENREADER
  - DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS
  - EIN KLICK PRO ENTSCHEIDUNG
  - DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN
  - DAS FORMULAR NENNT, WOHIN ES SENDET
follows:
  - ARC-001
uses:
  - MOD-fragenkatalog.ladeKatalog
  - MOD-pruefung.istPflicht
  - MOD-zwischenstand.lies
  - MOD-zwischenstand.schreibe
  - MOD-zwischenstand.loesche
  - MOD-export.zeilen
  - MOD-export.alsWord
  - MOD-export.alsPdf
  - MOD-export.speichere
  - MOD-einreichen.EMPFAENGER
  - MOD-einreichen.reicheEin
provides:
  - starte
---
# MOD-formular Die Seite des Formulars

## Verantwortung

Die einzige Stelle, die das DOM berührt: zeichnet das Formular aus dem Katalog, bindet jede Eingabe an den
Zwischenstand, kennzeichnet die Pflichtfragen, zeigt die Bedienelemente *Als Word exportieren*, *Als PDF exportieren*,
*Einreichen* mit dem Empfänger daneben und *Entwurf löschen*, und trägt das Erscheinungsbild der FAU.

## Teile

- **Kopf** — Logo der FAU mit Textalternative, Titel „Antrag auf ein neues IuK-Projekt“ und der Hinweis, dass der
  Entwurf nur in diesem Browser liegt.
- **Abschnitte** — je Abschnitt ein `<fieldset>` mit `<legend>`; je Frage ein `<label>` mit Nummer und Text, bei
  Pflicht `*` und für Screenreader der Text „Pflicht“; das Feld ihrer Antwortart — `<textarea>`,
  `<input type="date">`, eine Gruppe `<input type="radio">` oder für einen Hinweis `<input type="checkbox">` — mit
  `aria-required`; darunter `<details><summary>Erklärung</summary>…</details>`.
- **Aktionen** — die vier Schaltflächen; neben *Einreichen* „an cio-office@fau.de“. Nach einem gescheiterten
  Einreichen eine Liste der fehlenden Pflichtfragen mit `role="alert"`, jede ein Link zu ihrem Feld, und der Fokus im
  ersten. Öffnet sich kein Mailprogramm, stehen Empfänger und Betreff zum Kopieren daneben.

## Schnittstellen

- `starte(wurzel: HTMLElement, basis: URL) -> Promise<void>` — von `src/index.html` aufgerufen: lädt Katalog und
  Zwischenstand, zeichnet und setzt den Fokus in das erste Feld.

## Dateien

- `src/index.html` — die Seite; lädt `formular/index.mjs` als Modul.
- `src/formular/index.mjs`
- `src/formular/formular.css` — der einzige Stil: FAU-Blau `#04316a`, Systemschrift, Ziele von mindestens 24 × 24 px,
  Umfluss ab 320 px Breite, sichtbarer Fokusrahmen, kein Zustand allein durch Farbe.
- `src/formular/fau-logo.svg` — das Logo der FAU aus den Vorlagen ihres Corporate Designs.

## Benutzt

- MOD-fragenkatalog, MOD-pruefung, MOD-zwischenstand, MOD-export und MOD-einreichen, wie im Kopf aufgeführt.
