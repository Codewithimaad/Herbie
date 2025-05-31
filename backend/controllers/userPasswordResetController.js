import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs'; // Ensure bcrypt is imported
import dotenv from 'dotenv';

dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Request password reset
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No user found with this email' });
        }

        // Check if user logged in with Google
        if (user.isGoogleUser) {
            return res.status(403).json({ message: 'You cannot reset your password because you logged in with Google' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // Build reset URL
        const resetUrl = `${process.env.FRONT_END_URL}/reset-password/${resetToken}`;

        // Email options with modern template
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Herbie - Reset Your Password',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; }
                        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 20px; text-align: center; }
                        .header img { max-width: 150px; height: auto; }
                        .content { padding: 30px 20px; }
                        h2 { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 16px; }
                        p { font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 20px; }
                        .cta-button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #4f46e5, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500; transition: background 0.3s; }
                        .cta-button:hover { background: linear-gradient(135deg, #4338ca, #0891b2); }
                        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
                        .footer a { color: #4f46e5; text-decoration: none; }
                        .footer a:hover { text-decoration: underline; }
                        .social-icons { margin-top: 12px; }
                        .social-icons a { display: inline-block; margin: 0 8px; }
                        .social-icons img { width: 24px; height: 24px; }
                        @media (max-width: 600px) {
                            .container { margin: 10px; }
                            h2 { font-size: 20px; }
                            p { font-size: 14px; }
                            .cta-button { padding: 10px 20px; font-size: 14px; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://via.placeholder.com/150x50?text=Herbie+Logo" alt="Herbie Logo">
                        </div>
                        <div class="content">
                            <h2>Reset Your Password</h2>
                            <p>Hello ${user.name || 'User'},</p>
                            <p>You requested to reset your password for your Herbie account. Click the button below to set a new password. This link will expire in 1 hour.</p>
                            <p style="text-align: center; margin: 24px 0;">
                                <a href="${resetUrl}" class="cta-button">Reset Password</a>
                            </p>
                            <p>If you didn’t request this, you can safely ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 Herbie. All rights reserved.</p>
                            <p><a href="${process.env.FRONT_END_URL}/privacy">Privacy Policy</a> | <a href="${process.env.FRONT_END_URL}/unsubscribe">Unsubscribe</a></p>
                            <div class="social-icons">
                                <a href="https://twitter.com"><img src="https://via.placeholder.com/24?text=T" alt="Twitter"></a>
                                <a href="https://facebook.com"><img src="https://via.placeholder.com/24?text=F" alt="Facebook"></a>
                                <a href="https://linkedin.com"><img src="https://via.placeholder.com/24?text=L" alt="LinkedIn"></a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });

    } catch (err) {
        console.error('❌ Error sending reset email:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save hashed password
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });

    } catch (err) {
        console.error('❌ Error resetting password:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};