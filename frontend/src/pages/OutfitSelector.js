// src/pages/OutfitSelector.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/OutfitSelector.css'; 

import dropdownArrowIcon from '../assets/images/dropdown-arrow.png'; 
import initialClosetItems from '../assets/images/gallery'; 

const mockSavedPresets = [
  { id: 'preset1', name: 'Summer Chill Vibe' },
  { id: 'preset2', name: 'MyPerfectOutFit' },
  { id: 'preset3', name: 'Rainy Day Casual' },
  { id: 'preset4', name: 'Office Ready' },
];

export default function OutfitSelector() {
  const [savedPresets, setSavedPresets] = useState(mockSavedPresets);
  const [selectedPreset, setSelectedPreset] = useState(mockSavedPresets[0]?.id || ''); 
  const [userCloset, setUserCloset] = useState(initialClosetItems); 
  
  const [selectedHeadwear, setSelectedHeadwear] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null); // Для футболок, рубашек
  const [selectedOuterwear, setSelectedOuterwear] = useState(null); // Для курток, худи
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedFootwear, setSelectedFootwear] = useState(null);

  const [newPresetName, setNewPresetName] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // --- Функции handleUseItem, handleDeleteItem, handleSavePreset, loadPreset остаются как в твоем коде ---
  const handleUseItem = (item) => {
    console.log('Use item:', item);
    if (!item.category) {
        console.warn("Item category is not defined for:", item.name, "Defaulting to top or outerwear.");
        if (!selectedTop) setSelectedTop(item); 
        else if (!selectedOuterwear && item.category !== 'top') setSelectedOuterwear(item); // Не кладем в outerwear если это тоже топ
        return;
    }
    switch (item.category.toLowerCase()) {
      case 'headwear': setSelectedHeadwear(item); break;
      case 'top': setSelectedTop(item); break; // Футболки, рубашки, лонгсливы
      case 'outerwear': setSelectedOuterwear(item); break; // Куртки, худи, пальто
      case 'bottom': setSelectedBottom(item); break;
      case 'shoes': setSelectedFootwear(item); break;
      default: 
        console.log(`Unknown category or no specific slot for: ${item.category}`);
        if(!selectedTop) setSelectedTop(item); // По умолчанию в слот 'top'
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
      alert("Please enter a name for your preset.");
      return;
    }
    const currentOutfitItems = { // Сохраняем ID выбранных вещей
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
    alert(`Preset "${newPresetData.name}" saved!`);
  };
  
  const loadPreset = (presetId) => {
    const presetToLoad = savedPresets.find(p => p.id === presetId);
    if (presetToLoad && presetToLoad.config) {
        console.log("Loading preset (mock):", presetToLoad.name, presetToLoad.config);
        // Находим вещи в userCloset по сохраненным ID
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
    if (selectedPreset) { // Если выбран конкретный пресет
        loadPreset(selectedPreset);
    } else { // Если выбрана опция "Your Saved Presets" (value="")
        loadPreset(null); // Очистить манекен
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedPreset]); // Убрал savedPresets и userCloset из зависимостей для упрощения,
                        // но в реальном приложении это может потребовать более тонкой настройки,
                        // особенно если userCloset меняется и нужно пере-валидировать пресет


  return (
    <div className="outfit-selector-page">
      <Navbar />
      <main className="os-main-content">
        {/* === Левая колонка === */}
        <div className="os-left-sidebar">
          <div className="os-dropdown-container presets-dropdown-container">
            <label htmlFor="savedPresets" className="os-label visually-hidden">Your Saved Presets</label>
            <select 
              id="savedPresets" 
              className="os-dropdown"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            >
              <option value="">Your Saved Presets</option>
              {savedPresets.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
          </div>
          
          {/* "Манекен" */}
          <div className="os-mannequin-area">
             <div className="mannequin-slot slot-headwear" onClick={() => setSelectedHeadwear(null)} title={selectedHeadwear ? `Remove ${selectedHeadwear.name}` : "Add Headwear"}>
              {selectedHeadwear ? <img src={selectedHeadwear.imageUrl} alt={selectedHeadwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Головной убор</span>}
            </div>
            {/* Переименовал для ясности и чтобы было понятно, что это разные слои */}
            <div className="mannequin-slot slot-layer-outer" onClick={() => setSelectedOuterwear(null)} title={selectedOuterwear ? `Remove ${selectedOuterwear.name}` : "Add Outer Layer (Jacket, Hoodie)"}>
              {selectedOuterwear ? <img src={selectedOuterwear.imageUrl} alt={selectedOuterwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Верхний слой</span>}
            </div>
            <div className="mannequin-slot slot-layer-main" onClick={() => setSelectedTop(null)} title={selectedTop ? `Remove ${selectedTop.name}` : "Add Main Top (T-Shirt, Shirt)"}>
              {selectedTop ? <img src={selectedTop.imageUrl} alt={selectedTop.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Верх (футболка и т.д.)</span>}
            </div>
            <div className="mannequin-slot slot-bottom" onClick={() => setSelectedBottom(null)} title={selectedBottom ? `Remove ${selectedBottom.name}` : "Add Bottoms"}>
              {selectedBottom ? <img src={selectedBottom.imageUrl} alt={selectedBottom.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Низ</span>}
            </div>
            <div className="mannequin-slot slot-footwear" onClick={() => setSelectedFootwear(null)} title={selectedFootwear ? `Remove ${selectedFootwear.name}` : "Add Footwear"}>
              {selectedFootwear ? <img src={selectedFootwear.imageUrl} alt={selectedFootwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Обувь</span>}
            </div>
          </div>
          
          <div className="os-preset-controls">
            <label htmlFor="savePresetName" className="os-label">Save that preset as</label>
            <div className="os-input-group">
              <input 
                type="text" 
                id="savePresetName" 
                className="os-input" // Стиль для серого фона будет в CSS
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="My Awesome Look" 
              />
              <button className="os-button-save" onClick={handleSavePreset}>Save</button>
            </div>
          </div>
        </div>

        {/* === Центральная колонка === */}
        <div className="os-center-content">
          {/* Текст "You could pick..." теперь здесь, вверху центральной колонки */}
          <div className="os-intro-text-container">
            <p className="os-intro-text">You could pick clothes yourself or let AI make it for you!</p>
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
                      <button className="os-action-btn use-btn" onClick={(e) => { e.stopPropagation(); handleUseItem(item);}}>USE</button>
                      <button className="os-action-btn delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id);}}>DELETE</button>
                    </div>
                  )}
                </div>
              )) : (
                <p className="os-empty-closet-message">Your closet is empty. Add some clothes on the "Wardrobe" page!</p>
              )}
            </div>
          </div>
          
          <div className="os-ai-action"> 
            <button className="os-ai-button">
              Make Outfit via AI
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}