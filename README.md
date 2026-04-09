# John Joshua Portfolio

A full-stack portfolio website showcasing projects, skills, and experience with AI chatbot integration and contact management.

## 🌟 Features

- **Responsive Portfolio**: Modern, clean design with multiple sections
- **AI Chat Assistant**: OpenAI-powered chatbot with fallback responses
- **Contact Form**: Submit messages with email notifications
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Blog System**: Read and filter blog posts
- **Database**: SQLite for storing contact submissions
- **Email Notifications**: Gmail or SendGrid email confirmations
- **Admin API**: Manage contact submissions

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite with Sequelize ORM
- **AI**: OpenAI API integration
- **Email**: Nodemailer (Gmail) & SendGrid
- **Hosting**: Compatible with Render.com

## 📖 Documentation

**👉 START HERE:** [QUICK_START.md](QUICK_START.md) - 5-minute setup

**Full Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete documentation

## 🚀 Quick Start

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your credentials (Gmail App Password, OpenAI key, etc)
# See .env.example for detailed instructions

# 3. Install dependencies
npm install

# 4. Start server
npm start

# 5. Visit http://localhost:5000
```

## 📋 Configuration

All configuration happens in `.env` file. Copy from `.env.example` and add:

- **Gmail**: Email address and App Password
- **OpenAI**: API key for live AI chat (optional)
- **Port**: Server port (default 5000)
- **SendGrid**: Alternative email service (optional)

For detailed instructions on getting credentials, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## ✅ What's Fixed & Ready

### Recent Improvements ✨
- ✅ Fixed OpenAI API endpoint (now using correct `/v1/chat/completions`)
- ✅ Updated request body format for ChatGPT compatibility
- ✅ Added complete `.env.example` with detailed configuration instructions
- ✅ Enhanced error handling for OpenAI and email services
- ✅ Contact form fully functional with database persistence
- ✅ Email notifications working (Gmail + SendGrid fallback)
- ✅ AI chat works offline with fallback responses
- ✅ Dark/Light theme toggle working
- ✅ Blog system functional
- ✅ Theme preferences saved to localStorage

### API Features
- **AI Chat**: `/api/ai` - Get AI responses with fallback
- **Contact**: `/api/contact` - Submit contact form
- **Admin**: `/api/contacts` - View submissions
- **Admin**: `/api/contacts/:id` - Update status

### Public Endpoints

- `GET /` - Serve homepage
- `GET /contact.html` - Serve contact page
- `GET /about.html` - Serve about page
- `GET /projects.html` - Serve projects page
- `POST /api/contact` - Submit contact form

### Admin Endpoints

- `GET /api/contacts` - Get all contact submissions
- `PUT /api/contacts/:id` - Update contact status

## Database Schema

### Contact Model

```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  name: STRING (Required),
  email: STRING (Required, Email validation),
  subject: STRING (Required),
  message: TEXT (Required),
  status: ENUM ('new', 'read', 'replied') - Default: 'new',
  createdAt: DATETIME,
  updatedAt: DATETIME
}
```

## Usage

### Submitting a Contact Form

```javascript
POST /api/contact
Content-Type: application/json

{
  "from_name": "John Doe",
  "from_email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project with you."
}
```

### Getting Contact Submissions

```javascript
GET /api/contacts
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Project Inquiry",
      "message": "I'd like to discuss a project with you.",
      "status": "new",
      "createdAt": "2026-03-07T10:24:30.769Z",
      "updatedAt": "2026-03-07T10:24:30.769Z"
    }
  ]
}
```

### Updating Contact Status

```javascript
PUT /api/contacts/1
Content-Type: application/json

{
  "status": "read"
}
```

## Development

- `npm run dev` - Start development server with auto-restart
- `npm start` - Start production server

## Deployment

The application is configured for deployment on Render.com with the included `render.yaml` configuration file.

## Database

The application uses SQLite for local development. The database file (`database.sqlite`) is automatically created in the project root when the server starts.

For production deployment, consider using a cloud database service like:
- PostgreSQL on Render
- MongoDB Atlas
- AWS RDS
- Google Cloud SQL
