// src/services/pdf.service.ts
import { jsPDF } from "jspdf";
import { Note } from "../Models/Note";

export const pdfService = {
  exportarNota: (nota: Note, carrera: string, resumenExterno?: string) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - margin * 2;
    let cursorY = 20;

    // TÍTULO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 180, 216);
    doc.text(nota.titulo.toUpperCase(), margin, cursorY);
    cursorY += 10;

    // CARRERA
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`CARRERA: ${carrera || "ESTUDIANTE DUOC UC"}`, margin, cursorY);
    cursorY += 12;

    // CONTENIDO (con paginación)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(40);
    const contenidoLineas = doc.splitTextToSize(nota.contenido, maxLineWidth);

    contenidoLineas.forEach((linea: string) => {
      if (cursorY > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(linea, margin, cursorY);
      cursorY += 6;
    });

    // SÍNTESIS IA
    const resumen = resumenExterno ?? nota.resumenIA ?? "";
    if (resumen.trim().length > 0) {
      cursorY += 8;
      if (cursorY > pageHeight - margin - 20) {
        doc.addPage();
        cursorY = margin;
      }
      doc.setDrawColor(0, 150, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 8;

      doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(0, 150, 200);
      doc.text("SÍNTESIS NEURAL (IA)", margin, cursorY);
      cursorY += 8;

      doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(60);
      const resumenLineas = doc.splitTextToSize(resumen, maxLineWidth);
      resumenLineas.forEach((linea: string) => {
        if (cursorY > pageHeight - margin) { doc.addPage(); cursorY = margin; }
        doc.text(linea, margin, cursorY);
        cursorY += 5.5;
      });
    }

    doc.save(`CyberNotes_${nota.titulo.replace(/\s+/g, "_")}.pdf`);
  }
};