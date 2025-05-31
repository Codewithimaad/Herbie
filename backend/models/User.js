import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // optional for Google users
    googleId: { type: String }, // used for OAuth users
    isGoogleUser: { type: Boolean, default: false }, // flag for Google users
    avatar: { type: String, default: '' }, // URL to profile picture
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    isVerified: { type: Boolean, default: false }, // New field
    verificationToken: { type: String }, // New field
    verificationTokenExpires: Date,
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