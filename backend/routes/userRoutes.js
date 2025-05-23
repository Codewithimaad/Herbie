import express from 'express';
import { getProfile, updateProfile, changePassword, uploadAvatar } from '../controllers/userController.js';
import { authUser } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/profile', authUser, getProfile);
router.put('/profile', authUser, updateProfile);
router.put('/profile/password', authUser, changePassword);
router.post('/profile/avatar', authUser, uploadAvatar);

export default router;
