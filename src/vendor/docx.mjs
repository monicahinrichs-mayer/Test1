// Lädt die mitgelieferte Bibliothek docx (siehe VERSIONS.md) vom Ursprung der Seite, einmal, erst beim Export
// (ARC-001: Bibliotheken mitgeliefert und gepinnt; KEIN SERVER). Die UMD-Datei setzt globalThis.docx.
export default await new Promise((fertig, fehler) => {
  if (globalThis.docx) return fertig(globalThis.docx);
  const skript = document.createElement("script");
  skript.src = new URL("./docx.umd.js", import.meta.url).href;
  skript.onload = () => (globalThis.docx ? fertig(globalThis.docx) : fehler(new Error("docx fehlt")));
  skript.onerror = () => fehler(new Error("docx konnte nicht geladen werden"));
  document.head.append(skript);
});
