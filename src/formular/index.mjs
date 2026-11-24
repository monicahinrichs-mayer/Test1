// MOD-formular: die Seite des Formulars. Die einzige Stelle, die das DOM berührt: zeichnet das Formular aus dem Katalog,
// bindet jede Eingabe an den Zwischenstand, kennzeichnet die Pflichtfragen und zeigt die Bedienelemente.

import { ladeKatalog } from "../fragenkatalog/index.mjs";
import { istPflicht } from "../pruefung/index.mjs";
import { lies, loesche, schreibe } from "../zwischenstand/index.mjs";
import { alsPdf, alsWord, dateiname, speichere, zeilen } from "../export/index.mjs";
import { BETREFF, EMPFAENGER, reicheEin } from "../einreichen/index.mjs";

// Ein Element mit Attributen und Kindern; ein Attribut mit undefined entfällt.
function el(name, attribute = {}, ...kinder) {
  const element = document.createElement(name);
  for (const [schluessel, wert] of Object.entries(attribute)) {
    if (wert !== undefined) element.setAttribute(schluessel, wert);
  }
  element.append(...kinder);
  return element;
}

// Nummer, Text und Pflichtkennzeichen einer Frage: sichtbar „*“, für Screenreader „Pflicht“
// (JEDE PFLICHTFRAGE IST GEKENNZEICHNET, nicht allein durch Farbe).
function titel(frage) {
  return [
    el("span", { class: "nr" }, frage.nr),
    " ",
    el("span", { class: "text" }, frage.text),
    el("span", { class: "pflicht" }, " ", el("span", { "aria-hidden": "true" }, "*"), el("span", { class: "nur-vorgelesen" }, " (Pflicht)")),
  ];
}

// Das Feld einer Frage nach ihrer Antwortart (JEDE FRAGE HAT IHRE ANTWORTART) und ihre eingeklappte Erklärung
// (JEDE FRAGE ERKLÄRT SICH).
function zeichneFrage(frage) {
  const id = `feld-${frage.nr}`;
  const titelId = `titel-${frage.nr}`;
  const erklaerung = el(
    "details",
    { class: "erklaerung" },
    el("summary", {}, "Erklärung", el("span", { class: "nur-vorgelesen" }, ` zu ${frage.nr}`)),
    el("p", {}, frage.erklaerung),
  );

  if (frage.art === "Auswahl") {
    // Eine Gruppe von Optionsfeldern mit demselben Namen: höchstens eine Möglichkeit ist gewählt (UC-001 3c).
    return el(
      "div",
      { class: "frage", "data-nr": frage.nr },
      el(
        "fieldset",
        { id, role: "radiogroup", "aria-labelledby": titelId },
        el("legend", { id: titelId, class: "frage-titel" }, ...titel(frage)),
        ...frage.moeglichkeiten.map((moeglichkeit, i) =>
          el(
            "div",
            { class: "moeglichkeit" },
            el("input", { type: "radio", name: frage.nr, value: moeglichkeit, id: `${id}-${i + 1}` }),
            el("label", { for: `${id}-${i + 1}` }, moeglichkeit),
          ),
        ),
      ),
      erklaerung,
    );
  }

  if (frage.art === "Hinweis") {
    // Ein Kästchen, das bestätigt, dass eine Beilage beigefügt ist; sein Name ist die Frage und „Beilage ist beigefügt“.
    return el(
      "div",
      { class: "frage", "data-nr": frage.nr },
      el("p", { id: titelId, class: "frage-titel" }, ...titel(frage)),
      el(
        "div",
        { class: "moeglichkeit" },
        el("input", { type: "checkbox", name: frage.nr, id, "aria-labelledby": `${titelId} ${id}-beilage` }),
        el("label", { for: id, id: `${id}-beilage` }, "Beilage ist beigefügt"),
      ),
      erklaerung,
    );
  }
  const kopf = el("label", { for: id, id: titelId, class: "frage-titel" }, ...titel(frage));
  const feld =
    frage.art === "Datum"
      ? el("input", { type: "date", name: frage.nr, id })
      : el("textarea", { name: frage.nr, id, rows: "3" });
  return el("div", { class: "frage", "data-nr": frage.nr }, kopf, feld, erklaerung);
}

