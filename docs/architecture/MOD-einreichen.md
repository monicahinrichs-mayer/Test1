---
id: MOD-einreichen
title: Einreichen über das Mailprogramm
folder: src/einreichen/
realises:
  - EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS
  - DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT
  - NACH DEM EINREICHEN STEHT EINE CHECKLISTE DER ANHÄNGE
  - KEINE ANTWORT STEHT IN EINER ADRESSE
follows:
  - ARC-001
uses:
  - MOD-pruefung.fehlendePflichtfragen
  - MOD-export.zeilen
  - MOD-export.alsWord
  - MOD-export.dateiname
  - MOD-export.speichere
  - MOD-fragenkatalog.Frage
provides:
  - EMPFAENGER
  - BETREFF
  - MAILTO
  - reicheEin
  - beilagen
---
# MOD-einreichen Einreichen über das Mailprogramm

## Verantwortung

Führt *Einreichen* aus: prüft die Pflichtfragen, speichert dann das Word-Dokument und öffnet danach das Mailprogramm;
nennt die Beilagen, die die Antworten ankündigen.
Die `mailto:`-Adresse ist eine Konstante; keine Antwort gelangt hinein.

## Schnittstellen

- `EMPFAENGER = "cio-office@fau.de"` — auch der Text, den MOD-formular am Bedienelement zeigt.
- `BETREFF = "Antrag neues IuK-Projekt"` — auch der Betreff, den MOD-formular zum Kopieren zeigt, falls sich kein
  Mailprogramm öffnet.
- `MAILTO` — `mailto:cio-office@fau.de` mit dem Betreff „Antrag neues IuK-Projekt“ und einem Text, der bittet, das eben
  gespeicherte Word-Dokument und die Beilagen der Checkliste anzuhängen; er nennt keine Beilage.
- `reicheEin(abschnitte, antworten, oeffne) -> Promise<{ fehlend: Frage[], datei?: string }>` — ist
  `fehlendePflichtfragen` nicht leer, gibt es sie zurück und tut sonst nichts; sonst speichert es `alsWord` über
  `speichere` unter `dateiname("docx")`, ruft danach `oeffne(MAILTO)` und gibt den Dateinamen als `datei` zurück;
  `fehlend` ist dann leer. `oeffne` setzt im Browser `location.href`; ein Test übergibt sein eigenes.
- `beilagen(abschnitte, antworten) -> string[]` — der Text jeder Beilage, deren Frage genau die angekündigte Antwort
  hat, in der Reihenfolge des Katalogs; ohne Seite testbar.

## Dateien

- `src/einreichen/index.mjs`

## Benutzt

- MOD-pruefung: `fehlendePflichtfragen`.
- MOD-export: `zeilen`, `alsWord`, `dateiname`, `speichere`.
- MOD-fragenkatalog: `frage.beilagen`.
