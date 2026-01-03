import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Home
export const getHomeData = () => api.get('/home');

// Categories
export const getCategories = () => api.get('/categories');
export const getCategoryBySlug = (slug: string) => api.get(`/categories/${slug}`);

// Subcategories
export const getSubcategoryBySlug = (slug: string) => api.get(`/subcategories/${slug}`);

// Items
export const getItems = (params?: any) => api.get('/items', { params });
export const getItemBySlug = (slug: string) => api.get(`/items/${slug}`);
export const searchItems = (q: string) => api.get(`/items/search`, { params: { q } });
export const getDealItems = () => api.get('/items/deals');

// Shops
export const getShops = () => api.get('/shops');
export const getShopBySlug = (slug: string) => api.get(`/shops/${slug}`);

// Orders
export const createOrder = (data: any) => api.post('/orders', data);
export const trackOrder = (phone: string, orderNumber: string) =>
  api.get(`/orders/track`, { params: { phone, orderNumber } });
export const submitFeedback = (orderId: string, data: any) =>
  api.post(`/orders/${orderId}/feedback`, data);

// Config
export const getPublicConfig = () => api.get('/config/public');
