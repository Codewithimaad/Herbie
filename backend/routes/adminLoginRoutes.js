import express from 'express';
import {
    addAdmin,
    loginAdmin,
    getAllAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin,
} from '../controllers/adminLoginController.js';
import { adminAuth } from '../middlewares/authAdmin.js';

const router = express.Router();

// Public
router.post('/login', loginAdmin);

// CRUD
router.post('/', adminAuth, addAdmin);         // Add new admin
router.get('/', adminAuth, getAllAdmins);      // Get all admins
router.get('/get-admin', adminAuth, getAdmin);       // Get single admin
router.put('/:id', adminAuth, updateAdmin);    // Update admin
router.delete('/:id', adminAuth, deleteAdmin); // Delete admin

export default router;
