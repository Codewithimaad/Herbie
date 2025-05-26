import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import mongoose from 'mongoose';

export const adminAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
                return res.status(401).json({ message: 'Invalid token format' });
            }

            const admin = await Admin.findById(decoded.id); // ✅ Correct usage

            if (!admin) {
                return res.status(401).json({ message: 'Admin not found' });
            }

            req.admin = admin;
            next();
        } catch (error) {
            console.error('Auth error:', error.message);
            return res.status(401).json({
                message: 'Not authorized',
                error: error.message
            });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};
