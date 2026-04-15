/// <reference types="vite/client" />
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2112/api';

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
  login: (data: any) => api.post('/auth/login', data),
  signup: (data: any) => api.post('/auth/signup', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  verifyOtp: (data: any) => api.post('/auth/verify-otp', data),
  googleLogin: (data: any) => api.post('/auth/google', data),
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  changePassword: (data: any) => api.put('/user/change-password', data),
  uploadAvatar: (formData: FormData) => api.post('/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllUsers: () => api.get('/user/all'),
  deleteUser: (id: string) => api.delete(`/user/${id}`),
};

export const productService = {
  getAll: (params?: any) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getById: (id: string) => api.get(`/products/${id}`),
  getBySku: (sku: string) => api.get(`/products/sku/${sku}`),
  create: (data: any) => api.post('/products', data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  update: (id: string, data: any) => api.put(`/products/${id}`, data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const enquiryService = {
  create: (data: any) => api.post('/enquiry', data),
  getAll: () => api.get('/enquiry'),
  getUserEnquiries: () => api.get('/enquiry/my'),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
