import Order from '../models/Orders.js';

// Get all orders without pagination or filters
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

// Get a single order by MongoDB _id
// Get a single order by MongoDB _id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name price images');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Transform the order for consistent frontend format
        const formattedOrder = {
            id: order._id.toString(),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            status: order.status,
            trackingNumber: order.trackingNumber || null,
            paymentMethod: order.paymentMethod,
            paymentDetails: order.paymentDetails,
            totals: order.totals,
            shippingAddress: order.shippingAddress,
            items: order.items ? order.items.map((item) => ({
                id: item._id.toString(),
                product: item.product?._id?.toString() || null,
                name: item.product?.name || item.name,
                image: item.product?.images?.[0] || '/products/placeholder.jpg',
                price: item.price,
                quantity: item.quantity,
                status: order.status,
            })) : [], // Fallback to empty array if items is undefined
            statusHistory: order.statusHistory || [],

        };

        res.status(200).json(formattedOrder);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};


// Update order payment method (e.g., mark as paid)
export const updateOrderPaymentMethod = async (req, res) => {
    try {
        const { paymentMethod } = req.body;

        // Optionally: validate payment method
        const validMethods = ['cod', 'paid', 'easypaisa', 'card'];
        if (paymentMethod && !validMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update payment method
        if (paymentMethod && order.paymentMethod !== paymentMethod) {
            order.paymentMethod = paymentMethod;

            // Optionally: store timestamp for when payment was marked
            order.paymentDetails = {
                ...order.paymentDetails,
                paidAt: new Date(),
            };
        }

        await order.save();
        res.status(200).json(order);
    } catch (err) {
        console.error('Error updating payment method:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};




// Update an order by MongoDB _id
export const updateOrder = async (req, res) => {
    try {
        const { status, trackingNumber, adminNotes, shippingAddress } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Validate status
        if (status && !['placed', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // If status has changed, update it and push to statusHistory
        if (status && status !== order.status) {
            order.status = status;
            order.statusHistory = order.statusHistory || [];
            order.statusHistory.push({ status, timestamp: new Date() });
        }

        if (trackingNumber !== undefined) {
            order.trackingNumber = trackingNumber;
        }

        if (shippingAddress) {
            order.shippingAddress = {
                ...order.shippingAddress,
                ...shippingAddress,
            };
        }

        await order.save();
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};


// Delete an order (hard delete from DB)
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};
