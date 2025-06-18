// src/pages/Closet.js
import React, { useRef, useState, useEffect, useCallback } from 'react'; // Добавил useCallback

import '../styles/Closet.css';
import uploadIcon from '../assets/images/uploadicon.png';
import { useLanguage } from '../contexts/LanguageContext'; // Для переводов

// ИМПОРТИРУЕМ ОБЩИЙ ХУК ГАРДЕРОБА
import { useUserCloset } from '../hooks/useUserCloset';

// !!! УДАЛИТЕ ЭТУ СТРОКУ, она больше не нужна.
// import importedClosetItems from '../assets/images/gallery'; 


const CLOTH_TYPES = [
  { value: '', label: 'Select type' },
  { value: 'top', label: 'T-Shirt' },       // Используем общие категории для `value`
  { value: 'bottom', label: 'Pants' },
  { value: 'outerwear', label: 'Hoodie' },
  { value: 'outerwear', label: 'Jacket' },
  { value: 'top', label: 'Dress' },         
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'headwear', label: 'Cap' }
];

export default function Closet() {
  const { t } = useLanguage();

  const fileInputRef = useRef(null);
  // Ваш существующий стейт для селекта
  const [selectedClothType, setSelectedClothType] = useState(''); 
  // Ваш существующий стейт для попапа просмотра деталей
  const [selectedItemForPopup, setSelectedItemForPopup] = useState(null); 

  // !!! ИСПОЛЬЗУЕМ ОБЩИЙ ГАРДЕРОБ ИЗ ХУКА! ЭТО ГЛАВНОЕ ИЗМЕНЕНИЕ ЛОГИКИ ДАННЫХ
  const { userCloset, addUserItem, removeUserItem } = useUserCloset();


  const handleFileChange = useCallback((event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
          alert(t('invalidFileType'));
          event.target.value = ''; // Очищаем input[type="file"]
          return;
      }

      // Используем FileReader для преобразования изображения в Base64.
      // Это позволяет сохранить изображение как строку в localStorage.
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Уникальный ID
            imageUrl: reader.result, // Base64-строка изображения
            name: file.name.split('.')[0].trim() || t('newItemName'), // Имя файла или "New Item" (переведенное)
            category: selectedClothType || 'top', // Используем выбранный тип, иначе по умолчанию 'top'
            
            // !!! НАШ "КОСТЫЛЬ": ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ ДЛЯ ТЕГОВ, ЕСЛИ НЕТ ПОЛЕЙ ВВОДА НА UI
            warmthRating: 1,      // Дефолтное тепло (например, легкая одежда)
            isWaterproof: false,  // Дефолт: не водонепроницаемо
            isClosedToe: false,   // Дефолт: не закрытый носок (если не обувь)
            // Дополнительные теги из gallery.js, если они всегда статические для новых:
            // style: 'casual',
            // color: 'mixed',
            // pattern: 'solid',
            // occasion: 'daily',
            // gender: 'unisex'
        };

        // Специальная логика для isClosedToe, если выбрана категория обуви, но нет UI для выбора
        if (newItem.category === 'shoes') {
             newItem.isClosedToe = false; // Обувь по умолчанию без закрытого носка, если пользователь не указал
        }

        addUserItem(newItem); // <-- ДОБАВЛЕНИЕ НОВОГО ПРЕДМЕТА ЧЕРЕЗ ОБЩИЙ ХУК
        console.log("Added new item:", newItem);
        alert(t('itemAddedToCloset', { name: newItem.name })); // Подтверждение пользователю
      };
      reader.readAsDataURL(file); // Запускаем чтение файла
      event.target.value = ''; // Сброс input[type="file"], чтобы можно было загрузить тот же файл снова
    }
  }, [selectedClothType, addUserItem, t]);


  const handleUploadAreaClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  // Ваш оригинальный функционал открытия/закрытия попапа просмотра деталей
  const openItemPopup = useCallback((item) => {
    setSelectedItemForPopup(item);
  }, []);

  const closeItemPopup = useCallback(() => {
    setSelectedItemForPopup(null);
  }, []);

  // Новый handleDeleteItem для попапа, который удаляет из общего гардероба
  const handleDeleteItem = useCallback((itemId) => {
    if (window.confirm(t('confirmDeleteItem'))) { // С подтверждением
        removeUserItem(itemId); // <-- УДАЛЕНИЕ ЧЕРЕЗ ОБЩИЙ ХУК
        setSelectedItemForPopup(null); // Закрываем попап
    }
  }, [removeUserItem, t]);

  // Ваш оригинальный useEffect для обработки кликов вне попапов
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Закрываем попап, только если клик был вне его содержимого и на overlay
      if (selectedItemForPopup && !event.target.closest('.popup-content') && event.target.classList.contains('popup-overlay')) {
        closeItemPopup();
      }
    };
    const handleEscapeKey = (event) => {
        if (event.key === 'Escape' && selectedItemForPopup) {
            closeItemPopup();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedItemForPopup, closeItemPopup]);


  return (
    <div className="closet-page-container">
      
      <main className="closet-main-content">
        <h1 className="closet-title">
          {t('closetUploadTitle')} {/* Перевод */}
        </h1>

        <div className="closet-upload-interaction-area">
          <div className="type-selector-container">
            <label htmlFor="clothType" className="cloth-type-label">
              {t('chooseTypeOfCloth')} {/* Перевод */}
            </label>
            <select
              id="clothType"
              value={selectedClothType}
              onChange={(e) => setSelectedClothType(e.target.value)}
              className="cloth-type-dropdown"
            >
              {CLOTH_TYPES.map((type, index) => (
                <option key={index} value={type.value} disabled={type.value === ''}>
                  {t(type.label.toLowerCase().replace(/[^a-z0-9]/g, ''))} {/* Переводим, нормализуя ключ */}
                </option>
              ))}
            </select>
          </div>

          <div 
            className="upload-area" 
            onClick={handleUploadAreaClick}
            onKeyDown={(e) => e.key === 'Enter' && handleUploadAreaClick()}
            role="button"
            tabIndex={0}
            aria-label="Upload new clothes image"
          >
            <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
          </div>
        </div>
        
        <p className="upload-instructions">
          {t('supportedFormats')}: .png, .svg, .jpg, .jpeg {/* Перевод */}
        </p>
        <input
          type="file"
          accept=".png, .svg, .jpg, .jpeg"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        <p className="item-appearance-text">{t('itWillAppearHere')}:</p> {/* Перевод */}

        <div className="closet-items-grid">
          {/* !!! ГЛАВНОЕ: используем userCloset из нашего общего хука, данные постоянны */}
          {userCloset.length > 0 ? userCloset.map(item => (
            <div 
              key={item.id} 
              className="closet-item-card" 
              onClick={() => openItemPopup(item)}
              onKeyDown={(e) => e.key === 'Enter' && openItemPopup(item)}
              role="button"
              tabIndex={0}
            >
              <img src={item.imageUrl} alt={item.name || t('closetItem')} className="closet-item-image" /> {/* Перевод */}
            </div>
          )) : (
            <p className="closet-empty-message">{t('yourClosetIsEmpty')}</p> 
          )}
        </div>
      </main>

      {/* ВАШ СУЩЕСТВУЮЩИЙ POPUP для просмотра деталей элемента */}
      {selectedItemForPopup && (
        <div className="popup-overlay">
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={closeItemPopup} aria-label="Close popup">×</button>
            <img src={selectedItemForPopup.imageUrl} alt={selectedItemForPopup.name || t('selectedItem')} className="popup-image" /> {/* Перевод */}
            <h3 className="popup-item-name">{selectedItemForPopup.name || t('itemDetails')}</h3> {/* Перевод */}
            {/* Добавляем отображение тегов в попапе, чтобы можно было их видеть */}
            <p><strong>{t('category')}:</strong> {t(selectedItemForPopup.category.toLowerCase().replace(/[^a-z0-9]/g, '')) || 'N/A'}</p>
            <p><strong>{t('warmthRating')}:</strong> {selectedItemForPopup.warmthRating || 'N/A'}</p>
            <p><strong>{t('isWaterproof')}:</strong> {selectedItemForPopup.isWaterproof ? t('yes') : t('no')}</p>
            {selectedItemForPopup.category === 'shoes' && (
              <p><strong>{t('isClosedToe')}:</strong> {selectedItemForPopup.isClosedToe ? t('yes') : t('no')}</p>
            )}
            <button className="closet-delete-btn-popup" onClick={() => handleDeleteItem(selectedItemForPopup.id)}>{t('delete')}</button> {/* Кнопка удаления */}
          </div>
        </div>
      )}
    </div>
  );
}