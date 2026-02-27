const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/projects.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'projects.html'));
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { from_name, from_email, subject, message } = req.body;

        // Validate input
        if (!from_name || !from_email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Email to you
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'johnomitijoshua@gmail.com',
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${from_name}</p>
                <p><strong>Email:</strong> ${from_email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>Reply to: ${from_email}</em></p>
            `
        };

        // Confirmation email to sender
        const confirmationEmail = {
            from: process.env.EMAIL_USER,
            to: from_email,
            subject: 'Thank you for contacting me - John Joshua',
            html: `
                <h2>Thank You!</h2>
                <p>Hi ${from_name},</p>
                <p>Thank you for reaching out! I received your message and will get back to you as soon as possible.</p>
                <p><strong>Your message:</strong></p>
                <p>${subject}</p>
                <hr>
                <p>Best regards,<br>John Joshua</p>
            `
        };

        // Send both emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(confirmationEmail);

        res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully!' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email. Please try again.' 
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
