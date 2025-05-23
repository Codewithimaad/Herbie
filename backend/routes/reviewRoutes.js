// backend/routes/reviews.js
import express from 'express';

import { authUser } from '../middlewares/authUser.js'; // From previous responses
import { getReviewForProduct, helpfulCount, postNewReviewForProduct } from '../controllers/reviewController.js';

const router = express.Router();

// GET reviews for a product
router.get('/:productId', getReviewForProduct);

// POST a new review (authenticated)
router.post('/:productId', authUser, postNewReviewForProduct);

// PUT to increment helpful count (optional)
router.put('/:reviewId/helpful', authUser, helpfulCount);

export default router;