// backend/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product ID is required'],
            },
            name: {
                type: String,
                required: [true, 'Product name is required'],
                trim: true,
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required'],
                min: [1, 'Quantity must be at least 1'],
            },
            price: {
                type: Number,
                required: [true, 'Price is required'],
                min: [0, 'Price cannot be negative'],
            },
        },
    ],
    shippingAddress: {
        name: { type: String, required: [true, 'Name is required'], trim: true },
        email: { type: String, required: [true, 'Email is required'], trim: true },
        phone: { type: String, required: [true, 'Phone is required'], trim: true },
        address: { type: String, required: [true, 'Address is required'], trim: true },
        city: { type: String, required: [true, 'City is required'], trim: true },
        country: { type: String, required: [true, 'Country is required'], trim: true },
        zip: { type: String, required: [true, 'ZIP code is required'], trim: true },
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'easypaisa', 'cod'],
        required: [true, 'Payment method is required'],
    },
    paymentDetails: {
        cardNumber: { type: String, trim: true }, // Last 4 digits
        expiry: { type: String, trim: true },
        easypaisaNumber: { type: String, trim: true },
    },
    totals: {
        subtotal: {
            type: Number,
            required: [true, 'Subtotal is required'],
            min: [0, 'Subtotal cannot be negative'],
        },
        shipping: {
            type: Number,
            required: [true, 'Shipping is required'],
            min: [0, 'Shipping cannot be negative'],
        },
        tax: {
            type: Number,
            required: [true, 'Tax is required'],
            min: [0, 'Tax cannot be negative'],
        },
        grandTotal: {
            type: Number,
            required: [true, 'Total is required'],
            min: [0, 'Total cannot be negative'],
        },

    },
    status: {
        type: String,
        enum: ['placed', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'placed',
    },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    paymentStatus: { type: String },
    deliveryStatus: { type: String, default: 'In Transit', enum: ['In Transit', 'Delivered'] },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    statusHistory: [
        {
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],

});

orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

orderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);