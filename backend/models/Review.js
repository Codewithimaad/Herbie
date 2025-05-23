import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer',
        },
    },
    title: {
        type: String,
        required: [true, 'Review title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
        type: String,
        required: [true, 'Review content is required'],
        trim: true,
        minlength: [10, 'Content must be at least 10 characters'],
        maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    recommend: {
        type: Boolean,
        required: [true, 'Recommendation is required'],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    helpfulCount: {
        type: Number,
        default: 0,
        min: [0, 'Helpful count cannot be negative'],
    },

    attributes: {
        type: [String],
        default: [],
        validate: {
            validator: (arr) => arr.every((v) => typeof v === 'string' && v.length <= 50),
            message: 'Each attribute must be a string and cannot exceed 50 characters',
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for faster queries
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

// Update `updatedAt` on save
reviewSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Review', reviewSchema);