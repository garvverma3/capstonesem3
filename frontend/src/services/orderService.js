import apiClient from './apiClient';

export const fetchOrders = async (params = {}) => {
  const response = await apiClient.get('/orders', { params });
  return response.data;
};

export const createOrder = async (payload) => {
  const response = await apiClient.post('/orders', payload);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.patch(`/orders/${id}/status`, { status });
  return response.data;
};

export const deleteOrder = async (id) => {
  await apiClient.delete(`/orders/${id}`);
};

