# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start a Local Server

**Option A: Using Python (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Using Node.js**
```bash
npx http-server -p 8000
```

**Option C: Using PHP**
```bash
php -S localhost:8000
```

### Step 2: Open in Browser

Navigate to:
```
http://localhost:8000
```

### Step 3: Start Using

1. **POS Screen** (Main page)
   - Browse menu items
   - Add items to cart
   - Process payments

2. **Admin Panel** (Menu Management)
   - Default PIN: `1234`
   - Add/edit menu items and categories

3. **Analytics**
   - View sales reports
   - Export data

4. **Settings**
   - Configure system settings
   - Change admin PIN
   - Set up WhatsApp reports

## 📱 Mobile Testing

1. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`

2. On your mobile device, open:
   ```
   http://YOUR_IP_ADDRESS:8000
   ```

3. Add to Home Screen for PWA experience

## 🔑 Default Credentials

- **Admin PIN**: `1234`
- Change it in Settings → Admin PIN

## 💡 Tips

- All data is stored in browser localStorage
- Works offline after first load
- Clear browser data to reset to defaults
- Export data regularly for backup

## 🐛 Troubleshooting

**Service Worker Not Working?**
- Make sure you're using `http://` not `file://`
- Clear browser cache

**Charts Not Showing?**
- Check internet connection (Chart.js loads from CDN)
- Try refreshing the page

**Data Not Saving?**
- Check browser localStorage is enabled
- Try a different browser

---

**Need Help?** Check the main README.md for detailed documentation.

