// Analytics Dashboard Logic
class Analytics {
  static currentPeriod = 'today';
  static orders = [];
  static filteredOrders = [];

  static init() {
    this.loadData();
    this.setupEventListeners();
    this.render();
  }

  static loadData() {
    this.orders = Storage.getOrders();
    this.filterOrders();
  }

  static setupEventListeners() {
    // Period filter buttons
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPeriod = btn.dataset.period;
        this.updatePeriodButtons();
        this.filterOrders();
        this.render();
      });
    });

    // Export buttons
    const exportExcelBtn = document.getElementById('export-excel');
    const exportCSVBtn = document.getElementById('export-csv');
    const exportWhatsAppBtn = document.getElementById('export-whatsapp');

    if (exportExcelBtn) {
      exportExcelBtn.addEventListener('click', () => this.exportToExcel());
    }
    if (exportCSVBtn) {
      exportCSVBtn.addEventListener('click', () => this.exportToCSV());
    }
    if (exportWhatsAppBtn) {
      exportWhatsAppBtn.addEventListener('click', () => this.sendWhatsAppReport());
    }
  }

  static updatePeriodButtons() {
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.period === this.currentPeriod);
    });
  }

  static filterOrders() {
    const now = new Date();
    let startDate;

    switch(this.currentPeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    this.filteredOrders = this.orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate;
    });
  }

  static calculateSummary() {
    const totalRevenue = this.filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = this.filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue
    };
  }

  static getPaymentModeSummary() {
    const summary = {};
    this.filteredOrders.forEach(order => {
      summary[order.paymentMode] = (summary[order.paymentMode] || 0) + 1;
    });
    return summary;
  }

  static getTopSellingItems() {
    const itemCounts = {};
    this.filteredOrders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
      });
    });

    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  static getDailySales() {
    const dailySales = {};
    this.filteredOrders.forEach(order => {
      const date = order.date.split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + order.total;
    });

    return Object.entries(dailySales)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  static getMonthlyRevenue() {
    const monthlyRevenue = {};
    this.filteredOrders.forEach(order => {
      const date = new Date(order.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + order.total;
    });

    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  static render() {
    this.renderSummary();
    this.renderCharts();
  }

  static renderSummary() {
    const summary = this.calculateSummary();
    const summaryContainer = document.getElementById('summary-cards');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-label">Total Revenue</div>
        <div class="summary-card-value">${App.formatCurrency(summary.totalRevenue)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Total Orders</div>
        <div class="summary-card-value">${summary.totalOrders}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Average Order Value</div>
        <div class="summary-card-value">${App.formatCurrency(summary.avgOrderValue)}</div>
      </div>
    `;
  }

  static renderCharts() {
    // Note: Chart.js or ApexCharts would be loaded via CDN
    // For now, we'll create placeholder chart containers
    // In production, these would render actual charts

    const dailySales = this.getDailySales();
    const monthlyRevenue = this.getMonthlyRevenue();
    const topItems = this.getTopSellingItems();
    const paymentModes = this.getPaymentModeSummary();

    // Daily Sales Chart
    this.renderDailySalesChart(dailySales);
    
    // Monthly Revenue Chart
    this.renderMonthlyRevenueChart(monthlyRevenue);
    
    // Top Selling Items Chart
    this.renderTopItemsChart(topItems);
    
    // Payment Mode Chart
    this.renderPaymentModeChart(paymentModes);
  }

  static renderDailySalesChart(data) {
    const container = document.getElementById('daily-sales-chart');
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
      return;
    }

    // Placeholder - would use Chart.js in production
    container.innerHTML = `
      <canvas id="dailySalesCanvas"></canvas>
    `;

    // Initialize Chart.js if available
    if (typeof Chart !== 'undefined') {
      new Chart(document.getElementById('dailySalesCanvas'), {
        type: 'bar',
        data: {
          labels: data.map(d => new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Daily Sales',
            data: data.map(d => d.revenue),
            backgroundColor: 'rgba(6, 182, 212, 0.8)',
            borderColor: 'rgba(6, 182, 212, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  static renderMonthlyRevenueChart(data) {
    const container = document.getElementById('monthly-revenue-chart');
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
      return;
    }

    container.innerHTML = `
      <canvas id="monthlyRevenueCanvas"></canvas>
    `;

    if (typeof Chart !== 'undefined') {
      new Chart(document.getElementById('monthlyRevenueCanvas'), {
        type: 'line',
        data: {
          labels: data.map(d => d.month),
          datasets: [{
            label: 'Monthly Revenue',
            data: data.map(d => d.revenue),
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  static renderTopItemsChart(data) {
    const container = document.getElementById('top-items-chart');
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
      return;
    }

    container.innerHTML = `
      <canvas id="topItemsCanvas"></canvas>
    `;

    if (typeof Chart !== 'undefined') {
      new Chart(document.getElementById('topItemsCanvas'), {
        type: 'bar',
        data: {
          labels: data.map(d => d.name),
          datasets: [{
            label: 'Quantity Sold',
            data: data.map(d => d.count),
            backgroundColor: 'rgba(6, 182, 212, 0.8)',
            borderColor: 'rgba(6, 182, 212, 1)',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  static renderPaymentModeChart(data) {
    const container = document.getElementById('payment-mode-chart');
    if (!container) return;

    const entries = Object.entries(data);
    if (entries.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No data available</p></div>';
      return;
    }

    container.innerHTML = `
      <canvas id="paymentModeCanvas"></canvas>
    `;

    if (typeof Chart !== 'undefined') {
      new Chart(document.getElementById('paymentModeCanvas'), {
        type: 'doughnut',
        data: {
          labels: entries.map(([mode]) => mode.toUpperCase()),
          datasets: [{
            data: entries.map(([, count]) => count),
            backgroundColor: [
              'rgba(6, 182, 212, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  static exportToExcel() {
    // Would use SheetJS (xlsx) library
    App.showToast('Excel export feature - requires xlsx library', 'success');
  }

  static exportToCSV() {
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${this.currentPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    App.showToast('CSV exported successfully', 'success');
  }

  static generateCSV() {
    const headers = ['Date', 'Invoice No', 'Items', 'Subtotal', 'Tax', 'Discount', 'Total', 'Payment Mode'];
    const rows = this.filteredOrders.map(order => [
      new Date(order.date).toLocaleDateString(),
      order.invoiceNo,
      order.items.map(i => `${i.name} (${i.qty})`).join('; '),
      order.subtotal,
      order.tax,
      order.discount,
      order.total,
      order.paymentMode
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  static sendWhatsAppReport() {
    if (typeof WhatsAppReport !== 'undefined') {
      WhatsAppReport.generateAndSend();
    } else {
      App.showToast('WhatsApp report feature loading...', 'success');
    }
  }
}

