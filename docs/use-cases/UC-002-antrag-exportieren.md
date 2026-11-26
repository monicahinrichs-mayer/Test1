---
id: UC-002
title: Antrag als Word oder PDF exportieren
area: export
actors:
  - Antragsteller/in
  - Browser
realises:
  - KEIN SERVER
  - DER ANTRAG WIRD ALS WORD-DOKUMENT EXPORTIERT
  - DER ANTRAG WIRD ALS PDF EXPORTIERT
  - DER EXPORT ENTHÄLT JEDE FRAGE MIT IHRER ANTWORT
  - DAS FORMULAR TRÄGT DEN TITEL DES ANTRAGS
  - DAS DATUM DER ANTRAGSTELLUNG IST DER TAG DES EXPORTS
  - EIN UNVOLLSTÄNDIGER EXPORT IST ALS ENTWURF GEKENNZEICHNET
  - EIN KLICK PRO ENTSCHEIDUNG
  - EXPORTIEREN UND EINREICHEN STEHEN UNTER JEDER LASCHE
  - KEINE ANTWORT STEHT IN EINER ADRESSE
---
# UC-002 Antrag als Word oder PDF exportieren

**Ziel.** Die antragstellende Person erhält ihren Antrag als Datei, um ihn abzulegen, weiterzugeben oder einzureichen.

## Akteure

- **Antragsteller/in** — wie in UC-001.
- **Browser** — erzeugt die Datei und speichert sie im Download-Ordner der Person.

## Vorbedingung

- Das Formular ist geöffnet (UC-001); es kann ganz, teilweise oder gar nicht ausgefüllt sein.

## Hauptablauf

1. Die Person wählt *Als Word exportieren*, gleich unter welcher Lasche.
2. Der Browser erzeugt aus dem aktuellen Stand eine Datei `.docx`, ohne etwas an einen Server zu senden, und speichert
   sie. Ein Klick genügt. Die Datei beginnt mit dem Titel „Antrag gem. §5 Abs. 4 CIO-Ordnung an das CIO-Gremium zur
   Einführung eines IuK-Projekts“ und nennt darunter „Datum der Antragstellung“ mit dem heutigen Tag.
3. Die Datei enthält jede Frage des Formulars in dessen Reihenfolge und unter ihrem Abschnitt, jeweils mit der
   gegebenen Antwort; bei einer Auswahl die gewählte Möglichkeit.

## Alternative Abläufe

- **1a. Die Person wählt *Als PDF exportieren*.** Wie im Hauptablauf, mit einer Datei im Format PDF.
- **3a. Eine Frage ist unbeantwortet.** Sie steht in der Datei mit dem Vermerk *nicht beantwortet*.
- **3b. Eine Pflichtfrage ist unbeantwortet.** Der Export gelingt trotzdem; das Dokument trägt an seinem Anfang den
  Vermerk „Entwurf – unvollständig“. Ein Export des vollständigen Antrags trägt ihn nicht.

## Nachbedingung

- Der Download-Ordner hält die Datei; der Zwischenstand im Browser ist unverändert.
- Keine Antwort hat den Browser verlassen; keine steht in einer Adresse.
