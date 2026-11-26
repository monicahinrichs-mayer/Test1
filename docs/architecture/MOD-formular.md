---
id: MOD-formular
title: Die Seite des Formulars
folder: src/formular/
realises:
  - KEIN SERVER
  - DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS
  - DAS FORMULAR TRÄGT DEN TITEL DES ANTRAGS
  - JEDE FRAGE HAT IHRE ANTWORTART
  - JEDE FRAGE ERKLÄRT SICH
  - JEDE PFLICHTFRAGE IST GEKENNZEICHNET
  - DAS FORMULAR TRÄGT DAS ERSCHEINUNGSBILD DER FAU
  - DAS FORMULAR HAT EINEN STIL UND FUNKTIONIERT AUF DEM HANDY
  - DAS FORMULAR DIENT EINEM SCREENREADER
  - DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS
  - EIN KLICK PRO ENTSCHEIDUNG
  - DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN
  - DAS FORMULAR IST AUF FÜNF LASCHEN VERTEILT
  - EINE LASCHE WECHSELT OHNE VERLUST
  - EXPORTIEREN UND EINREICHEN STEHEN UNTER JEDER LASCHE
  - DIE FORTSCHRITTSLEISTE ZEIGT DEN ANTEIL DER BEANTWORTETEN PFLICHTFRAGEN
  - JEDE LASCHE ZEIGT, OB SIE VOLLSTÄNDIG IST
  - DAS FORMULAR NENNT, WOHIN ES SENDET
  - NACH DEM EINREICHEN STEHT EINE CHECKLISTE DER ANHÄNGE
follows:
  - ARC-001
uses:
  - MOD-fragenkatalog.ladeKatalog
  - MOD-fragenkatalog.laschen
  - MOD-pruefung.istPflicht
  - MOD-pruefung.fortschritt
  - MOD-zwischenstand.lies
  - MOD-zwischenstand.schreibe
  - MOD-zwischenstand.loesche
  - MOD-export.TITEL
  - MOD-export.zeilen
  - MOD-export.alsWord
  - MOD-export.alsPdf
  - MOD-export.dateiname
  - MOD-export.speichere
  - MOD-einreichen.EMPFAENGER
  - MOD-einreichen.BETREFF
  - MOD-einreichen.reicheEin
  - MOD-einreichen.beilagen
provides:
  - starte
---
# MOD-formular Die Seite des Formulars

## Verantwortung

Die einzige Stelle, die das DOM berührt: zeichnet das Formular aus dem Katalog auf fünf Laschen, bindet jede Eingabe an
den Zwischenstand, kennzeichnet die Pflichtfragen, zeigt den Fortschritt, die Bedienelemente *Als Word exportieren*,
*Als PDF exportieren*, *Einreichen* mit dem Empfänger daneben und *Entwurf löschen*, und trägt das Erscheinungsbild der
FAU.

## Teile

- **Kopf der Seite** — Logo der FAU mit Textalternative, als Hauptüberschrift `TITEL` aus MOD-export (auch als Titel
  des Dokuments im Browser) und der Hinweis, dass der Entwurf nur in diesem Browser liegt.
- **Fortschritt** — ein `<progress>` mit dem Text „Ausgefüllt: n % der Pflichtfragen (b von p)“ als zugänglichem Namen
  und sichtbar daneben; nach jeder Eingabe aus `fortschritt` über alle Abschnitte.
- **Reiter** — ein `role="tablist"` mit je Lasche einem `<button role="tab">` mit ihrem Namen; ist `fortschritt` ihrer
  Abschnitte bei 100 %, trägt er sichtbar „✓“ und für Screenreader „ (vollständig)“. Klick, Pfeiltasten links und
  rechts, `Pos1` und `Ende` wählen einen Reiter (*roving tabindex*).
- **Laschen** — je Lasche ein `role="tabpanel"`, nur die gewählte sichtbar; darin je Abschnitt ein `<fieldset>` mit
  `<legend>`, und am Ende jeder Lasche außer der letzten *Weiter: \<nächste Lasche\>*, das die nächste zeigt und den
  Fokus in ihr erstes Feld setzt. Je Frage ein Behälter `<div class="frage" data-nr>` mit:
  - einem Titel mit Nummer und Text, bei Pflicht `*` und für Screenreader der Text „Pflicht“;
  - dem Feld ihrer Antwortart: `<textarea>`; `<input type="date">`; bei einer Auswahl ein
    `<fieldset role="radiogroup">` mit dem Titel als `<legend>` und je Möglichkeit `<input type="radio">`; bei einem
    Hinweis ein `<input type="checkbox">`, benannt über `aria-labelledby` aus Titel und „Beilage ist beigefügt“. Das
    Feld trägt `aria-required`;
  - darunter `<details><summary>Erklärung</summary>…</details>`.
- **Aktionen** — unter den Laschen, also unter jeder sichtbar: die vier Schaltflächen; neben *Einreichen* „an
  cio-office@fau.de“. Nach einem gescheiterten Einreichen eine Liste der fehlenden Pflichtfragen mit `role="alert"`,
  jede ein Link, der die Lasche ihres Feldes zeigt und es fokussiert; die Lasche der ersten ist gezeigt und der Fokus in
  ihr. Öffnet sich kein Mailprogramm, stehen `EMPFAENGER` und `BETREFF` zum Kopieren daneben.
- **Checkliste** — nach einem gelungenen Einreichen eine Liste mit der Überschrift „Bitte hängen Sie an die Mail an:“,
  je Eintrag ein `<input type="checkbox">` mit Beschriftung: zuerst das Word-Dokument mit seinem Dateinamen, dann jede
  Beilage aus `beilagen`. Die Häkchen sind nur eine Hilfe beim Anhängen; sie werden nicht gespeichert.

## Schnittstellen

- `starte(wurzel: HTMLElement, basis: URL) -> Promise<void>` — von `src/index.html` aufgerufen: lädt Katalog und
  Zwischenstand, zeichnet, zeigt die erste Lasche und setzt den Fokus in ihr erstes Feld.

## Dateien

- `src/index.html` — die Seite; lädt `formular/index.mjs` als Modul.
- `src/formular/index.mjs`
- `src/formular/formular.css` — der einzige Stil: FAU-Blau `#04316a`, Systemschrift, Ziele von mindestens 24 × 24 px,
  Umfluss ab 320 px Breite (die Reiter brechen um), sichtbarer Fokusrahmen, kein Zustand allein durch Farbe.
- `src/formular/fau-logo.svg` — das Logo der FAU aus den Vorlagen ihres Corporate Designs.

## Benutzt

- MOD-fragenkatalog, MOD-pruefung, MOD-zwischenstand, MOD-export und MOD-einreichen, wie im Kopf aufgeführt.
