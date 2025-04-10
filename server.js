const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create a directory for storing submissions if it doesn't exist
const submissionsDir = path.join(__dirname, 'submissions');
if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir);
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Handle contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Save submission to file
        const submission = {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        };

        const fileName = `submission_${Date.now()}.json`;
        fs.writeFileSync(
            path.join(submissionsDir, fileName),
            JSON.stringify(submission, null, 2)
        );

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to your email
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Send auto-reply to user
        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting ZUUMAV',
            html: `
                <h2>Thank you for contacting ZUUMAV!</h2>
                <p>Dear ${name},</p>
                <p>We have received your message and will get back to you shortly.</p>
                <p>Best regards,<br>ZUUMAV Team</p>
            `
        };

        await transporter.sendMail(autoReplyOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ error: 'Failed to process submission' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 