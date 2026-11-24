// Lädt die mitgelieferte Bibliothek jsPDF (siehe VERSIONS.md) vom Ursprung der Seite, einmal, erst beim Export
// (ARC-001: Bibliotheken mitgeliefert und gepinnt; KEIN SERVER). Die UMD-Datei setzt globalThis.jspdf = { jsPDF, … }.
export default await new Promise((fertig, fehler) => {
  if (globalThis.jspdf?.jsPDF) return fertig(globalThis.jspdf);
  const skript = document.createElement("script");
  skript.src = new URL("./jspdf.umd.min.js", import.meta.url).href;
  skript.onload = () => (globalThis.jspdf?.jsPDF ? fertig(globalThis.jspdf) : fehler(new Error("jsPDF fehlt")));
  skript.onerror = () => fehler(new Error("jsPDF konnte nicht geladen werden"));
  document.head.append(skript);
});
