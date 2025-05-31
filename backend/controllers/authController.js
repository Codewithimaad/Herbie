import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register user with email verification
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const verificationTokenExpires = Date.now() + 3600000; // 1 hour

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires,
            isVerified: false
        });

        // Send verification email
        const verificationUrl = `${process.env.FRONT_END_URL}/verify-email/${verificationToken}`;

        const mailOptions = {
            from: `"Herbie" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email',
            html: `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 20px;">
      <div style="background: linear-gradient(to right, #22c55e, #16a34a); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to Herbie</h1>
      </div>
      <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #1f2937; margin: 0 0 20px;">Hi ${name},</p>
        <p style="font-size: 16px; color: #1f2937; margin: 0 0 20px;">
          Thank you for signing up with Herbie! Please verify your email address to get started.
        </p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #15803d; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; margin: 0 0 20px; transition: background-color 0.2s;">Verify Email</a>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">
          If you didn’t create an account, you can safely ignore this email.
        </p>
      </div>
      <div style="text-align: center; padding: 20px 0;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
          &copy; ${new Date().getFullYear()} Herbie. All rights reserved.
        </p>
      </div>
    </div>
  `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Verify email endpoint
export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification token'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully. You can now log in.'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Updated login to check verification status
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Block login attempt if user is a Google user
        if (user.isGoogleUser) {
            return res.status(403).json({
                message: 'Please log in using Google authentication'
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.json({ message: 'Login successful', user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Resend verification email
export const resendVerification = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

        // Generate new token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        const mailOptions = {
            from: `"Your App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email',
            html: `... same email template as register ...`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Verification email resent. Please check your inbox.'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('_id email name cart createdAt isGoogleUser avatar')
            .populate('cart.product', 'name price image'); // Optional: populate cart product details

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Structure the response to match exactly what you need
        const userData = {
            _id: user._id,
            email: user.email,
            name: user.name || '',
            createdAt: user.createdAt,
            cart: user.cart || [],
            isGoogleUser: user.isGoogleUser || false,
            avatar: user.avatar || ''
        };
        console.log('User Data Image:', userData)
        res.json({ user: userData });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Error fetching user data' });
    }
};

// Logout controller
export const logoutUser = async (req, res) => {
    try {
        // If you're using cookies for JWT, clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'None', // or 'Lax'/'Strict' depending on your frontend setup
            secure: true      // true if using HTTPS (production)
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Logout failed' });
    }
};
