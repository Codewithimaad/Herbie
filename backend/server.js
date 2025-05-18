import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

import connectDB from './config/connectDB.js';
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import { notFound, errorHandler } from './middlewares/errorMiddlewares.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Passport session
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
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

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
