import Admin from '../models/Admin.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Log to verify env variables are loaded
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('ADMIN_URL:', process.env.ADMIN_URL);

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
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'No admin found with this email' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const resetPasswordExpires = Date.now() + 3600000; // 1 hour

        admin.resetPasswordToken = resetPasswordToken;
        admin.resetPasswordExpires = resetPasswordExpires;
        await admin.save();

        // Build reset URL
        const resetUrl = `${process.env.ADMIN_URL}/reset-password/${resetToken}`;

        // Email options
        const mailOptions = {
            to: admin.email,
            from: process.env.EMAIL_USER,
            subject: 'Herbie Admin - Reset Your Password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb; color: #111827; max-width: 600px; margin: auto;">
                    <h2 style="color: #4f46e5;">Reset Your Password</h2>
                    <p>Hello ${admin.name || 'Admin'},</p>
                    <p>You requested to reset your password. Click the button below to proceed:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p style="font-size: 0.8rem; color: #6b7280;">© 2025 Herbie Admin</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent:', info.messageId);

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

        const admin = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        admin.password = password;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();

        res.status(200).json({ message: 'Password reset successful' });

    } catch (err) {
        console.error('❌ Error resetting password:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
