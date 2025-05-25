import express from 'express';

const router = express.Router();

import { adminAuth } from '../middlewares/authAdmin.js'
import { addFAQ, deleteFAQ, getAllFAQs } from '../controllers/faQsController.js';

router.get('/', adminAuth, getAllFAQs);
router.post('/', adminAuth, addFAQ);
router.delete('/:id', adminAuth, deleteFAQ);
router.get('/for-all', getAllFAQs);


export default router;