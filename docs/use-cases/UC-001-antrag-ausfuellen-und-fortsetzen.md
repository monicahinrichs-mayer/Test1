---
id: UC-001
title: Antrag ausfüllen und später fortsetzen
area: formular
actors:
  - Antragsteller/in
  - Browser
realises:
  - KEIN SERVER
  - DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS
  - DAS FORMULAR TRÄGT DEN TITEL DES ANTRAGS
  - JEDE FRAGE HAT IHRE ANTWORTART
  - JEDE FRAGE ERKLÄRT SICH
  - PFLICHTFELDER
  - JEDE PFLICHTFRAGE IST GEKENNZEICHNET
  - DAS FORMULAR TRÄGT DAS ERSCHEINUNGSBILD DER FAU
  - DAS FORMULAR HAT EINEN STIL UND FUNKTIONIERT AUF DEM HANDY
  - DAS FORMULAR DIENT EINEM SCREENREADER
  - DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS
  - DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN
  - DAS FORMULAR IST AUF FÜNF LASCHEN VERTEILT
  - EINE LASCHE WECHSELT OHNE VERLUST
  - DIE FORTSCHRITTSLEISTE ZEIGT DEN ANTEIL DER BEANTWORTETEN PFLICHTFRAGEN
  - JEDE LASCHE ZEIGT, OB SIE VOLLSTÄNDIG IST
  - EINGABEN BLEIBEN IM BROWSER ERHALTEN
  - DER ZWISCHENSTAND LIEGT IM LOCALSTORAGE
  - LÖSCHEN LÖSCHT WIRKLICH
  - KEINE ANTWORT STEHT IN EINER ADRESSE
---
# UC-001 Antrag ausfüllen und später fortsetzen

**Ziel.** Die antragstellende Person füllt den Antrag auf ein neues IuK-Projekt im Browser aus, in so vielen Sitzungen
wie nötig, ohne dass ein Entwurf ihren Browser verlässt.

## Akteure

- **Antragsteller/in** — stellt den Antrag als Product Owner des IuK-Projekts; stellt womöglich zum ersten Mal einen
  solchen Antrag.
- **Browser** — zeigt das Formular und hält den Zwischenstand in seinem `localStorage`.

## Vorbedingung

- Die Seite des Formulars ist im Browser erreichbar.

## Hauptablauf

1. Die Person öffnet die Seite des Formulars. Sie lädt in unter drei Sekunden, trägt FAU-Blau, das Logo der FAU und
   den Titel „Antrag gem. §5 Abs. 4 CIO-Ordnung an das CIO-Gremium zur Einführung/Einstellung eines IuK-Projekts“. Sie
   zeigt die erste von fünf Laschen, *Allgemeines*, und der Eingabefokus liegt im ersten Feld (K1, Einführung oder
   Einstellung).
2. Über den Reitern der Laschen *Allgemeines*, *Projekt*, *Recht und Sicherheit*, *Nutzung und Betrieb* und *Kosten*
   steht eine Fortschrittsleiste mit dem Anteil der beantworteten Pflichtfragen in Prozent. Die gezeigte Lasche stellt
   jede ihrer Fragen in ihrer Reihenfolge, unter ihrem Abschnitt, mit ihrer Antwortart: ein Textfeld oder eine Auswahl
   ihrer Möglichkeiten; nach einem Datum fragt das Formular nicht. Neben jeder Frage steht eine eingeklappte
   Erklärung; jede Pflichtfrage ist als solche gekennzeichnet, sichtbar und für einen Screenreader. Beantwortet die
   Person V1, V3 oder C4 mit „Ja“, wird die zugehörige Folgefrage V2, V4 beziehungsweise C5 zur Pflichtfrage.
3. Die Person beantwortet die Fragen der Lasche. Bei Bedarf klappt sie die Erklärung einer Frage auf. Am Ende der
   Lasche wählt sie *Weiter* und beantwortet die Fragen der nächsten Lasche, bis zur letzten.
4. Jede Eingabe wird sofort im `localStorage` des Browsers gespeichert; das Formular sendet nichts an einen Server
   und setzt kein Cookie. Ein Hinweis am Formular sagt, dass der Entwurf nur in diesem Browser liegt. Die
   Fortschrittsleiste folgt jeder Eingabe; sind alle Pflichtfragen einer Lasche beantwortet, trägt ihr Reiter ein
   Häkchen und für einen Screenreader den Text „vollständig“. Bei 100 % ist der Antrag einreichbar (UC-003).
5. Die Person schließt die Seite.
6. Später öffnet sie die Seite im selben Browser wieder. Alle Eingaben stehen in den Feldern, wie sie sie verlassen
   hat, und sie setzt bei Schritt 3 fort.

## Alternative Abläufe

- **3a. Die Person bedient das Formular nur mit der Tastatur oder mit einem Screenreader.** Jedes Feld und jede
  Erklärung ist mit der Tastatur erreichbar und hat einen zugänglichen Namen; die Abschnitte sind Überschriften.
- **3b. Die Person füllt den Antrag auf dem Handy aus.** Das Formular fließt auf die Breite des Bildschirms um;
  nichts muss seitlich gescrollt werden.
- **3c. Die Person ändert bei einer Auswahl ihre Wahl.** Die neue Möglichkeit ersetzt die alte; nie sind zwei gewählt.
- **3d. Die Person springt zu einer anderen Lasche.** Sie klickt auf deren Reiter oder bewegt sich mit den Pfeiltasten
  über die Reiter. Das Formular zeigt diese Lasche; jede Antwort, auch auf den anderen Laschen, bleibt, wie sie war.
  Exportieren, Einreichen und *Entwurf löschen* stehen unter jeder Lasche.
- **6a. Die Person öffnet die Seite in einem anderen Browser oder auf einem anderen Gerät.** Das Formular ist leer:
  der Entwurf liegt nur im Browser, in dem er entstand. Ein Hinweis am Formular sagt das.
- **5a. Die Person verwirft den Entwurf, statt die Seite zu schließen.** Sie wählt *Entwurf löschen*; das Formular fragt einmal nach. Bestätigt sie,
  sind alle Felder leer und der Zwischenstand ist aus dem `localStorage` entfernt; nach dem Neuladen bleibt das
  Formular leer. Bricht sie ab, bleibt alles, wie es war.

## Nachbedingung

- Der Browser hält den aktuellen Stand aller Antworten in seinem `localStorage`, nach 5a keinen.
- Keine Antwort hat den Browser verlassen; keine steht in einer Adresse.
