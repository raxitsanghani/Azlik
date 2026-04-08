import type { Product } from '../data/products';
import { enquiryService } from '../api/apiService';

export type ProductEnquiryPayload = {
  product: Product;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

export async function sendProductEnquiry(payload: ProductEnquiryPayload): Promise<void> {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  await enquiryService.create({
    productId: payload.product.id || (payload.product as any)._id,
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    city: payload.city,
    message: payload.message,
    userId: user?.id || user?._id
  });
}
