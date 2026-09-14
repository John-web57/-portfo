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

app.get('/experience.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'experience.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/certifications.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'certifications.html'));
});

app.get(['/case-studies', '/case-studies.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'case-studies.html'));
});

app.get('/blog.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/ai-chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai-chat.html'));
});

const portfolioContext = `
You are the AI assistant for John Omiti Joshua's professional portfolio.
Use this information when answering:
- Answer in first person as John when describing project work, design choices, skills, and experience.
- John Omiti Joshua is a results-driven IT Support Specialist with a Bachelor of Science in Information Technology from Dedan Kimathi University of Technology (2026) and professional experience providing IT support, systems maintenance, networking, and software development at CryptAfrica.
- Skilled in troubleshooting hardware, software, and network issues, managing Windows environments, supporting end users, and maintaining secure and reliable IT systems. Experienced in web and software development, cybersecurity fundamentals, REST APIs, databases, SEO, content writing, and technical documentation. Passionate about using technology, including AI-powered solutions, to improve operational efficiency, security, and user experience.
- Career Objective: To secure a challenging position within a forward-thinking organization where I can apply my IT support, networking, software development, and cybersecurity skills to deliver reliable technology solutions. Committed to continuous learning and professional growth while contributing to innovative projects in areas such as artificial intelligence, IoT, cloud technologies, and enterprise software systems.
- Key projects: 1) CryptAfrica Staff Attendance & Daily Work Management System, 2) CryptAfrica News Platform, 3) JAYTECH Solutions Company Website, 4) Android Mobile Application, 5) SMART IoT Environmental Monitoring System.
- Certifications: Cisco Introduction to Networking, Network Security, Cybersecurity Essentials, IoT, and 1st Place Winner in the Huawei National ICT Hackathon.
- Open for roles in IT Support, Systems Administration, Network Operations, and Software Engineering.
- Contact: johnomitijoshua@gmail.com, +254 757 824 227, Nairobi, Kenya.
- Keep responses concise, professional, and portfolio-focused.
`.trim();

const fallbackResponses = [
    {
        keywords: ['objective', 'goal', 'aim', 'career goal', 'career objective'],
        reply: 'My career objective is to secure a challenging position within a forward-thinking organization where I can apply my IT support, networking, software development, and cybersecurity skills to deliver reliable technology solutions. I am committed to continuous learning and contributing to innovative projects in AI, IoT, cloud technologies, and enterprise software systems.'
    },
    {
        keywords: ['skill', 'stack', 'technology', 'technologies', 'tools', 'languages', 'seo', 'content'],
        reply: 'My technical stack spans IT Support (Windows, Linux, hardware/software troubleshooting), Networking (TCP/IP, LAN/WAN, Cisco routers & switches, DNS, DHCP), Cybersecurity (threat assessment, endpoint hardening), Software Development (Java, Spring Boot, React, JavaScript, SQL), SEO, and technical content writing.'
    },
    {
        keywords: ['attendance', 'cryptafrica', 'work management', 'clock'],
        reply: 'I built the CryptAfrica Staff Attendance & Daily Work Management System with Spring Boot, React, MySQL, and Java. It manages employee clock-in/out, time wasted vs. recovered calculations, leave requests, asset allocation, and daily work logs.'
    },
    {
        keywords: ['education', 'study', 'university', 'degree', 'kimathi'],
        reply: 'I graduated with a Bachelor of Science in Information Technology from Dedan Kimathi University of Technology (2026) with coursework spanning Software Engineering, Networking, Cybersecurity, and Database Systems.'
    },
    {
        keywords: ['project', 'projects', 'build', 'built'],
        reply: 'My primary projects are: 1) CryptAfrica Staff Attendance & Work Management System, 2) CryptAfrica News Platform, 3) JAYTECH Solutions Company Website, 4) Android Mobile Application, and 5) SMART IoT Environmental & Water Monitoring System.'
    },
    {
        keywords: ['certifications', 'cisco', 'huawei', 'award', 'hackathon'],
        reply: 'I hold 4 Cisco credentials (Networking, Network Security, Cybersecurity Essentials, IoT) and won First Place in the Huawei National ICT Hackathon for Best Android Application.'
    },
    {
        keywords: ['hire', 'available', 'freelance', 'internship', 'collaborate', 'contact', 'email'],
        reply: 'I am actively open to IT Support, Systems Administration, and Software Developer positions. You can reach me directly at johnomitijoshua@gmail.com, +254 757 824 227, or via the Contact form.'
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

    return 'I am John Omiti Joshua, an IT Support Specialist at CryptAfrica and Software Developer. Feel free to ask about my projects like the CryptAfrica Attendance System, my Cisco & Huawei certifications, or my technical skills!';
}

async function getOpenAIReply(message) {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: portfolioContext
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data.choices && data.choices[0] && data.choices[0].message 
            ? data.choices[0].message.content.trim() 
            : null;
    } catch (error) {
        console.error('OpenAI API error:', error.message);
        return null;
    }
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
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
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

            // Send both emails if configured
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                Promise.all([
                    transporter.sendMail(mailOptions),
                    transporter.sendMail(confirmationEmail)
                ]).then(() => {
                    console.log('✅ Emails sent via Gmail');
                }).catch((mailErr) => {
                    console.warn('⚠️ Email notification notice (message saved to database):', mailErr.message);
                });
            } else {
                console.log('ℹ️ Email credentials not configured, contact message saved to database');
            }
        }

        res.status(200).json({
            success: true,
            message: 'Message received and saved successfully!'
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
