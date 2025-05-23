import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // optional for Google users
    googleId: { type: String }, // used for OAuth users
    avatar: { type: String, default: '' }, // URL to profile picture
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: { type: Number, default: 1 }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
