# Requirements: Titel, kürzerer Antrag, Laschen, Fortschrittsleiste und Checkliste der Anhänge

**Die Änderung.** Der Abschnitt `## Requirements` erhält die neue Gruppe *Laschen und Fortschritt* mit fünf
Anforderungen und drei weitere neue Anforderungen zu Titel, Datum und Checkliste der Anhänge; die Regeln dreier
Anforderungen ändern sich, ihre Namen bleiben. Jedes andere Byte des Abschnitts bleibt, wie es ist.

- Neu: `DAS FORMULAR TRÄGT DEN TITEL DES ANTRAGS`, `DAS DATUM DER ANTRAGSTELLUNG IST DER TAG DES EXPORTS`,
  `NACH DEM EINREICHEN STEHT EINE CHECKLISTE DER ANHÄNGE`, `DAS FORMULAR IST AUF FÜNF LASCHEN VERTEILT`,
  `EINE LASCHE WECHSELT OHNE VERLUST`, `EXPORTIEREN UND EINREICHEN STEHEN UNTER JEDER LASCHE`,
  `DIE FORTSCHRITTSLEISTE ZEIGT DEN ANTEIL DER BEANTWORTETEN PFLICHTFRAGEN`, `JEDE LASCHE ZEIGT, OB SIE VOLLSTÄNDIG IST`.
- Geändert: `DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS` — ohne die allgemeinen Angaben des Word-Formulars: die beiden
  Fragen nach dem Datum (K1 „Datum“, C6 „Datum der Antragstellung“), „Der Antrag betrifft die … Einführung ·
  Einstellung“ (K2) und „Software/IT-Systeme/IT-Services („IuK-Projekt“)“ (K3). Der Abschnitt dieser Angaben entfällt.
- Geändert: `EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS` — das Formular zeigt die Lasche der ersten fehlenden
  Pflichtfrage, bevor es den Fokus in sie setzt.
- Geändert: `DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT` — der Text der Mail bittet, auch die Beilagen der
  Checkliste anzuhängen.

**Warum.** Die Überschrift „Antrag auf ein neues IuK-Projekt“ sagt nicht, worum es geht; das Word-Formular nennt
Rechtsgrundlage, Gremium und Zweck. Die Einstellung eines IuK-Projekts ist ein anderer, viel kürzerer Antrag; dieses
Formular gilt nur der Einführung. Der Antrag fragte zweimal nach einem Datum, und beide Male ist es nur der Tag, an dem
er gestellt wird; die Bezeichnung des Vorhabens ergibt sich aus der Projektbeschreibung. Auf einer Seite sind die Fragen
zu lang; Laschen und eine Fortschrittsleiste zeigen, wie weit der Antrag ist und was noch fehlt. Wer Beilagen
angekündigt hat, soll beim Einreichen keine vergessen.

**Entscheidungen.**
- **Titel** aus dem Word-Formular v4, ohne „/Einstellung“: „Antrag gem. §5 Abs. 4 CIO-Ordnung an das CIO-Gremium zur
  Einführung eines IuK-Projekts“. Der Betreff der Mail bleibt „Antrag neues IuK-Projekt“.
- **Ein Datum, automatisch.** Das Formular fragt nach keinem Datum; jedes exportierte Dokument nennt den Tag seines
  Exports als Datum der Antragstellung.
- **Fünf Laschen:** *Antragsteller/in* (Antragstellerin / Antragsteller), *Projekt* (Projektbeschreibung), *Recht und
  Sicherheit* (Datenschutz, Personalrat, Barrierefreiheit, Informationssicherheit), *Nutzung und Betrieb* (Zielgruppe,
  Bedienungsanleitung, Vorarbeiten, Einrichtung und Support), *Kosten*. Die Zuordnung steht in `docs/antragsfragen.md`.
- **Fortschritt der Pflichtfragen:** 100 % heißt einreichbar; Folgefragen zählen nur, solange sie Pflicht sind.
  Abgerundet, damit 100 % nie erscheint, solange etwas fehlt. Dazu je Reiter ein Häkchen, wenn seine Lasche vollständig
  ist.
- **Exportieren und Einreichen unter jeder Lasche**, damit beides ein Klick bleibt (`EIN KLICK PRO ENTSCHEIDUNG`).
- **Checkliste der Anhänge** nach dem Einreichen: das Word-Dokument und jede angekündigte Beilage — P5 und P6, wenn
  angekreuzt; D3 und R3 bei „Ja, ist beigelegt“. „Wird nachgereicht“ kündigt keine Beilage an. Welche Antwort welche
  Beilage ankündigt, steht in `docs/beilagen.md`. Die Mail selbst bleibt fest: sie nennt keine Beilage, denn welche
  Beilagen es gibt, verriete Antworten (`KEINE ANTWORT STEHT IN EINER ADRESSE`).

**Auswirkungen.** UC-001 (Laschen, Fortschritt, weniger Fragen), UC-002 (Titel und Datum im Dokument) und UC-003 (Lasche
der ersten fehlenden Pflichtfrage, Checkliste der Anhänge) werden entsprechend vorgeschlagen; `docs/antragsfragen.md`
verliert K1, K2, K3 und C6.

**Herkunft.** Aufträge von monicahinrichs-mayer vom 2026-11-26: die Überschrift aus dem vorigen Dokument übernehmen;
zweifelhaft, ob es zwei Daten braucht; „Kopf“ umbenennen; den Antrag auf mehrere Laschen aufteilen; eine Leiste, wie
viel Prozent ausgefüllt sind. Später am selben Tag: „Einstellung“ aus der Überschrift streichen, das sei ein ganz
anderer und viel kürzerer Antrag; K1 und K2 (die bisherigen K2 und K3) sind unnötig; für angeklickte Anlagen (P5, P6,
D3, R3) beim Einreichen eine kleine Checkliste, was beizulegen ist. Entscheidungen desselben Tages: ein Datum,
automatisch; fünf Laschen, gruppiert; Fortschritt der Pflichtfragen.
