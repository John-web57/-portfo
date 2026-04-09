# Portfolio Setup - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Copy Environment Template
```bash
cp .env.example .env
```

### Step 2: Edit .env with Your Credentials
Open `.env` and add:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Gmail App Password (from https://myaccount.google.com/apppasswords)
- `OPENAI_API_KEY`: (optional, for AI chat)

### Step 3: Install & Start
```bash
npm install
npm start
```

Visit: **http://localhost:5000**

---

## 🛠️ Full Setup Guide

See **SETUP_GUIDE.md** For complete documentation including:
- How to get Gmail App Password
- OpenAI API configuration  
- Deployment to Render
- Troubleshooting

---

## ✨ Features That Now Work

### ✅ AI Chat Assistant
- Go to `/ai-chat.html`
- Ask questions about projects, skills, availability
- Works offline with fallback responses
- Live AI when OpenAI key is configured

### ✅ Contact Form
- Go to `/contact.html`
- Submit form saves to database
- Sends confirmation emails (Gmail or SendGrid)

### ✅ Dark/Light Theme
- Toggle button in navigation bar
- Preference saved to browser

### ✅ Blog System
- Read blog posts on `/blog.html`
- Filter by category

---

## 📋 Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Add your Gmail App Password to `.env`
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Test at http://localhost:5000/ai-chat.html
- [ ] Test contact form at http://localhost:5000/contact.html
- [ ] Push to GitHub (credentials fixed)
- [ ] Deploy to Render.com

---

## 🐛 If You Get Errors

### "npm: No such file"
Install Node.js from https://nodejs.org

### "Error: Cannot find module"
Run `npm install` again

### "Emails not sending"
Check your Gmail App Password is correct (NOT regular password)

### "AI chat not responding"
It's okay - fallback mode works offline. Add OPENAI_API_KEY to .env if you want live AI.

---

## 📱 Testing Features

```
# Terminal 1: Start server
npm start

# Terminal 2 (new window): Test AI endpoint
curl -X POST http://localhost:5000/api/ai \\
  -H "Content-Type: application/json" \\
  -d '{"message":"What are your skills?"}'

# Test contact (will send email)
curl -X POST http://localhost:5000/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{
    "from_name":"Test User",
    "from_email":"test@example.com",
    "subject":"Test",
    "message":"Hello"
  }'
```

---

## 🚢 Deploy to Render (Free Tier)

1. Push code to GitHub
2. Go to https://render.com
3. Connect GitHub repo
4. Create new Web Service
5. Set Environment Variables (from your .env):
   ```
   PORT=5000
   OPENAI_API_KEY=...
   EMAIL_USER=...
   EMAIL_PASS=...
   ```
6. Deploy!

---

## 📞 Need Help?

All configuration details are in `.env.example`
Full guide in `SETUP_GUIDE.md`
