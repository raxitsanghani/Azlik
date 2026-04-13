import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import adminRoutes from './routes/adminRoutes';
import collectionRoutes from './routes/collectionRoutes';
import categoryRoutes from './routes/categoryRoutes';

import session from 'express-session';
import passport from './config/passport';

import path from 'path';

// Load environment variables safely
dotenv.config(); // Simple load for standard environments
try {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
} catch (e) {
  // Ignore error if root .env is missing (e.g. on Vercel)
}

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins during initial deployment help
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use(session({
  secret: process.env.JWT_SECRET || 'premium_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/categories', categoryRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URI.substring(0, 30)}...`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

export default app;
