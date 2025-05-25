import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    image: {
        type: String, // URL or file path to image
        default: '',
    },

    bio: {
        type: String,
        trim: true,
        default: '',
    }

}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
