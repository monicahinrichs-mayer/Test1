# Requirements: Titel, ein Datum, Laschen und Fortschrittsleiste

**Die Änderung.** Der Abschnitt `## Requirements` erhält die neue Gruppe *Laschen und Fortschritt* mit fünf
Anforderungen und zwei neue Anforderungen zu Titel und Datum; die Regeln zweier Anforderungen ändern sich, ihre Namen
bleiben. Jedes andere Byte des Abschnitts bleibt, wie es ist.

- Neu: `DAS FORMULAR TRÄGT DEN TITEL DES ANTRAGS`, `DAS DATUM DER ANTRAGSTELLUNG IST DER TAG DES EXPORTS`,
  `DAS FORMULAR IST AUF FÜNF LASCHEN VERTEILT`, `EINE LASCHE WECHSELT OHNE VERLUST`,
  `EXPORTIEREN UND EINREICHEN STEHEN UNTER JEDER LASCHE`,
  `DIE FORTSCHRITTSLEISTE ZEIGT DEN ANTEIL DER BEANTWORTETEN PFLICHTFRAGEN`, `JEDE LASCHE ZEIGT, OB SIE VOLLSTÄNDIG IST`.
- Geändert: `DAS FORMULAR STELLT JEDE FRAGE DES ANTRAGS` — ohne die beiden Fragen nach dem Datum (bisher K1 „Datum“ und
  C6 „Datum der Antragstellung“); der erste Abschnitt heißt „Allgemeine Informationen“ statt „Kopf“.
- Geändert: `EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS` — das Formular zeigt die Lasche der ersten fehlenden
  Pflichtfrage, bevor es den Fokus in sie setzt.

**Warum.** Die Überschrift „Antrag auf ein neues IuK-Projekt“ sagt nicht, worum es geht; das Word-Formular nennt
Rechtsgrundlage, Gremium und Zweck. Der Antrag fragte zweimal nach einem Datum, und beide Male ist es nur der Tag, an dem
der Antrag gestellt wird. Auf einer Seite sind 39 Fragen zu lang; Laschen und eine Fortschrittsleiste zeigen, wie weit
der Antrag ist und was noch fehlt.

**Entscheidungen.**
- **Titel** wortgetreu aus dem Word-Formular v4: „Antrag gem. §5 Abs. 4 CIO-Ordnung an das CIO-Gremium zur
  Einführung/Einstellung eines IuK-Projekts“. Der Betreff der Mail bleibt „Antrag neues IuK-Projekt“.
- **Ein Datum, automatisch.** Das Formular fragt nach keinem Datum; jedes exportierte Dokument nennt den Tag seines
  Exports als Datum der Antragstellung.
- **Fünf Laschen:** *Allgemeines* (Allgemeine Informationen, Antragsteller/in), *Projekt* (Projektbeschreibung),
  *Recht und Sicherheit* (Datenschutz, Personalrat, Barrierefreiheit, Informationssicherheit), *Nutzung und Betrieb*
  (Zielgruppe, Bedienungsanleitung, Vorarbeiten, Einrichtung und Support), *Kosten*. Die Zuordnung steht in
  `docs/antragsfragen.md`.
- **Fortschritt der Pflichtfragen:** 100 % heißt einreichbar; Folgefragen zählen nur, solange sie Pflicht sind.
  Abgerundet, damit 100 % nie erscheint, solange etwas fehlt. Dazu je Reiter ein Häkchen, wenn seine Lasche vollständig
  ist.
- **Exportieren und Einreichen unter jeder Lasche**, damit beides ein Klick bleibt (`EIN KLICK PRO ENTSCHEIDUNG`).

**Auswirkungen.** UC-001 (Laschen, Fortschritt, kein Datumsfeld), UC-002 (Titel und Datum im Dokument) und UC-003
(Lasche der ersten fehlenden Pflichtfrage) werden entsprechend vorgeschlagen; `docs/antragsfragen.md` verliert K1 und C6,
K2 und K3 heißen fortan K1 und K2.

**Herkunft.** Auftrag von monicahinrichs-mayer vom 2026-11-26: die Überschrift aus dem vorigen Dokument übernehmen;
zweifelhaft, ob es zwei Daten braucht; „Kopf“ in „Allgemeine Informationen“ umbenennen; den Antrag auf mehrere Laschen
aufteilen; eine Leiste, wie viel Prozent ausgefüllt sind. Entscheidungen desselben Tages: ein Datum, automatisch; fünf
Laschen, gruppiert; Fortschritt der Pflichtfragen.
