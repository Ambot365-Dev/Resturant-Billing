// Admin Panel Logic
class Admin {
  static currentTab = 'items';
  static editingItem = null;
  static editingCategory = null;

  static init() {
    // Check if user is logged in (PIN protected)
    const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    if (!isLoggedIn) {
      window.location.href = 'login.html';
      return;
    }

    this.showTab('items');
    this.renderItems();
    this.renderCategories();
    this.setupEventListeners();
  }

  static setupEventListeners() {
    // Item form
    const itemForm = document.getElementById('item-form');
    if (itemForm) {
      itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveItem();
      });
    }

    // Category form
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
      categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveCategory();
      });
    }
  }

  static showTab(tab) {
    this.currentTab = tab;
    
    // Update tab buttons
    document.getElementById('tab-items').classList.toggle('btn-primary', tab === 'items');
    document.getElementById('tab-items').classList.toggle('btn-secondary', tab !== 'items');
    document.getElementById('tab-categories').classList.toggle('btn-primary', tab === 'categories');
    document.getElementById('tab-categories').classList.toggle('btn-secondary', tab !== 'categories');

    // Show/hide tabs
    document.getElementById('items-tab').style.display = tab === 'items' ? 'block' : 'none';
    document.getElementById('categories-tab').style.display = tab === 'categories' ? 'block' : 'none';
  }

  static renderItems() {
    const container = document.getElementById('items-list');
    if (!container) return;

    const items = Storage.getItems();
    const categories = Storage.getCategories();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-utensils"></i>
          <p>No items found. Add your first item!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="menu-list">
        ${items.map(item => {
          const category = categories.find(cat => cat.id === item.categoryId);
          return `
            <div class="menu-list-item">
              <img src="${item.image}" alt="${item.name}" class="menu-list-item-image" onerror="this.src='https://via.placeholder.com/400?text=${encodeURIComponent(item.name)}'">
              <div class="menu-list-item-content">
                <div style="flex: 1;">
                  <div class="menu-item-name">${item.name}</div>
                  <div style="color: #6b7280; margin-top: 0.25rem;">
                    ${category ? category.name : 'Uncategorized'} • ${App.formatCurrency(item.price)}
                  </div>
                  ${!item.isActive ? '<span style="color: #ef4444; font-size: 0.875rem;">Inactive</span>' : ''}
                </div>
                <div class="flex gap-1">
                  <button class="btn btn-sm btn-primary" onclick="Admin.editItem('${item.id}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="Admin.deleteItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button class="btn btn-sm ${item.isActive ? 'btn-secondary' : 'btn-success'}" onclick="Admin.toggleItemStatus('${item.id}')">
                    <i class="fas fa-${item.isActive ? 'eye-slash' : 'eye'}"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  static renderCategories() {
    const container = document.getElementById('categories-list');
    if (!container) return;

    const categories = Storage.getCategories();
    const items = Storage.getItems();

    if (categories.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-tags"></i>
          <p>No categories found. Add your first category!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="menu-list">
        ${categories.map(cat => {
          const itemCount = items.filter(item => item.categoryId === cat.id).length;
          return `
            <div class="menu-list-item">
              <div class="menu-list-item-content" style="width: 100%;">
                <div style="flex: 1;">
                  <div class="menu-item-name">${cat.name}</div>
                  <div style="color: #6b7280; margin-top: 0.25rem;">
                    ${itemCount} item${itemCount !== 1 ? 's' : ''}
                  </div>
                </div>
                <div class="flex gap-1">
                  <button class="btn btn-sm btn-primary" onclick="Admin.editCategory('${cat.id}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="Admin.deleteCategory('${cat.id}')" ${itemCount > 0 ? 'disabled title="Cannot delete category with items"' : ''}>
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  static showItemModal(itemId = null) {
    const modal = document.getElementById('item-modal');
    const form = document.getElementById('item-form');
    const title = document.getElementById('item-modal-title');
    
    this.editingItem = itemId;
    
    if (itemId) {
      const item = Storage.getItem(itemId);
      if (item) {
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-category').value = item.categoryId;
        document.getElementById('item-image').value = item.image || '';
        document.getElementById('item-active').checked = item.isActive;
        title.textContent = 'Edit Item';
      }
    } else {
      form.reset();
      document.getElementById('item-id').value = '';
      title.textContent = 'Add Item';
    }

    // Populate categories
    const categorySelect = document.getElementById('item-category');
    const categories = Storage.getCategories();
    categorySelect.innerHTML = categories.map(cat => 
      `<option value="${cat.id}">${cat.name}</option>`
    ).join('');

    modal.classList.add('active');
  }

  static closeItemModal() {
    const modal = document.getElementById('item-modal');
    modal.classList.remove('active');
    this.editingItem = null;
  }

  static saveItem() {
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const categoryId = document.getElementById('item-category').value;
    const image = document.getElementById('item-image').value;
    const isActive = document.getElementById('item-active').checked;

    if (!name || !price || !categoryId) {
      App.showToast('Please fill all required fields', 'error');
      return;
    }

    if (id) {
      // Update existing
      Storage.updateItem(id, { name, price, categoryId, image, isActive });
      App.showToast('Item updated successfully', 'success');
    } else {
      // Add new
      const newItem = {
        id: generateId(),
        name,
        price,
        categoryId,
        image: image || 'https://via.placeholder.com/400?text=' + encodeURIComponent(name),
        isActive
      };
      Storage.addItem(newItem);
      App.showToast('Item added successfully', 'success');
    }

    this.closeItemModal();
    this.renderItems();
  }

  static editItem(itemId) {
    this.showItemModal(itemId);
  }

  static deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
      Storage.deleteItem(itemId);
      App.showToast('Item deleted successfully', 'success');
      this.renderItems();
    }
  }

  static toggleItemStatus(itemId) {
    const item = Storage.getItem(itemId);
    if (item) {
      Storage.updateItem(itemId, { isActive: !item.isActive });
      App.showToast(`Item ${item.isActive ? 'deactivated' : 'activated'}`, 'success');
      this.renderItems();
    }
  }

  static showCategoryModal(categoryId = null) {
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const title = document.getElementById('category-modal-title');
    
    this.editingCategory = categoryId;
    
    if (categoryId) {
      const category = Storage.getCategory(categoryId);
      if (category) {
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        title.textContent = 'Edit Category';
      }
    } else {
      form.reset();
      document.getElementById('category-id').value = '';
      title.textContent = 'Add Category';
    }

    modal.classList.add('active');
  }

  static closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    modal.classList.remove('active');
    this.editingCategory = null;
  }

  static saveCategory() {
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;

    if (!name) {
      App.showToast('Please enter category name', 'error');
      return;
    }

    if (id) {
      // Update existing
      Storage.updateCategory(id, { name });
      App.showToast('Category updated successfully', 'success');
    } else {
      // Add new
      const newCategory = {
        id: generateId(),
        name
      };
      Storage.addCategory(newCategory);
      App.showToast('Category added successfully', 'success');
    }

    this.closeCategoryModal();
    this.renderCategories();
    // Update category select in item modal if open
    if (document.getElementById('item-modal').classList.contains('active')) {
      const categorySelect = document.getElementById('item-category');
      const categories = Storage.getCategories();
      categorySelect.innerHTML = categories.map(cat => 
        `<option value="${cat.id}">${cat.name}</option>`
      ).join('');
    }
  }

  static editCategory(categoryId) {
    this.showCategoryModal(categoryId);
  }

  static deleteCategory(categoryId) {
    const items = Storage.getItems();
    const hasItems = items.some(item => item.categoryId === categoryId);
    
    if (hasItems) {
      App.showToast('Cannot delete category with items', 'error');
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      const deleted = Storage.deleteCategory(categoryId);
      if (deleted) {
        App.showToast('Category deleted successfully', 'success');
        this.renderCategories();
      } else {
        App.showToast('Cannot delete category with items', 'error');
      }
    }
  }
}

