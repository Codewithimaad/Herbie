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
router.get('/dashboard', adminAuth, getDashboardMetrics);
router.get('/orders/recent', adminAuth, getRecentOrders);
router.get('/sales-data', adminAuth, getSalesData);

// Dynamic routes with ID validation
router.get('/', getAllOrders);
router.get('/:id', validateObjectId, adminAuth, getOrderById);
router.put('/:id', validateObjectId, adminAuth, updateOrder);
router.delete('/:id', validateObjectId, adminAuth, deleteOrder);
router.put('/payment/:id', adminAuth, updateOrderPaymentMethod);
router.put('/delivery-status/:id', adminAuth, updateOrderDeliveryStatus)

export default router;