import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  lastLogin?: Date;
  enquiriesCount?: number;
  savedProductsCount?: number;
  role: 'user' | 'admin';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  avatar: { type: String, required: false },
  password: { type: String, required: false }, // Password optional for Google users
  googleId: { type: String, required: false },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  enquiriesCount: { type: Number, default: 0 },
  savedProductsCount: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
