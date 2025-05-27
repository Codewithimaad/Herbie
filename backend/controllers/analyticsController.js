
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();


// Recreate __dirname in ES module scope:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Initialize GA client with service account
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: path.join(__dirname, '../config/herbie-analytics.json'),
});

const propertyId = process.env.GA4_PROPERTY_ID; // Replace with your GA4 Measurement ID (no "G-", just the numeric property ID)

if (!propertyId) {
    console.error('GA4_PROPERTY_ID is not defined in the environment variables.')
    throw new Error('GA4_PROPERTY_ID is not defined in the environment variables.');
}

export const getMostViewedPages = async (req, res) => {
    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 10,
        });

        const pages = response.rows.map(row => ({
            path: row.dimensionValues[0].value,
            views: row.metricValues[0].value,
        }));
        console.log('Pages:', pages);

        res.status(200).json(pages);
    } catch (error) {
        console.error('GA4 Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch GA data' });
    }
};


export const getActiveUsers = async (req, res) => {
    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
        });

        const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value || '0';
        console.log('active users', activeUsers);


        res.status(200).json({ activeUsers });
    } catch (error) {
        console.error('GA4 Error (active users):', error.message);
        res.status(500).json({ error: 'Failed to fetch active user data' });
    }
};
