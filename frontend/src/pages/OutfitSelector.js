// src/pages/OutfitSelector.js
import React, { useState, useEffect } from 'react';
import '../styles/OutfitSelector.css'; 
import { useLanguage } from '../contexts/LanguageContext'; // Импортируем хук языка

import dropdownArrowIcon from '../assets/images/dropdown-arrow.png'; 
import initialClosetItems from '../assets/images/gallery'; 

const mockSavedPresets = [
  { id: 'preset1', name: 'Summer Chill Vibe' },
  { id: 'preset2', name: 'MyPerfectOutFit' },
  { id: 'preset3', name: 'Rainy Day Casual' },
  { id: 'preset4', name: 'Office Ready' },
];

export default function OutfitSelector() {
  const { t } = useLanguage(); 

  const [savedPresets, setSavedPresets] = useState(mockSavedPresets);
  const [selectedPreset, setSelectedPreset] = useState(mockSavedPresets[0]?.id || ''); 
  const [userCloset, setUserCloset] = useState(initialClosetItems); 
  
  const [selectedHeadwear, setSelectedHeadwear] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null); 
  const [selectedOuterwear, setSelectedOuterwear] = useState(null); 
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedFootwear, setSelectedFootwear] = useState(null);

  const [newPresetName, setNewPresetName] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const [weatherData, setWeatherData] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState('');

  useEffect(() => {
    const storedWeatherData = localStorage.getItem('lastWeatherData');
    if (storedWeatherData) {
      setWeatherData(JSON.parse(storedWeatherData));
    }
  }, []);

  const handleUseItem = (item) => {
    console.log('Use item:', item);
    if (!item.category) {
        console.warn("Item category is not defined for:", item.name, "Defaulting to top slot.");
        setSelectedTop(item); 
        return;
    }
    switch (item.category.toLowerCase()) {
      case 'headwear': setSelectedHeadwear(item); break;
      case 'top': setSelectedTop(item); break;
      case 'outerwear': setSelectedOuterwear(item); break;
      case 'bottom': setSelectedBottom(item); break;
      case 'shoes': setSelectedFootwear(item); break;
      default: 
        console.log(`Unknown category or no specific slot for: ${item.category}`);
        setSelectedTop(item); 
    }
    setHoveredItemId(null); 
  };

  const handleDeleteItem = (itemId) => {
    console.log('Delete item ID:', itemId);
    setUserCloset(prev => prev.filter(item => item.id !== itemId));
    if(selectedHeadwear?.id === itemId) setSelectedHeadwear(null);
    if(selectedTop?.id === itemId) setSelectedTop(null);
    if(selectedOuterwear?.id === itemId) setSelectedOuterwear(null);
    if(selectedBottom?.id === itemId) setSelectedBottom(null);
    if(selectedFootwear?.id === itemId) setSelectedFootwear(null);
    setHoveredItemId(null);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      alert(t('pleaseEnterPresetName')); 
      return;
    }
    const currentOutfitItems = { 
        headwearId: selectedHeadwear?.id || null,
        topId: selectedTop?.id || null,
        outerwearId: selectedOuterwear?.id || null,
        bottomId: selectedBottom?.id || null,
        footwearId: selectedFootwear?.id || null,
    };
    const newPresetData = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      config: currentOutfitItems 
    };
    setSavedPresets(prev => [newPresetData, ...prev]);
    setNewPresetName(''); 
    setSelectedPreset(newPresetData.id); 
    console.log("Preset saved (locally):", newPresetData);
    alert(t('presetSavedAlert', { name: newPresetData.name })); 
  };
  
  const loadPreset = (presetId) => {
    const presetToLoad = savedPresets.find(p => p.id === presetId);
    if (presetToLoad && presetToLoad.config) {
            console.log("Loading preset (mock):", presetToLoad.name, presetToLoad.config);
            setSelectedHeadwear(userCloset.find(item => item.id === presetToLoad.config.headwearId) || null);
            setSelectedTop(userCloset.find(item => item.id === presetToLoad.config.topId) || null);
            setSelectedOuterwear(userCloset.find(item => item.id === presetToLoad.config.outerwearId) || null);
            setSelectedBottom(userCloset.find(item => item.id === presetToLoad.config.bottomId) || null);
            setSelectedFootwear(userCloset.find(item => item.id === presetToLoad.config.footwearId) || null);
        } else {
            setSelectedHeadwear(null);
            setSelectedTop(null);
            setSelectedOuterwear(null);
            setSelectedBottom(null);
            setSelectedFootwear(null);
        }
      };

      useEffect(() => {
        if (selectedPreset) { 
            loadPreset(selectedPreset);
        } else { 
            loadPreset(null);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps 
      }, [selectedPreset]); 

      const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

      const generateOutfitViaAI = () => {
        if (!weatherData) {
          alert(t('weatherDataNotAvailable')); 
          return;
        }

        const { temperature, weatherCondition } = weatherData;
        let recommendedOutfit = {};
        let recommendationMessage = '';

        if (temperature < 10) { 
          recommendationMessage = t('coldWeatherWarning');
          const warmOuterwear = userCloset.filter(item => item.category === 'outerwear' && item.warmthRating >= 3);
          const warmTops = userCloset.filter(item => item.category === 'top' && item.warmthRating >= 2);
          const warmBottoms = userCloset.filter(item => item.category === 'bottom' && item.warmthRating >= 3);
          const warmFootwear = userCloset.filter(item => item.category === 'shoes' && item.warmthRating >= 3 && item.isClosedToe);
          if (warmOuterwear.length > 0) recommendedOutfit.outerwear = getRandomItem(warmOuterwear);
          if (warmTops.length > 0) recommendedOutfit.top = getRandomItem(warmTops);
          if (warmBottoms.length > 0) recommendedOutfit.bottom = getRandomItem(warmBottoms);
          if (warmFootwear.length > 0) recommendedOutfit.footwear = getRandomItem(warmFootwear);
        } else if (temperature >= 10 && temperature <= 20) { 
          recommendationMessage = t('mildWeatherNotice');
          const mildOuterwear = userCloset.filter(item => item.category === 'outerwear' && item.warmthRating >= 2 && item.warmthRating <= 3);
          const mildTops = userCloset.filter(item => item.category === 'top' && item.warmthRating >= 1 && item.warmthRating <= 2);
          const mildBottoms = userCloset.filter(item => item.category === 'bottom' && item.warmthRating >= 1 && item.warmthRating <= 2);
          const mildFootwear = userCloset.filter(item => item.category === 'shoes' && item.warmthRating >= 1 && item.warmthRating <= 2 && item.isClosedToe);
          if (mildOuterwear.length > 0) recommendedOutfit.outerwear = getRandomItem(mildOuterwear);
          if (mildTops.length > 0) recommendedOutfit.top = getRandomItem(mildTops);
          if (mildBottoms.length > 0) recommendedOutfit.bottom = getRandomItem(mildBottoms);
          if (mildFootwear.length > 0) recommendedOutfit.footwear = getRandomItem(mildFootwear);
        } else {
          recommendationMessage = t('hotWeatherWarning');
          const lightTops = userCloset.filter(item => item.category === 'top' && item.warmthRating === 1);
          const lightBottoms = userCloset.filter(item => item.category === 'bottom' && item.warmthRating === 1);
          const lightFootwear = userCloset.filter(item => item.category === 'shoes' && item.warmthRating === 1);
          if (lightTops.length > 0) recommendedOutfit.top = getRandomItem(lightTops);
          if (lightBottoms.length > 0) recommendedOutfit.bottom = getRandomItem(lightBottoms);
          if (lightFootwear.length > 0) recommendedOutfit.footwear = getRandomItem(lightFootwear);
        }
        if (weatherCondition && weatherCondition.toLowerCase().includes('rain')) {
          const waterproofOuterwear = userCloset.filter(item => item.category === 'outerwear' && item.isWaterproof);
          const closedFootwear = userCloset.filter(item => item.category === 'shoes' && item.isClosedToe);
          if (waterproofOuterwear.length > 0) { recommendedOutfit.outerwear = getRandomItem(waterproofOuterwear); }
          if (closedFootwear.length > 0) { recommendedOutfit.footwear = getRandomItem(closedFootwear); }
          recommendationMessage += ` ${t('umbrellaRecommendation')}`;
        }
        if (!recommendedOutfit.headwear) { const headwear = userCloset.filter(item => item.category === 'headwear'); if (headwear.length > 0) recommendedOutfit.headwear = getRandomItem(headwear); }
        if (!recommendedOutfit.top) { const tops = userCloset.filter(item => item.category === 'top'); if (tops.length > 0) recommendedOutfit.top = getRandomItem(tops); }
        if (!recommendedOutfit.outerwear) { const outerwear = userCloset.filter(item => item.category === 'outerwear'); if (outerwear.length > 0) recommendedOutfit.outerwear = getRandomItem(outerwear); }
        if (!recommendedOutfit.bottom) { const bottoms = userCloset.filter(item => item.category === 'bottom'); if (bottoms.length > 0) recommendedOutfit.bottom = getRandomItem(bottoms); }
        if (!recommendedOutfit.footwear) { const footwear = userCloset.filter(item => item.category === 'shoes'); if (footwear.length > 0) recommendedOutfit.footwear = getRandomItem(footwear); }
        setSelectedHeadwear(recommendedOutfit.headwear || null);
        setSelectedTop(recommendedOutfit.top || null);
        setSelectedOuterwear(recommendedOutfit.outerwear || null);
        setSelectedBottom(recommendedOutfit.bottom || null);
        setSelectedFootwear(recommendedOutfit.footwear || null);
        setAiRecommendation(recommendationMessage);
      };

      return (
        // !!! ИЗМЕНЕНО: КОРНЕВОЙ ТЕГ БЫЛ <main>, СТАЛ <div className="os-main-content"> (без внешнего outfit-selector-page div) !!!
        // Это важный шаг для корректной вложенности в <main className="app-main-content"> в App.js.
        <div className="os-main-content"> 
          {/* === Левая колонка === */}
          <div className="os-left-sidebar">
            <div className="os-dropdown-container presets-dropdown-container">
              <label htmlFor="savedPresets" className="os-label visually-hidden">{t('yourSavedPresets')}</label>
              <select 
                id="savedPresets" 
                className="os-dropdown"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
              >
                <option value="">{t('yourSavedPresets')}</option> {/* Локализация */}
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
                <button className="os-button-save" onClick={handleSavePreset}>{t('save')}</button>
              </div>
            </div>
          </div>

          {/* === Центральная колонка === */}
          <div className="os-center-content">
            <div className="os-intro-text-container">
              <p className="os-intro-text">{t('youCouldPickClothes')}</p>
            </div>

            {weatherData && (
              <div className="os-weather-info">
                <p>{t('weatherInfo', { weatherDescription: weatherData.description, temperature: weatherData.temperature })}</p>
                {aiRecommendation && <p className="ai-recommendation-text">{aiRecommendation}</p>}
              </div>
            )}

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
            
            <div className="os-ai-action"> 
              <button className="os-ai-button" onClick={generateOutfitViaAI}>
                {t('makeOutfitViaAI')}
              </button>
            </div>
          </div>
        </div>
      );
    }