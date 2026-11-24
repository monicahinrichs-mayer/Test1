# Requirements: Pflichtfelder, Prüfung und Einreichen als Word-Dokument

**Die Änderung.** Der Abschnitt `## Requirements` erhält die neue Gruppe *Pflichtfelder und Prüfung* mit fünf
Anforderungen; die Regel von `DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT` ändert sich, ihr Name bleibt. Jedes
andere Byte des Abschnitts bleibt, wie es ist.

- Neu: `PFLICHTFELDER`, `EINE PFLICHTFRAGE IST BEANTWORTET, WENN IHRE ANTWORT GÜLTIG IST`,
  `JEDE PFLICHTFRAGE IST GEKENNZEICHNET`, `EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS`,
  `EIN UNVOLLSTÄNDIGER EXPORT IST ALS ENTWURF GEKENNZEICHNET`.
- Geändert: `DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT` — *Einreichen* speichert zuerst den Antrag als
  Word-Dokument und öffnet danach das Mailprogramm; bisher öffnete es nur das Mailprogramm und setzte einen Export voraus.

**Warum.** Ein eingereichter Antrag soll vollständig sein, und *Einreichen* soll die Datei nicht als eigenen Schritt
voraussetzen. Das Word-Formular kennt keine Pflichtfelder; sie werden hier festgelegt.

**Entscheidungen.**
- **Pflicht:** jede Frage, außer den Beilage-Hinweisen P5 und P6; die Folgefragen V2, V4 und C5 nur, wenn ihre
  auslösende Frage mit „Ja“ beantwortet ist. Die Tabelle in `docs/antragsfragen.md` trägt dafür die Spalte *Pflicht*.
- **Gesperrt wird nur das Einreichen.** Exportieren bleibt immer möglich, damit ein Zwischenstand abgestimmt werden
  kann; ein unvollständiger Export ist als Entwurf gekennzeichnet.
- **Format beim Einreichen: Word,** damit das CIO-Office im Dokument weiterarbeiten kann.
- **Gekennzeichnet nicht allein durch Farbe,** wie es `DAS FORMULAR DIENT EINEM SCREENREADER` verlangt.

**Auswirkungen.** UC-001 (Pflichtfragen gekennzeichnet), UC-002 (Vermerk bei unvollständigem Export) und UC-003
(Prüfung, dann Word-Dokument und Mail in einem Klick) werden entsprechend vorgeschlagen.

**Herkunft.** Auftrag von monicahinrichs-mayer vom 2026-11-24: „einreichen soll zuerst die Datei speichern und dann die
Mail öffnen“; Pflichtfelder definieren und Antworten vor Export und Versand prüfen. Entscheidungen desselben Tages:
alle Fragen Pflicht, Folgefragen bedingt; nur Einreichen sperren; Format Word.
