// Settings Page Logic
class Settings {
  static init() {
    this.loadSettings();
    this.setupEventListeners();
  }

  static loadSettings() {
    const settings = Storage.getSettings();
    if (!settings) return;

    // General Settings
    document.getElementById('dark-mode').checked = settings.darkMode || false;
    document.getElementById('currency').value = settings.currency || '₹';
    document.getElementById('upi-id').value = settings.upiId || '';
    document.getElementById('payee-name').value = settings.payeeName || '';

    // Tax & Billing
    document.getElementById('gst-enabled').checked = settings.gstEnabled !== false;
    document.getElementById('tax-rate').value = settings.taxRate || 18;
    document.getElementById('discount-enabled').checked = settings.discountEnabled !== false;

    // Admin PIN
    // PIN is managed separately

    // WhatsApp Report
    document.getElementById('whatsapp-number').value = settings.whatsappNumber || '';
    document.getElementById('whatsapp-api-service').value = settings.whatsappApiService || 'wasend';
    document.getElementById('whatsapp-api-key').value = settings.whatsappApiKey || '';
    document.getElementById('whatsapp-api-url').value = settings.whatsappApiUrl || '';
    document.getElementById('auto-report-enabled').checked = settings.autoReportEnabled || false;
    document.getElementById('report-time').value = settings.reportTime || '22:00';

    // Show/hide API fields based on service
    this.updateApiFieldsVisibility();
  }