/**
 * Lädt Katalog und Zwischenstand, zeichnet das Formular und setzt den Fokus in das erste Feld (UC-001 1–2).
 * @param {HTMLElement} wurzel das Element <main> der Seite
 * @param {URL} basis die URL von docs/
 */
export async function starte(wurzel, basis) {
  let abschnitte;
  try {
    abschnitte = await ladeKatalog(basis);
  } catch {
    wurzel.replaceChildren(el("p", { role: "alert" }, "Das Formular konnte nicht geladen werden. Bitte laden Sie die Seite neu."));
    return;
  }
  const fragen = abschnitte.flatMap((abschnitt) => abschnitt.fragen);
  const frageJe = new Map(fragen.map((frage) => [frage.nr, frage]));
  let antworten = lies();

  // Abschnitte: je Abschnitt ein <fieldset> mit seiner Überschrift (UC-001 2, 3a).
  const formular = el(
    "form",
    { id: "antrag", novalidate: "", "aria-label": "Antrag" },
    el("p", { class: "hinweis" }, "Fragen mit * sind Pflichtfragen."),
    ...abschnitte.map((abschnitt) =>
      el("fieldset", { class: "abschnitt" }, el("legend", {}, el("h2", {}, abschnitt.titel)), ...abschnitt.fragen.map(zeichneFrage)),
    ),
  );

  // Aktionen: Export, Einreichen mit dem Empfänger daneben, Entwurf löschen (EIN KLICK PRO ENTSCHEIDUNG).
  const knopf = (id, text, attribute = {}) => el("button", { type: "button", id, ...attribute }, text);
  const alsWordKnopf = knopf("als-word", "Als Word exportieren");
  const alsPdfKnopf = knopf("als-pdf", "Als PDF exportieren");
  const einreichenKnopf = knopf("einreichen", "Einreichen", { "aria-describedby": "empfaenger" });
  const loeschenKnopf = knopf("entwurf-loeschen", "Entwurf löschen");
  const fehlendListe = el("div", { id: "fehlend", role: "alert" });
  const meldung = el("p", { id: "meldung", role: "status" });
  const aktionen = el(
    "section",
    { class: "aktionen", "aria-labelledby": "aktionen-titel" },
    el("h2", { id: "aktionen-titel" }, "Exportieren und einreichen"),
    el("div", { class: "knoepfe" }, alsWordKnopf, alsPdfKnopf),
    // DAS FORMULAR NENNT, WOHIN ES SENDET
    el("div", { class: "knoepfe einreichen" }, einreichenKnopf, el("span", { id: "empfaenger" }, `an ${EMPFAENGER}`)),
    // UC-003 5a: Empfänger und Betreff zum Kopieren, falls sich kein Mailprogramm öffnet.
    el(
      "p",
      { class: "hinweis" },
      "Öffnet sich kein Mailprogramm, schreiben Sie die Mail selbst an ",
      el("span", { class: "kopierbar" }, EMPFAENGER),
      " mit dem Betreff ",
      el("span", { class: "kopierbar" }, BETREFF),
      " und hängen Sie das gespeicherte Word-Dokument an.",
    ),
    fehlendListe,
    meldung,
    el("div", { class: "knoepfe" }, loeschenKnopf),
  );
  wurzel.replaceChildren(formular, aktionen);

  const melde = (text) => {
    meldung.textContent = text;
  };

  // Das Element, das den Fokus einer Frage bekommt.
  const fokusZiel = (nr) =>
    frageJe.get(nr).art === "Auswahl"
      ? formular.querySelector(`input[name="${nr}"]:checked`) ?? formular.querySelector(`input[name="${nr}"]`)
      : document.getElementById(`feld-${nr}`);

  // PFLICHTFELDER: die Pflicht jeder Frage, neu nach jeder Antwort (V2, V4, C5 hängen an V1, V3, C4).
  const kennzeichne = () => {
    for (const frage of fragen) {
      const pflicht = istPflicht(frage, antworten);
      document.getElementById(`feld-${frage.nr}`).setAttribute("aria-required", String(pflicht));
      formular.querySelector(`[data-nr="${frage.nr}"] .pflicht`).hidden = !pflicht;
    }
  };

  // Die Antworten in die Felder; {} leert jedes Feld.
  const setzeWerte = () => {
    for (const frage of fragen) {
      const wert = antworten[frage.nr];
      if (frage.art === "Auswahl") {
        for (const option of formular.querySelectorAll(`input[name="${frage.nr}"]`)) option.checked = option.value === wert;
      } else if (frage.art === "Hinweis") {
        document.getElementById(`feld-${frage.nr}`).checked = wert === "ja";
      } else {
        document.getElementById(`feld-${frage.nr}`).value = wert ?? "";
      }
    }
  };

  // Jede Eingabe sofort in den Zwischenstand (UC-001 4; EINGABEN BLEIBEN IM BROWSER ERHALTEN).
  let gespeichert = true;
  const uebernehme = (ereignis) => {
    const nr = ereignis.target.closest("[data-nr]")?.dataset.nr;
    const frage = frageJe.get(nr);
    if (!frage) return;
    let wert;
    if (frage.art === "Auswahl") wert = formular.querySelector(`input[name="${nr}"]:checked`)?.value;
    else if (frage.art === "Hinweis") wert = ereignis.target.checked ? "ja" : undefined;
    else wert = ereignis.target.value;
    if (wert === undefined || wert === "") delete antworten[nr];
    else antworten[nr] = wert;
    const ok = schreibe(antworten);
    if (!ok && gespeichert) melde("Ihr Entwurf kann in diesem Browser nicht gespeichert werden. Exportieren Sie ihn, bevor Sie die Seite schließen.");
    gespeichert = ok;
    kennzeichne();
  };
  formular.addEventListener("input", uebernehme);
  formular.addEventListener("change", uebernehme);
  formular.addEventListener("submit", (ereignis) => ereignis.preventDefault());

  // UC-002: Export in einem Klick.
  const exportiere = async (art) => {
    melde("Das Dokument wird erstellt …");
    try {
      const inhalt = zeilen(abschnitte, antworten);
      speichere(art === "docx" ? await alsWord(inhalt) : await alsPdf(inhalt), dateiname(art));
      melde("Das Dokument ist in Ihrem Download-Ordner gespeichert.");
    } catch {
      melde("Das Dokument konnte nicht erstellt werden. Bitte versuchen Sie es erneut.");
    }
  };
  alsWordKnopf.addEventListener("click", () => exportiere("docx"));
  alsPdfKnopf.addEventListener("click", () => exportiere("pdf"));

  // UC-003: Einreichen in einem Klick; fehlt eine Pflichtfrage, nennt das Formular jede und fokussiert die erste.
  einreichenKnopf.addEventListener("click", async () => {
    melde("");
    fehlendListe.replaceChildren();
    let fehlend;
    try {
      ({ fehlend } = await reicheEin(abschnitte, antworten, (adresse) => {
        location.href = adresse;
      }));
    } catch {
      melde("Das Word-Dokument konnte nicht erstellt werden. Bitte versuchen Sie es erneut.");
      return;
    }
    if (fehlend.length === 0) {
      melde(`Das Word-Dokument ist gespeichert. Hängen Sie es an die Mail an ${EMPFAENGER} an.`);
      return;
    }
    fehlendListe.replaceChildren(
      el("p", {}, "Der Antrag ist noch nicht vollständig. Bitte beantworten Sie diese Pflichtfragen:"),
      el(
        "ul",
        {},
        ...fehlend.map((frage) => {
          const link = el("a", { href: `#feld-${frage.nr}`, "data-ziel": frage.nr }, `${frage.nr} ${frage.text}`);
          link.addEventListener("click", (ereignis) => {
            ereignis.preventDefault();
            fokusZiel(frage.nr).focus();
          });
          return el("li", {}, link);
        }),
      ),
    );
    fokusZiel(fehlend[0].nr).focus();
  });

  // UC-001 5a; LÖSCHEN LÖSCHT WIRKLICH: nach einer Rückfrage alle Felder leer und der Schlüssel entfernt.
  loeschenKnopf.addEventListener("click", () => {
    if (!confirm("Möchten Sie den Entwurf wirklich löschen? Alle Antworten werden aus diesem Browser entfernt.")) return;
    loesche();
    antworten = {};
    setzeWerte();
    kennzeichne();
    fehlendListe.replaceChildren();
    melde("Der Entwurf ist gelöscht.");
  });

  setzeWerte();
  kennzeichne();
  // DAS FORMULAR ÖFFNET MIT DEM ERSTEN FELD IM FOKUS
  fokusZiel(fragen[0].nr).focus();
}
