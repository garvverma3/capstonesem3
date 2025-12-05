import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: false,
});

let getAccessToken;
let refreshTokens;
let handleLogout;

export const configureApiClient = ({
  getAccessTokenFn,
  refreshTokensFn,
  handleLogoutFn,
}) => {
  getAccessToken = getAccessTokenFn;
  refreshTokens = refreshTokensFn;
  handleLogout = handleLogoutFn;
};

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken?.();
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshTokens
    ) {
      originalRequest._retry = true;
      try {
        await refreshTokens();
        return apiClient(originalRequest);
      } catch (refreshError) {
        handleLogout?.();
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;


