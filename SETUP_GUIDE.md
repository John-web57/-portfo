# John Joshua Portfolio - Setup & Deployment Guide

## Overview
This is a full-stack portfolio website with:
- Static HTML/CSS/JS frontend
- Node.js/Express backend
- SQLite database
- AI chatbot assistant (OpenAI API integration)
- Contact form with email notifications
- Dark/Light theme toggle

---

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git
- (Optional) OpenAI API key for live AI chat
- (Optional) Gmail account with App Password for email notifications

---

## Local Development Setup

### 1. Install Dependencies
```bash
cd /home/omiti/Desktop/portfo
npm install
```

### 2. Create Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and add your actual values:
```
PORT=5000
NODE_ENV=development

# For AI Assistant (optional)
OPENAI_API_KEY=sk-... (your OpenAI API key)
OPENAI_MODEL=gpt-3.5-turbo

# For Email Notifications (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SendGrid (alternative to Gmail - optional)
SENDGRID_API_KEY=SG.xxx
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows Computer
3. Generate and copy the 16-character password
4. Paste it as `EMAIL_PASS` in your `.env` file

### 3. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The app will be available at: **http://localhost:5000**

---

## Features & How They Work

### AI Chat Assistant
- **Location:** `/ai-chat.html`
- **Backend:** `/api/ai` endpoint in `server.js`
- **Fallback Mode:** Works offline with keyword-based responses
- **Requires:** `OPENAI_API_KEY` for live AI responses

**Testing:**
1. Go to http://localhost:5000/ai-chat.html
2. Ask questions like: "What are your skills?", "Tell me about your projects"
3. If OpenAI key is configured, you'll get AI responses; otherwise fallback responses appear

### Contact Form
- **Location:** `/contact.html`
- **Backend:** `/api/contact` endpoint
- **Database:** Contacts saved to SQLite
- **Email:** Notifications sent via Gmail or SendGrid

**Testing:**
1. Go to http://localhost:5000/contact.html
2. Fill out the form and click "Send Message"
3. Check your email for confirmation

### Dark/Light Theme
- **File:** `theme-toggle.js`
- **Storage:** Browser localStorage
- **Button:** Toggle in navigation bar

### Blog System
- **File:** `blog.js`
- **Format:** JavaScript objects with post data
- **Location:** `/blog.html`
- To add posts, edit `blog.js` and add entries to `blogPosts` object

---

## Database

### SQLite Setup
- **Location:** `database.sqlite` (auto-created)
- **Connection:** Via `db.js` using Sequelize ORM
- **Model:** `models/Contact.js`

### Database Admin Endpoints
- `GET /api/contacts` - View all contact submissions
- `PUT /api/contacts/:id` - Update contact status

---

## Deployment to Render

### 1. Deploy Your Code
```bash
# Create a new Render service
# GitHub: https://github.com/John-web57/-portfo
# Branch: main
```

### 2. Configure Environment Variables on Render
In Render Dashboard → Your Service → Environment:
```
PORT=5000
NODE_ENV=production
OPENAI_API_KEY=sk-...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SENDGRID_API_KEY=SG.xxx (optional)
```

### 3. Build Command
```
npm install
```

### 4. Start Command
```
npm start
```

### 5. Health Check
Render will automatically check `http://localhost:$PORT/` every 30 seconds.

---

## GitHub Push

Your code is already configured to push to:
```
https://github.com/John-web57/-portfo.git
```

### To Push Updates:
```bash
git add .
git commit -m "Your message"
git push origin main
```

If you get authentication errors, generate a Personal Access Token:
1. GitHub → Settings → Developer Settings → Personal Access Tokens
2. Create new token with `repo` scope
3. Use as password when pushing: `git push`

---

## Troubleshooting

### AI Chat Not Responding
- Check that `OPENAI_API_KEY` is set in `.env`
- Verify your OpenAI account has available credits
- Check server logs for error messages
- Fallback mode will work without OpenAI key

### Emails Not Sending
- Verify Gmail App Password is correct (NOT your regular password)
- Check that `EMAIL_USER` and `EMAIL_PASS` are in `.env`
- Enable "Less secure app access" if using Gmail
- Try SendGrid as alternative (set `SENDGRID_API_KEY`)

### Database Not Updating
- Delete `database.sqlite` and restart server to reset
- Check `db.js` for connection errors
- Verify directory permissions

### Port Already in Use
```bash
# Change PORT in .env to different value (e.g., 5001)
# Or kill process using port 5000:
lsof -i :5000
kill -9 <PID>
```

---

## Project Structure
```
/home/omiti/Desktop/portfo/
├── index.html              # Home page
├── about.html              # About section
├── projects.html           # Projects showcase
├── contact.html            # Contact form
├── blog.html               # Blog posts
├── case-studies.html       # Case studies
├── ai-chat.html            # AI chatbot demo
├── server.js               # Express server
├── db.js                   # Database setup
├── ai-assistant.js         # Client-side AI chat
├── blog.js                 # Blog post data
├── theme-toggle.js         # Dark/light theme
├── style.css               # Main styles
├── package.json            # Dependencies
├── .env                    # Environment variables (create this)
├── .env.example            # Template for .env
├── database.sqlite         # SQLite database (auto-created)
├── models/
│   └── Contact.js          # Contact model
├── render.yaml             # Render deployment config
└── README.md               # Project info
```

---

## Next Steps

1. ✅ Set up `.env` file with your credentials
2. ✅ Run `npm install` to install dependencies  
3. ✅ Run `npm start` to start the server locally
4. ✅ Test all features (AI chat, contact form, theme toggle)
5. ✅ Push to GitHub when ready
6. ✅ Deploy to Render.com

---

## Support
For questions about the portfolio setup, check the individual HTML files for comments and refer to the original documentation in each JavaScript file.

Last updated: April 2026
