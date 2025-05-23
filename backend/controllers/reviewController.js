import mongoose from 'mongoose';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Order from '../models/Orders.js';

export const getReviewForProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'most-recent' } = req.query;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Sorting logic
        const sortOptions = {
            'most-recent': { createdAt: -1 },
            'highest-rated': { rating: -1, createdAt: -1 },
            'lowest-rated': { rating: 1, createdAt: -1 },
            'most-helpful': { helpfulCount: -1, createdAt: -1 },
        };

        // Fetch reviews
        const reviews = await Review.find({ productId })
            .sort(sortOptions[sort] || sortOptions['most-recent'])
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        // Calculate rating stats
        const allReviews = await Review.find({ productId }).lean();
        const total = allReviews.length;
        const average = total
            ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1))
            : 0;
        const breakdown = [0, 0, 0, 0, 0]; // [5, 4, 3, 2, 1]
        allReviews.forEach((r) => {
            breakdown[5 - r.rating]++;
        });
        const recommendPercentage = total
            ? Math.round((allReviews.filter((r) => r.recommend).length / total) * 100)
            : 0;

        res.json({
            reviews,
            ratingStats: { average, total, breakdown, recommendPercentage },
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


export const postNewReviewForProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, title, content, recommend, attributes, location } = req.body;
        const userId = req.user.id;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Validate inputs
        if (!rating || !title || !content || recommend === undefined) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Check if user purchased the product
        const order = await Order.findOne({
            user: userId,
            'items.product': productId,
            status: { $in: ['shipped', 'delivered'] },
        });
        const verified = !!order;

        // Create review
        const review = new Review({
            productId,
            userId,
            name: (await User.findById(userId).select('name')).name,
            rating,
            title,
            content,
            recommend,
            verified,
            helpfulCount: 0,
            location: location || '',
            attributes: attributes || [],
        });

        await review.save();
        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (err) {
        console.error('Error submitting review:', err);
        res.status(400).json({ message: err.message || 'Failed to submit review' });
    }
}


export const helpfulCount = async (req, res) => {
    try {
        const { reviewId } = req.params;
        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { $inc: { helpfulCount: 1 } },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json({ message: 'Helpful count updated', helpfulCount: review.helpfulCount });
    } catch (err) {
        console.error('Error updating helpful count:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


