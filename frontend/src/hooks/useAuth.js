import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Адреса вашого API
const API_URL = 'http://localhost:5500/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[useAuth useEffect] Token:', token);
    const fetchUser = async () => {
      setIsLoading(true);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
        console.log('[useAuth fetchUser] Attempting to fetch user data...');
        try {
          const response = await axios.get(`${API_URL}/me`);
          setUser(response.data.user);
          console.log('[useAuth fetchUser] User data fetched successfully:', response.data.user);
        } catch (error) {
          console.error('[useAuth fetchUser] Failed to fetch user on refresh:', error.response?.data?.message || error.message);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('[useAuth useEffect] No token found, clearing authorization headers and local storage.');
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        setUser(null);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    navigate('/'); // Перенаправлення після успішного входу на головну сторінку
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    // Після реєстрації можна одразу логінити користувача або перенаправити на сторінку входу
    navigate('/login');
    return response.data;
  };

  const updateUser = async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData);
      setUser(response.data.user); // Update user in context
      return response.data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = { user, token, login, register, logout, updateUser, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для легкого доступу до контексту
export const useAuth = () => {
  return useContext(AuthContext);
};