import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

import connectDB from './config/connectDB.js';
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import adminLoginRoutes from './routes/adminLoginRoutes.js'
import faQsRoutes from './routes/faQsRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import contactRoutes from './routes/contactRoute.js'
import { notFound, errorHandler } from './middlewares/errorMiddlewares.js';

// Load environment variables FIRST
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

// Initialize Express
const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors({
    origin: [process.env.FRONT_END_URL, process.env.ADMIN_URL], // Pass as array
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.PASSPORT_SECRET || 'dev-secret', // Fallback for development
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/admins', adminLoginRoutes);
app.use('/api/faqs', faQsRoutes)
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);




app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`🌍 CORS-enabled for: ${process.env.FRONT_END_URL || 'http://localhost:3000'}\n`);
});


// Export for Vercel
export default app;