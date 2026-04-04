import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = axios.create(); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Auto-login if token exists on page refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin || false);
    }
    setAuthLoading(false);
  }, []);

  const register = async (formData) => {
    const { data } = await API.post('/api/auth/register', formData);
    setUser(data.user);
    setToken(data.token);
    setIsAdmin(data.user.isAdmin || false);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // 👈 persist user
  };

  const login = async (formData) => {
    const { data } = await API.post('/api/auth/login', formData);
    setUser(data.user);
    setToken(data.token);
    setIsAdmin(data.user.isAdmin || false);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // 👈 persist user
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, authLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);