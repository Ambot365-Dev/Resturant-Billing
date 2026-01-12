// Main App Logic
class App {
  static currentPage = 'pos';
  static cart = [];
  static settings = null;

  static init() {
    // Initialize storage with default data
    Storage.init();

    // Load settings
    this.settings = Storage.getSettings();

    // Apply dark mode if enabled
    if (this.settings?.darkMode) {
      document.body.classList.add('dark-mode');
    }

    // Load cart
    this.cart = Storage.getCart();

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
    }

    // Setup navigation
    this.setupNavigation();

    // Setup auto WhatsApp report if available
    if (typeof WhatsAppReport !== 'undefined') {
      WhatsAppReport.setupAutoReport();
      WhatsAppReport.requestNotificationPermission();
    }

    // Initialize page-specific logic based on current page
    const currentPath = window.location.pathname;
    if (currentPath.includes('admin.html') && typeof Admin !== 'undefined') {
      Admin.init();
    } else if (currentPath.includes('analytics.html') && typeof Analytics !== 'undefined') {
      Analytics.init();
    } else if (currentPath.includes('settings.html') && typeof Settings !== 'undefined') {
      Settings.init();
    } else if (currentPath.includes('invoice.html') && typeof Invoice !== 'undefined') {
      Invoice.init();
    } else if ((currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) && typeof POS !== 'undefined') {
      POS.init();
    }
  }

  static setupNavigation() {
    // Navigation is handled via direct links in HTML
    // This method can be used for SPA routing if needed in future
  }

  static setupRouting() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const page = window.location.hash.slice(1) || 'pos';
      this.loadPage(page);
    });

    // Initial page load
    const hash = window.location.hash.slice(1);
    if (hash) {
      this.currentPage = hash;
    }
  }

  static navigateTo(page) {
    this.currentPage = page;
    window.location.hash = page;
    this.loadPage(page);
  }

  static loadPage(page) {
    // For multi-page app, navigation is handled via HTML links
    // This method is kept for potential SPA conversion
  }

  static showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = `toast ${type} show`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  static formatCurrency(amount) {
    const settings = Storage.getSettings();
    const currency = settings?.currency || '₹';
    return `${currency} ${amount.toFixed(2)}`;
  }

  static generateInvoiceNumber() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const orders = Storage.getOrders();
    const todayOrders = orders.filter(order => 
      order.date.startsWith(today.toISOString().split('T')[0])
    );
    const sequence = String(todayOrders.length + 1).padStart(3, '0');
    return `INV-${dateStr}-${sequence}`;
  }

  static calculateCartTotal() {
    const settings = Storage.getSettings();
    let subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let tax = 0;
    let discount = 0;
    let total = subtotal;

    if (settings?.gstEnabled && settings?.taxRate) {
      tax = (subtotal * settings.taxRate) / 100;
    }

    // Discount calculation (if needed)
    if (settings?.discountEnabled) {
      // Discount can be applied here if needed
    }

    total = subtotal + tax - discount;

    return {
      subtotal,
      tax,
      discount,
      total
    };
  }
}

// Utility functions
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

