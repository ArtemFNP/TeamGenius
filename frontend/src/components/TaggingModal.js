// src/components/TaggingModal.js
import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // Для переводов
import { useNewClothingItemForm } from '../hooks/useNewClothingItemForm'; // Хук для формы тегирования
import '../styles/Closet.css'; // Используем стили из Closet.css

function TaggingModal({
  itemData, // Данные об изображении {file: File, previewUrl: Base64}
  onSave,   // Функция-колбэк для сохранения (получает объект itemWithTags)
  onClose,  // Функция-колбэк для закрытия модала без сохранения
  initialCategory // Предзаполненная категория из Select на основной странице Closet
}) {
  const { t } = useLanguage();

  // Используем наш хук для управления полями формы тегирования
  const {
    newImageName, setNewImageName,
    newImageCategory, setNewImageCategory,
    newImageWarmth, setNewImageWarmth,
    newImageIsWaterproof, setNewImageIsWaterproof,
    newImageIsClosedToe, setNewImageIsClosedToe,
    resetForm // Функция сброса всех полей формы в хуке
  } = useNewClothingItemForm();

  // Эффект для инициализации полей формы при открытии модала
  useEffect(() => {
    if (itemData) {
      setNewImageName(itemData.file.name.split('.')[0].trim()); // Предзаполняем именем файла
      setNewImageCategory(initialCategory || ''); // Предзаполняем выбранной категорией с главной страницы
      setNewImageWarmth(1); // Дефолтное значение тепла
      setNewImageIsWaterproof(false);
      setNewImageIsClosedToe(false);
    }
  }, [itemData, initialCategory, setNewImageName, setNewImageCategory, setNewImageWarmth, setNewImageIsWaterproof, setNewImageIsClosedToe]);


  const handleSave = () => {
    // Валидация всех обязательных полей перед сохранением
    if (!newImageName.trim()) {
      alert(t('pleaseEnterItemName'));
      return;
    }
    if (!newImageCategory.trim()) {
      alert(t('pleaseSelectCategory'));
      return;
    }

    const itemWithTags = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Уникальный ID
      name: newImageName.trim(),
      imageUrl: itemData.previewUrl, // Base64 изображение
      category: newImageCategory.toLowerCase(), // Нормализованная категория
      warmthRating: parseInt(newImageWarmth),
      isWaterproof: newImageIsWaterproof,
      isClosedToe: (newImageCategory === 'shoes' ? newImageIsClosedToe : false), // isClosedToe только для обуви
      // Если у вас есть другие статические поля (color, style и т.д. из gallery.js), 
      // и они не зависят от пользовательского ввода, можете добавить их здесь напрямую:
      // color: 'unspecified', style: 'unknown', etc.
    };

    onSave(itemWithTags); // Передаем полностью заполненный объект назад в Closet.js
    resetForm(); // Сбрасываем внутреннее состояние формы хука
  };

  const handleClose = () => {
    resetForm(); // Сброс формы при закрытии/отмене
    onClose();
  };

  // Важно: Эти категории должны совпадать с теми, которые вы обрабатываете в OutfitSelector
  const taggingCategories = [
    { value: '', label: t('selectCategory') },
    { value: 'headwear', label: t('headwear') },
    { value: 'outerwear', label: t('outerwear') },
    { value: 'top', label: t('top') },
    { value: 'bottom', label: t('bottom') },
    { value: 'shoes', label: t('shoes') },
    { value: 'accessory', label: t('accessory') }, // Если есть
  ];

  return (
    <div className="popup-overlay">
      <div className="popup-content tagging-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-button" onClick={handleClose} aria-label={t('cancel')}>×</button>
        <h3>{t('tagNewClothingItem')}</h3>
        
        {itemData.previewUrl && (
          <img src={itemData.previewUrl} alt="New item preview" className="modal-image-preview" />
        )}

        <div className="os-input-group">
          <label htmlFor="modalItemName">{t('itemName')}:</label>
          <input
            type="text"
            id="modalItemName"
            value={newImageName}
            onChange={(e) => setNewImageName(e.target.value)}
            placeholder={t('enterItemName')}
          />
        </div>

        <div className="os-input-group">
          <label htmlFor="modalItemCategory">{t('category')}:</label>
          <select
            id="modalItemCategory"
            value={newImageCategory}
            onChange={(e) => setNewImageCategory(e.target.value)}
          >
            {taggingCategories.map(cat => (
              <option key={cat.value} value={cat.value} disabled={cat.value === ''}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="os-input-group">
          <label htmlFor="modalItemWarmth">{t('warmthRating')}: {newImageWarmth}</label>
          <input
            type="range"
            id="modalItemWarmth"
            min="1"
            max="5"
            value={newImageWarmth}
            onChange={(e) => setNewImageWarmth(e.target.value)}
          />
        </div>

        <div className="os-input-group checkbox-group">
          <input
            type="checkbox"
            id="modalIsWaterproof"
            checked={newImageIsWaterproof}
            onChange={(e) => setNewImageIsWaterproof(e.target.checked)}
          />
          <label htmlFor="modalIsWaterproof">{t('isWaterproof')}</label>
        </div>

        {newImageCategory === 'shoes' && (
            <div className="os-input-group checkbox-group">
              <input
                type="checkbox"
                id="modalIsClosedToe"
                checked={newImageIsClosedToe}
                onChange={(e) => setNewImageIsClosedToe(e.target.checked)}
              />
              <label htmlFor="modalIsClosedToe">{t('isClosedToe')}</label>
            </div>
        )}

        <div className="modal-actions">
          <button className="os-button-save" onClick={handleSave}>{t('addToCloset')}</button>
          <button className="closet-button-cancel" onClick={handleClose}>{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
}

export default TaggingModal;