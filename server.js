const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./db');
const Contact = require('./models/Contact');

dotenv.config();

// Try to load SendGrid if available
let sgMail;
try {
    sgMail = require('@sendgrid/mail');
    if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
} catch (error) {
    console.log('SendGrid not configured, using Gmail fallback');
}

// Connect to database
connectDB();

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

app.get('/ai-chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai-chat.html'));
});

const portfolioContext = `
You are the AI assistant for John Joshua's portfolio.
Use this information when answering:
- Answer in first person as John when describing the project work, design choices, skills, and experience.
- John Joshua is an IT graduate and web developer with strong interest in AI, cybersecurity, and practical digital products.
- The portfolio highlights web development, AI/ML, cybersecurity, and IoT.
- He studied BSc. Information Technology at Dedan Kimathi University of Technology from 2022 to 2026 and has Dean's List recognition.
- He is open to internships, freelance projects, and collaboration.
- Visitors can explore Projects, Case Studies, Blog, About, and Contact pages to learn more or reach out.
- Keep responses concise, helpful, professional, and portfolio-focused.
- If a question asks for information not available in the portfolio, say so clearly and invite the visitor to contact John directly.
`.trim();

const fallbackResponses = [
    {
        keywords: ['skill', 'stack', 'technology', 'technologies', 'tools'],
        reply: 'I work across web development, AI/ML, cybersecurity, and IoT. My portfolio especially emphasizes practical web solutions, intelligent systems, and secure digital products.'
    },
    {
        keywords: ['education', 'study', 'university', 'degree'],
        reply: 'I studied BSc. Information Technology at Dedan Kimathi University of Technology from 2022 to 2026, with Dean\'s List recognition highlighted in my portfolio.'
    },
    {
        keywords: ['project', 'projects', 'build', 'built'],
        reply: 'I build practical web applications and I am especially interested in intelligent systems, cybersecurity-focused solutions, and IoT projects. The Projects and Case Studies pages are the best place to explore specific work.'
    },
    {
        keywords: ['ai', 'machine learning', 'prompt', 'llm'],
        reply: 'AI is one of my core focus areas. I am especially interested in intelligent systems, prompt engineering, and practical AI-driven solutions.'
    },
    {
        keywords: ['hire', 'available', 'freelance', 'internship', 'collaborate', 'contact'],
        reply: 'I am open to internships, freelance work, and collaborations. The fastest next step is through the Contact page if you want to discuss a role or project.'
    }
];

function buildFallbackReply(message) {
    const normalizedMessage = message.toLowerCase();
    const matchedResponse = fallbackResponses.find((entry) =>
        entry.keywords.some((keyword) => normalizedMessage.includes(keyword))
    );

    if (matchedResponse) {
        return matchedResponse.reply;
    }

    return 'I am an IT graduate and developer focused on web development, AI, cybersecurity, and practical problem-solving. If you want details about a project, skill set, or collaboration opportunity, ask that directly or use the Contact page.';
}

async function getOpenAIReply(message) {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }

    if (typeof fetch !== 'function') {
        throw new Error('Fetch is not available in this Node runtime.');
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
            input: [
                {
                    role: 'system',
                    content: [
                        {
                            type: 'input_text',
                            text: portfolioContext
                        }
                    ]
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: message
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.output_text ? data.output_text.trim() : null;
}

app.post('/api/ai', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                error: 'A message is required.'
            });
        }

        const cleanMessage = message.trim().slice(0, 1000);

        try {
            const openAIReply = await getOpenAIReply(cleanMessage);
            if (openAIReply) {
                return res.status(200).json({
                    reply: openAIReply,
                    source: 'openai'
                });
            }
        } catch (openAIError) {
            console.error('OpenAI assistant error:', openAIError.message);
        }

        return res.status(200).json({
            reply: buildFallbackReply(cleanMessage),
            source: 'fallback'
        });
    } catch (error) {
        console.error('AI endpoint error:', error);
        res.status(500).json({
            error: 'Failed to generate AI response.'
        });
    }
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

        // Save to database
        const contact = await Contact.create({
            name: from_name,
            email: from_email,
            subject: subject,
            message: message
        });

        // Try to send emails using SendGrid first, then Gmail fallback
        let emailSent = false;

        try {
            if (sgMail && process.env.SENDGRID_API_KEY) {
                // SendGrid email to you
                const sgMessageToYou = {
                    to: 'johnomitijoshua@gmail.com',
                    from: 'portfolio@yourdomain.com', // Replace with your verified sender
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

                // SendGrid confirmation email to sender
                const sgMessageToSender = {
                    to: from_email,
                    from: 'portfolio@yourdomain.com', // Replace with your verified sender
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

                await sgMail.send(sgMessageToYou);
                await sgMail.send(sgMessageToSender);
                emailSent = true;
                console.log('✅ Emails sent via SendGrid');
            }
        } catch (sgError) {
            console.log('SendGrid failed, trying Gmail fallback:', sgError.message);
        }

        // Gmail fallback if SendGrid failed or not configured
        if (!emailSent) {
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
            console.log('✅ Emails sent via Gmail');
        }

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

// Get all contact submissions (admin endpoint)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch contacts'
        });
    }
});

// Update contact status (admin endpoint)
app.put('/api/contacts/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const [updatedRowsCount] = await Contact.update(
            { status },
            { where: { id: req.params.id } }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            });
        }

        const contact = await Contact.findByPk(req.params.id);
        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update contact'
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
