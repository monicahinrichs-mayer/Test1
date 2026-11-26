---
id: UC-003
title: Antrag beim CIO-Office einreichen
area: einreichen
actors:
  - Antragsteller/in
  - Browser
  - Mailprogramm
  - CIO-Office
realises:
  - KEIN SERVER
  - PFLICHTFELDER
  - EINE PFLICHTFRAGE IST BEANTWORTET, WENN IHRE ANTWORT GÜLTIG IST
  - EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS
  - DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT
  - DAS FORMULAR NENNT, WOHIN ES SENDET
  - EIN KLICK PRO ENTSCHEIDUNG
  - EXPORTIEREN UND EINREICHEN STEHEN UNTER JEDER LASCHE
  - KEINE ANTWORT STEHT IN EINER ADRESSE
---
# UC-003 Antrag beim CIO-Office einreichen

**Ziel.** Die antragstellende Person schickt ihren vollständigen Antrag als Word-Dokument an das CIO-Office, mit einem
Klick im Formular und ohne dass das Formular einen Server braucht.

## Akteure

- **Antragsteller/in** — wie in UC-001.
- **Browser** — prüft den Antrag, erzeugt das Word-Dokument und speichert es im Download-Ordner der Person.
- **Mailprogramm** — das Mailprogramm, das auf dem Gerät der Person für `mailto:`-Adressen eingestellt ist.
- **CIO-Office** — empfängt den Antrag unter `cio-office@fau.de`.

## Vorbedingung

- Das Formular ist geöffnet und ausgefüllt (UC-001).

## Hauptablauf

1. Am Bedienelement *Einreichen*, das unter jeder Lasche steht, steht sichtbar der Empfänger `cio-office@fau.de`. Die
   Fortschrittsleiste zeigt 100 %.
2. Die Person wählt *Einreichen*. Ein Klick genügt.
3. Das Formular prüft jede Pflichtfrage: eine Antwort mit Text enthält ein Zeichen außer Leerraum, eine mit Auswahl
   eine gewählte Möglichkeit. Jede Pflichtfrage ist beantwortet.
4. Der Browser speichert den Antrag als Word-Dokument im Download-Ordner, ohne etwas an einen Server zu senden.
5. Danach öffnet das Mailprogramm eine neue Mail an `cio-office@fau.de` mit dem Betreff „Antrag neues IuK-Projekt“ und
   einem Text, der bittet, das eben gespeicherte Word-Dokument anzuhängen. Die Adresse, die das Formular dafür öffnet,
   enthält keine Antwort des Formulars.
6. Die Person hängt das Word-Dokument an, ergänzt die Mail nach Belieben und sendet sie aus ihrem Mailprogramm.

## Alternative Abläufe

- **3a. Eine Pflichtfrage ist unbeantwortet oder ihre Antwort ungültig.** Es wird keine Datei gespeichert und kein
  Mailprogramm geöffnet. Das Formular nennt jede unbeantwortete Pflichtfrage mit ihrer Nummer und ihrem Text, zeigt die
  Lasche der ersten und setzt den Eingabefokus in sie; ein Klick auf eine andere genannte Frage zeigt deren Lasche und
  fokussiert sie. Die Person ergänzt die Antworten (UC-001) und wählt erneut *Einreichen*.
- **5a. Auf dem Gerät ist kein Mailprogramm eingestellt.** Das Word-Dokument ist gespeichert, aber es öffnet sich keine
  Mail. Neben *Einreichen* stehen der Empfänger und der Betreff zum Kopieren, sodass die Person die Mail selbst
  schreiben kann.

## Nachbedingung

- Der Download-Ordner hält das Word-Dokument des vollständigen Antrags; nach 3a keines.
- Die Mail mit dem Antrag liegt beim CIO-Office, sobald die Person sie gesendet hat.
- Das Formular hat nichts an einen Server gesendet; der Zwischenstand im Browser ist unverändert.
