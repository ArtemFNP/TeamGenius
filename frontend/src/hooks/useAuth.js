import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Адреса вашого API
const API_URL = 'http://localhost:5500/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    // Якщо токен є, зберігаємо його для всіх запитів axios
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // Тут можна додати логіку для отримання даних користувача за токеном
      // наприклад, при перезавантаженні сторінки
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    navigate('/dashboard'); // Перенаправлення після успішного входу
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    // Після реєстрації можна одразу логінити користувача або перенаправити на сторінку входу
    navigate('/login');
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const value = { user, token, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для легкого доступу до контексту
export const useAuth = () => {
  return useContext(AuthContext);
};