import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  type: 'accessory' | 'main'; // For future flexibility
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['accessory', 'main'], default: 'accessory' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICategory>('Category', CategorySchema);
