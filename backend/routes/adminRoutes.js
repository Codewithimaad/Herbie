import express from 'express';
import { getAllOrders, getOrderById, updateOrder, deleteOrder, updateOrderPaymentMethod } from '../controllers/adminController.js';

const router = express.Router();

// Get all orders (with filtering and pagination)
router.get('/', getAllOrders);

// Get a single order by ID
router.get('/:id', getOrderById);

// Update an order
router.put('/:id', updateOrder);

// Delete an order
router.delete('/:id', deleteOrder);

// Update payment method
router.put('/payment/:id', updateOrderPaymentMethod);

export default router;