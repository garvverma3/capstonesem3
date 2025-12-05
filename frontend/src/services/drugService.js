import apiClient from './apiClient';

export const fetchDrugs = async (params = {}) => {
  const response = await apiClient.get('/drugs', { params });
  return response.data;
};

export const createDrug = async (payload) => {
  const response = await apiClient.post('/drugs', payload);
  return response.data;
};

export const updateDrug = async (id, payload) => {
  const response = await apiClient.put(`/drugs/${id}`, payload);
  return response.data;
};

export const deleteDrug = async (id) => {
  await apiClient.delete(`/drugs/${id}`);
};

