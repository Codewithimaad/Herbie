import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: [{ type: String, required: true }], // <-- Now an array of image URLs
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    category: {
        type: String,
        enum: ['Tea Herbs', 'Medicinal Herbs', 'Spices', 'Beauty Herbs', 'Culinary Herbs'],
        required: true
    },
    inStock: { type: Number, required: true, min: 0, default: 0 },
    isOrganic: { type: Boolean, default: false },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
