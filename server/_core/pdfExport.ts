/**
 * PDF Export Functionality
 * Generates PDF exports for readings and comparisons
 */

import { PDFDocument, rgb, PDFPage } from "pdf-lib";

interface ReadingData {
  id: string;
  spreadType: string;
  question?: string;
  cards: Array<{
    name: string;
    suit: string;
    number: number;
    meaning: string;
    reversed: boolean;
  }>;
  interpretation: string;
  createdAt: Date;
}

interface ComparisonData {
  id: string;
  reading1: ReadingData;
  reading2: ReadingData;
  analysis: string;
  createdAt: Date;
}

/**
 * Generate PDF for a single reading
 */
export async function generateReadingPDF(reading: ReadingData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  const margin = 40;
  let yPosition = height - margin;

  // Helper function to add text
  const addText = (text: string, size: number = 12, bold: boolean = false, color = rgb(0, 0, 0)) => {
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size,
      color,
    });
    yPosition -= size + 8;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (space: number = 50) => {
    if (yPosition < margin + space) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = height - margin;
    }
  };

  // Title
  addText("Tarot Reading", 24, true, rgb(1, 0, 0.5));
  yPosition -= 10;

  // Reading info
  addText(`Spread Type: ${reading.spreadType}`, 11);
  if (reading.question) {
    addText(`Question: ${reading.question}`, 11);
  }
  addText(`Date: ${reading.createdAt.toLocaleDateString()}`, 11);
  yPosition -= 10;

  // Cards
  addText("Cards:", 14, true);
  yPosition -= 5;

  reading.cards.forEach((card, index) => {
    checkNewPage(60);
    addText(`${index + 1}. ${card.name}${card.reversed ? " (Reversed)" : ""}`, 12, true);
    addText(`Suit: ${card.suit} | Number: ${card.number}`, 10);
    addText(`Meaning: ${card.meaning}`, 10);
    yPosition -= 8;
  });

  yPosition -= 10;

  // Interpretation
  addText("Interpretation:", 14, true);
  yPosition -= 5;

  // Word wrap interpretation
  const maxWidth = width - 2 * margin;
  const interpretationLines = wrapText(reading.interpretation, 70);
  interpretationLines.forEach((line) => {
    checkNewPage(30);
    addText(line, 11);
  });

  // Generate PDF buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Generate PDF for comparison analysis
 */
export async function generateComparisonPDF(comparison: ComparisonData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  const margin = 40;
  let yPosition = height - margin;

  const addText = (text: string, size: number = 12, bold: boolean = false, color = rgb(0, 0, 0)) => {
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size,
      color,
    });
    yPosition -= size + 8;
  };

  const checkNewPage = (space: number = 50) => {
    if (yPosition < margin + space) {
      page = pdfDoc.addPage([612, 792]);
      yPosition = height - margin;
    }
  };

  // Title
  addText("Reading Comparison Analysis", 24, true, rgb(1, 0, 0.5));
  yPosition -= 10;

  // Date
  addText(`Date: ${comparison.createdAt.toLocaleDateString()}`, 11);
  yPosition -= 10;

  // Reading 1
  addText("First Reading:", 14, true);
  addText(`Spread: ${comparison.reading1.spreadType}`, 11);
  if (comparison.reading1.question) {
    addText(`Question: ${comparison.reading1.question}`, 11);
  }
  yPosition -= 8;

  // Reading 1 Cards
  addText("Cards:", 12, true);
  comparison.reading1.cards.forEach((card, index) => {
    checkNewPage(40);
    addText(`  ${index + 1}. ${card.name}${card.reversed ? " (R)" : ""}`, 10);
  });

  yPosition -= 10;

  // Reading 2
  addText("Second Reading:", 14, true);
  addText(`Spread: ${comparison.reading2.spreadType}`, 11);
  if (comparison.reading2.question) {
    addText(`Question: ${comparison.reading2.question}`, 11);
  }
  yPosition -= 8;

  // Reading 2 Cards
  addText("Cards:", 12, true);
  comparison.reading2.cards.forEach((card, index) => {
    checkNewPage(40);
    addText(`  ${index + 1}. ${card.name}${card.reversed ? " (R)" : ""}`, 10);
  });

  yPosition -= 15;

  // Analysis
  addText("AI Analysis:", 14, true);
  yPosition -= 5;

  const analysisLines = wrapText(comparison.analysis, 70);
  analysisLines.forEach((line) => {
    checkNewPage(30);
    addText(line, 11);
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Wrap text to fit within a certain character width
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  });

  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

/**
 * Export reading as PDF file
 */
export async function exportReadingAsPDF(reading: ReadingData, filename: string): Promise<Buffer> {
  return generateReadingPDF(reading);
}

/**
 * Export comparison as PDF file
 */
export async function exportComparisonAsPDF(comparison: ComparisonData, filename: string): Promise<Buffer> {
  return generateComparisonPDF(comparison);
}
