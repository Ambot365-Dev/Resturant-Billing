// LocalStorage Utilities
class Storage {
  static keys = {
    ITEMS: 'restaurant_pos_items',
    CATEGORIES: 'restaurant_pos_categories',
    ORDERS: 'restaurant_pos_orders',
    SETTINGS: 'restaurant_pos_settings',
    HELD_BILLS: 'restaurant_pos_held_bills',
    ADMIN_PIN: 'restaurant_pos_admin_pin',
    CART: 'restaurant_pos_cart'
  };

  // Initialize default data
  static init() {
    // Initialize categories if empty
    if (!this.getCategories().length) {
      const defaultCategories = [
        { id: 'cat1', name: 'Appetizers' },
        { id: 'cat2', name: 'Main Course' },
        { id: 'cat3', name: 'Desserts' },
        { id: 'cat4', name: 'Beverages' }
      ];
      this.setCategories(defaultCategories);
    }

    // Initialize items if empty
    if (!this.getItems().length) {
      const defaultItems = [
        { id: 'item1', name: 'Caesar Salad', price: 250, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', categoryId: 'cat1', isActive: true },
        { id: 'item2', name: 'Spring Rolls', price: 180, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', categoryId: 'cat1', isActive: true },
        { id: 'item3', name: 'Chicken Wings', price: 320, image: 'https://images.unsplash.com/photo-1527477396000-e27137b2a8b8?w=400', categoryId: 'cat1', isActive: true },
        { id: 'item4', name: 'Bruschetta', price: 200, image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400', categoryId: 'cat1', isActive: true },
        { id: 'item5', name: 'Grilled Chicken', price: 450, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400', categoryId: 'cat2', isActive: true },
        { id: 'item6', name: 'Pasta Carbonara', price: 380, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', categoryId: 'cat2', isActive: true },
        { id: 'item7', name: 'Beef Steak', price: 650, image: 'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=400', categoryId: 'cat2', isActive: true },
        { id: 'item8', name: 'Fish Curry', price: 420, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', categoryId: 'cat2', isActive: true },
        { id: 'item9', name: 'Vegetable Biryani', price: 350, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', categoryId: 'cat2', isActive: true },
        { id: 'item10', name: 'Chocolate Cake', price: 280, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', categoryId: 'cat3', isActive: true },
        { id: 'item11', name: 'Ice Cream', price: 150, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', categoryId: 'cat3', isActive: true },
        { id: 'item12', name: 'Tiramisu', price: 320, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', categoryId: 'cat3', isActive: true },
        { id: 'item13', name: 'Coca Cola', price: 50, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', categoryId: 'cat4', isActive: true },
        { id: 'item14', name: 'Fresh Juice', price: 120, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', categoryId: 'cat4', isActive: true },
        { id: 'item15', name: 'Coffee', price: 80, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', categoryId: 'cat4', isActive: true }
      ];
      this.setItems(defaultItems);
    }

    // Initialize settings if empty
    if (!this.getSettings()) {
      const defaultSettings = {
        taxRate: 18,
        discountEnabled: true,
        gstEnabled: true,
        currency: '₹',
        darkMode: false,
        upiId: 'your-upi-id@paytm',
        payeeName: 'Restaurant Name',
        whatsappNumber: '6383170709',
        whatsappApiService: 'wasend',
        whatsappApiKey: '',
        whatsappApiUrl: '',
        autoReportEnabled: true,
        reportTime: '22:00'
      };
      this.setSettings(defaultSettings);
    }

    // Initialize admin PIN if empty
    if (!this.getAdminPIN()) {
      this.setAdminPIN('1234');
    }
  }

  // Generic get/set methods
  static get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      return false;
    }
  }

  // Items
  static getItems() {
    return this.get(this.keys.ITEMS) || [];
  }

  static setItems(items) {
    return this.set(this.keys.ITEMS, items);
  }

  static addItem(item) {
    const items = this.getItems();
    items.push(item);
    return this.setItems(items);
  }

  static updateItem(itemId, updates) {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      return this.setItems(items);
    }
    return false;
  }

  static deleteItem(itemId) {
    const items = this.getItems();
    const filtered = items.filter(item => item.id !== itemId);
    return this.setItems(filtered);
  }

  static getItem(itemId) {
    const items = this.getItems();
    return items.find(item => item.id === itemId);
  }

  // Categories
  static getCategories() {
    return this.get(this.keys.CATEGORIES) || [];
  }

  static setCategories(categories) {
    return this.set(this.keys.CATEGORIES, categories);
  }

  static addCategory(category) {
    const categories = this.getCategories();
    categories.push(category);
    return this.setCategories(categories);
  }

  static updateCategory(categoryId, updates) {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      return this.setCategories(categories);
    }
    return false;
  }

  static deleteCategory(categoryId) {
    const items = this.getItems();
    const hasItems = items.some(item => item.categoryId === categoryId);
    if (hasItems) {
      return false; // Cannot delete category with items
    }
    const categories = this.getCategories();
    const filtered = categories.filter(cat => cat.id !== categoryId);
    return this.setCategories(filtered);
  }

  static getCategory(categoryId) {
    const categories = this.getCategories();
    return categories.find(cat => cat.id === categoryId);
  }

  // Orders
  static getOrders() {
    return this.get(this.keys.ORDERS) || [];
  }

  static setOrders(orders) {
    return this.set(this.keys.ORDERS, orders);
  }

  static addOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    return this.setOrders(orders);
  }

  // Settings
  static getSettings() {
    return this.get(this.keys.SETTINGS);
  }

  static setSettings(settings) {
    return this.set(this.keys.SETTINGS, settings);
  }

  static updateSettings(updates) {
    const settings = this.getSettings() || {};
    const updated = { ...settings, ...updates };
    return this.setSettings(updated);
  }

  // Held Bills
  static getHeldBills() {
    return this.get(this.keys.HELD_BILLS) || [];
  }

  static setHeldBills(bills) {
    return this.set(this.keys.HELD_BILLS, bills);
  }

  static addHeldBill(bill) {
    const bills = this.getHeldBills();
    bills.push(bill);
    return this.setHeldBills(bills);
  }

  static deleteHeldBill(billId) {
    const bills = this.getHeldBills();
    const filtered = bills.filter(bill => bill.id !== billId);
    return this.setHeldBills(filtered);
  }

  // Admin PIN
  static getAdminPIN() {
    return localStorage.getItem(this.keys.ADMIN_PIN) || '1234';
  }

  static setAdminPIN(pin) {
    localStorage.setItem(this.keys.ADMIN_PIN, pin);
  }

  static verifyPIN(pin) {
    return pin === this.getAdminPIN();
  }

  // Cart
  static getCart() {
    return this.get(this.keys.CART) || [];
  }

  static setCart(cart) {
    return this.set(this.keys.CART, cart);
  }

  static clearCart() {
    return this.set(this.keys.CART, []);
  }
}

