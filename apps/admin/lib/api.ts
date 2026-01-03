import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const adminLogin = (email: string, password: string) =>
  api.post('/auth/admin/login', { email, password });

// Categories
export const getCategories = () => api.get('/admin/categories');
export const createCategory = (data: any) => api.post('/admin/categories', data);
export const updateCategory = (id: string, data: any) => api.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/admin/categories/${id}`);

// Subcategories
export const createSubcategory = (data: any) => api.post('/admin/subcategories', data);
export const updateSubcategory = (id: string, data: any) => api.put(`/admin/subcategories/${id}`, data);
export const deleteSubcategory = (id: string) => api.delete(`/admin/subcategories/${id}`);

// Items
export const getItems = (params?: any) => api.get('/admin/items', { params });
export const createItem = (data: any) => api.post('/admin/items', data);
export const updateItem = (id: string, data: any) => api.put(`/admin/items/${id}`, data);
export const deleteItem = (id: string) => api.delete(`/admin/items/${id}`);

// Orders
export const getOrders = (params?: any) => api.get('/admin/orders', { params });
export const getOrder = (id: string) => api.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id: string, status: string) =>
  api.put(`/admin/orders/${id}/status`, { status });
export const assignRider = (orderId: string, riderId: string) =>
  api.put(`/admin/orders/${orderId}/assign-rider`, { riderId });
export const getOrderStats = () => api.get('/admin/orders/stats');

// Shops
export const getShops = () => api.get('/admin/shops');
export const createShop = (data: any) => api.post('/admin/shops', data);
export const updateShop = (id: string, data: any) => api.put(`/admin/shops/${id}`, data);
export const deleteShop = (id: string) => api.delete(`/admin/shops/${id}`);
export const addItemToShop = (shopId: string, itemId: string, shopPrice?: number) =>
  api.post(`/admin/shops/${shopId}/items`, { itemId, shopPrice });
export const removeItemFromShop = (shopId: string, itemId: string) =>
  api.delete(`/admin/shops/${shopId}/items/${itemId}`);

// Riders
export const getRiders = () => api.get('/admin/riders');
export const createRider = (data: any) => api.post('/admin/riders', data);
export const updateRider = (id: string, data: any) => api.put(`/admin/riders/${id}`, data);
export const toggleRider = (id: string) => api.put(`/admin/riders/${id}/toggle`);

// Promotions
export const getPromotions = () => api.get('/admin/promotions');
export const createPromotion = (data: any) => api.post('/admin/promotions', data);
export const updatePromotion = (id: string, data: any) => api.put(`/admin/promotions/${id}`, data);
export const deletePromotion = (id: string) => api.delete(`/admin/promotions/${id}`);

// Banners
export const getBanners = () => api.get('/admin/banners');
export const createBanner = (data: any) => api.post('/admin/banners', data);
export const updateBanner = (id: string, data: any) => api.put(`/admin/banners/${id}`, data);
export const deleteBanner = (id: string) => api.delete(`/admin/banners/${id}`);

// Home Sections
export const getHomeSections = () => api.get('/admin/home-sections');
export const updateHomeSection = (id: string, data: any) =>
  api.put(`/admin/home-sections/${id}`, data);

// Config
export const getConfig = () => api.get('/admin/config');
export const updateConfig = (key: string, value: any, description?: string) =>
  api.put(`/admin/config/${key}`, { value, description });

// Upload
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
