import jsPDF from 'jspdf';
import { Order } from '../types';

/**
 * Creates a crisp, high-resolution Canvas image of the official MENSVIBES logo
 * matching the brand emblem: Shoe sole swoosh, MENSVIBES typography, COMFORT MEETS STYLE subtitle.
 */
function createHighResLogoDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200; // 3x high resolution for ultra-sharp PDF output
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - clean luxury warm cream (#FAF6EE)
  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = 600; // center X

  // 1. Draw Shoe Silhouette & Soles
  ctx.save();
  ctx.translate(cx - 180, 50);
  ctx.scale(1.8, 1.8);

  // Upper shoe body - Rich brown (#8B3A13)
  ctx.beginPath();
  ctx.moveTo(30, 80);
  ctx.bezierCurveTo(40, 40, 80, 20, 110, 20);
  ctx.bezierCurveTo(130, 20, 150, 40, 160, 50);
  ctx.bezierCurveTo(180, 60, 210, 65, 230, 65);
  ctx.bezierCurveTo(240, 65, 245, 80, 220, 95);
  ctx.bezierCurveTo(180, 110, 120, 105, 30, 80);
  ctx.closePath();
  ctx.fillStyle = '#7A3311';
  ctx.fill();

  // Decorative cutouts on shoe upper
  ctx.fillStyle = '#FAF6EE';
  ctx.beginPath();
  ctx.ellipse(135, 45, 18, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(155, 55, 18, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Middle Sole Layer 1 (Warm salmon/orange #D97A4E)
  ctx.beginPath();
  ctx.moveTo(30, 88);
  ctx.bezierCurveTo(100, 115, 180, 115, 240, 80);
  ctx.bezierCurveTo(220, 100, 160, 125, 30, 105);
  ctx.closePath();
  ctx.fillStyle = '#E88D67';
  ctx.fill();

  // Middle Sole Layer 2 (Warm terra cotta #B85835)
  ctx.beginPath();
  ctx.moveTo(30, 102);
  ctx.bezierCurveTo(100, 125, 170, 125, 220, 102);
  ctx.bezierCurveTo(180, 132, 110, 132, 42, 116);
  ctx.closePath();
  ctx.fillStyle = '#C86A43';
  ctx.fill();

  // Bottom Base Sole - Deep charcoal/black (#1A1A1A)
  ctx.beginPath();
  ctx.moveTo(42, 118);
  ctx.bezierCurveTo(100, 138, 170, 138, 205, 118);
  ctx.bezierCurveTo(170, 148, 90, 145, 42, 128);
  ctx.closePath();
  ctx.fillStyle = '#1A1A1A';
  ctx.fill();

  ctx.restore();

  // 2. MENSVIBES Title Typography
  ctx.font = '900 76px "Georgia", "Times New Roman", serif';
  ctx.fillStyle = '#7A3311';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('M E N S V I B E S', cx, 310);

  // 3. COMFORT MEETS STYLE Subtitle
  ctx.font = '700 28px "Arial", sans-serif';
  ctx.fillStyle = '#D97A4E';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('COMFORT MEETS STYLE', cx, 360);

  return canvas.toDataURL('image/png', 1.0);
}

export function generateInvoicePDF(order: Order): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const logoDataUrl = createHighResLogoDataUrl();

  // Header Banner Background
  doc.setFillColor(250, 246, 238); // Cream #FAF6EE
  doc.rect(0, 0, 210, 52, 'F');

  // Add high-resolution logo image
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 15, 6, 90, 30);
  }

  // Header Right - Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(122, 51, 17); // #7A3311
  doc.text('OFFICIAL TAX INVOICE', 195, 18, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 26, 26);
  doc.text(`INVOICE NO: INV-${order.orderNumber}`, 195, 26, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Date: ${formattedDate}`, 195, 32, { align: 'right' });
  doc.text(`Status: ${order.orderStatus.toUpperCase()}`, 195, 38, { align: 'right' });

  // Store Address Bar
  doc.setDrawColor(210, 200, 180);
  doc.setLineWidth(0.5);
  doc.line(15, 52, 195, 52);

  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(
    'Shop no-33/34/35/36, Level-5, Fortune Shopping Mall, Mouchak, Malibag, Dhaka | Hotline: +8801721605677',
    15,
    58
  );
  doc.text('Email: admin.mensvibes@gmail.com | Website: https://mensvibes.shop', 15, 63);

  // Customer & Shipping Info Box
  let y = 72;

  // Billed To Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, y, 88, 38, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(122, 51, 17);
  doc.text('BILLED TO (CUSTOMER)', 20, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(order.customerName, 20, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text(`Phone: ${order.customerPhone}`, 20, y + 22);
  doc.text(`Email: ${order.customerEmail}`, 20, y + 28);

  // Delivery Destination Box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(107, y, 88, 38, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(122, 51, 17);
  doc.text('DELIVERY ADDRESS', 112, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(order.shippingAddress.streetAddress, 112, y + 15);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 112, y + 22);
  doc.text('Bangladesh', 112, y + 28);

  // Items Table Header
  y += 46;

  doc.setFillColor(30, 30, 30); // Dark header bar
  doc.rect(15, y, 180, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ITEM DESCRIPTION', 20, y + 6.5);
  doc.text('SIZE', 115, y + 6.5, { align: 'center' });
  doc.text('QTY', 135, y + 6.5, { align: 'center' });
  doc.text('UNIT PRICE', 165, y + 6.5, { align: 'right' });
  doc.text('TOTAL (BDT)', 190, y + 6.5, { align: 'right' });

  y += 10;

  // Items List
  order.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(250, 250, 250);
      doc.rect(15, y, 180, 12, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    // Truncate long names
    const shortName = item.productName.length > 40 ? item.productName.substring(0, 37) + '...' : item.productName;
    doc.text(shortName, 20, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text('Handcrafted A-Grade Leather', 20, y + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(`EU ${item.size}`, 115, y + 7, { align: 'center' });
    doc.text(`${item.quantity}`, 135, y + 7, { align: 'center' });
    doc.text(`TK ${item.unitPrice.toLocaleString()}`, 165, y + 7, { align: 'right' });
    doc.text(`TK ${item.subtotal.toLocaleString()}`, 190, y + 7, { align: 'right' });

    y += 12;
    doc.setDrawColor(230, 230, 230);
    doc.line(15, y, 195, y);
  });

  // Table Bottom Summary
  y += 6;

  // Payment Status Box (Left)
  doc.setFillColor(240, 249, 244); // subtle green background
  doc.roundedRect(15, y, 95, 32, 3, 3, 'F');
  doc.setDrawColor(52, 211, 153);
  doc.roundedRect(15, y, 95, 32, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(16, 185, 129);
  doc.text('PAYMENT & MERCHANDISE VERIFICATION', 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 20, y + 14);
  if (order.paymentMethod === 'bkash') {
    doc.text('bKash Merchant Hotline: +8801721605677', 20, y + 20);
  } else {
    doc.text('Verified Doorstep Courier Dispatch', 20, y + 20);
  }
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`Order Status: ${order.orderStatus.toUpperCase()}`, 20, y + 26);

  // Total Breakdown (Right)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Subtotal:', 145, y + 7);
  doc.text(`TK ${order.totalAmount.toLocaleString()}`, 190, y + 7, { align: 'right' });

  doc.text('Courier Express Shipping:', 145, y + 14);
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text('FREE', 190, y + 14, { align: 'right' });

  doc.setDrawColor(200, 200, 200);
  doc.line(140, y + 18, 195, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(122, 51, 17);
  doc.text('Total Amount Paid:', 140, y + 26);
  doc.text(`TK ${order.totalAmount.toLocaleString()}`, 190, y + 26, { align: 'right' });

  // Guarantee Seal & Footer Note
  y += 45;

  doc.setFillColor(250, 246, 238);
  doc.roundedRect(15, y, 180, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(122, 51, 17);
  doc.text('MENSVIBES HANDCRAFTED FOOTWEAR GUARANTEE', 105, y + 7, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(
    'Every pair is crafted with 100% premium genuine cow leather and ergonomic comfort insoles.',
    105,
    y + 12,
    { align: 'center' }
  );
  doc.text(
    'For exchanges or support, visit our store at Fortune Shopping Mall, Malibag, Dhaka or call +8801721605677.',
    105,
    y + 17,
    { align: 'center' }
  );

  // Download PDF file
  const fileName = `MENSVIBES_Invoice_INV-${order.orderNumber}.pdf`;
  doc.save(fileName);
}
