// Invoice Generation Logic
class Invoice {
  static order = null;

  static init() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
      document.getElementById('invoice-container').innerHTML = `
        <div class="card">
          <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>Invoice not found</p>
            <a href="index.html" class="btn btn-primary mt-2">Back to POS</a>
          </div>
        </div>
      `;
      return;
    }

    const orders = Storage.getOrders();
    this.order = orders.find(o => o.id === orderId);

    if (!this.order) {
      document.getElementById('invoice-container').innerHTML = `
        <div class="card">
          <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>Invoice not found</p>
            <a href="index.html" class="btn btn-primary mt-2">Back to POS</a>
          </div>
        </div>
      `;
      return;
    }

    this.renderInvoice();
    this.setupEventListeners();
  }

  static renderInvoice() {
    const container = document.getElementById('invoice-container');
    if (!container || !this.order) return;

    const settings = Storage.getSettings();
    const date = new Date(this.order.date);

    container.innerHTML = `
      <div class="invoice" id="invoice">
        <div class="invoice-header">
          <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">${settings?.payeeName || 'Restaurant'}</h1>
          <p style="color: #6b7280;">Invoice</p>
        </div>

        <div class="invoice-details">
          <div>
            <p><strong>Invoice No:</strong> ${this.order.invoiceNo}</p>
            <p><strong>Date:</strong> ${date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div>
            <p><strong>Payment Mode:</strong> ${this.order.paymentMode.toUpperCase()}</p>
            <p><strong>Status:</strong> <span style="color: #10b981;">Paid</span></p>
          </div>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${this.order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${App.formatCurrency(item.price)}</td>
                <td>${App.formatCurrency(item.price * item.qty)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="invoice-total">
          <div class="invoice-total-row">
            <span>Subtotal:</span>
            <span>${App.formatCurrency(this.order.subtotal)}</span>
          </div>
          ${this.order.tax > 0 ? `
            <div class="invoice-total-row">
              <span>Tax (${settings?.taxRate || 0}%):</span>
              <span>${App.formatCurrency(this.order.tax)}</span>
            </div>
          ` : ''}
          ${this.order.discount > 0 ? `
            <div class="invoice-total-row">
              <span>Discount:</span>
              <span>-${App.formatCurrency(this.order.discount)}</span>
            </div>
          ` : ''}
          <div class="invoice-total-row invoice-total-final">
            <span>Total:</span>
            <span>${App.formatCurrency(this.order.total)}</span>
          </div>
        </div>

        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p>Thank you for your visit!</p>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">${settings?.payeeName || 'Restaurant'}</p>
        </div>
      </div>
    `;
  }

  static setupEventListeners() {
    // Print
    const printBtn = document.getElementById('print-invoice');
    if (printBtn) {
      printBtn.addEventListener('click', () => this.printInvoice());
    }

    // Download PDF
    const downloadPDFBtn = document.getElementById('download-pdf');
    if (downloadPDFBtn) {
      downloadPDFBtn.addEventListener('click', () => this.downloadPDF());
    }

    // Export CSV
    const exportCSVBtn = document.getElementById('export-csv');
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportCSV());
    }

    // Share
    const shareBtn = document.getElementById('share-invoice');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareInvoice());
    }
  }

  static printInvoice() {
    window.print();
  }

  static downloadPDF() {
    if (typeof window.jspdf === 'undefined') {
      alert('PDF library not loaded. Please check your internet connection.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const invoiceElement = document.getElementById('invoice');
    
    // Simple PDF generation
    const settings = Storage.getSettings();
    const date = new Date(this.order.date);

    doc.setFontSize(20);
    doc.text(settings?.payeeName || 'Restaurant', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Invoice', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Invoice No: ${this.order.invoiceNo}`, 20, 45);
    doc.text(`Date: ${date.toLocaleDateString()}`, 20, 52);
    doc.text(`Payment Mode: ${this.order.paymentMode.toUpperCase()}`, 20, 59);

    let yPos = 70;
    doc.setFontSize(12);
    doc.text('Items', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    this.order.items.forEach(item => {
      doc.text(`${item.name} (${item.qty}x)`, 20, yPos);
      doc.text(App.formatCurrency(item.price * item.qty), 180, yPos, { align: 'right' });
      yPos += 7;
    });

    yPos += 5;
    doc.text(`Subtotal: ${App.formatCurrency(this.order.subtotal)}`, 120, yPos, { align: 'right' });
    yPos += 7;
    if (this.order.tax > 0) {
      doc.text(`Tax: ${App.formatCurrency(this.order.tax)}`, 120, yPos, { align: 'right' });
      yPos += 7;
    }
    doc.setFontSize(12);
    doc.text(`Total: ${App.formatCurrency(this.order.total)}`, 120, yPos, { align: 'right' });

    doc.save(`invoice-${this.order.invoiceNo}.pdf`);
  }

  static exportCSV() {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${this.order.invoiceNo}.csv`;
    a.click();
  }

  static generateCSV() {
    const headers = ['Item', 'Quantity', 'Price', 'Total'];
    const rows = this.order.items.map(item => [
      item.name,
      item.qty,
      item.price,
      item.price * item.qty
    ]);

    const summary = [
      [],
      ['Subtotal', '', '', this.order.subtotal],
      ['Tax', '', '', this.order.tax],
      ['Total', '', '', this.order.total]
    ];

    return [
      ['Invoice No:', this.order.invoiceNo],
      ['Date:', new Date(this.order.date).toLocaleDateString()],
      [],
      headers,
      ...rows,
      ...summary
    ].map(row => row.join(',')).join('\n');
  }

  static shareInvoice() {
    if (navigator.share) {
      const text = this.generateShareText();
      navigator.share({
        title: `Invoice ${this.order.invoiceNo}`,
        text: text
      }).catch(err => console.log('Error sharing', err));
    } else {
      // Fallback: copy to clipboard
      const text = this.generateShareText();
      navigator.clipboard.writeText(text).then(() => {
        alert('Invoice details copied to clipboard!');
      });
    }
  }

  static generateShareText() {
    const date = new Date(this.order.date);
    const settings = Storage.getSettings();
    let text = `${settings?.payeeName || 'Restaurant'}\n`;
    text += `Invoice: ${this.order.invoiceNo}\n`;
    text += `Date: ${date.toLocaleDateString()}\n\n`;
    text += `Items:\n`;
    this.order.items.forEach(item => {
      text += `${item.name} x${item.qty} - ${App.formatCurrency(item.price * item.qty)}\n`;
    });
    text += `\nTotal: ${App.formatCurrency(this.order.total)}`;
    return text;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Invoice.init();
});

