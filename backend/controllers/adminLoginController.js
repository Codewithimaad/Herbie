import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminId = req.admin._id; // From auth middleware

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Current password and new password are required',
                error: 'MISSING_FIELDS'
            });
        }

        // Validate new password strength
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters',
                error: 'PASSWORD_TOO_SHORT'
            });
        }

        // Get admin from database
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found',
                error: 'ADMIN_NOT_FOUND'
            });
        }

        // Verify current password - IMPORTANT: compare with admin.password (not currentPassword)
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect',
                error: 'INCORRECT_PASSWORD'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password - IMPORTANT: update admin.password (not newPassword)
        admin.password = hashedPassword;
        admin.tokenVersion = (admin.tokenVersion || 0) + 1; // Increment token version for invalidation

        await admin.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully. Please log in again.'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
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
            bio: admin.bio,
            address: admin.address || '',
            phone: admin.phone || null,
        };

        res.json({ admin: adminData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update admin
export const updateAdmin = async (req, res) => {
    const { name, email, bio, address, phone } = req.body;
    console.log('Request body:', req.body); // Add this line

    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.bio = bio || admin.bio,
            admin.address = address || admin.address,
            admin.phone = phone || admin.phone;


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


