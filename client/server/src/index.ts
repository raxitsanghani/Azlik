import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import adminRoutes from './routes/adminRoutes';

import session from 'express-session';
import passport from './config/passport';

import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });
console.log('Environment loaded from root .env');
console.log('PORT:', process.env.PORT);

const app = express();
console.log('Attempting to start server...');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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
