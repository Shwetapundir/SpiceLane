import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Menu
export const getMenuItems = () => API.get('/api/admin/menu');
export const addMenuItem = (data) => API.post('/api/admin/menu', data);
export const updateMenuItem = (id, data) => API.put(`/api/admin/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/api/admin/menu/${id}`);

// Orders
export const getAllOrders = () => API.get('/api/admin/orders');
export const updateOrderStatus = (id, status) => API.put(`/api/admin/orders/${id}`, { status });

// Users
export const getAllUsers = () => API.get('/api/admin/users');
export const deleteUser = (id) => API.delete(`/api/admin/users/${id}`);