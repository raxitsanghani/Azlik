import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string; // SKU or slug
  name: string;
  image: string;
  images: string[];
  description: string;
  category: string;
  material: string;
  finish: string;
  dimensions: string;
  featured: boolean;
  status: 'Active' | 'Inactive';
  sku?: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true
  },
  material: { type: String, required: true },
  finish: { type: String, required: true },
  dimensions: { type: String, required: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  sku: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema);
