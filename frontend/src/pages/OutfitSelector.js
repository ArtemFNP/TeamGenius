// src/pages/OutfitSelector.js
import React, { useState, useEffect } from 'react';
import '../styles/OutfitSelector.css';
import { useLanguage } from '../contexts/LanguageContext';

// Импортируем наши пользовательские хуки
import { useUserCloset } from '../hooks/useUserCloset';
import { useOutfitPresets } from '../hooks/useOutfitPresets';
import { useMannequinSlots } from '../hooks/useMannequinSlots';
import { useLocalStorage } from '../hooks/useLocalStorage'; // для weatherData
import { useOutfitRecommendation } from '../hooks/useOutfitRecommendation';


export default function OutfitSelector() {
  const { t } = useLanguage();

  // Использование хуков для получения состояния и функций
  const { userCloset, addUserItem, removeUserItem } = useUserCloset();
  const {
    savedPresets,
    selectedPresetId,
    setSelectedPresetId,
    newPresetName,
    setNewPresetName,
    savePreset, // Эта функция теперь содержит Alert внутри
    loadPreset
  } = useOutfitPresets(userCloset);

  // Инициализация слотов манекена. ЭТО ВАЖНО, чтобы selectedXxx были объявлены
  const {
    selectedHeadwear, setSelectedHeadwear,
    selectedTop, setSelectedTop,
    selectedOuterwear, setSelectedOuterwear,
    selectedBottom, setSelectedBottom,
    selectedFootwear, setSelectedFootwear,
    setItemInSlot,
    resetAllSlots
  } = useMannequinSlots(); 


  const [weatherData, setWeatherData] = useLocalStorage('lastWeatherData', null);
  const { aiRecommendation, generateOutfitViaAI } = useOutfitRecommendation(userCloset, weatherData);


  // ********** Эффекты и хэндлеры **********

  // При изменении выбранного пресета, загружаем его.
  // Добавление userCloset в зависимости необходимо для корректной работы
  // loadPreset, так как он ищет элементы внутри userCloset.
  useEffect(() => {
    if (selectedPresetId) {
        const outfit = loadPreset(selectedPresetId);
        // Обновляем слоты манекена на основе загруженного пресета
        setSelectedHeadwear(outfit.headwear);
        setSelectedTop(outfit.top);
        setSelectedOuterwear(outfit.outerwear);
        setSelectedBottom(outfit.bottom);
        setSelectedFootwear(outfit.footwear);
    } 
  }, [
      selectedPresetId, 
      loadPreset,
      setSelectedHeadwear, setSelectedTop, setSelectedOuterwear,
      setSelectedBottom, setSelectedFootwear,
      userCloset // КРИТИЧНО: эта зависимость должна быть, чтобы пресеты правильно загружались из актуального гардероба
  ]);

  const handleUseItem = (item) => {
    console.log('Use item:', item);
    setItemInSlot(item); // Устанавливаем предмет в соответствующий слот
    setHoveredItemId(null); // Сброс hover-состояния
  };

  const handleDeleteItem = (itemId) => {
    console.log('Delete item ID:', itemId);
    removeUserItem(itemId); // Удаляем из общего гардероба
    // Также очищаем слоты манекена, если удаленный предмет был на нем
    if(selectedHeadwear?.id === itemId) setSelectedHeadwear(null);
    if(selectedTop?.id === itemId) setSelectedTop(null);
    if(selectedOuterwear?.id === itemId) setSelectedOuterwear(null);
    if(selectedBottom?.id === itemId) setSelectedBottom(null);
    if(selectedFootwear?.id === itemId) setSelectedFootwear(null);
  };

  const handleSaveCurrentPreset = () => {
    // !!! ЭТОТ БЛОК КОДА ПРИНАДЛЕЖИТ СЮДА И ТОЛЬКО СЮДА !!!
    if (!newPresetName.trim()) {
        alert(t('pleaseEnterPresetName'));
        return;
    }
    const currentOutfitConfig = {
        headwearId: selectedHeadwear?.id || null,
        topId: selectedTop?.id || null,
        outerwearId: selectedOuterwear?.id || null,
        bottomId: selectedBottom?.id || null,
        footwearId: selectedFootwear?.id || null,
    };
    savePreset(currentOutfitConfig, newPresetName); // Вызываем функцию из хука
    // Alert уже вызывается внутри savePreset в useOutfitPresets.js, так что эта строка ниже должна быть удалена,
    // если она у вас есть из-за прошлых копирований:
    // alert(t('presetSavedAlert', { name: newPresetName })); 
  };


  const handleGenerateOutfitClick = () => {
      // Передаем функции-сеттеры в хук для обновления слотов
      generateOutfitViaAI({
          setSelectedHeadwear,
          setSelectedTop,
          setSelectedOuterwear,
          setSelectedBottom,
          setSelectedFootwear
      });
  };

  // Локальное состояние для визуального эффекта наведения (не относится к функционалу манекена)
  const [hoveredItemId, setHoveredItemId] = useState(null);


  return (
    <div className="os-main-content">
      {/* === Left Column: Mannequin Area & Presets === */}
      <div className="os-mannequin-and-presets-wrapper">
        <div className="os-dropdown-container presets-dropdown-container">
          <label htmlFor="savedPresets" className="os-label visually-hidden">{t('yourSavedPresets')}</label>
          <select
            id="savedPresets"
            className="os-dropdown"
            value={selectedPresetId}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedPresetId(newId);
              if (!newId) { // Если выбрано пустое значение (т.е. "No Preset Selected")
                resetAllSlots(); // Тогда явно сбросим слоты манекена
              }
            }}
          >
            <option value="">{t('yourSavedPresets')}</option>
            {savedPresets.map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </select>
        </div>

        {/* "Манекен" */}
        <div className="os-mannequin-area">
           <div className="mannequin-slot slot-headwear" onClick={() => setSelectedHeadwear(null)} title={selectedHeadwear ? `${t('removeHeadwear')} ${selectedHeadwear.name}` : t('addHeadwear')}>
            {selectedHeadwear ? <img src={selectedHeadwear.imageUrl} alt={selectedHeadwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>{t('headwear')}</span>}
          </div>
          <div className="mannequin-slot slot-layer-outer" onClick={() => setSelectedOuterwear(null)} title={selectedOuterwear ? `${t('removeOuterLayer')} ${selectedOuterwear.name}` : t('addOuterLayer')}>
            {selectedOuterwear ? <img src={selectedOuterwear.imageUrl} alt={selectedOuterwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>{t('outerLayer')}</span>}
          </div>
          <div className="mannequin-slot slot-layer-main" onClick={() => setSelectedTop(null)} title={selectedTop ? `${t('removeMainTop')} ${selectedTop.name}` : t('addMainTop')}>
            {selectedTop ? <img src={selectedTop.imageUrl} alt={selectedTop.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>{t('mainTop')}</span>}
          </div>
          <div className="mannequin-slot slot-bottom" onClick={() => setSelectedBottom(null)} title={selectedBottom ? `${t('removeBottoms')} ${selectedBottom.name}` : t('addBottoms')}>
            {selectedBottom ? <img src={selectedBottom.imageUrl} alt={selectedBottom.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>{t('bottoms')}</span>}
          </div>
          <div className="mannequin-slot slot-footwear" onClick={() => setSelectedFootwear(null)} title={selectedFootwear ? `${t('removeFootwear')} ${selectedFootwear.name}` : t('addFootwear')}>
            {selectedFootwear ? <img src={selectedFootwear.imageUrl} alt={selectedFootwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>{t('footwear')}</span>}
          </div>
        </div>

        <div className="os-preset-controls">
          <label htmlFor="savePresetName" className="os-label">{t('savePresetAs')}</label>
          <div className="os-input-group">
            <input
              type="text"
              id="savePresetName"
              className="os-input"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder={t('myAwesomeLookPlaceholder')}
            />
            <button className="os-button-save" onClick={handleSaveCurrentPreset}>{t('save')}</button>
          </div>
        </div>
      </div>

      {/* === Right Panel Wrapper: Info Column + Clothing Grid === */}
      <div className="os-right-panel-wrapper">
        {/* Clothing Grid */}
        <div className="os-clothing-grid-wrapper">
          <div className="os-intro-text-container">
            <p className="os-intro-text">{t('youCouldPickClothes')}</p>
          </div>

          <div className="os-clothing-grid-container">
            <div className="os-clothing-grid">
              {userCloset.length > 0 ? userCloset.map(item => (
                <div
                  key={item.id}
                  className="os-clothing-item-card"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleUseItem(item); } }}
                >
                  <img src={item.imageUrl} alt={item.name || 'Clothing item'} className="os-item-image" />
                  {hoveredItemId === item.id && (
                    <div className="os-item-actions">
                      <button className="os-action-btn use-btn" onClick={(e) => { e.stopPropagation(); handleUseItem(item);}}>{t('use')}</button>
                      <button className="os-action-btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id);}}>{t('delete')}</button>
                    </div>
                  )}
                </div>
              )) : (
                // Используйте свой пустой текст, я не стал менять.
                <p className="os-empty-closet-message">{t('emptyClosetMessage')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="os-info-column">
          {weatherData ? (
            <div className="os-weather-info">
              <p>{t('weatherInfo', { weatherDescription: weatherData.current.description, temperature: weatherData.current.temperature })}</p>
              {aiRecommendation && <p className="ai-recommendation-text">{aiRecommendation}</p>}
            </div>
          ) : (
            <div className="os-weather-info">
              <p className="ai-recommendation-text">{t('weatherDataNotAvailable')}</p>
            </div>
          )}

          <div className="os-ai-action">
            <button className="os-ai-button" onClick={handleGenerateOutfitClick}>
              {t('makeOutfitViaAI')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}