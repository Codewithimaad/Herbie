import mongoose from 'mongoose';
import Order from '../models/Orders.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const orderCreation = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            items,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            totals: { subtotal, shipping, tax, grandTotal },
        } = req.body;

        // Validate inputs
        if (!items?.length) {
            return res.status(400).json({ message: 'Cart items are required' });
        }
        if (!shippingAddress?.name || !shippingAddress?.email || !shippingAddress?.phone) {
            return res.status(400).json({ message: 'Complete shipping address is required' });
        }
        if (!['card', 'easypaisa', 'cod'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }
        if (
            paymentMethod === 'card' &&
            (!paymentDetails?.cardNumber || !paymentDetails?.expiry)
        ) {
            return res.status(400).json({ message: 'Card details are required' });
        }
        if (paymentMethod === 'easypaisa' && !paymentDetails?.easypaisaNumber) {
            return res.status(400).json({ message: 'Easypaisa number is required' });
        }
        if (
            !Number.isFinite(subtotal) ||
            !Number.isFinite(shipping) ||
            !Number.isFinite(tax) ||
            !Number.isFinite(grandTotal)
        ) {
            return res.status(400).json({ message: 'Valid totals are required' });
        }

        // Fetch user and populate cart's product details
        const user = await User.findById(userId).populate('cart.product', 'name price stock');
        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Validate items
        for (const item of items) {
            if (!mongoose.isValidObjectId(item.productId)) {
                return res.status(400).json({ message: `Invalid product ID: ${item.productId}` });
            }
            // Find matching cart item
            const cartItem = user.cart.find(
                (ci) => ci.product._id.toString() === item.productId
            );
            if (!cartItem) {
                return res.status(400).json({
                    message: `Product not in cart: ${item.name}`,
                });
            }
            // Validate quantity
            if (cartItem.quantity !== item.quantity) {
                return res.status(400).json({
                    message: `Quantity mismatch for ${item.name}. Cart: ${cartItem.quantity}, Provided: ${item.quantity}`,
                });
            }
            // Validate product details
            if (cartItem.product.name !== item.name || cartItem.product.price !== item.price) {
                return res.status(400).json({
                    message: `Product details mismatch for ${item.name}`,
                });
            }
            // Check stock
            if (cartItem.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}. Available: ${cartItem.product.stock}`,
                });
            }
        }

        // Create order
        const order = new Order({
            user: userId,
            items: items.map((item) => ({
                product: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress,
            paymentMethod,
            paymentDetails,
            totals: {
                subtotal,
                shipping,
                tax,
                grandTotal,
            },
            status: 'placed',
        });

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }

        // Clear cart
        await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: err.message || 'Failed to create order' });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch orders for the user, populate product details
        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name price images')
            .sort({ createdAt: -1 }); // Sort by newest first

        // Transform orders to match frontend structure
        const formattedOrders = orders.map((order) => ({
            id: order._id.toString(),
            createdAt: order.createdAt, // Full ISO string
            updatedAt: order.updatedAt, // Full ISO string
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            items: order.items.reduce((sum, item) => sum + item.quantity, 0),
            total: order.totals.grandTotal,
            trackingNumber: order.trackingNumber || null,
            paymentMethod: (() => {
                if (order.paymentMethod === 'card') {
                    return `Card •••• ${order.paymentDetails.cardNumber || 'XXXX'}`;
                } else if (order.paymentMethod === 'easypaisa') {
                    return `Easypaisa •••• ${order.paymentDetails.easypaisaNumber?.slice(-4) || 'XXXX'}`;
                }
                else if (order.paymentMethod === 'paid') {
                    return 'paid';
                }
                else {
                    return 'cod';
                }
            })(),
            shippingAddress: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country} ${order.shippingAddress.zip}`,
            itemsDetails: order.items.map((item) => ({
                id: item._id.toString(),
                product: item.product?._id.toString(),
                name: item.name,
                image: item.product?.images?.[0] || '/products/placeholder.jpg',
                price: item.price,
                quantity: item.quantity,
                status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                returnEligible: ['delivered'].includes(order.status.toLowerCase()) &&
                    (new Date(order.deliveryDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000),
            })),
            // Add timeline dates if available
            processingDate: order.processingDate || null,
            shippedDate: order.shippedDate || null,
            deliveredDate: order.deliveredDate || null,
        }));

        res.status(200).json({ orders: formattedOrders });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch orders' });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        // Validate order ID
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        // Find order
        const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product', 'stock');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order can be cancelled
        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        // Update order status
        order.status = 'cancelled';
        await order.save();

        // Restock products
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: item.quantity },
            });
        }

        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling order:', err);
        res.status(500).json({ message: err.message || 'Failed to cancel order' });
    }
};

