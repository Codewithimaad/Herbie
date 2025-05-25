import express from 'express';
import {
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderPaymentMethod,
    getDashboardMetrics,
    getRecentOrders,
    getSalesData,
    updateOrderDeliveryStatus
} from '../controllers/adminController.js';
import validateObjectId from '../middlewares/validateObjectId.js';
import { adminAuth } from '../middlewares/authAdmin.js'

const router = express.Router();

// Specific routes first
router.get('/dashboard', getDashboardMetrics);
router.get('/orders/recent', getRecentOrders);
router.get('/sales-data', getSalesData);

// Dynamic routes with ID validation
router.get('/', getAllOrders);
router.get('/:id', validateObjectId, getOrderById);
router.put('/:id', validateObjectId, updateOrder);
router.delete('/:id', validateObjectId, deleteOrder);
router.put('/payment/:id', updateOrderPaymentMethod);
router.put('/delivery-status/:id', adminAuth, updateOrderDeliveryStatus)

export default router;