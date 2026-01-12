# GitHub Pages Setup Guide

## ✅ Code Pushed to GitHub

Your code has been successfully pushed to: https://github.com/Ambot365-Dev/Resturant-Billing.git

## 🚀 Enable GitHub Pages

### Step 1: Go to Repository Settings
1. Open your repository: https://github.com/Ambot365-Dev/Resturant-Billing
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar

### Step 2: Configure GitHub Pages
1. Under **Source**, select **Deploy from a branch**
2. Select **Branch**: `main`
3. Select **Folder**: `/ (root)`
4. Click **Save**

### Step 3: Wait for Deployment
- GitHub will build and deploy your site
- This usually takes 1-2 minutes
- You'll see a green checkmark when it's ready

### Step 4: Access Your Live Site
Your site will be available at:
```
https://ambot365-dev.github.io/Resturant-Billing/
```

## 📝 Important Notes

### Path Issues Fixed
All paths in the project are relative, so they should work correctly on GitHub Pages.

### Service Worker
The service worker is configured to work with GitHub Pages paths.

### Custom Domain (Optional)
If you want to use a custom domain:
1. Add a `CNAME` file in the root with your domain
2. Configure DNS settings as per GitHub instructions

## 🔄 Updating Your Site

To update your live site:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Pages will automatically rebuild and deploy (takes 1-2 minutes).

## 🐛 Troubleshooting

### Site Not Loading
- Check if GitHub Pages is enabled in Settings
- Wait a few minutes for initial deployment
- Check the Actions tab for build errors

### Path Errors
- All paths are relative, so they should work
- If you see 404 errors, check file names match exactly

### Service Worker Issues
- Clear browser cache
- Service worker will work on GitHub Pages

---

**Your site will be live at:** https://ambot365-dev.github.io/Resturant-Billing/

