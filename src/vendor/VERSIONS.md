# Mitgelieferte Bibliotheken

Beide Dateien sind unverändert aus dem npm-Paket übernommen und werden erst beim Klick auf einen Export geladen, über
`docx.mjs` beziehungsweise `jspdf.mjs` vom Ursprung der Seite (ARC-001, MOD-export). Prüfen:
`sha256sum src/vendor/docx.umd.js src/vendor/jspdf.umd.min.js`.

| Bibliothek | Version | Lizenz | Quelle | Datei | SHA-256 |
|---|---|---|---|---|---|
| docx | 9.5.1 | MIT | https://cdn.jsdelivr.net/npm/docx@9.5.1/dist/index.umd.cjs | `docx.umd.js` | `aee5cf06c948263b7489f7e1bd08f4b8f612bb845275d6b931c6ef5b0d0a20de` |
| jsPDF | 4.2.1 | MIT | https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js | `jspdf.umd.min.js` | `e6551fcdc32f09d6853b2c5126d18d01d9447e0da618a41a11ebeee0f6c20d54` |

- **docx** — Copyright (c) 2016 Dolan, https://github.com/dolanmiu/docx. Die UMD-Datei setzt `globalThis.docx`.
- **jsPDF** — Copyright (c) 2010-2025 James Hall, (c) 2015-2025 yWorks GmbH, https://github.com/parallax/jsPDF. Die
  UMD-Datei setzt `globalThis.jspdf`; der Lizenztext steht im Kopf der Datei. Die optionalen Abhängigkeiten
  (html2canvas, DOMPurify, canvg) werden nicht mitgeliefert und vom Formular nicht gebraucht.

`.gitattributes` hält beide Dateien von jeder Zeilenende-Umwandlung frei, damit die Prüfsummen auf jedem Rechner gelten.

## Lizenztext docx (MIT)

```text
The MIT License (MIT)

Copyright (c) 2016 Dolan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

## Lizenztext jsPDF (MIT)

```text
Copyright
(c) 2010-2025 James Hall, https://github.com/MrRio/jsPDF
(c) 2015-2025 yWorks GmbH, https://www.yworks.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```
