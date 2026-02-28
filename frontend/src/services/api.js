import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.response?.data?.message || 'Something went wrong';
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    toast.error(message);
    return Promise.reject(err);
  }
);

export const dishAPI = {
  getAll: (params) => api.get('/dishes', { params }),
  getById: (id) => api.get(`/dishes/${id}`),
  getCategories: () => api.get('/dishes/categories'),
  create: (data) => api.post('/dishes', data),
  update: (id, data) => api.put(`/dishes/${id}`, data),
  delete: (id) => api.delete(`/dishes/${id}`),
};

export const orderAPI = {
  getMyOrders: () => api.get('/orders'),
  createOrder: (data) => api.post('/orders', data),
};

export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payment/create', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
};

export const adminAPI = {
  getAllOrders: () => api.get('/admin/orders'),
  getAllUsers: () => api.get('/admin/users'),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export default api;