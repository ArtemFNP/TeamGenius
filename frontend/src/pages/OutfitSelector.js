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
    savePreset, // Эта функция теперь содержит Alert
    loadPreset
  } = useOutfitPresets(userCloset);

  // Инициализация слотов манекена
  const {
    selectedHeadwear, setSelectedHeadwear,
    selectedTop, setSelectedTop,
    selectedOuterwear, setSelectedOuterwear,
    selectedBottom, setSelectedBottom,
    selectedFootwear, setSelectedFootwear,
    setItemInSlot, // Используется для 'Use item'
    resetAllSlots // Используется при выборе пустого пресета
  } = useMannequinSlots(); // <<< ХУК ДЛЯ СЛОТОВ ДОЛЖЕН БЫТЬ ОБЪЯВЛЕН ДО ИСПОЛЬЗОВАНИЯ ЕГО ЗНАЧЕНИЙ


  const [weatherData, setWeatherData] = useLocalStorage('lastWeatherData', null);
  const { aiRecommendation, generateOutfitViaAI } = useOutfitRecommendation(userCloset, weatherData);


  // ********** Эффекты и хэндлеры, теперь использующие хуки **********

  // При изменении выбранного пресета, загружаем его
  useEffect(() => {
    if (selectedPresetId) {
        const outfit = loadPreset(selectedPresetId);
        // Обновляем слоты манекена на основе загруженного пресета
        setSelectedHeadwear(outfit.headwear);
        setSelectedTop(outfit.top);
        setSelectedOuterwear(outfit.outerwear);
        setSelectedBottom(outfit.bottom);
        setSelectedFootwear(outfit.footwear);
    } else {
        // Если выбран "Пустой пресет" или ничего не выбрано
        resetAllSlots();
    }
  }, [selectedPresetId, loadPreset, resetAllSlots,
      setSelectedHeadwear, setSelectedTop, setSelectedOuterwear, // set-функции тоже нужны в зависимостях
      setSelectedBottom, setSelectedFootwear
  ]);

  const handleUseItem = (item) => {
    console.log('Use item:', item);
    setItemInSlot(item);
    setHoveredItemId(null); // Это только для визуального эффекта
  };

  const handleDeleteItem = (itemId) => {
    console.log('Delete item ID:', itemId);
    removeUserItem(itemId); // Удаляем из общего гардероба
    // Если удаленный элемент был на манекене, тоже убираем его
    if(selectedHeadwear?.id === itemId) setSelectedHeadwear(null);
    if(selectedTop?.id === itemId) setSelectedTop(null);
    if(selectedOuterwear?.id === itemId) setSelectedOuterwear(null);
    if(selectedBottom?.id === itemId) setSelectedBottom(null);
    if(selectedFootwear?.id === itemId) setSelectedFootwear(null);
    // setHoveredItemId(null); // Если это состояние используется для ховера, то оно локальное, иначе не нужно
  };

  const handleSaveCurrentPreset = () => {
    // !!! ЭТОТ БЛОК КОДА ПРИНАДЛЕЖИТ СЮДА !!!
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
    savePreset(currentOutfitConfig, newPresetName); // Теперь savePreset из хука уже содержит Alert
    // alert(t('presetSavedAlert', { name: newPresetName })); // <<< ЭТО УДАЛЯЕМ, ОНО ДУБЛИРУЕТСЯ ВНУТРИ ХУКА savePreset
  };


  const handleGenerateOutfitClick = () => {
      generateOutfitViaAI({
          setSelectedHeadwear,
          setSelectedTop,
          setSelectedOuterwear,
          setSelectedBottom,
          setSelectedFootwear
      });
  };

  const [hoveredItemId, setHoveredItemId] = useState(null);


  return (
    <div className="os-main-content">
      {/* ... (остальной JSX остается как был) ... */}
      {/* === Left Column: Mannequin Area & Presets === */}
      <div className="os-mannequin-and-presets-wrapper">
        <div className="os-dropdown-container presets-dropdown-container">
          <label htmlFor="savedPresets" className="os-label visually-hidden">{t('yourSavedPresets')}</label>
          <select
            id="savedPresets"
            className="os-dropdown"
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
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
        {/* Clothing Grid (now part of the right panel) */}
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
                <p className="os-empty-closet-message">{t('emptyClosetMessage')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info Column (now part of the right panel) */}
        <div className="os-info-column">
          {weatherData && (
            <div className="os-weather-info">
              <p>{t('weatherInfo', { weatherDescription: weatherData.description, temperature: weatherData.temperature })}</p>
              {aiRecommendation && <p className="ai-recommendation-text">{aiRecommendation}</p>}
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