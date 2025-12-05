import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import apiClient, { configureApiClient } from '../services/apiClient';
import {
  getStoredTokens,
  persistTokens,
  clearTokens,
  getStoredUser,
  persistUser,
  clearUser,
} from '../services/tokenService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [tokens, setTokens] = useState(() => getStoredTokens());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setAuthPayload = useCallback((payload) => {
    if (!payload) return;
    setUser(payload.user);
    persistUser(payload.user);
    setTokens(payload.tokens);
    persistTokens(payload.tokens);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    clearTokens();
    clearUser();
    apiClient.post('/auth/logout').catch(() => {});
  }, []);

  const refreshTokens = useCallback(async () => {
    if (!tokens?.refreshToken) {
      throw new Error('Missing refresh token');
    }
    const response = await apiClient.post('/auth/refresh', {
      refreshToken: tokens.refreshToken,
    });
    setAuthPayload(response.data.data);
    return response.data.data.tokens.accessToken;
  }, [tokens, setAuthPayload]);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/auth/login', credentials);
        setAuthPayload(response.data.data);
      } catch (err) {
        let errorMessage = 'Login failed';
        
        if (err.response) {
          errorMessage = err.response.data?.message || errorMessage;
          
          // Handle rate limiting
          if (err.response.status === 429) {
            errorMessage = 'Too many login attempts. Please try again in a few minutes.';
          }
        } else if (err.request) {
          // Network error - server might not be running
          const isProduction = process.env.NODE_ENV === 'production' || 
                               (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));
          
          if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
            errorMessage = isProduction
              ? 'Cannot connect to server. Please check Vercel function logs and ensure environment variables are configured correctly.'
              : 'Cannot connect to server. Please ensure the backend server is running on http://localhost:5001';
          } else {
            errorMessage = isProduction 
              ? 'Network error. Please check your connection and Vercel deployment status.'
              : 'Network error. Please check your connection and ensure the backend server is running.';
          }
        }
        
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setAuthPayload],
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/auth/register', payload);
        setAuthPayload(response.data.data);
      } catch (err) {
        let errorMessage = 'Signup failed';
        
        if (err.response) {
          // Handle validation errors
          if (err.response.data?.errors && Array.isArray(err.response.data.errors)) {
            const validationErrors = err.response.data.errors
              .map((e) => `${e.path?.join('.')}: ${e.message}`)
              .join(', ');
            errorMessage = validationErrors || err.response.data?.message || errorMessage;
          } else {
            errorMessage = err.response.data?.message || errorMessage;
          }
          
          // Handle rate limiting
          if (err.response.status === 429) {
            errorMessage = 'Too many signup attempts. Please try again in a few minutes.';
          }
        } else if (err.request) {
          // Network error - server might not be running
          const isProduction = process.env.NODE_ENV === 'production' || 
                               (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));
          
          if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
            errorMessage = isProduction
              ? 'Cannot connect to server. Please check Vercel function logs and ensure environment variables are configured correctly.'
              : 'Cannot connect to server. Please ensure the backend server is running on http://localhost:5001';
          } else {
            errorMessage = isProduction 
              ? 'Network error. Please check your connection and Vercel deployment status.'
              : 'Network error. Please check your connection and ensure the backend server is running.';
          }
        }
        
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setAuthPayload],
  );

  useEffect(() => {
    configureApiClient({
      getAccessTokenFn: () => tokens?.accessToken,
      refreshTokensFn: refreshTokens,
      handleLogoutFn: logout,
    });
  }, [tokens?.accessToken, refreshTokens, logout]);

  const value = useMemo(
    () => ({
      user,
      tokens,
      isAuthenticated: Boolean(user && tokens?.accessToken),
      login,
      register,
      logout,
      loading,
      error,
    }),
    [user, tokens, login, register, logout, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

