import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  // "booting" = we're still checking if a stored token is valid, on first load.
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const { data } = await api.get('/me');
        setUser(data.user);
      } catch (err) {
        // Token expired/invalid — interceptor already cleared it.
        setToken(null);
        setUser(null);
      } finally {
        setBooting(false);
      }
    }
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSession = (newToken, newUser) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    persistSession(data.token, data.user);
    return data.user;
  }, []);

  // registerData is a FormData instance (name, email, password, password_confirmation, image?)
  const register = useCallback(async (registerData) => {
    const { data } = await api.post('/register', registerData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    persistSession(data.token, data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      // Even if the request fails (e.g. token already gone), clear locally.
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    booting,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
