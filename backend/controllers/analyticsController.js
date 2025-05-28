
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Initialize GA4 client
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}');
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
const propertyId = `properties/${process.env.GA4_PROPERTY_ID} `; // Use .env variable



// Controller to fetch most viewed pages, active users, and most visited product
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
                        value: '/product/' // ✅ FIXED: matches the real route
                    },
                },
            },
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 1,
        });

        let mostVisitedProducts = [];

        if (productPagesResponse.rows?.length > 0) {
            for (const row of productPagesResponse.rows) {
                const pagePath = row.dimensionValues[0].value; // e.g., /product/123
                const views = parseInt(row.metricValues[0].value, 10);

                const match = pagePath.match(/^\/product\/([a-f\d]{24})/i); // matches /product/:id

                if (match && mongoose.isValidObjectId(match[1])) {
                    const productId = match[1];
                    const product = await Product.findById(productId).select('name');

                    if (product) {
                        mostVisitedProducts.push({
                            productId,
                            name: product.name,
                            views,
                            page: pagePath,
                        });
                    }
                }
            }
        }


        res.json({ pages, activeUsers, mostVisitedProducts });
    } catch (error) {
        console.error('Error fetching analytics:', error.message, error.code, error.details);
        res.status(500).json({
            error: 'Failed to fetch analytics data',
            details: error.message,
            code: error.code || 'UNKNOWN',
        });
    }
};










