import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en.json';
import uk from '../locales/uk.json';

const locales = { en, uk };
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Инициализация языка из localStorage или по умолчанию 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  // Сохранение языка в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Функция перевода
  const t = (key, params = {}) => {
    // Ищем перевод по ключу в текущем языке, затем в английском, затем возвращаем сам ключ
    const text = locales[language][key] || locales['en'][key] || key;
    // Заменяем параметры типа {{paramName}} в строке
    return Object.keys(params).reduce((acc, paramKey) => {
      return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
    }, text);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для удобного использования в компонентах
export const useLanguage = () => useContext(LanguageContext);