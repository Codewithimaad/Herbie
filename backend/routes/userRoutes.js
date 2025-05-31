import express from 'express';
import { getProfile, updateProfile, changePassword, uploadAvatar } from '../controllers/userController.js';
import { authUser } from '../middlewares/authUser.js';
import { requestPasswordReset, resetPassword } from '../controllers/userPasswordResetController.js';

const router = express.Router();


router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);


router.get('/profile', authUser, getProfile);
router.put('/profile', authUser, updateProfile);
router.put('/profile/password', authUser, changePassword);
router.post('/profile/avatar', authUser, uploadAvatar);

export default router;
