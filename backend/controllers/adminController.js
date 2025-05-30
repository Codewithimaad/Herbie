import Order from '../models/Orders.js';
import Product from '../models/Product.js'

// Get all orders without pagination or filters
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

// Get a single order by MongoDB
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name price images');

        if (!order) {
            console.error('Order not found:', req.params.id); // Debug
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Fetched Order:', order); // Debug

        // Transform the order for consistent frontend format
        const formattedOrder = {
            id: order._id.toString(),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            status: order.status,
            isDelivered: order.isDelivered ?? false, // Add isDelivered
            isPaid: order.isPaid ?? false, // Add isDelivered
            deliveryStatus: order.deliveryStatus ?? 'In Transit', // Add deliveryStatus
            trackingNumber: order.trackingNumber || null,
            paymentMethod: order.paymentMethod,
            paymentDetails: order.paymentDetails,
            totals: order.totals,
            shippingAddress: order.shippingAddress,
            items: order.items
                ? order.items.map((item) => ({
                    id: item._id.toString(),
                    product: item.product?._id?.toString() || null,
                    name: item.product?.name || item.name,
                    image: item.product?.images?.[0] || '/products/placeholder.jpg',
                    price: item.price,
                    quantity: item.quantity,
                    status: order.status,
                }))
                : [], // Fallback to empty array if items is undefined
            statusHistory: order.statusHistory || [],
        };

        res.status(200).json(formattedOrder);
    } catch (err) {
        console.error('Error fetching order:', err.message, err.stack);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};


// Update order payment method (e.g., mark as paid)
export const updateOrderPaymentMethod = async (req, res) => {
    try {
        const { isPaid } = req.body;

        // Validate input
        if (typeof isPaid !== 'boolean') {
            return res.status(400).json({
                message: 'Invalid input: isPaid must be boolean (true/false)'
            });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only update if status is changing
        if (order.isPaid !== isPaid) {
            order.isPaid = isPaid;

            // Update payment details
            order.paymentDetails = {
                ...order.paymentDetails,
                [isPaid ? 'paidAt' : 'unpaidAt']: new Date()
            };


        }

        const updatedOrder = await order.save();

        res.status(200).json({
            message: `Order payment status updated to ${isPaid ? 'PAID' : 'UNPAID'}`,
            order: {
                id: updatedOrder._id,
                isPaid: updatedOrder.isPaid,
                updatedAt: updatedOrder.updatedAt,
                paymentStatus: isPaid ? 'Confirmed' : 'Pending'
            }
        });

    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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





// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardMetrics = async (req, res) => {
    try {
        // Get total products count
        const totalProducts = await Product.countDocuments();

        // Get total orders count
        const totalOrders = await Order.countDocuments();

        // Get pending orders count
        const pendingOrders = await Order.countDocuments({ isDelivered: false });
        const deliveredOrders = await Order.countDocuments({ isDelivered: true });


        res.json({
            totalProducts,
            totalOrders,
            pendingOrders,
            deliveredOrders
        });

    } catch (error) {
        console.error('Error getting dashboard metrics:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get recent orders
// @route   GET /api/admin/orders/recent
// @access  Private/Admin
export const getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .lean();

        const formattedOrders = orders.map(order => ({
            id: order._id,
            date: order.createdAt.toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            total: order.totals.grandTotal,
            status: order.isDelivered ? 'Delivered' : 'Pending',
            shippingAddress: {
                name: order.shippingAddress.name,
                email: order.shippingAddress.email,
                phone: order.shippingAddress.phone,
                address: order.shippingAddress.address,
                city: order.shippingAddress.city,
                country: order.shippingAddress.country,
                zip: order.shippingAddress.zip
            }
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error getting recent orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get sales data for chart
// @route   GET /api/admin/sales-data
// @access  Private/Admin
export const getSalesData = async (req, res) => {
    try {
        // Explicitly define date range
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const salesData = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                    createdAt: {
                        $gte: thirtyDaysAgo,
                        $lte: new Date() // Add upper bound
                    }
                }
            },
            {
                $addFields: {
                    // Ensure createdAt is a Date object
                    createdAtDate: {
                        $cond: {
                            if: { $eq: [{ $type: "$createdAt" }, "string"] },
                            then: { $toDate: "$createdAt" },
                            else: "$createdAt"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAtDate" // Use the normalized field
                        }
                    },
                    totalSales: { $sum: "$totals.grandTotal" }, // Changed from totalPrice
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log('Raw sales data:', salesData); // Debug output

        res.json(salesData);
    } catch (error) {
        console.error('Error getting sales data:', error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


export const updateOrderDeliveryStatus = async (req, res) => {
    try {
        const { isDelivered } = req.body;

        // Validate input
        if (typeof isDelivered !== 'boolean') {
            return res.status(400).json({ message: 'Invalid input: isDelivered must be boolean' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update both fields
        order.isDelivered = isDelivered;
        order.deliveryStatus = isDelivered ? 'Delivered' : 'In Transit';
        const updatedOrder = await order.save();
        console.log('Updated Order:', updatedOrder); // Debug

        res.status(200).json({
            message: `Order delivery status updated to ${isDelivered ? 'DELIVERED' : 'NOT DELIVERED'} `,
            order: {
                id: updatedOrder._id,
                isDelivered: updatedOrder.isDelivered,
                deliveryStatus: updatedOrder.deliveryStatus,
                updatedAt: updatedOrder.updatedAt,
            },
        });
    } catch (err) {
        console.error('Error updating delivery status:', err);
        res.status(500).json({
            message: 'Server error',
            error: err.message,
        });
    }
};

