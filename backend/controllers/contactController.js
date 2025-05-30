import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address (e.g., Gmail)
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Input validation
    if (!name || name.trim().length < 4) {
        return res.status(400).json({ message: 'Name must be at least 4 characters long' });
    }
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!message || message.trim().length < 10) {
        return res.status(400).json({ message: 'Message must be at least 10 characters long' });
    }

    // Email options
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: 'kimad1728@gmail.com', // Destination email (your support email)
        replyTo: email, // User's email for replies
        subject: subject || 'New Contact Form Submission',
        text: `
            Name: ${name}
            Email: ${email}
            Subject: ${subject || 'No Subject'}
            Message: ${message}
        `,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }
                    .header {
                        background-color: #005B99;
                        padding: 20px;
                        text-align: center;
                        border-radius: 8px 8px 0 0;
                    }
                    .header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content p {
                        margin: 10px 0;
                        line-height: 1.6;
                    }
                    .content strong {
                        color: #005B99;
                    }
                    .message-box {
                        background-color: #f9f9f9;
                        border-left: 4px solid #005B99;
                        padding: 15px;
                        margin: 10px 0;
                        border-radius: 4px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #777777;
                        border-top: 1px solid #eeeeee;
                    }
                    @media only screen and (max-width: 600px) {
                        .container {
                            width: 100%;
                            margin: 10px;
                            padding: 10px;
                        }
                        .header h1 {
                            font-size: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Contact Form Submission</h1>
                    </div>
                    <div class="content">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
                        <p><strong>Message:</strong></p>
                        <div class="message-box">${message}</div>
                    </div>
                    <div class="footer">
                        <p>Thank you for your submission. We will get back to you soon!</p>
                        <p>&copy; 2025 Your Company. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};