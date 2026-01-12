// Cart Page Logic
class Cart {
  static init() {
    // Load cart from storage
    App.cart = Storage.getCart();
    this.renderCart();
    this.setupEventListeners();
    
    // Listen for storage changes (when cart is updated from other pages)
    window.addEventListener('storage', () => {
      App.cart = Storage.getCart();
      this.renderCart();
    });
    
    // Also check periodically (for same-tab updates)
    setInterval(() => {
      const storedCart = Storage.getCart();
      if (JSON.stringify(storedCart) !== JSON.stringify(App.cart)) {
        App.cart = storedCart;
        this.renderCart();
      }
    }, 1000);
  }

  static setupEventListeners() {
    // Process Payment button
    const processPaymentBtn = document.getElementById('process-payment');
    if (processPaymentBtn) {
      processPaymentBtn.addEventListener('click', () => {
        if (typeof POS !== 'undefined') {
          POS.showPaymentModal();
        } else {
          // Fallback if POS class not available
          this.showPaymentModal();
        }
      });
    }

    // Hold Bill button
    const holdBillBtn = document.getElementById('hold-bill');
    if (holdBillBtn) {
      holdBillBtn.addEventListener('click', () => {
        if (typeof POS !== 'undefined') {
          POS.holdBill();
        } else {
          this.holdBill();
        }
      });
    }
  }

