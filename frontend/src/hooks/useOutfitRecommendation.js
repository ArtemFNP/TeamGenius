// src/hooks/useOutfitRecommendation.js
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // Предполагается, что useLanguage доступен
// Можно убрать отсюда getRandomItem, если его не использовать где-то еще, и оставить в generateOutfit

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

export function useOutfitRecommendation(userCloset, weatherData) {
  const { t } = useLanguage();
  const [aiRecommendation, setAiRecommendation] = useState('');

  const generateOutfitViaAI = (setSelectedSlotFns) => { // setSelectedSlotFns - это функции-сеттеры из useMannequinSlots
    if (!weatherData) {
      alert(t('weatherDataNotAvailable'));
      return;
    }

    const { temperature, weatherCondition } = weatherData;
    let recommendedOutfit = {};
    let recommendationMessage = '';

    // !!! Логика подбора остается та же, но теперь работает с userCloset
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
    // Если слоты остались пустыми, заполняем любыми доступными
    if (!recommendedOutfit.headwear) { const headwear = userCloset.filter(item => item.category === 'headwear'); if (headwear.length > 0) recommendedOutfit.headwear = getRandomItem(headwear); }
    if (!recommendedOutfit.top) { const tops = userCloset.filter(item => item.category === 'top'); if (tops.length > 0) recommendedOutfit.top = getRandomItem(tops); }
    if (!recommendedOutfit.outerwear) { const outerwear = userCloset.filter(item => item.category === 'outerwear'); if (outerwear.length > 0) recommendedOutfit.outerwear = getRandomItem(outerwear); }
    if (!recommendedOutfit.bottom) { const bottoms = userCloset.filter(item => item.category === 'bottom'); if (bottoms.length > 0) recommendedOutfit.bottom = getRandomItem(bottoms); }
    if (!recommendedOutfit.footwear) { const footwear = userCloset.filter(item => item.category === 'shoes'); if (footwear.length > 0) recommendedOutfit.footwear = getRandomItem(footwear); }

    // Используем переданные функции-сеттеры для обновления состояния манекена
    setSelectedSlotFns.setSelectedHeadwear(recommendedOutfit.headwear || null);
    setSelectedSlotFns.setSelectedTop(recommendedOutfit.top || null);
    setSelectedSlotFns.setSelectedOuterwear(recommendedOutfit.outerwear || null);
    setSelectedSlotFns.setSelectedBottom(recommendedOutfit.bottom || null);
    setSelectedSlotFns.setSelectedFootwear(recommendedOutfit.footwear || null);

    setAiRecommendation(recommendationMessage);
  };

  return { aiRecommendation, generateOutfitViaAI };
}