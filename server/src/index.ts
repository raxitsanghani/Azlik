import dotenv from 'dotenv';
import path from 'path';

// Load environment variables immediately
dotenv.config({ path: path.join(__dirname, '../../.env') });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from './config/passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import adminRoutes from './routes/adminRoutes';
import collectionRoutes from './routes/collectionRoutes';
import categoryRoutes from './routes/categoryRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();

// Middleware - Simplified CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// In Express 5, use a regex for wildcard matching to avoid PathErrors
app.options(/.*/, cors()); 

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Session configuration for Passport
app.use(session({
  name: 'azlik_session_id', // Custom name to avoid conflicts
  secret: process.env.SESSION_SECRET || 'azlik_premium_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Needed for cross-domain in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  proxy: true // Trust reverse proxy (needed for platforms like Vercel/Heroku)
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the root uploads directory
// __dirname is server/src, so ../../uploads is root/uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    path: req.path
  });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || '';
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => {
      console.error('MongoDB Connection Error:', err);
    });
}

// Export for Vercel
export default app;

// Listen for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
