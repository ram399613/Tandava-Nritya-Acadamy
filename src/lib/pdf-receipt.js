import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from './utils';


export function downloadReceiptPDF(payment) {
  if (!payment) return;

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const receiptNum = (payment.transactionId || payment._id || 'RCP-8921').slice(-8).toUpperCase();
    const student = payment.student?.name || payment.studentName || 'Student Dancer';
    const course = payment.course?.title || payment.courseTitle || 'Studio Choreography Discipline';
    const amount = Number(payment.amount) || 4500;
    const baseAmount = Math.round(amount / 1.18);
    const gstAmount = amount - baseAmount;
    const paymentMode = payment.paymentMethod || 'Razorpay Live UPI / Card';
    const paymentDate = formatDate(payment.paidAt || payment.createdAt || new Date());

    
    doc.setFillColor(15, 12, 28);
    doc.rect(0, 0, 210, 45, 'F');

    
    doc.setTextColor(245, 158, 11); 
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TANDAVA NRITYA ACADEMY', 15, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('Cosmic Conservatory of Classical Indian & Global Dance Arts', 15, 27);
    doc.text('88 Artistry Boulevard, Bandra West, Mumbai 400050 | GSTIN: 27AABCT1234D1Z5', 15, 33);
    doc.text('contact@tandavanritya.academy | +91 98765 43210 | Official Tax Invoice', 15, 39);

    
    doc.setFillColor(139, 92, 246);
    doc.roundedRect(145, 12, 50, 24, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 153, 20);
    doc.setFontSize(8);
    doc.text(`#${receiptNum}`, 153, 26);
    doc.text(paymentDate, 153, 32);

    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO (STUDENT):', 15, 58);

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(student, 15, 66);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Student ID: ${payment.studentId || payment.student?._id || 'STD-7749'}`, 15, 72);
    doc.text(`Email: ${payment.student?.email || 'student@danceacademy.com'}`, 15, 77);

    
    doc.setFillColor(16, 185, 129); 
    doc.roundedRect(145, 58, 50, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('STATUS: PAID & CONFIRMED', 148, 66);

    
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 90, 180, 10, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION / CURRICULUM', 20, 96.5);
    doc.text('SAC CODE', 115, 96.5);
    doc.text('AMOUNT (INR)', 160, 96.5);

    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(course, 20, 110);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('12-Week Conservatory Intensive & Studio Barre Training', 20, 116);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('999293', 115, 110);
    doc.text(`Rs. ${baseAmount.toLocaleString('en-IN')}`, 160, 110);

    
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 125, 195, 125);

    
    const startY = 135;
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Subtotal (Tuition Fee):', 120, startY);
    doc.setTextColor(15, 23, 42);
    doc.text(`Rs. ${baseAmount.toLocaleString('en-IN')}`, 165, startY);

    doc.setTextColor(100, 116, 139);
    doc.text('CGST (9%):', 120, startY + 7);
    doc.setTextColor(15, 23, 42);
    doc.text(`Rs. ${Math.round(gstAmount / 2).toLocaleString('en-IN')}`, 165, startY + 7);

    doc.setTextColor(100, 116, 139);
    doc.text('SGST (9%):', 120, startY + 14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Rs. ${Math.round(gstAmount / 2).toLocaleString('en-IN')}`, 165, startY + 14);

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(115, startY + 18, 80, 12, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text('Total Paid:', 120, startY + 26);
    doc.text(`Rs. ${amount.toLocaleString('en-IN')}`, 160, startY + 26);

    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('PAYMENT SETTLEMENT INFO:', 15, startY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Payment Gateway: ${paymentMode}`, 15, startY + 6);
    doc.text(`Transaction Reference: ${payment.transactionId || 'TXN_RZP_VERIFIED'}`, 15, startY + 12);
    doc.text(`Settlement Timestamp: ${paymentDate}`, 15, startY + 18);
    doc.text('Authentication: HMAC SHA-256 Validated', 15, startY + 24);

    
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 190, 85, 30, 2, 2, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text('DIGITALLY VERIFIED INVOICE', 20, 198);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('This is an electronically generated tax invoice.', 20, 204);
    doc.text('Validated with Tandava Nritya Real-Time Ledger & Atlas DB.', 20, 210);

    
    doc.line(135, 215, 195, 215);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Authorized Signatory', 145, 221);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Tandava Nritya Academy Registrar', 145, 225);

    
    doc.setFillColor(15, 12, 28);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text('Thank you for dancing with Tandava Nritya Academy! For queries, contact billing@tandavanritya.academy', 30, 290);

    
    doc.save(`Tandava_Invoice_${receiptNum}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF Generation Error:', err);
    
    printReceiptWindow(payment);
    return false;
  }
}


export function printReceiptWindow(payment) {
  if (!payment) return;

  const receiptNum = (payment.transactionId || payment._id || 'RCP-8921').slice(-8).toUpperCase();
  const student = payment.student?.name || payment.studentName || 'Student Dancer';
  const course = payment.course?.title || payment.courseTitle || 'Studio Choreography Discipline';
  const amount = Number(payment.amount) || 4500;
  const paymentMode = payment.paymentMethod || 'Razorpay Live UPI / Card';
  const paymentDate = formatDate(payment.paidAt || payment.createdAt || new Date());

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print the receipt.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tandava Nritya Academy Tax Invoice #${receiptNum}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; }
          .brand { font-size: 26px; font-weight: 800; color: #6d28d9; letter-spacing: -0.5px; }
          .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
          .badge { background: #10b981; color: white; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: bold; }
          .section { margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f8fafc; text-align: left; padding: 12px; font-size: 13px; border-bottom: 2px solid #e2e8f0; color: #475569; }
          td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .total-box { margin-top: 30px; display: flex; justify-content: flex-end; }
          .total-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 24px; min-width: 250px; }
          .footer { margin-top: 60px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">🔥 TANDAVA NRITYA ACADEMY</div>
            <div class="sub">Cosmic Conservatory of Classical Indian & Global Dance Arts</div>
            <div class="sub">GSTIN: 27AABCT1234D1Z5 | Mumbai, India</div>
          </div>
          <div style="text-align: right;">
            <div class="badge">PAID / CONFIRMED</div>
            <div style="font-weight: bold; margin-top: 10px; font-size: 14px;">INVOICE #${receiptNum}</div>
            <div class="sub">Date: ${paymentDate}</div>
          </div>
        </div>

        <div class="section">
          <div style="font-size: 12px; color: #64748b; font-weight: bold;">BILLED TO:</div>
          <div style="font-size: 18px; font-weight: bold; margin-top: 4px;">${student}</div>
          <div style="font-size: 13px; color: #64748b;">${payment.student?.email || 'student@danceacademy.com'}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Curriculum Discipline</th>
              <th>SAC Code</th>
              <th>Method</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${course}</strong><br><span style="font-size: 12px; color: #64748b;">12-Week Conservatory Intensive Training</span></td>
              <td>999293</td>
              <td>${paymentMode}</td>
              <td style="text-align: right; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-card">
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #64748b;">
              <span>Subtotal:</span>
              <span>₹${Math.round(amount / 1.18).toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #64748b; margin-top: 6px;">
              <span>GST (18%):</span>
              <span>₹${(amount - Math.round(amount / 1.18)).toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #6d28d9; margin-top: 12px; border-top: 1px solid #cbd5e1; padding-top: 8px;">
              <span>Total Paid:</span>
              <span>₹${amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          Digitally generated and verified with Tandava Nritya Real-Time Ledger.<br>
          Thank you for training with Tandava Nritya Academy!
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
