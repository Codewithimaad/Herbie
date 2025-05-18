import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController.js';
import { authUser } from '../middlewares/authUser.js';

const router = express.Router();

router.post('/add', authUser, addToCart);
router.get('/', authUser, getCart);
router.post('/remove', authUser, removeFromCart); // Delete item
router.post('/update', authUser, updateCartItem); // Update quantity

export default router;
