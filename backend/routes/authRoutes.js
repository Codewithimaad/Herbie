import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, getCurrentUser, verifyEmail, resendVerification } from '../controllers/authController.js';
import { authUser } from '../middlewares/authUser.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', loginUser);
router.get('/get-user', authUser, getCurrentUser); // Protected route to get user



// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.redirect(`${process.env.FRONT_END_URL}/?token=${token}`);
    }
);

export default router;
