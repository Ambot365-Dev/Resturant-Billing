# WhatsApp Integration Guide

## Overview

The Restaurant POS system now supports automatic WhatsApp message sending using WhatsApp Business APIs. You can send daily sales reports automatically without opening WhatsApp manually.

## Setup Instructions

### Option 1: WASend API (Recommended - Easiest)

1. **Sign up for WASend API:**
   - Visit https://wasend.dev
   - Create an account
   - Get your API key from the dashboard

2. **Configure in Settings:**
   - Go to Settings → WhatsApp Report
   - Select "WASend API" from the dropdown
   - Enter your API key
   - Enter your WhatsApp number (with country code, e.g., +916383170709)
   - Click "Test WhatsApp Send" to verify

3. **Enable Auto-Report:**
   - Toggle "Enable Auto-Report"
   - Set the time (default: 10 PM)
   - Save settings

### Option 2: Custom API

If you have your own WhatsApp API endpoint:

1. **Configure in Settings:**
   - Select "Custom API" from dropdown
   - Enter your API endpoint URL (e.g., `https://your-api.com/whatsapp/send`)
   - Enter your API key
   - Enter your WhatsApp number
   - Test the connection

2. **API Requirements:**
   Your endpoint should accept POST requests with:
   ```json
   {
     "number": "916383170709",
     "message": "Your message here"
   }
   ```
   And return success status on 200 OK response.

### Option 3: WhatsApp Web (Fallback)

If no API is configured, the system will:
- Open WhatsApp Web automatically
- Pre-fill the message
- You just need to click send

## Features

### Automatic Daily Reports
- Sends daily sales report at configured time (default: 10 PM)
- Includes:
  - Total revenue
  - Total orders
  - Average order value
  - Payment mode summary
  - Top 5 selling items

### Manual Reports
- Click "Send WhatsApp Report" button in Analytics page
- Instantly sends current day's report

### Test Function
- Use "Test WhatsApp Send" button in Settings
- Sends a test message to verify integration

## API Services Supported

1. **WASend API** - Direct integration, no backend needed
2. **Twilio** - Requires backend proxy (for security)
3. **Custom API** - Use your own WhatsApp API endpoint
4. **WhatsApp Web** - Fallback option (opens WhatsApp Web)

## Troubleshooting

### Messages Not Sending
1. Check API key is correct
2. Verify WhatsApp number format (include country code)
3. Test using "Test WhatsApp Send" button
4. Check browser console for errors

### Auto-Report Not Working
1. Ensure "Enable Auto-Report" is turned on
2. Check the report time is set correctly
3. Verify browser notifications are enabled
4. Check browser console for errors

### API Errors
- **401 Unauthorized**: Check API key
- **400 Bad Request**: Check number format
- **500 Server Error**: API service issue, try later

## Default Configuration

- **WhatsApp Number**: 6383170709
- **Auto-Report Time**: 22:00 (10 PM)
- **Auto-Report**: Enabled by default
- **API Service**: WASend (can be changed)

## Security Notes

- API keys are stored in browser localStorage (not encrypted)
- For production, consider using a backend proxy for API keys
- Never share your API keys publicly

---

**Need Help?** Check the API provider's documentation or contact support.

