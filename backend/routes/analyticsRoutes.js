import express from 'express';
const router = express.Router();
import { getActiveUsers, getMostViewedPages } from '../controllers/analyticsController.js'

router.get('/most-viewed-pages', getMostViewedPages);

router.get('/active-users', getActiveUsers); // <-- Add this


export default router;