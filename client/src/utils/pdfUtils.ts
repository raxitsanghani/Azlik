import jsPDF from 'jspdf';
import type { Product } from '../data/products';

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateProductPdf(product: Product): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4');

  const marginX = 20;
  let cursorY = 24;

  // Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AZLIK', marginX, cursorY);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Premium Bathroom Collections', marginX, cursorY + 6);

  cursorY += 18;

  // Product image
  const imageHeight = 80;
  const imageWidth = 170;
  const imageDataUrl = await loadImageAsDataUrl(product.image);
  if (imageDataUrl) {
    try {
      doc.addImage(imageDataUrl, 'JPEG', marginX, cursorY, imageWidth, imageHeight);
    } catch {
      // Ignore image errors; continue with text-only layout.
    }
  }

  cursorY += imageHeight + 14;

  // Product title
  doc.setTextColor(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(product.name, marginX, cursorY);

  cursorY += 8;

  // Meta
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90);
  doc.text(`Category: ${product.category}`, marginX, cursorY);
  cursorY += 6;
  doc.text(`Product ID: ${product.id}`, marginX, cursorY);

  cursorY += 10;

  // Description
  doc.setFontSize(11);
  doc.setTextColor(40);
  const descLines = doc.splitTextToSize(product.description, 170);
  doc.text(descLines, marginX, cursorY);
  cursorY += descLines.length * 6 + 4;

  // Specifications heading
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Specifications', marginX, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const specs: string[] = [
    `Material: ${product.material}`,
    `Finish: ${product.finish}`,
    `Dimensions: ${product.dimensions}`,
  ];

  specs.forEach((line) => {
    doc.text(`• ${line}`, marginX, cursorY);
    cursorY += 5;
  });

  cursorY += 8;

  // Contact block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Contact & Enquiries', marginX, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60);
  const contactLines = [
    'Email: enquiries@azlik.luxury',
    'Website: www.azlik.luxury',
    'For architectural specifications or CAD drawings, please contact our concierge team.',
  ];
  contactLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, 170);
    doc.text(wrapped, marginX, cursorY);
    cursorY += wrapped.length * 5;
  });

  // Footer
  doc.setDrawColor(220);
  doc.line(marginX, 285, 190, 285);
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text('AZLIK · Modern Bathroom Sanctuaries', marginX, 291);

  const fileNameSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const fileName = `${fileNameSlug || 'product'}-azlik-catalog.pdf`;

  doc.save(fileName);
}

