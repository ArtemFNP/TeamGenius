// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Хук для использования localStorage.
 * @param {string} key Ключ, под которым данные будут храниться в localStorage.
 * @param {any} initialValue Начальное значение, если в localStorage ничего нет.
 * @returns {[any, Function]} Массив из значения и функции для его обновления.
 */
export function useLocalStorage(key, initialValue) {
  // Получаем начальное значение из localStorage или используем initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // useEffect для обновления localStorage при изменении storedValue
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}