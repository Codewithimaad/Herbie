
// ... (other imports and setup remain the same)
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Orders.js'; // Fixed typo: Orders.js -> Order.js

// Initialize GA4 client
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}');
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
const propertyId = `properties/${process.env.GA4_PROPERTY_ID}`;

// Controller to fetch most viewed pages, active users, most visited products, and most ordered products
export const getAnalytics = async (req, res) => {
    try {
        // Validate environment variables
        if (!process.env.GA4_PROPERTY_ID) {
            throw new Error('GA4_PROPERTY_ID is not defined in .env');
        }
        if (!credentials.client_email) {
            throw new Error('Invalid GOOGLE_APPLICATION_CREDENTIALS in .env');
        }


        // Fetch Most Viewed Pages
        const [pagesResponse] = await analyticsDataClient.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 10,
        });

        const pages = (pagesResponse.rows || []).map(row => ({
            page: row.dimensionValues[0].value,
            views: parseInt(row.metricValues[0].value, 10),
        }));

        // Fetch Active Users
        const [usersResponse] = await analyticsDataClient.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
        });

        const activeUsers = usersResponse.rows?.[0]?.metricValues?.[0]?.value
            ? parseInt(usersResponse.rows[0].metricValues[0].value, 10)
            : 0;

        // Fetch Product Page Views
        const [productPagesResponse] = await analyticsDataClient.runReport({
            property: propertyId,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            dimensionFilter: {
                filter: {
                    fieldName: 'pagePath',
                    stringFilter: {
                        matchType: 'BEGINS_WITH',
                        value: '/product/'
                    },
                },
            },
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 10,
        });

        let mostVisitedProducts = [];

        if (productPagesResponse.rows?.length > 0) {
            for (const row of productPagesResponse.rows) {
                const pagePath = row.dimensionValues[0].value;
                const views = parseInt(row.metricValues[0].value, 10);

                const match = pagePath.match(/^\/product\/([a-f\d]{24})(?:\/|\?|$)/i);

                if (match && mongoose.isValidObjectId(match[1])) {
                    const productId = match[1];
                    try {
                        const product = await Product.findById(productId).select('name');
                        if (product) {
                            mostVisitedProducts.push({
                                productId,
                                name: product.name,
                                views,
                                page: pagePath
                            });
                        }
                    } catch (dbError) {
                        console.error('DB Error for Product ID:', productId, dbError.message);
                    }
                }
            }
        }


        // Fallback for empty mostVisitedProducts
        if (mostVisitedProducts.length === 0) {
            mostVisitedProducts.push({ message: 'No active product page views found in the last 30 days' });
        }

        // Debug: Check all orders
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const orders = await Order.find({ createdAt: { $gte: thirtyDaysAgo } }).select('createdAt items status');

        // Fetch Most Ordered Products
        let mostOrderedProducts = await Order.aggregate([
            // Filter orders from the last 30 days
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            // Unwind the items array
            { $unwind: '$items' },
            // Group by product and sum quantities
            {
                $group: {
                    _id: '$items.product',
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            // Filter out null product IDs
            { $match: { _id: { $ne: null } } },
            // Sort by total quantity in descending order
            { $sort: { totalQuantity: -1 } },
            // Limit to top 10
            { $limit: 10 },
            // Lookup product details from the Product collection
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            // Unwind productDetails to simplify the structure
            { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
            // Only include active products
            { $match: { 'productDetails': { $exists: true } } },
            // Project the desired fields
            {
                $project: {
                    productId: '$_id',
                    name: '$productDetails.name',
                    totalQuantity: 1,
                    _id: 0
                }
            }
        ]);

        // Fallback for empty mostOrderedProducts
        if (mostOrderedProducts.length === 0) {
            mostOrderedProducts = [{ message: 'No products ordered in the last 30 days' }];
        }

        res.json({ pages, activeUsers, mostVisitedProducts, mostOrderedProducts });
    } catch (error) {
        console.error('Error fetching analytics:', error.message, error.code, error.details);
        res.status(500).json({
            error: 'Failed to fetch analytics data',
            details: error.message,
            code: error.code || 'UNKNOWN',
        });
    }
};