  static renderCart() {
    const cartEmptyState = document.getElementById('cart-empty-state');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const cartSummary = document.getElementById('cart-summary');

    if (!cartEmptyState || !cartItemsList || !cartSummaryContainer || !cartSummary) return;

    if (App.cart.length === 0) {
      cartEmptyState.style.display = 'block';
      cartItemsList.style.display = 'none';
      cartSummaryContainer.style.display = 'none';
      return;
    }

    // Show items
    cartEmptyState.style.display = 'none';
    cartItemsList.style.display = 'block';
    cartSummaryContainer.style.display = 'block';

    // Render cart items
    cartItemsList.innerHTML = App.cart.map(item => `
      <div class="cart-item" style="display: flex; gap: 1rem; padding: 1.5rem; border-bottom: 1px solid var(--border-light); align-items: center;">
        <div class="cart-item-info" style="flex: 1;">
          <div class="cart-item-name" style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.5rem;">${item.name}</div>
          <div class="cart-item-price" style="color: var(--primary-start); font-weight: 600; font-size: 1rem;">${App.formatCurrency(item.price)} each</div>
        </div>
        <div class="cart-item-controls" style="display: flex; align-items: center; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-light); border-radius: 0.5rem; padding: 0.25rem;">
            <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', -1)" style="width: 2.5rem; height: 2.5rem; border: none; background: transparent; cursor: pointer; font-size: 1.25rem; color: var(--text-light);">-</button>
            <span class="quantity-display" style="min-width: 3rem; text-align: center; font-weight: 600; font-size: 1.125rem;">${item.quantity}</span>
            <button class="quantity-btn" onclick="Cart.updateQuantity('${item.id}', 1)" style="width: 2.5rem; height: 2.5rem; border: none; background: transparent; cursor: pointer; font-size: 1.25rem; color: var(--text-light);">+</button>
          </div>
          <button class="btn btn-icon btn-danger" onclick="Cart.removeItem('${item.id}')" style="width: 3rem; height: 3rem;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Render summary
    const totals = App.calculateCartTotal();
    cartSummary.innerHTML = `
      <div class="cart-summary-row" style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1rem;">
        <span>Subtotal</span>
        <span>${App.formatCurrency(totals.subtotal)}</span>
      </div>
      ${totals.tax > 0 ? `
        <div class="cart-summary-row" style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1rem;">
          <span>Tax (${Storage.getSettings()?.taxRate || 0}%)</span>
          <span>${App.formatCurrency(totals.tax)}</span>
        </div>
      ` : ''}
      ${totals.discount > 0 ? `
        <div class="cart-summary-row" style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1rem;">
          <span>Discount</span>
          <span>-${App.formatCurrency(totals.discount)}</span>
        </div>
      ` : ''}
      <div class="cart-summary-row cart-total" style="display: flex; justify-content: space-between; padding: 1rem 0; margin-top: 0.5rem; border-top: 2px solid var(--border-light); font-size: 1.5rem; font-weight: 700; color: var(--primary-start);">
        <span>Total</span>
        <span>${App.formatCurrency(totals.total)}</span>
      </div>
    `;
  }

  static updateQuantity(itemId, change) {
    const cart = App.cart;
    const item = cart.find(ci => ci.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }

    App.cart = cart;
    Storage.setCart(cart);
    this.renderCart();
    this.updateCartBadge();
  }

  static removeItem(itemId) {
    App.cart = App.cart.filter(item => item.id !== itemId);
    Storage.setCart(App.cart);
    this.renderCart();
    this.updateCartBadge();
  }

  static updateCartBadge() {
    const totalItems = App.cart.reduce((sum, item) => sum + item.quantity, 0);
    // Update badge on POS page if it exists
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
  }

  static showPaymentModal() {
    if (App.cart.length === 0) {
      App.showToast('Cart is empty', 'error');
      return;
    }

    if (typeof POS !== 'undefined') {
      POS.showPaymentModal();
    } else {
      // Basic payment modal if POS class not available
      const modal = document.getElementById('payment-modal');
      if (!modal) return;

      modal.classList.add('active');
      const totals = App.calculateCartTotal();
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Select Payment Mode</h2>
            <button class="modal-close" onclick="Cart.closePaymentModal()">&times;</button>
          </div>
          <div class="payment-modes" style="display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center;">
            <button class="payment-mode" onclick="Cart.selectPaymentMode('cash')" style="flex: 1; padding: 1.5rem; border: 2px solid var(--border-light); border-radius: 0.75rem; background: white; cursor: pointer;">
              <div style="font-weight: 600;">Cash</div>
            </button>
            <button class="payment-mode" onclick="Cart.selectPaymentMode('upi')" style="flex: 1; padding: 1.5rem; border: 2px solid var(--primary-start); border-radius: 0.75rem; background: rgba(6, 182, 212, 0.1); cursor: pointer;">
              <div style="font-weight: 600;">UPI</div>
            </button>
            <button class="payment-mode" onclick="Cart.selectPaymentMode('card')" style="flex: 1; padding: 1.5rem; border: 2px solid var(--border-light); border-radius: 0.75rem; background: white; cursor: pointer;">
              <i class="fas fa-credit-card" style="color: var(--primary-start); margin-bottom: 0.5rem;"></i>
              <div style="font-weight: 600;">Card</div>
            </button>
          </div>
          <div id="payment-details"></div>
          <div id="payment-confirm" style="display: none; margin-top: 1.5rem;">
            <button class="btn btn-primary" onclick="Cart.confirmPayment()" style="width: 100%; padding: 1rem; font-size: 1.125rem;">
              Confirm Payment
            </button>
          </div>
        </div>
      `;
    }
  }

