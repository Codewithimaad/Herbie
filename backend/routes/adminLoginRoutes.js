import express from 'express';
import {
    addAdmin,
    loginAdmin,
    getAllAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    changePassword,
} from '../controllers/adminLoginController.js';
import { adminAuth } from '../middlewares/authAdmin.js';
import { requestPasswordReset, resetPassword } from '../controllers/adminPasswordResetController.js';

const router = express.Router();

// Public
router.post('/login', loginAdmin);

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);


router.put('/change-password', adminAuth, changePassword); // Delete admin
router.get('/get-admin', adminAuth, getAdmin);       // Get single admin



// CRUD
router.post('/', adminAuth, addAdmin);         // Add new admin
router.get('/', adminAuth, getAllAdmins);      // Get all admins
router.put('/:id', adminAuth, updateAdmin);    // Update admin
router.delete('/:id', adminAuth, deleteAdmin); // Delete admin





export default router;
