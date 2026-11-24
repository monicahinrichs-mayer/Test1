## Requirements

### Grundregeln

**KEIN SERVER** *(github.com/monicahinrichs-mayer)*
Das Antragsformular wird als statische Seite ausgeliefert; das Produkt betreibt keinen Server, keine Benutzerkonten und
keine Datenbank.
*Check:* `tests/kein-server.test.mjs` — beim Laden, Ausfüllen, Exportieren und Einreichen geht keine Anfrage an einen
anderen Ursprung als den der Seite; Gegenprobe: eine eingeschleuste Anfrage an einen fremden Ursprung schlägt fehl.

**KEIN GEHEIMNIS IM REPOSITORY** *(github.com/monicahinrichs-mayer)*
Kein API-Schlüssel, Zugangstoken oder Passwort steht in einer Datei des Repositorys.
*Check:* `tests/kein-geheimnis.test.mjs` — kein Dateiinhalt gleicht dem Muster eines Schlüssels oder Tokens; Gegenprobe:
eine eingeschleuste Datei mit `github_pat_…` schlägt fehl.

### Formular

**DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS** *(github.com/monicahinrichs-mayer)*
Das Formular stellt jede Frage des Antrags auf ein neues IuK-Projekt, Fassung v4, in deren Reihenfolge und unter deren
Abschnitt. [→ docs/antragsfragen.md]
*Check:* `tests/fragen.test.mjs` — jede Frage aus `docs/antragsfragen.md` steht im Formular, in derselben Reihenfolge.

**JEDE FRAGE HAT IHRE ANTWORTART** *(github.com/monicahinrichs-mayer)*
Eine Frage mit Auswahl bietet genau ihre Möglichkeiten an, von denen höchstens eine gewählt ist; eine Frage mit Text
nimmt Freitext an; eine Frage mit Datum nimmt ein Datum an.
*Check:* `tests/fragen.test.mjs` — Antwortart und Möglichkeiten jedes Feldes gleichen der Tabelle.

**JEDE FRAGE ERKLÄRT SICH** *(github.com/monicahinrichs-mayer)*
Jede Frage trägt eine aufklappbare Erklärung, geschrieben für jemanden, der zum ersten Mal einen IuK-Antrag stellt.
*Check:* `tests/fragen.test.mjs` — jede Frage hat eine eingeklappte, nicht leere Erklärung.

### Erscheinungsbild und Bedienung

**DAS FORMULAR TRÄGT DAS ERSCHEINUNGSBILD DER FAU** *(github.com/monicahinrichs-mayer)*
Das Formular verwendet FAU-Blau `#04316a` als Hauptfarbe und das zentrale Logo der FAU.
*Check:* nur bei der Prüfung.

**DAS FORMULAR HAT EINEN STIL UND FUNKTIONIERT AUF DEM HANDY** *(github.com/monicahinrichs-mayer)*
Das Formular zeichnet alle Elemente mit denselben Stylesheets; jede Schaltfläche und jeder Link erfüllt die
Mindestgröße nach WCAG 2.2, Erfolgskriterium 2.5.8; der Inhalt fließt nach Erfolgskriterium 1.4.10 um, sodass er auf
einem Handy ohne seitliches Scrollen lesbar ist.
*Check:* `tests/bedienung.test.mjs` — in Handy- und Desktop-Breite: nur die eigenen Stylesheets, kein Bedienelement unter
der Mindestgröße, kein Element breiter als das Fenster; Gegenprobe: ein eingeschleustes zu breites Element schlägt fehl.

**DAS FORMULAR DIENT EINEM SCREENREADER** *(github.com/monicahinrichs-mayer)*
Das Formular erfüllt WCAG 2.2 auf Stufe AA: jedes Bedienelement hat einen zugänglichen Namen, jedes Bild eine
Textalternative, die Seite ihre Landmarken und Überschriften in Reihenfolge, und kein Zustand wird allein durch Farbe
angezeigt.
*Check:* `tests/barrierefreiheit.test.mjs` — eine automatische Prüfung gegen WCAG 2.2 AA findet keinen Verstoß;
Gegenprobe: eine eingeschleuste Schaltfläche ohne Namen schlägt fehl.

**DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS** *(github.com/monicahinrichs-mayer)*
Beim Öffnen des Formulars liegt der Eingabefokus im ersten Feld.
*Check:* `tests/bedienung.test.mjs` — nach dem Laden ist das erste Feld fokussiert.

**EIN KLICK PRO ENTSCHEIDUNG** *(github.com/monicahinrichs-mayer)*
Exportieren und Einreichen brauchen je einen Klick.
*Check:* nur bei der Prüfung.

**DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN** *(github.com/monicahinrichs-mayer)*
Die Seite des Formulars ist weniger als drei Sekunden nach Beginn des Aufrufs vollständig geladen.
*Check:* `tests/ladezeit.test.mjs` — ein Browser lädt die Seite; die letzte Anfrage endet vor Ablauf von drei Sekunden.

### Zwischenspeichern

**EINGABEN BLEIBEN IM BROWSER ERHALTEN** *(github.com/monicahinrichs-mayer)*
Wer die Seite des Formulars im selben Browser erneut öffnet, findet alle bis dahin gemachten Eingaben vor.
*Check:* `tests/speichern.test.mjs` — Eingaben, Neuladen der Seite, dieselben Eingaben.

**DER ZWISCHENSTAND LIEGT IM LOCALSTORAGE** *(github.com/monicahinrichs-mayer)*
Der Zwischenstand wird in `localStorage` gespeichert; das Formular setzt kein Cookie.
*Check:* `tests/speichern.test.mjs` — nach dem Ausfüllen hält `localStorage` den Stand und `document.cookie` ist leer.

**LÖSCHEN LÖSCHT WIRKLICH** *(github.com/monicahinrichs-mayer)*
Ein Bedienelement leert nach einer Rückfrage alle Felder und entfernt den Zwischenstand aus dem Browser.
*Check:* `tests/speichern.test.mjs` — nach dem Löschen hält `localStorage` keinen Eintrag des Formulars, und nach dem
Neuladen sind alle Felder leer.

**KEINE ANTWORT STEHT IN EINER ADRESSE** *(github.com/monicahinrichs-mayer)*
Keine Eingabe des Formulars erscheint in einer Adresse, einer Abfrage oder einem Fragment.
*Check:* `tests/speichern.test.mjs` — nach dem Ausfüllen, Exportieren und Einreichen enthält keine aufgerufene Adresse
eine Eingabe.

### Export

**DER ANTRAG WIRD ALS WORD-DOKUMENT EXPORTIERT** *(github.com/monicahinrichs-mayer)*
Ein Bedienelement erzeugt aus dem aktuellen Stand eine Datei im Format `.docx`.
*Check:* `tests/export.test.mjs` — die Datei öffnet sich als Word-Dokument.

**DER ANTRAG WIRD ALS PDF EXPORTIERT** *(github.com/monicahinrichs-mayer)*
Ein Bedienelement erzeugt aus dem aktuellen Stand eine Datei im Format PDF.
*Check:* `tests/export.test.mjs` — die Datei öffnet sich als PDF.

**DER EXPORT ENTHÄLT JEDE FRAGE MIT IHRER ANTWORT** *(github.com/monicahinrichs-mayer)*
Ein exportiertes Dokument enthält jede Frage des Formulars in dessen Reihenfolge, jeweils mit der gegebenen Antwort
oder als unbeantwortet gekennzeichnet.
*Check:* `tests/export.test.mjs` — Word- und PDF-Text enthalten jede Frage und jede gegebene Antwort, in Reihenfolge.

### Einreichen

**DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT** *(github.com/monicahinrichs-mayer)*
Ein Bedienelement öffnet das Mailprogramm mit dem Empfänger `cio-office@fau.de`, dem Betreff „Antrag neues
IuK-Projekt“ und einem Text, der bittet, den exportierten Antrag anzuhängen.
*Check:* `tests/einreichen.test.mjs` — die geöffnete `mailto:`-Adresse nennt genau Empfänger, Betreff und Text und keine
Eingabe des Formulars.

**DAS FORMULAR NENNT, WOHIN ES SENDET** *(github.com/monicahinrichs-mayer)*
Bevor das Mailprogramm geöffnet wird, nennt das Formular den Empfänger `cio-office@fau.de`.
*Check:* `tests/einreichen.test.mjs` — der Empfänger steht sichtbar am Bedienelement des Einreichens.
