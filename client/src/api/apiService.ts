/// <reference types="vite/client" />
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '';
export const BASE_URL = API_URL.replace('/api', '');

export const getFullImageUrl = (path: string) => {
  if (!path) return '/placeholder-product.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${BASE_URL}${path}`;
  if (path.startsWith('uploads')) return `${BASE_URL}/${path}`;
  return path;
};

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user') || 'null')?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data: any) => api.post('/api/auth/login', data),
  signup: (data: any) => api.post('/api/auth/signup', data),
  forgotPassword: (data: any) => api.post('/api/auth/forgot-password', data),
  resetPassword: (data: any) => api.post('/api/auth/reset-password', data),
  verifyOtp: (data: any) => api.post('/api/auth/verify-otp', data),
  googleLogin: (data: any) => api.post('/api/auth/google', data),
};

export const userService = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data: any) => api.put('/api/user/profile', data),
  changePassword: (data: any) => api.put('/api/user/change-password', data),
  uploadAvatar: (formData: FormData) => api.post('/api/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllUsers: () => api.get('/api/user/all'),
  deleteUser: (id: string) => api.delete(`/api/user/${id}`),
};

export const productService = {
  getAll: (params?: any) => api.get('/api/products', { params }),
  getFeatured: () => api.get('/api/products/featured'),
  getById: (id: string) => api.get(`/api/products/${id}`),
  getBySku: (sku: string) => api.get(`/api/products/sku/${sku}`),
  create: (data: any) => api.post('/api/products', data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  update: (id: string, data: any) => api.put(`/api/products/${id}`, data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  delete: (id: string) => api.delete(`/api/products/${id}`),
};

export const enquiryService = {
  create: (data: any) => api.post('/api/enquiry', data),
  getAll: () => api.get('/api/enquiry'),
  getUserEnquiries: () => api.get('/api/enquiry/my'),
};

export const adminService = {
  getStats: () => api.get('/api/admin/stats'),
};

export const collectionService = {
  getAll: (params?: any) => api.get('/api/collections', { params }),
  getById: (id: string) => api.get(`/api/collections/${id}`),
  create: (data: any) => api.post('/api/collections', data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  update: (id: string, data: any) => api.put(`/api/collections/${id}`, data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  delete: (id: string) => api.delete(`/api/collections/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/api/categories'),
  create: (name: string) => api.post('/api/categories', { name }),
  delete: (id: string) => api.delete(`/api/categories/${id}`),
};

export const notificationService = {
  getAll: () => api.get('/api/notifications'),
  markAsRead: (id: string) => api.patch(`/api/notifications/mark-read/${id}`),
  markAllAsRead: () => api.patch('/api/notifications/mark-all-read'),
  delete: (id: string) => api.delete(`/api/notifications/${id}`),
  clearAll: () => api.delete('/api/notifications/clear-all'),
};

export default api;
