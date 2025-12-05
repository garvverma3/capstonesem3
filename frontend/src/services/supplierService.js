import apiClient from './apiClient';

export const fetchSuppliers = async (params = {}) => {
  const response = await apiClient.get('/suppliers', { params });
  return response.data;
};

export const createSupplier = async (payload) => {
  const response = await apiClient.post('/suppliers', payload);
  return response.data;
};

export const updateSupplier = async (id, payload) => {
  const response = await apiClient.put(`/suppliers/${id}`, payload);
  return response.data;
};

export const deleteSupplier = async (id) => {
  await apiClient.delete(`/suppliers/${id}`);
};

