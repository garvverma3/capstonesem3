import axios from 'axios';

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // If explicitly set, use that
  if (process.env.REACT_APP_API_URL) {
    console.log('[API Client] Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Check hostname to determine if we're on Vercel or production
  let hostname = '';
  if (typeof window !== 'undefined' && window.location) {
    hostname = window.location.hostname;
  }
  
  // Force /api for Vercel deployments (most reliable check)
  if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
    console.log('[API Client] Vercel detected, using /api');
    return '/api';
  }
  
  // Check if we're in production build
  const isProduction = process.env.NODE_ENV === 'production';
  
  // If production and not localhost, use /api
  if (isProduction && hostname && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    console.log('[API Client] Production mode detected, using /api');
    return '/api';
  }
  
  // Development fallback
  console.log('[API Client] Development mode, using localhost:5001/api');
  console.log('[API Client] Hostname:', hostname);
  console.log('[API Client] NODE_ENV:', process.env.NODE_ENV);
  return 'http://localhost:5001/api';
};

const apiUrl = getApiUrl();
console.log('[API Client] Base URL:', apiUrl);

const apiClient = axios.create({
  baseURL: apiUrl,
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


