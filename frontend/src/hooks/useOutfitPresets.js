// src/hooks/useOutfitPresets.js
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useLanguage } from '../contexts/LanguageContext'; // <<< ДОБАВИТЬ: импортируем useLanguage

const mockInitialPresets = [ // Стартовые пресеты (только если localStorage пуст!)
  { id: 'preset1', name: 'Summer Chill Vibe', config: { headwearId: null, topId: null, outerwearId: null, bottomId: null, footwearId: null } },
  { id: 'preset2', name: 'MyPerfectOutFit', config: { headwearId: null, topId: null, outerwearId: null, bottomId: null, footwearId: null } },
];


export function useOutfitPresets(userCloset) { // Зависимость от userCloset для загрузки
  const { t } = useLanguage(); // <<< ДОБАВИТЬ: инициализируем хук языка

  const [savedPresets, setSavedPresets] = useLocalStorage('savedPresets', mockInitialPresets);
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [newPresetName, setNewPresetName] = useState('');

  // Логика сохранения пресета
  const savePreset = (currentOutfitConfig, presetName) => {
    if (!presetName.trim()) {
      alert(t('pleaseEnterPresetName')); // Алерт теперь вызывается прямо здесь
      return; // Прекращаем выполнение
    }
    const newPresetData = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      config: currentOutfitConfig
    };
    setSavedPresets(prev => [newPresetData, ...prev]);
    setNewPresetName('');
    setSelectedPresetId(newPresetData.id);
    alert(t('presetSavedAlert', { name: newPresetData.name })); // Алерт об успешном сохранении тоже здесь
  };

  // Логика загрузки пресета
  const loadPreset = (presetId) => {
    const presetToLoad = savedPresets.find(p => p.id === presetId);
    if (presetToLoad && presetToLoad.config) {
        // Находим реальные объекты одежды по ID в текущем userCloset
        const loadedHeadwear = userCloset.find(item => item.id === presetToLoad.config.headwearId) || null;
        const loadedTop = userCloset.find(item => item.id === presetToLoad.config.topId) || null;
        const loadedOuterwear = userCloset.find(item => item.id === presetToLoad.config.outerwearId) || null;
        const loadedBottom = userCloset.find(item => item.id === presetToLoad.config.bottomId) || null;
        const loadedFootwear = userCloset.find(item => item.id === presetToLoad.config.footwearId) || null;
        return {
            headwear: loadedHeadwear,
            top: loadedTop,
            outerwear: loadedOuterwear,
            bottom: loadedBottom,
            footwear: loadedFootwear,
            name: presetToLoad.name // Возвращаем название для потенциального использования
        };
    }
    // Если пресет не найден или пустой, возвращаем null для всех слотов
    return {
        headwear: null, top: null, outerwear: null, bottom: null, footwear: null, name: ''
    };
  };

  return {
    savedPresets,
    selectedPresetId,
    setSelectedPresetId,
    newPresetName,
    setNewPresetName,
    savePreset,
    loadPreset
  };
}