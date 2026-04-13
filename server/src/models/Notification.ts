import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: [
      'user_signup', 
      'enquiry_new', 
      'product_request', 
      'collection_added', 
      'product_added', 
      'upload_status', 
      'system_error', 
      'admin_alert'
    ],
    default: 'admin_alert'
  },
  isRead: { type: Boolean, default: false },
  metadata: { type: Object }, // Optional: link to IDs like productId, userId etc.
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', NotificationSchema);
