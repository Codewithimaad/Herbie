import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


// Add new admin
export const addAdmin = async (req, res) => {
    const { name, email, password, image, bio } = req.body;
    try {
        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Admin already exists' });

        const admin = new Admin({ name, email, password, image, bio });
        await admin.save();

        res.status(201).json({ message: 'Admin created', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(admin._id);

        res.json({
            message: 'Login successful',
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                image: admin.image,
                bio: admin.bio,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single admin by ID
export const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update admin
export const updateAdmin = async (req, res) => {
    const { name, email, password, image, bio } = req.body;
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.password = password || admin.password;
        admin.image = image || admin.image;
        admin.bio = bio || admin.bio;

        await admin.save();
        res.json({ message: 'Admin updated', admin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
