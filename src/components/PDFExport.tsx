import React from 'react';
import { jsPDF } from 'jspdf';
import { useStore } from '../store';
import { Download } from 'lucide-react';

export function PDFExport() {
  const chapters = useStore(state => state.chapters);

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yOffset = 20;

    chapters.forEach((chapter, chapterIndex) => {
      // Add chapter title
      doc.setFontSize(16);
      doc.text(chapter.title, 20, yOffset);
      yOffset += 10;

      chapter.subchapters.forEach((subchapter, subIndex) => {
        // Add subchapter title
        doc.setFontSize(14);
        doc.text(subchapter.title, 30, yOffset);
        yOffset += 10;

        // Add content
        doc.setFontSize(12);
        const contentLines = doc.splitTextToSize(subchapter.content, 170);
        contentLines.forEach((line: string) => {
          if (yOffset > 280) {
            doc.addPage();
            yOffset = 20;
          }
          doc.text(line, 40, yOffset);
          yOffset += 7;
        });

        yOffset += 10;
      });

      if (chapterIndex < chapters.length - 1) {
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 20;
        } else {
          yOffset += 20;
        }
      }
    });

    doc.save('notebook.pdf');
  };

  return (
    <button
      onClick={exportToPDF}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Download size={20} />
      Export to PDF
    </button>
  );
}