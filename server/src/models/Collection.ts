import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  modelNumber?: string;
  color?: string; // or finish
  description: string;
  image: string; // main photo
  images?: string[]; // gallery
  category?: string;
  finish?: string;
  material?: string;
  dimensions?: string;
  status: 'Active' | 'Inactive';
  featured: boolean;
  relatedProducts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema({
  name: { type: String, required: true },
  modelNumber: { type: String },
  color: { type: String },
  description: { type: String, required: true },
  image: { type: String, required: true }, // URL or path
  images: [{ type: String }],
  category: { type: String },
  finish: { type: String },
  material: { type: String },
  dimensions: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  featured: { type: Boolean, default: false },
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

export default mongoose.model<ICollection>('Collection', CollectionSchema);
