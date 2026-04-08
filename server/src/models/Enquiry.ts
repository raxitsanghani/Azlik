import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  product: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  status: 'New' | 'Pending' | 'Followed-up' | 'Closed';
  createdAt: Date;
}

const EnquirySchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Pending', 'Followed-up', 'Closed'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
