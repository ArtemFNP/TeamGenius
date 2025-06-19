// src/hooks/useUserCloset.js
import { useLocalStorage } from './useLocalStorage';
import { useState, useEffect, useMemo } from 'react';

// !!! ОЧЕНЬ ВАЖНО: Убедитесь, что этот путь к вашему gallery.js правильный.
// Например: из src/hooks/ к src/assets/images/gallery.js
import initialClosetItems from '../assets/images/gallery'; 

export function useUserCloset() {
  console.log('Value of initialClosetItems:', initialClosetItems);
  // Мы будем хранить *только* предметы, явно добавленные пользователем, в локальном хранилище.
  // Начальное значение для этого будет пустым массивом.
  const [userAddedItems, setUserAddedItems] = useLocalStorage('userAddedClothingItems', []);

  // Используем временное состояние для удалений в рамках текущей сессии,
  // чтобы начальные предметы могли быть "удалены" визуально без влияния на постоянное хранение.
  const [sessionRemovedItemIds, setSessionRemovedItemIds] = useState([]);

  // Эффективный гардероб пользователя объединяет начальные предметы с добавленными пользователем предметами,
  // и отфильтровывает предметы, помеченные для удаления в текущей сессии.
  const userCloset = useMemo(() => {
    const combinedItems = [...initialClosetItems, ...userAddedItems];
    const uniqueItems = [];
    const seenIds = new Set();

    for (const item of combinedItems) {
      if (!seenIds.has(item.id) && !sessionRemovedItemIds.includes(item.id)) {
        uniqueItems.push(item);
        seenIds.add(item.id);
      }
    }
    return uniqueItems;
  }, [userAddedItems, sessionRemovedItemIds]);

  const addUserItem = (item) => {
    // Добавляем только если предмета нет ни в начальных, ни в уже добавленных пользователем
    const isAlreadyInitial = initialClosetItems.some(i => i.id === item.id);
    const isAlreadyUserAdded = userAddedItems.some(i => i.id === item.id);

    if (!isAlreadyInitial && !isAlreadyUserAdded) {
      setUserAddedItems(prev => [...prev, item]);
    }
    // Если предмет был временно удален из сессии, добавляем его обратно
    setSessionRemovedItemIds(prev => prev.filter(id => id !== item.id));
  };

  const removeUserItem = (itemId) => {
    // Проверяем, является ли предмет одним из начальных, всегда присутствующих предметов
    const isInitialItem = initialClosetItems.some(item => item.id === itemId);

    if (isInitialItem) {
      // Если это начальный предмет, просто помечаем его как удаленный для текущей сессии
      setSessionRemovedItemIds(prev => [...prev, itemId]);
    } else {
      // Если это предмет, добавленный пользователем, безвозвратно удаляем его из постоянного состояния
      setUserAddedItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  return { userCloset, addUserItem, removeUserItem };
}