// src/pages/TimelineSelector.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TimelineSelector.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function TimelineSelector() {
  const navigate = useNavigate();
  const timelineRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [dragInfo, setDragInfo] = useState(null);
  const { t } = useLanguage(); 

  // convert px → time between 06:00–24:00
  const pxToTime = px => {
    const { width } = timelineRef.current.getBoundingClientRect();
    let pct = Math.max(0, Math.min(1, px / width));
    const totalMins = Math.round(pct * 18 * 60) + 6 * 60; // 18 часов (с 06 до 24), 60 минут/час
    const h = String(Math.floor(totalMins / 60)).padStart(2, '0');
    const m = String(totalMins % 60).padStart(2, '0');
    return `${h}:${m}`;
  };

  const onMouseDown = e => {
    if (e.button !== 0) return;
    setDragInfo({ startX: e.nativeEvent.offsetX, currentX: e.nativeEvent.offsetX });
  };
  const onMouseMove = e => {
    dragInfo && setDragInfo(info => ({ ...info, currentX: e.nativeEvent.offsetX }));
  };
  const onMouseUp = () => {
    if (!dragInfo) return;
    const { startX, currentX } = dragInfo;
    const startTimeStr = pxToTime(Math.min(startX, currentX));
    const endTimeStr = pxToTime(Math.max(startX, currentX));
    
    // --- Добавляем логику для получения моковых погодных данных ---
    // В реальном приложении здесь будет вызов к бэкенду/API
    const currentHour = new Date().getHours();
    let mockTemp, mockCondition;

    // Очень простой моковый пример температуры и условий на основе текущего часа
    // (позже будет зависеть от выбранного времени)
    if (currentHour >= 22 || currentHour < 7) { // Night/Early morning
      mockTemp = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // 5-10 C
      mockCondition = (Math.random() < 0.3) ? 'rain' : 'clear'; // Шанс дождя ночью
    } else if (currentHour >= 7 && currentHour < 12) { // Morning
      mockTemp = Math.floor(Math.random() * (18 - 12 + 1)) + 12; // 12-18 C
      mockCondition = (Math.random() < 0.2) ? 'clouds' : 'clear';
    } else if (currentHour >= 12 && currentHour < 18) { // Afternoon
      mockTemp = Math.floor(Math.random() * (25 - 18 + 1)) + 18; // 18-25 C
      mockCondition = 'clear';
    } else { // Evening
      mockTemp = Math.floor(Math.random() * (20 - 15 + 1)) + 15; // 15-20 C
      mockCondition = (Math.random() < 0.4) ? 'rain' : 'clouds'; // Шанс дождя вечером
    }
    const mockWeatherDescription = (mockCondition === 'rain') ? t('rainy') : (mockCondition === 'clear') ? t('clearSky') : t('cloudy');


    // Запрашиваем описание периода от пользователя
    const desc = prompt(t('describePeriodPrompt', { start: startTimeStr, end: endTimeStr }), t('describePeriodPlaceholder'));
    
    if (desc !== null) {
      const newBlock = { start: startTimeStr, end: endTimeStr, desc };
      setBlocks(bs => [...bs, newBlock]);
      
      // Сохраняем ВСЕ необходимые данные в localStorage
      // chosenTime: выбранный диапазон
      // temperature: моковая температура для этого диапазона
      // condition: моковое погодное условие (rain, clear, clouds)
      // description: локализованное описание погоды
      // timestamp: время, когда это было сохранено (для проверки свежести)
      localStorage.setItem('selectedPeriodData', JSON.stringify({
        chosenTime: { start: startTimeStr, end: endTimeStr },
        weather: { 
          temperature: mockTemp, 
          condition: mockCondition, 
          description: mockWeatherDescription 
        },
        timestamp: Date.now() // Сохраняем текущий timestamp в миллисекундах
      }));

      // После сохранения данных, переходим на OutfitSelector
      navigate('/outfit-selector'); // <--- Перенаправляем на OutfitSelector
    }
    setDragInfo(null);
  };

  // hours from 6 to 24
  const hours = Array.from({ length: 19 }, (_, i) => i + 6);

  return (
    <div className="timeline-selector-page"> {/* <--- ВАША ОБОЛОЧКА СТРАНИЦЫ */}
      <section className="weather-main-card large wide">
        <h2 style={{ marginBottom: '1rem' }}>{t('selectDaysPeriod')}</h2> 

        <div
          className="timeline"
          ref={timelineRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ marginTop: '1rem' }}
        >
          {hours.map(h => (
            <div key={h} className="timeline-hour" style={{ left: `${((h - 6) / 18) * 100}%` }}>
              <span>{String(h).padStart(2, '0')}{t('hourSuffix')}</span> 
            </div>
          ))}

          {dragInfo && (
            <div
              className="timeline-drag"
              style={{
                left: `${(Math.min(dragInfo.startX, dragInfo.currentX) / timelineRef.current.clientWidth) * 100}%`,
                width: `${(Math.abs(dragInfo.currentX - dragInfo.startX) / timelineRef.current.clientWidth) * 100}%`
              }}
            />
          )}

          {blocks.map((b, i) => {
            const [sh, sm] = b.start.split(':').map(Number);
            const [eh, em] = b.end.split(':').map(Number);
            const startPct = ((sh * 60 + sm) - 6 * 60) / (18 * 60) * 100;
            const widthPct = ((eh * 60 + em) - (sh * 60 + sm)) / (18 * 60) * 100;
            return (
              <div
                key={i}
                className="timeline-block"
                style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                title={t('periodDescriptionTitle', { start: b.start, end: b.end, desc: b.desc })} 
              >
                <span className="block-label">{b.desc}</span>
              </div>
            );
          })}
        </div>

        <div className="blocks-summary" style={{ marginTop: '1.5rem' }}>
          {blocks.map((b, i) => (
            <div key={i} className="block-item">
              <strong>{t('timeRange', { start: b.start, end: b.end })}</strong> {b.desc}
            </div>
          ))}
        </div>
        {/* Кнопка "Adjust your day schedule" (если это был статичный текст, локализовать) */}
        {/* <div className="weather-main-card-extra">
          <img src={calendarIcon} alt="Calendar" className="weather-extra-icon" />
          <p>{t('adjustDaySchedule')}</p>
        </div> */}

        {/* Секция "Weather for the day" (если это часть TimelineSelector, локализовать) */}
        {/* <div className="weather-for-day-section">
          <h2>{t('weatherForTheDay')}</h2>
          <span className="location-picker">{t('antwerpBelgium')}</span>
          <div className="weather-hourly-forecast">
            ...ваш почасовой прогноз...
          </div>
        </div> */}
      </section>
    </div>
  );
}