  static setupEventListeners() {
    // Save button
    const saveBtn = document.getElementById('save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveSettings());
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        this.saveSettings();
      });
    }

    // Change PIN button
    const changePINBtn = document.getElementById('change-pin');
    if (changePINBtn) {
      changePINBtn.addEventListener('click', () => this.showChangePINModal());
    }

    // Import/Export Menu
    const importMenuBtn = document.getElementById('import-menu');
    const exportMenuBtn = document.getElementById('export-menu');

    if (importMenuBtn) {
      importMenuBtn.addEventListener('click', () => this.importMenu());
    }
    if (exportMenuBtn) {
      exportMenuBtn.addEventListener('click', () => this.exportMenu());
    }

    // WhatsApp API Service change
    const apiServiceSelect = document.getElementById('whatsapp-api-service');
    if (apiServiceSelect) {
      apiServiceSelect.addEventListener('change', () => this.updateApiFieldsVisibility());
    }

    // Test WhatsApp button
    const testWhatsAppBtn = document.getElementById('test-whatsapp');
    if (testWhatsAppBtn) {
      testWhatsAppBtn.addEventListener('click', () => this.testWhatsApp());
    }
  }

  static saveSettings() {
    const settings = {
      darkMode: document.getElementById('dark-mode').checked,
      currency: document.getElementById('currency').value,
      upiId: document.getElementById('upi-id').value,
      payeeName: document.getElementById('payee-name').value,
      gstEnabled: document.getElementById('gst-enabled').checked,
      taxRate: parseFloat(document.getElementById('tax-rate').value) || 0,
      discountEnabled: document.getElementById('discount-enabled').checked,
      whatsappNumber: document.getElementById('whatsapp-number').value,
      whatsappApiService: document.getElementById('whatsapp-api-service').value,
      whatsappApiKey: document.getElementById('whatsapp-api-key').value,
      whatsappApiUrl: document.getElementById('whatsapp-api-url').value,
      autoReportEnabled: document.getElementById('auto-report-enabled').checked,
      reportTime: document.getElementById('report-time').value
    };

    Storage.setSettings(settings);
    App.settings = settings;
    App.showToast('Settings saved successfully', 'success');
  }

  static updateApiFieldsVisibility() {
    const apiService = document.getElementById('whatsapp-api-service').value;
    const apiKeyGroup = document.getElementById('api-key-group');
    const apiUrlGroup = document.getElementById('api-url-group');

    if (apiService === 'web') {
      apiKeyGroup.style.display = 'none';
      apiUrlGroup.style.display = 'none';
    } else if (apiService === 'custom') {
      apiKeyGroup.style.display = 'block';
      apiUrlGroup.style.display = 'block';
    } else {
      apiKeyGroup.style.display = 'block';
      apiUrlGroup.style.display = 'none';
    }
  }

  static async testWhatsApp() {
    const whatsappNumber = document.getElementById('whatsapp-number').value;
    if (!whatsappNumber) {
      App.showToast('Please enter WhatsApp number first', 'error');
      return;
    }

    const testMessage = '🧪 *Test Message*\n\nThis is a test message from Restaurant POS System.\n\nIf you received this, your WhatsApp integration is working correctly! ✅';

    App.showToast('Sending test message...', 'success');

    if (typeof WhatsAppReport !== 'undefined') {
      try {
        const settings = Storage.getSettings();
        const apiKey = settings?.whatsappApiKey;
        const apiService = settings?.whatsappApiService || 'wasend';

        if (apiKey && apiService !== 'web') {
          const apiUrl = settings?.whatsappApiUrl;
          const sent = await WhatsAppReport.sendViaAPI(whatsappNumber, testMessage, apiKey, apiService, apiUrl);
          if (sent) {
            App.showToast('Test message sent successfully via API!', 'success');
          } else {
            throw new Error('API send returned false');
          }
        } else {
          WhatsAppReport.sendViaWhatsAppWeb(whatsappNumber, testMessage);
          App.showToast('Opening WhatsApp Web for test...', 'success');
        }
      } catch (error) {
        console.error('Test error:', error);
        App.showToast('API test failed, opening WhatsApp Web...', 'error');
        WhatsAppReport.sendViaWhatsAppWeb(whatsappNumber, testMessage);
      }
    } else {
      // Fallback
      const cleanNumber = whatsappNumber.replace(/[+\s]/g, '');
      const whatsappURL = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(testMessage)}`;
      window.open(whatsappURL, '_blank');
      App.showToast('Opening WhatsApp Web for test...', 'success');
    }
  }

  static showChangePINModal() {
    const oldPIN = prompt('Enter current PIN:');
    if (!oldPIN) return;

    if (!Storage.verifyPIN(oldPIN)) {
      App.showToast('Invalid current PIN', 'error');
      return;
    }

    const newPIN = prompt('Enter new PIN (minimum 4 digits):');
    if (!newPIN || newPIN.length < 4) {
      App.showToast('PIN must be at least 4 digits', 'error');
      return;
    }

    const confirmPIN = prompt('Confirm new PIN:');
    if (newPIN !== confirmPIN) {
      App.showToast('PINs do not match', 'error');
      return;
    }

    Storage.setAdminPIN(newPIN);
    App.showToast('PIN changed successfully', 'success');
  }

  static exportMenu() {
    const items = Storage.getItems();
    const categories = Storage.getCategories();

    // Create CSV
    const csv = this.generateMenuCSV(items, categories);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    App.showToast('Menu exported successfully', 'success');
  }

  static generateMenuCSV(items, categories) {
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });

    const headers = ['Name', 'Price', 'Category', 'Image URL', 'Active'];
    const rows = items.map(item => [
      item.name,
      item.price,
      categoryMap[item.categoryId] || '',
      item.image || '',
      item.isActive ? 'Yes' : 'No'
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  static importMenu() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          this.parseMenuCSV(text);
          App.showToast('Menu imported successfully', 'success');
          // Reload page to show new items
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          App.showToast('Error importing menu: ' + error.message, 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  static parseMenuCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const categories = Storage.getCategories();
    const items = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      if (values.length < 2) continue;

      const name = values[0];
      const price = parseFloat(values[1]) || 0;
      const categoryName = values[2] || '';
      const image = values[3] || '';
      const isActive = values[4]?.toLowerCase() !== 'no';

      // Find or create category
      let category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
      if (!category && categoryName) {
        category = {
          id: generateId(),
          name: categoryName
        };
        Storage.addCategory(category);
        categories.push(category);
      }

      const item = {
        id: generateId(),
        name,
        price,
        categoryId: category?.id || categories[0]?.id || '',
        image: image || `https://via.placeholder.com/400?text=${encodeURIComponent(name)}`,
        isActive
      };

      items.push(item);
    }

    // Add imported items to existing items
    const existingItems = Storage.getItems();
    const newItems = [...existingItems, ...items];
    Storage.setItems(newItems);
  }
}

