import type { Product } from '../data/products';

export type ProductEnquiryPayload = {
  product: Product;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

// API-ready wrapper. Currently mocked with a small delay.
export async function sendProductEnquiry(payload: ProductEnquiryPayload): Promise<void> {
  // TODO: Replace with real API call, for example:
  // await api.post('/enquiries', payload);
  console.debug('Sending product enquiry (mock):', payload);
  await new Promise((resolve) => setTimeout(resolve, 600));
}

