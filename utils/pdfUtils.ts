
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
    const titleWidth = doc.getTextWidth(title);
    const subtitleWidth = doc.getTextWidth(subtitle);
    
    const xTitle = (pageWidth - titleWidth) / 2;
    const xSubtitle = (pageWidth - subtitleWidth) / 2;
    
    const yTitle = 50; // Top offset
    // Increased spacing from 20 to 35 to ensure no overlap
    const ySubtitle = yTitle + 35; 

    // Shadow
    doc.setTextColor(0, 0, 0);
    doc.text(title, xTitle + 1, yTitle + 1);
    doc.text(subtitle, xSubtitle + 1, ySubtitle + 1);

    // Main Text
    doc.setTextColor(255, 255, 255); // White
    doc.text(title, xTitle, yTitle);
    doc.text(subtitle, xSubtitle, ySubtitle);
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
    const imgHeight = pageHeight - (margin * 2); 

    doc.addImage(page.url, "PNG", margin, margin, imgWidth, imgHeight, undefined, 'FAST');
  });

  doc.save(`${settings.childName}-Coloring-Book.pdf`);
};
