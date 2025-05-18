import User from '../models/User.js';
import Product from '../models/Product.js';

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const existingItem = user.cart.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        res.status(200).json(user.cart);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const user = req.user;

        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'ProductId is required' });
        }

        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();

        res.json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update quantity of a cart item
export const updateCartItem = async (req, res) => {
    try {
        const user = req.user;

        const { productId, quantity } = req.body;
        if (!productId || quantity == null) {
            return res.status(400).json({ error: 'ProductId and quantity are required' });
        }

        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        if (quantity <= 0) {
            // Remove the item if quantity <= 0
            user.cart = user.cart.filter(item => item.product.toString() !== productId);
        } else {
            cartItem.quantity = quantity;
        }

        await user.save();

        res.json({ message: 'Cart updated', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
