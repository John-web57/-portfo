# Portfolio Backend

A Node.js backend server for a portfolio website with contact form functionality and database integration.

## Features

- **Static File Serving**: Serves HTML, CSS, and static assets
- **Contact Form**: Handles contact form submissions with email notifications
- **Database Integration**: Stores contact form submissions in SQLite database
- **Email Notifications**: Sends confirmation emails to both sender and recipient
- **Admin API**: Endpoints to manage contact submissions

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite with Sequelize ORM
- **Email**: Nodemailer with Gmail SMTP
- **Environment**: dotenv for configuration

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```
4. Configure your Gmail credentials in `.env`
5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Gmail credentials for contact form
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server port
PORT=3000
```

## API Endpoints

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
