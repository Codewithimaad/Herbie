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
import { notFound, errorHandler } from './middlewares/errorMiddlewares.js';

// Load environment variables FIRST
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

// Initialize Express
const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONT_END_URL || 'http://localhost:3000', // Fallback for local dev
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

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`🌍 CORS-enabled for: ${process.env.FRONT_END_URL || 'http://localhost:3000'}\n`);
});


// Export for Vercel
export default app;