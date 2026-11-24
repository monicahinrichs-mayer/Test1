# Requirements: das Antragsformular des CIO-Gremiums im Browser

**Die Änderung.** Der leere Abschnitt `## Requirements` erhält 20 Anforderungen in sechs Gruppen: Grundregeln,
Formular, Erscheinungsbild und Bedienung, Zwischenspeichern, Export und Einreichen.

**Warum.** Der Antrag auf ein neues IuK-Projekt ist bisher ein Word-Formular mit Formularfeldern. Er soll im Browser
ausgefüllt werden: zwischengespeichert, als Word und PDF exportierbar und einreichbar. Die Fragen des Formulars,
Fassung v4, stehen in `docs/antragsfragen.md`; die Word-Datei selbst kommt nicht in das öffentliche Repository.

**Übernommen aus der SPEC von Agent M.** Die Anforderungen von Agent M gelten auch für dieses Produkt. Die Regeln des
Prozesses — Rückverfolgbarkeit, Freigaben, Tests, Versionierung, Markdown-Artefakte — gelten durch Agent M selbst für
jedes Produkt, das es verwaltet, und werden hier nicht wiederholt. Die Anforderungen an das Produkt sind auf das
Formular übertragen:

| Agent M | Test1 |
|---|---|
| NO SERVER | KEIN SERVER |
| NO SECRET IN THE REPOSITORY | KEIN GEHEIMNIS IM REPOSITORY |
| EVERY STEP EXPLAINS ITSELF | JEDE FRAGE ERKLÄRT SICH |
| THE SITE WEARS THE PATTERN RECOGNITION LAB'S LOOK | DAS FORMULAR TRÄGT DAS ERSCHEINUNGSBILD DER FAU |
| EVERY PAGE SHARES ONE LOOK AND WORKS ON A PHONE | DAS FORMULAR HAT EINEN STIL UND FUNKTIONIERT AUF DEM HANDY |
| THE SITE SERVES A SCREEN READER | DAS FORMULAR DIENT EINEM SCREENREADER |
| A FORM OPENS WITH ITS FIRST FIELD FOCUSED | DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS |
| ONE CLICK PER DECISION | EIN KLICK PRO ENTSCHEIDUNG |
| EVERY PAGE LOADS IN UNDER THREE SECONDS | DAS FORMULAR LÄDT IN UNTER DREI SEKUNDEN |
| CONFIGURATION IS STORED IN LOCALSTORAGE, NOT IN A COOKIE | DER ZWISCHENSTAND LIEGT IM LOCALSTORAGE |
| A CLEAR IS A REAL CLEAR | LÖSCHEN LÖSCHT WIRKLICH |
| NO TEXT TRAVELS IN A URL | KEINE ANTWORT STEHT IN EINER ADRESSE |
| THE PAGE NAMES WHERE IT SENDS | DAS FORMULAR NENNT, WOHIN ES SENDET |

Nicht übernommen: AGENT M IS MIT-LICENSED — über die Lizenz von Test1 wird später entschieden. Die Anforderungen an
Token, Mailbox, Bridge, Jobs und Dashboard betreffen Werkzeuge, die das Formular nicht hat.

**Entscheidungen.**
- **Einreichen ohne Server:** `KEIN SERVER` gilt wie bei Agent M. „Direkt einreichen“ heißt deshalb: das Formular
  öffnet das Mailprogramm an `cio-office@fau.de`; den exportierten Antrag hängt die antragstellende Person an. Der
  Betreff ist fest, damit keine Antwort in der `mailto:`-Adresse steht (`KEINE ANTWORT STEHT IN EINER ADRESSE`).
- **Erscheinungsbild:** FAU-zentral, wie es einem Formular des CIO-Gremiums entspricht, statt des Erscheinungsbilds
  des Pattern Recognition Lab, das Agent M trägt.
- **Barrierefreiheit:** WCAG 2.2 AA wie bei Agent M; das erfüllt auch die BayDiV, nach der das Formular selbst fragt.
- **Export inhaltlich gleich, schlicht:** jede Frage mit ihrer Antwort, ohne Briefkopf und Layout des Word-Formulars.

**Offen, nicht Teil dieses Eintrags.**
- Wie das Formular in WordPress eingebunden wird — hängt von der WordPress-Instanz und den Rechten dort ab.
- Ob Fragen Pflichtfelder sind; das Word-Formular kennt keine.

**Herkunft.** Auftrag von monicahinrichs-mayer vom 2026-11-24 und die Entscheidungen desselben Tages: alle
Anforderungen von Agent M gelten auch hier, einschließlich des Corporate Designs; Einreichen über das Mailprogramm;
Erscheinungsbild FAU-zentral; keine Lizenz vorerst; Export inhaltlich gleich und schlicht; Fragen ja, Datei nein.
