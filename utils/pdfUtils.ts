import { jsPDF } from "jspdf";
import { GeneratedImage, BookSettings } from "../types";

export const generatePDF = async (images: GeneratedImage[], settings: BookSettings) => {
  // Initialize portrait A4
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Cover Page ---
  const coverImage = images.find((img) => img.type === "cover");
  if (coverImage) {
    doc.addImage(coverImage.url, "PNG", 0, 0, pageWidth, pageHeight);
    
    // Overlay Title
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(42);
    
    // Text Shadow for readability
    const title = `${settings.childName}'s`;
    const subtitle = "Coloring Adventure";
    
    // Simple centered text logic
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;
    const y = 50; // Top offset

    // Shadow
    doc.setTextColor(0, 0, 0);
    doc.text(title, x + 1, y + 1);
    doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2 + 1, y + 15 + 1);

    // Main Text
    doc.setTextColor(255, 255, 255); // White
    doc.text(title, x, y);
    doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, y + 15);
  } else {
    // Fallback text cover if generation failed
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setFontSize(40);
    doc.text(`${settings.childName}'s Coloring Book`, 20, 100);
  }

  // --- Content Pages ---
  const pages = images.filter((img) => img.type === "page");
  
  pages.forEach((page, index) => {
    doc.addPage();
    
    // Add a simple border or frame
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Margin border

    // Image constrained to margins
    const margin = 20;
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = pageHeight - (margin * 2) - 20; // Space for footer

    doc.addImage(page.url, "PNG", margin, margin, imgWidth, imgHeight, undefined, 'FAST');

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${index + 1} - ${settings.theme}`, margin, pageHeight - 10);
  });

  doc.save(`${settings.childName}-Coloring-Book.pdf`);
};