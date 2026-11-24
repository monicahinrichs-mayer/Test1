---
id: MOD-einreichen
title: Einreichen über das Mailprogramm
folder: src/einreichen/
realises:
  - EINREICHEN SETZT EINEN VOLLSTÄNDIGEN ANTRAG VORAUS
  - DER ANTRAG WIRD ÜBER DAS MAILPROGRAMM EINGEREICHT
  - KEINE ANTWORT STEHT IN EINER ADRESSE
follows:
  - ARC-001
uses:
  - MOD-pruefung.fehlendePflichtfragen
  - MOD-export.zeilen
  - MOD-export.alsWord
  - MOD-export.speichere
provides:
  - EMPFAENGER
  - MAILTO
  - reicheEin
---
# MOD-einreichen Einreichen über das Mailprogramm

## Verantwortung

Führt *Einreichen* aus: prüft die Pflichtfragen, speichert dann das Word-Dokument und öffnet danach das Mailprogramm.
Die `mailto:`-Adresse ist eine Konstante; keine Antwort gelangt hinein.

## Schnittstellen

- `EMPFAENGER = "cio-office@fau.de"` — auch der Text, den MOD-formular am Bedienelement zeigt.
- `MAILTO` — `mailto:cio-office@fau.de` mit dem Betreff „Antrag neues IuK-Projekt“ und einem Text, der bittet, das eben
  gespeicherte Word-Dokument anzuhängen.
- `reicheEin(abschnitte, antworten, oeffne) -> Promise<{ fehlend: Frage[] }>` — ist `fehlendePflichtfragen` nicht leer,
  gibt es sie zurück und tut sonst nichts; sonst speichert es `alsWord` über `speichere` und ruft danach
  `oeffne(MAILTO)`, und `fehlend` ist leer. `oeffne` setzt im Browser `location.href`; ein Test übergibt sein eigenes.

## Dateien

- `src/einreichen/index.mjs`

## Benutzt

- MOD-pruefung: `fehlendePflichtfragen`.
- MOD-export: `zeilen`, `alsWord`, `speichere`.
