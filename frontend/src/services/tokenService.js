const STORAGE_KEY = 'pharmacy_tokens';
const USER_KEY = 'pharmacy_user';

export const getStoredTokens = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const persistTokens = (tokens) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getStoredUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const persistUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

