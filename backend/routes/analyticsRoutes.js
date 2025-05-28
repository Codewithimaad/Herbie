import express from 'express';
import { adminAuth } from '../middlewares/authAdmin.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', adminAuth, getAnalytics);


export default router;
