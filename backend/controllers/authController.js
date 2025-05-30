import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login user (JWT)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // ❌ Block login attempt if user is a Google user
        if (user.isGoogleUser) {
            return res.status(403).json({
                message: 'Please log in using Google authentication'
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
