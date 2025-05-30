// src/pages/OutfitSelector.js
import React, { useState, useEffect } from 'react'; // useEffect добавлен для будущих нужд или если уже есть
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/OutfitSelector.css'; 

import dropdownArrowIcon from '../assets/images/dropdown-arrow.png'; // Убедись, что путь корректен
import initialClosetItems from '../assets/images/gallery'; // Убедись, что путь и структура gallery.js корректны

const mockSavedPresets = [
  { id: 'preset1', name: 'Summer Chill Vibe' },
  { id: 'preset2', name: 'MyPerfectOutFit' }, // Добавил из твоего скриншота
  { id: 'preset3', name: 'Rainy Day Casual' },
  { id: 'preset4', name: 'Office Ready' },
];

export default function OutfitSelector() {
  const [savedPresets, setSavedPresets] = useState(mockSavedPresets);
  // Выберем первый пресет по умолчанию, если он есть
  const [selectedPreset, setSelectedPreset] = useState(mockSavedPresets[0]?.id || ''); 
  const [userCloset, setUserCloset] = useState(initialClosetItems); 
  
  const [selectedHeadwear, setSelectedHeadwear] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedFootwear, setSelectedFootwear] = useState(null);

  const [newPresetName, setNewPresetName] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // --- Существующие функции handleUseItem, handleDeleteItem, handleSavePreset остаются такими же ---
  const handleUseItem = (item) => {
    console.log('Use item:', item);
    if (!item.category) {
        console.warn("Item category is not defined for:", item.name);
        if (!selectedTop) setSelectedTop(item); 
        else if (!selectedOuterwear) setSelectedOuterwear(item);
        return;
    }
    switch (item.category.toLowerCase()) {
      case 'headwear': setSelectedHeadwear(item); break;
      case 'top': setSelectedTop(item); break;
      case 'outerwear': setSelectedOuterwear(item); break;
      case 'bottom': setSelectedBottom(item); break;
      case 'shoes': setSelectedFootwear(item); break;
      default: if(!selectedTop) setSelectedTop(item);
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
    const currentOutfit = { // Собираем текущий аутфит для сохранения (пока только имена для примера)
        headwear: selectedHeadwear?.id || null,
        top: selectedTop?.id || null,
        outerwear: selectedOuterwear?.id || null,
        bottom: selectedBottom?.id || null,
        footwear: selectedFootwear?.id || null,
    };
    const newPresetData = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      items: currentOutfit // Здесь будет сохранена конфигурация манекена
    };
    setSavedPresets(prev => [newPresetData, ...prev]);
    setNewPresetName(''); 
    setSelectedPreset(newPresetData.id); 
    console.log("Preset saved (locally):", newPresetData);
    alert(`Preset "${newPresetData.name}" saved!`);
  };
  
  // Функция для загрузки пресета (пока моковая)
  const loadPreset = (presetId) => {
    const presetToLoad = savedPresets.find(p => p.id === presetId);
    if (presetToLoad && presetToLoad.items) {
        // Здесь нужно найти соответствующие item объекты в userCloset по их id
        // Это усложненная логика, пока оставим заглушку
        // Для примера: если бы в presetToLoad.items были полные объекты
        // setSelectedHeadwear(presetToLoad.items.headwear); 
        // setSelectedTop(presetToLoad.items.top);
        // ...
        console.log("Loading preset (mock):", presetToLoad.name);
    } else {
        // Очистить манекен, если выбран пустой "Your Saved Presets" или пресет без items
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
      } else { // Если selectedPreset пуст (например, выбрано "Your Saved Presets")
          loadPreset(null); // Вызываем для очистки манекена
      }
  }, [selectedPreset, savedPresets]); // Добавил savedPresets в зависимости


  return (
    <div className="outfit-selector-page">
      <Navbar />
      <main className="os-main-content">
        {/* === Левая колонка === */}
        <div className="os-left-sidebar">
          {/* Дропдаун "Your Saved Presets" теперь здесь */}
          <div className="os-dropdown-container presets-dropdown-container">
            <label htmlFor="savedPresets" className="os-label visually-hidden">Your Saved Presets</label>
            <select 
              id="savedPresets" 
              className="os-dropdown"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
            >
              <option value="">Your Saved Presets</option> {/* Плейсхолдер/дефолтная опция */}
              {savedPresets.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.name}</option>
              ))}
            </select>
            {/* Стрелка управляется через CSS */}
          </div>

          {/* Текст "You could pick..." теперь здесь */}
          <p className="os-sidebar-text">You could pick clothes yourself or let AI make it for you!</p>
          
          {/* "Манекен" / Слоты для выбранной одежды */}
          <div className="os-mannequin-area">
            <div className="mannequin-slot slot-headwear" onClick={() => setSelectedHeadwear(null)} title={selectedHeadwear ? `Remove ${selectedHeadwear.name}` : ""}>
              {selectedHeadwear ? <img src={selectedHeadwear.imageUrl} alt={selectedHeadwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Головной убор</span>}
            </div>
            <div className="mannequin-slot slot-outerwear" onClick={() => setSelectedOuterwear(null)} title={selectedOuterwear ? `Remove ${selectedOuterwear.name}` : ""}>
              {selectedOuterwear ? <img src={selectedOuterwear.imageUrl} alt={selectedOuterwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Верхний слой</span>}
            </div>
            <div className="mannequin-slot slot-top" onClick={() => setSelectedTop(null)} title={selectedTop ? `Remove ${selectedTop.name}` : ""}>
              {selectedTop ? <img src={selectedTop.imageUrl} alt={selectedTop.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Верх (футболка и т.д.)</span>}
            </div>
            <div className="mannequin-slot slot-bottom" onClick={() => setSelectedBottom(null)} title={selectedBottom ? `Remove ${selectedBottom.name}` : ""}>
              {selectedBottom ? <img src={selectedBottom.imageUrl} alt={selectedBottom.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Низ</span>}
            </div>
            <div className="mannequin-slot slot-footwear" onClick={() => setSelectedFootwear(null)} title={selectedFootwear ? `Remove ${selectedFootwear.name}` : ""}>
              {selectedFootwear ? <img src={selectedFootwear.imageUrl} alt={selectedFootwear.name} /> : <span className="slot-placeholder"><span className="plus-icon">+</span>Обувь</span>}
            </div>
          </div>
          
          {/* Сохранение пресета остается внизу левой колонки */}
          <div className="os-preset-controls">
            <label htmlFor="savePresetName" className="os-label">Save that preset as</label>
            <div className="os-input-group">
              <input 
                type="text" 
                id="savePresetName" 
                className="os-input"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="My Awesome Look" 
              />
              <button className="os-button-save" onClick={handleSavePreset}>Save</button>
            </div>
          </div>
        </div>

        {/* === Центральная колонка (только сетка и кнопка AI) === */}
        <div className="os-center-content">
          {/* <div className="os-top-controls"> ЭТОТ БЛОК ПЕРЕМЕЩЕН ВЛЕВО </div> */}

          <div className="os-clothing-grid-container">
            <div className="os-clothing-grid">
              {userCloset.length > 0 ? userCloset.map(item => (
                <div 
                  key={item.id} 
                  className="os-clothing-item-card"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  tabIndex={0} 
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleUseItem(item); } }} // USE по Enter/Space
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
          
          <div className="os-ai-action"> {/* Контейнер для кнопки AI для лучшего позиционирования */}
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