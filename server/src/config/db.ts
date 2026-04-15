import mongoose from 'mongoose';

let cached: Promise<typeof mongoose> | null = null;

export const connectDB = () => {
  if (cached) return cached;
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set');
    return Promise.resolve(mongoose);
  }
  cached = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then((m) => {
      console.log('MongoDB connected');
      return m;
    })
    .catch((err) => {
      cached = null;
      console.error('MongoDB connection error:', err);
      throw err;
    });
  return cached;
};
