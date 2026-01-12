// POS Screen Logic
class POS {
  static items = [];
  static categories = [];
  static filteredItems = [];
  static currentView = 'grid';
  static selectedCategory = 'all';
  static searchQuery = '';
  static selectedPaymentMode = null;

  static init() {
    this.loadData();
    this.renderMenu();
    this.setupEventListeners();
    this.updateCartBadge();
  }

  static loadData() {
    this.items = Storage.getItems().filter(item => item.isActive);
    this.categories = Storage.getCategories();
    this.filteredItems = [...this.items];
  }

  static setupEventListeners() {
    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.filterItems();
      });
    }

    // View toggle
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        this.currentView = 'grid';
        this.updateViewToggle();
        this.renderMenu();
      });
    }
    if (listBtn) {
      listBtn.addEventListener('click', () => {
        this.currentView = 'list';
        this.updateViewToggle();
        this.renderMenu();
      });
    }

    // Cart button - just update badge, navigation handled by link

    // Payment button
    const processPaymentBtn = document.getElementById('process-payment');
    if (processPaymentBtn) {
      processPaymentBtn.addEventListener('click', () => {
        this.showPaymentModal();
      });
    }

    // Hold bill button
    const holdBillBtn = document.getElementById('hold-bill');
    if (holdBillBtn) {
      holdBillBtn.addEventListener('click', () => {
        this.holdBill();
      });
    }
  }

  static filterItems() {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchQuery);
      const matchesCategory = this.selectedCategory === 'all' || item.categoryId === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
    this.renderMenu();
  }

  static updateViewToggle() {
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    if (gridBtn && listBtn) {
      gridBtn.classList.toggle('active', this.currentView === 'grid');
      listBtn.classList.toggle('active', this.currentView === 'list');
    }
  }

  static renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    if (this.filteredItems.length === 0) {
      menuContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-utensils"></i>
          <p>No items found</p>
        </div>
      `;
      return;
    }

    if (this.currentView === 'grid') {
      this.renderGridView(menuContainer);
    } else {
      this.renderListView(menuContainer);
    }

    // Render category filter
    this.renderCategoryFilter();
  }

  static renderGridView(container) {
    container.innerHTML = `
      <div class="menu-grid">
        ${this.filteredItems.map(item => `
          <div class="menu-item ${!item.isActive ? 'menu-item-inactive' : ''}" onclick="POS.addToCart('${item.id}')">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" onerror="this.src='https://via.placeholder.com/400?text=${encodeURIComponent(item.name)}'">
            <div class="menu-item-content">
              <div class="menu-item-name">${item.name}</div>
              <div class="menu-item-price">${App.formatCurrency(item.price)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  static renderListView(container) {
    container.innerHTML = `
      <div class="menu-list">
        ${this.filteredItems.map(item => `
          <div class="menu-list-item ${!item.isActive ? 'menu-item-inactive' : ''}" onclick="POS.addToCart('${item.id}')">
            <img src="${item.image}" alt="${item.name}" class="menu-list-item-image" onerror="this.src='https://via.placeholder.com/400?text=${encodeURIComponent(item.name)}'">
            <div class="menu-list-item-content">
              <div>
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">${App.formatCurrency(item.price)}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  static renderCategoryFilter() {
    const filterContainer = document.getElementById('category-filter');
    if (!filterContainer) return;

    filterContainer.innerHTML = `
      <div class="category-chip ${this.selectedCategory === 'all' ? 'active' : ''}" onclick="POS.selectCategory('all')">
        All
      </div>
      ${this.categories.map(cat => `
        <div class="category-chip ${this.selectedCategory === cat.id ? 'active' : ''}" onclick="POS.selectCategory('${cat.id}')">
          ${cat.name}
        </div>
      `).join('')}
    `;
  }

  static selectCategory(categoryId) {
    this.selectedCategory = categoryId;
    this.filterItems();
  }

  static addToCart(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    const cart = App.cart;
    const existingItem = cart.find(ci => ci.id === itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }

    App.cart = cart;
    Storage.setCart(cart);
    this.renderCart();
    this.updateCartBadge();
    App.showToast(`${item.name} added to cart`, 'success');
  }

  static updateCartQuantity(itemId, change) {
    const cart = App.cart;
    const item = cart.find(ci => ci.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      cart.splice(cart.indexOf(item), 1);
    }

    App.cart = cart;
    Storage.setCart(cart);
    this.updateCartBadge();
  }

  static removeFromCart(itemId) {
    App.cart = App.cart.filter(item => item.id !== itemId);
    Storage.setCart(App.cart);
    this.updateCartBadge();
  }

  static renderCart() {
    // Cart is now on a separate page, just update badge
    this.updateCartBadge();
  }

  static updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const totalItems = App.cart.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
  }

  static showPaymentModal() {
    if (App.cart.length === 0) {
      App.showToast('Cart is empty', 'error');
      return;
    }

    const modal = document.getElementById('payment-modal');
    if (!modal) return;

    this.selectedPaymentMode = null;
    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Select Payment Mode</h2>
          <button class="modal-close" onclick="POS.closePaymentModal()">&times;</button>
        </div>
        <div class="payment-modes">
          <div class="payment-mode" onclick="POS.selectPaymentMode('cash')">
            <i class="fas fa-money-bill-wave"></i>
            <div>Cash</div>
          </div>
          <div class="payment-mode" onclick="POS.selectPaymentMode('upi')">
            <i class="fas fa-qrcode"></i>
            <div>UPI</div>
          </div>
          <div class="payment-mode" onclick="POS.selectPaymentMode('card')">
            <i class="fas fa-credit-card"></i>
            <div>Card</div>
          </div>
        </div>
        <div id="payment-details"></div>
        <div id="payment-confirm" style="display: none; margin-top: 1rem;">
          <button class="btn btn-primary" onclick="POS.confirmPayment()" style="width: 100%;">
            Confirm Payment
          </button>
        </div>
      </div>
    `;
  }

  static selectPaymentMode(mode) {
    // Update button styles
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
      // Generate QR code - use setTimeout to ensure DOM is ready
      setTimeout(() => {
        this.generateUPIQR(totals.total, settings.upiId);
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

  static generateUPIQR(amount, upiId) {
    const qrContainer = document.getElementById('upi-qr');
    if (!qrContainer || !upiId) {
      return;
    }

    // Clear container first
    qrContainer.innerHTML = '';

    // Format amount (remove currency symbol and spaces, convert to number)
    const amountNum = parseFloat(amount.toString().replace(/[₹,\s]/g, ''));
    const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amountNum.toFixed(2)}&cu=INR`;

    // Use QRCode library if available
    if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
      // Using qrcode library (different API)
      QRCode.toCanvas(qrContainer, upiString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) {
          console.error('QR Code generation error:', error);
          this.generateQRFallback(qrContainer, upiString);
        }
      });
    } else if (typeof QRCode !== 'undefined' && typeof QRCode === 'function') {
      // Using qrcodejs library
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
        console.error('QR Code generation error:', e);
        this.generateQRFallback(qrContainer, upiString);
      }
    } else {
      // Fallback: Use API to generate QR code
      this.generateQRFallback(qrContainer, upiString);
    }
  }

  static generateQRFallback(qrContainer, upiString) {
    // Use QR code API service
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    const img = document.createElement('img');
    img.src = qrApiUrl;
    img.alt = 'UPI QR Code';
    img.style.cssText = 'width: 200px; height: 200px; margin: 0 auto; display: block; border-radius: 0.5rem; border: 1px solid #e5e7eb; padding: 0.5rem; background: white;';
    qrContainer.appendChild(img);
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
    this.renderCart();
    this.updateCartBadge();
    this.closePaymentModal();

    // Navigate to invoice
    window.location.href = `invoice.html?id=${order.id}`;
  }

  static closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
      modal.classList.remove('active');
    }
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
}

