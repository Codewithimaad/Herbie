// backend/routes/orders.js
import express from 'express';

import { authUser } from '../middlewares/authUser.js';
import { cancelOrder, getUserOrders, orderCreation } from '../controllers/orderController.js';

const router = express.Router();

// Post User Order
router.post('/', authUser, orderCreation);


// Get User Orders
router.get('/', authUser, getUserOrders)

// Cancel Order
router.patch('/:id/cancel', authUser, cancelOrder)

export default router;