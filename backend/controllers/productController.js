import Product from '../models/Product.js';

// GET all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST (Admin) - Create new product with image upload

export const createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        const imageUrls = req.files.map(file => file.path); // Cloudinary returns the image URL in `path`

        const newProduct = new Product({
            ...req.body,
            images: imageUrls, // Save array of image URLs
        });

        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const existing = await Product.findById(productId);
        if (!existing) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle image URLs
        const newImages = req.files ? req.files.map(file => file.path) : [];
        const retainedImages = JSON.parse(req.body.existingImages || '[]');
        const allImages = [...retainedImages, ...newImages];

        const updated = await Product.findByIdAndUpdate(productId, {
            ...req.body,
            images: allImages,
        }, { new: true });

        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};



// DELETE (Admin) - Remove product
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
