// src/hooks/useUserCloset.js
import { useLocalStorage } from './useLocalStorage';

// !!! ОЧЕНЬ ВАЖНО: Убедитесь, что этот путь к вашему gallery.js правильный.
// Например: из src/hooks/ к src/assets/images/gallery.js
import initialClosetItems from '../assets/images/gallery'; 

export function useUserCloset() {
  // Этот хук пытается загрузить данные из 'userCloset' в localStorage.
  // Если там пусто, он использует `initialClosetItems` как стартовое значение.
  const [userCloset, setUserCloset] = useLocalStorage('userCloset', initialClosetItems); 

  const addUserItem = (item) => {
    setUserCloset(prev => [...prev, item]);
  };

  const removeUserItem = (itemId) => {
    setUserCloset(prev => prev.filter(item => item.id !== itemId));
  };

  return { userCloset, addUserItem, removeUserItem };
}