  static closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  static selectPaymentMode(mode) {
    document.querySelectorAll('.payment-mode').forEach(pm => {
      pm.style.border = '2px solid var(--border-light)';
      pm.style.background = 'white';
    });
    
    const clickedMode = event?.target?.closest('.payment-mode');
    if (clickedMode) {
      clickedMode.style.border = '2px solid var(--primary-start)';
      clickedMode.style.background = 'rgba(6, 182, 212, 0.1)';
    }

    const detailsContainer = document.getElementById('payment-details');
    const confirmContainer = document.getElementById('payment-confirm');
    const totals = App.calculateCartTotal();

    if (mode === 'upi') {
      const settings = Storage.getSettings();
      if (!settings?.upiId) {
        App.showToast('UPI ID not configured. Please set it in Settings.', 'error');
        return;
      }
      detailsContainer.innerHTML = `
        <div class="qr-container">
          <h3 style="font-weight: 700; margin-bottom: 1.5rem;">Scan to Pay</h3>
          <div class="qr-code" id="upi-qr" style="margin: 1rem 0;"></div>
          <p style="margin-top: 1rem;"><strong>Amount:</strong> ${App.formatCurrency(totals.total)}</p>
          <p><strong>UPI ID:</strong> ${settings.upiId}</p>
        </div>
      `;
      setTimeout(() => {
        if (typeof POS !== 'undefined' && POS.generateUPIQR) {
          POS.generateUPIQR(totals.total, settings.upiId);
        } else {
          // Fallback QR generation
          this.generateUPIQR(totals.total, settings.upiId);
        }
      }, 100);
      confirmContainer.style.display = 'block';
    } else if (mode === 'card') {
      detailsContainer.innerHTML = `
        <div class="text-center" style="padding: 2rem;">
          <i class="fas fa-credit-card" style="font-size: 3rem; color: var(--primary-start); margin-bottom: 1rem;"></i>
          <p>Card payment will be processed</p>
          <p style="margin-top: 0.5rem;"><strong>Amount:</strong> ${App.formatCurrency(totals.total)}</p>
        </div>
      `;
      confirmContainer.style.display = 'block';
    } else {
      detailsContainer.innerHTML = '';
      confirmContainer.style.display = 'block';
    }

    this.selectedPaymentMode = mode;
  }

  static confirmPayment() {
    if (!this.selectedPaymentMode) {
      App.showToast('Please select a payment mode', 'error');
      return;
    }

    const totals = App.calculateCartTotal();
    const order = {
      id: generateId(),
      invoiceNo: App.generateInvoiceNumber(),
      date: new Date().toISOString(),
      items: App.cart.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total,
      paymentMode: this.selectedPaymentMode
    };

    Storage.addOrder(order);
    App.cart = [];
    Storage.clearCart();
    this.closePaymentModal();
    
    // Navigate to invoice
    window.location.href = `invoice.html?id=${order.id}`;
  }

  static holdBill() {
    if (App.cart.length === 0) {
      App.showToast('Cart is empty', 'error');
      return;
    }

    const totals = App.calculateCartTotal();
    const bill = {
      id: generateId(),
      date: new Date().toISOString(),
      items: [...App.cart],
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total
    };

    Storage.addHeldBill(bill);
    App.cart = [];
    Storage.clearCart();
    this.renderCart();
    this.updateCartBadge();
    App.showToast('Bill held successfully', 'success');
  }

  static generateUPIQR(amount, upiId) {
    const qrContainer = document.getElementById('upi-qr');
    if (!qrContainer || !upiId) {
      return;
    }

    qrContainer.innerHTML = '';

    const amountNum = parseFloat(amount.toString().replace(/[₹,\s]/g, ''));
    const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amountNum.toFixed(2)}&cu=INR`;

    if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
      QRCode.toCanvas(qrContainer, upiString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) {
          this.generateQRFallback(qrContainer, upiString);
        }
      });
    } else if (typeof QRCode !== 'undefined' && typeof QRCode === 'function') {
      try {
        new QRCode(qrContainer, {
          text: upiString,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      } catch (e) {
        this.generateQRFallback(qrContainer, upiString);
      }
    } else {
      this.generateQRFallback(qrContainer, upiString);
    }
  }

  static generateQRFallback(qrContainer, upiString) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    const img = document.createElement('img');
    img.src = qrApiUrl;
    img.alt = 'UPI QR Code';
    img.style.cssText = 'width: 200px; height: 200px; margin: 0 auto; display: block; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 0.5rem; background: white;';
    qrContainer.appendChild(img);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
});

