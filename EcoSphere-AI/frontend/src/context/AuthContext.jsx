import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Configure axios default auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Fetch freshest user profile to verify token integrity
          const data = await authService.getProfile();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          if (import.meta.env.DEV) {
            // Keep session active during development if backend is offline
            console.warn('Development Mode: Backend offline. Bypassing session verification.');
          } else {
            // Token is likely invalid or expired
            handleLogout();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Set up an interceptor to log out users automatically on 401 Unauthorized
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      let data;
      try {
        data = await authService.login(email, password);
      } catch (error) {
        if (import.meta.env.DEV) {
          // Dev fallback: Simulate login success when backend is unavailable
          console.warn('Development Mode: Backend login failed. Using mock credentials.');
          const formattedName = email.split('@')[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Eco Warrior';
          data = {
            success: true,
            token: 'mock-dev-jwt-token',
            user: {
              _id: 'mock-dev-user-id',
              name: formattedName,
              email: email,
              role: 'Employee',
              department: 'Operations & Supply Chain',
            }
          };
        } else {
          throw error;
        }
      }

      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name, email, password, department) => {
    setIsLoading(true);
    try {
      let data;
      try {
        data = await authService.register(name, email, password, department);
      } catch (error) {
        if (import.meta.env.DEV) {
          // Dev fallback: Simulate registration success when backend is unavailable
          console.warn('Development Mode: Backend registration failed. Using mock credentials.');
          data = {
            success: true,
            token: 'mock-dev-jwt-token',
            user: {
              _id: 'mock-dev-user-id',
              name,
              email,
              role: 'Employee',
              department: department || 'Operations & Supply Chain',
            }
          };
        } else {
          throw error;
        }
      }

      if (data.success && data.token) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        return data;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
