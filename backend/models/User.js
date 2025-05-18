import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    googleId: String,
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
