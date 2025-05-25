import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';


const generateToken = (id) => {
    return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};



// Add new admin
export const addAdmin = async (req, res) => {
    const { name, email, password, image, bio } = req.body;

    try {
        // Check if admin already exists
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin with hashed password
        const admin = new Admin({
            name,
            email,
            password: hashedPassword,
            image,
            bio
        });

        await admin.save();

        // Return response without the password
        const adminToReturn = admin.toObject();
        delete adminToReturn.password;

        res.status(201).json({
            message: 'Admin created successfully',
            admin: adminToReturn
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

// Login admin
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(admin._id);

        // Send response with admin details and token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                image: admin.image,
                bio: admin.bio,
            },
            token: token,
        });
    } catch (err) {
        console.error('Login error:', err);
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

export const getAdmin = async (req, res) => {
    try {
        // Assume your adminAuth middleware sets req.admin or req.adminId
        const adminId = req.admin._id || req.adminId;
        const admin = await Admin.findById(adminId).select('-password');
        console.log('Admin data:', admin); // Debug log
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });


        // Structure the response to match exactly what you need
        const adminData = {
            _id: admin._id,
            email: admin.email,
            name: admin.name || '', // Fallback if name doesn't exist
            bio: admin.bio
        };

        res.json({ admin: adminData });
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
