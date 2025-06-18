// src/hooks/useOutfitRecommendation.js
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // Предполагается, что useLanguage доступен
// Можно убрать отсюда getRandomItem, если его не использовать где-то еще, и оставить в generateOutfit

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

export function useOutfitRecommendation(userCloset, weatherData, timelineAvgTemp = null) {
  const { t } = useLanguage();
  const [aiRecommendation, setAiRecommendation] = useState('');

  const generateOutfitViaAI = (setSelectedSlotFns) => { // setSelectedSlotFns - это функции-сеттеры из useMannequinSlots
    const tempToUse = timelineAvgTemp !== null ? timelineAvgTemp : (weatherData?.current?.temperature ?? null);

    if (tempToUse === null) {
      setAiRecommendation(t('weatherDataNotAvailable'));
      return;
    }

    const { description: weatherCondition } = weatherData?.current || {}; // Деструктурируем из weatherData.current, добавил защиту
    let recommendedOutfit = {};
    let recommendationMessage = '';
    let outfitComplete = true; // Флаг для проверки полноты образа

    // Логика подбора остается та же, но теперь работает с userCloset
    if (tempToUse < 10) {
      recommendationMessage = t('coldWeatherWarning');
      const warmOuterwear = userCloset.filter(item => item.category === 'outerwear' && item.warmthRating >= 3);
      const warmTops = userCloset.filter(item => item.category === 'top' && item.warmthRating >= 2);
      const warmBottoms = userCloset.filter(item => item.category === 'bottom' && item.warmthRating >= 3);
      const warmFootwear = userCloset.filter(item => item.category === 'footwear' && item.warmthRating >= 3 && item.isClosedToe);

      recommendedOutfit.outerwear = warmOuterwear.length > 0 ? getRandomItem(warmOuterwear) : null;
      recommendedOutfit.top = warmTops.length > 0 ? getRandomItem(warmTops) : null;
      recommendedOutfit.bottom = warmBottoms.length > 0 ? getRandomItem(warmBottoms) : null;
      recommendedOutfit.footwear = warmFootwear.length > 0 ? getRandomItem(warmFootwear) : null;

    } else if (tempToUse >= 10 && tempToUse <= 20) { // Например, для 12 градусов
      recommendationMessage = t('mildWeatherNotice');
      const mildOuterwear = userCloset.filter(item => item.category === 'outerwear' && item.warmthRating >= 2);
      const mildTops = userCloset.filter(item => item.category === 'top' && item.warmthRating >= 1);
      const mildBottoms = userCloset.filter(item => item.category === 'bottom' && item.warmthRating >= 1);
      const mildFootwear = userCloset.filter(item => item.category === 'footwear' && item.warmthRating >= 1 && item.isClosedToe);

      recommendedOutfit.outerwear = mildOuterwear.length > 0 ? getRandomItem(mildOuterwear) : null;
      recommendedOutfit.top = mildTops.length > 0 ? getRandomItem(mildTops) : null;
      recommendedOutfit.bottom = mildBottoms.length > 0 ? getRandomItem(mildBottoms) : null;
      recommendedOutfit.footwear = mildFootwear.length > 0 ? getRandomItem(mildFootwear) : null;

    } else { // Теплая погода
      recommendationMessage = t('hotWeatherWarning');
      const lightTops = userCloset.filter(item => item.category === 'top' && item.warmthRating <= 1);
      const lightBottoms = userCloset.filter(item => item.category === 'bottom' && item.warmthRating <= 2);
      const lightFootwear = userCloset.filter(item => item.category === 'footwear' && item.warmthRating <= 1);

      recommendedOutfit.top = lightTops.length > 0 ? getRandomItem(lightTops) : null;
      recommendedOutfit.bottom = lightBottoms.length > 0 ? getRandomItem(lightBottoms) : null;
      recommendedOutfit.footwear = lightFootwear.length > 0 ? getRandomItem(lightFootwear) : null;
    }

    // Дополнительная логика для дождя
    if (weatherCondition && weatherCondition.toLowerCase().includes('rain')) {
      const waterproofOuterwear = userCloset.filter(item => item.category === 'outerwear' && item.isWaterproof);
      const closedFootwear = userCloset.filter(item => item.category === 'footwear' && item.isClosedToe);
      if (waterproofOuterwear.length > 0) { recommendedOutfit.outerwear = getRandomItem(waterproofOuterwear); }
      if (closedFootwear.length > 0) { recommendedOutfit.footwear = getRandomItem(closedFootwear); }
      recommendationMessage += ` ${t('umbrellaRecommendation')}`;
    }

    // Проверка, есть ли все необходимые элементы для базового образа (топ, низ, обувь)
    if (!recommendedOutfit.top || !recommendedOutfit.bottom || !recommendedOutfit.footwear) {
        outfitComplete = false;
    }

    // Если для холодной/умеренной погоды не нашлось верхней одежды
    if (tempToUse < 20 && !recommendedOutfit.outerwear) { // Использовать 20 градусов как порог для нужды в верхней одежде
        outfitComplete = false;
    }

    // Если образ неполный, или если погода требует, а подходящей одежды нет
    if (!outfitComplete) {
        setAiRecommendation(t('notEnoughClothes'));
        // Сбрасываем все слоты, так как полноценный образ не удалось собрать
        setSelectedSlotFns.setSelectedHeadwear(null);
        setSelectedSlotFns.setSelectedTop(null);
        setSelectedSlotFns.setSelectedOuterwear(null);
        setSelectedSlotFns.setSelectedBottom(null);
        setSelectedSlotFns.setSelectedFootwear(null);
        return; 
    }

    // Если все ок, используем подобранные элементы
    setSelectedSlotFns.setSelectedHeadwear(recommendedOutfit.headwear || null);
    setSelectedSlotFns.setSelectedTop(recommendedOutfit.top || null);
    setSelectedSlotFns.setSelectedOuterwear(recommendedOutfit.outerwear || null);
    setSelectedSlotFns.setSelectedBottom(recommendedOutfit.bottom || null);
    setSelectedSlotFns.setSelectedFootwear(recommendedOutfit.footwear || null);

    setAiRecommendation(recommendationMessage);
  };

  return { aiRecommendation, setAiRecommendation, generateOutfitViaAI };
}