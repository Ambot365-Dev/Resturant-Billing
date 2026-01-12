# Restaurant POS System

A lightweight, mobile-first restaurant billing and Point of Sale (POS) web application built with vanilla HTML, CSS, and JavaScript. Works completely offline and stores all data in localStorage.

## 🚀 Features

### Core Features
- **POS Screen**: Menu display with grid/list view, search, category filtering, and cart management
- **Billing**: Real-time cart calculation with tax (GST) and discount support
- **Payment Modes**: Cash, UPI (with QR code), and Card payments
- **Invoice Generation**: Auto-generated invoices with print, PDF download, CSV export, and share functionality
- **Admin Panel**: PIN-protected menu and category management (CRUD operations)
- **Analytics Dashboard**: Sales reports with charts (daily sales, monthly revenue, top items, payment modes)
- **Settings**: Comprehensive configuration (dark mode, currency, tax rates, UPI ID, WhatsApp reports)
- **WhatsApp Reports**: Daily sales reports via WhatsApp (manual and auto-scheduled)
- **PWA Support**: Installable Progressive Web App with offline functionality

### Technical Features
- **Offline First**: Works completely offline after first load
- **LocalStorage**: All data persisted in browser localStorage
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Modern UI**: Gradient themes, smooth animations, glassmorphism effects

## 📁 Project Structure

```
restaurant-pos/
├── index.html              # POS Screen (Main)
├── admin.html              # Admin Panel (Menu Management)
├── analytics.html          # Analytics Dashboard
├── settings.html           # Settings Page
├── login.html              # Admin Login (PIN)
├── invoice.html            # Invoice Display
├── manifest.json           # PWA Manifest
├── service-worker.js       # Service Worker for PWA
├── css/
│   └── styles.css          # Main Stylesheet
├── js/
│   ├── storage.js          # LocalStorage Utilities
│   ├── app.js              # Main App Logic
│   ├── pos.js              # POS Screen Logic
│   ├── admin.js            # Admin Panel Logic
│   ├── analytics.js        # Analytics Logic
│   ├── settings.js         # Settings Logic
│   ├── invoice.js          # Invoice Generation
│   └── whatsapp-report.js  # WhatsApp Report Generation
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (for development)

### Installation

1. **Clone or Download** the project files

2. **Start a Local Server** (choose one):
   
   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser:**
   ```
   http://localhost:8000
   ```

### PWA Installation
- On mobile: Open in browser, tap "Add to Home Screen"
- On desktop: Click install prompt in browser address bar

## 📖 Usage Guide

### Default Credentials
- **Admin PIN**: `1234` (change in Settings)

### POS Screen (index.html)
1. Browse menu items (grid or list view)
2. Search items or filter by category
3. Click items to add to cart
4. Adjust quantities in cart sidebar
5. Click "Process Payment" to complete order
6. Select payment mode (Cash/UPI/Card)
7. Invoice is generated automatically

### Admin Panel (admin.html)
1. Login with PIN (default: 1234)
2. Manage menu items:
   - Add/Edit/Delete items
   - Set prices, categories, images
   - Toggle active/inactive status
3. Manage categories:
   - Add/Edit/Delete categories
   - Cannot delete categories with items

### Analytics (analytics.html)
1. View sales reports by period (Today/Week/Month/Year/All)
2. See summary cards (Revenue, Orders, Avg Order Value)
3. View charts:
   - Daily Sales (Bar Chart)
   - Monthly Revenue (Area Chart)
   - Top Selling Items (Horizontal Bar)
   - Payment Mode Summary (Donut Chart)
4. Export reports (Excel, CSV)
5. Send WhatsApp report

### Settings (settings.html)
1. **General Settings:**
   - Toggle dark mode
   - Set currency symbol
   - Configure UPI ID
   - Set payee name
2. **Tax & Billing:**
   - Enable/disable GST
   - Set tax rate (%)
   - Enable/disable discount
3. **Admin PIN:**
   - Change admin PIN (min 4 digits)
4. **WhatsApp Report:**
   - Set owner WhatsApp number
   - Enable/disable auto-report
   - Set auto-report time (default: 10 PM)
5. **Menu Management:**
   - Import menu from Excel/CSV
   - Export menu to Excel/CSV

## 📊 Data Structure

### Items
```javascript
{
  id: string,
  name: string,
  price: number,
  image: string (URL),
  categoryId: string,
  isActive: boolean
}
```

### Categories
```javascript
{
  id: string,
  name: string
}
```

### Orders
```javascript
{
  id: string,
  invoiceNo: string (format: INV-YYYYMMDD-XXX),
  date: string (ISO),
  items: [{ id, name, qty, price }],
  subtotal: number,
  tax: number,
  discount: number,
  total: number,
  paymentMode: 'cash' | 'upi' | 'card'
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --primary-start: #06b6d4;  /* Teal */
  --primary-end: #10b981;     /* Green */
}
```

### Default Data
Edit `js/storage.js` `init()` method to change default categories and items.

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Notes

- Admin PIN is stored in localStorage (not encrypted)
- All data is stored locally in browser
- No server/backend required
- For production use, consider adding encryption for sensitive data

## 📝 Features Not Included (Requires External Libraries)

Some features require external CDN libraries:
- **Charts**: Chart.js (loaded via CDN in analytics.html)
- **PDF Generation**: jsPDF (loaded via CDN in invoice.html)
- **Excel Import/Export**: SheetJS (xlsx) - can be added if needed
- **QR Code Generation**: QR code library - can be added for UPI QR codes

## 🐛 Troubleshooting

### Service Worker Not Working
- Ensure you're accessing via HTTP/HTTPS (not file://)
- Clear browser cache and reload
- Check browser console for errors

### Data Not Persisting
- Check browser localStorage quota
- Ensure cookies/localStorage are enabled
- Try clearing and re-initializing

### Charts Not Displaying
- Check internet connection (Chart.js loaded from CDN)
- Verify Chart.js is loaded in browser console

## 📄 License

This project is open source and available for use.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests.

## 📧 Support

For issues or questions, please check the code comments or create an issue.

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

