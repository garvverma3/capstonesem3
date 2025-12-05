import apiClient from './apiClient';

export const fetchUsers = async (params = {}) => {
  const response = await apiClient.get('/users', { params });
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await apiClient.patch(`/users/${userId}/role`, { role });
  return response.data;
};

