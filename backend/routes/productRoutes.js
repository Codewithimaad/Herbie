import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

import upload from '../config/upload.js';
// import { authUser, isAdmin } from '../middleware/auth.js'; // Uncomment when adding auth

const router = express.Router();

// ✅ Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// ✅ Admin Routes (currently open, can add auth later)
router.post('/', upload.array('images', 5), createProduct);
router.put('/:id', upload.array('images', 5), updateProduct);
router.delete('/:id', deleteProduct);

// 🔒 Future secured version:
// router.post('/', authUser, isAdmin, upload.array('images', 5), createProduct);
// router.put('/:id', authUser, isAdmin, upload.array('images', 5), updateProduct);
// router.delete('/:id', authUser, isAdmin, deleteProduct);

export default router;
