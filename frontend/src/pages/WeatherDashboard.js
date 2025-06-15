// src/pages/WeatherDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks/useWeather';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/WeatherDashboard.css';


// ... (твои импорты иконок, картинок и т.д. остаются) ...
import calendarIcon from '../assets/images/calendar.png';
import rainIcon from '../assets/images/rainy.png';
import thunderIcon from '../assets/images/rain_storm.png';
import cloudIcon from '../assets/images/cloud.png';
import partlyCloudyIcon from '../assets/images/partly_cloudy.png';
// Переконайтеся, що імпортуємо те, що експортується з gallery.js
import allPhotos from '../assets/images/gallery'; // Це тепер масив об'єктів { id, imageUrl, name }

// Добавляем иконку сердца, если она будет использоваться
// import heartIconOutline from '../assets/images/heart-outline.svg';
// import heartIconFilled from '../assets/images/heart-filled.svg';

const cities = ['Antwerp, Belgium', 'Berlin, Germany', 'Paris, France'];

const weatherIcons = {
  'partly_cloudy.png': partlyCloudyIcon,
  'rainy.png': rainIcon,
  'rain_storm.png': thunderIcon,
  'cloud.png': cloudIcon
};

export default function WeatherDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setOpen] = useState(false);
  const [activePhoto, setActive] = useState(0); // Индекс для карусели основного фото
  const { weather, loading, error, city, setCity } = useWeather();
  const { t } = useLanguage();

  // Состояние для текущей даты и времени (чтобы они обновлялись)
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentDateTime(new Date()), 60000); // Обновлять время каждую минуту
    return () => clearInterval(timerId);
  }, []);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); // Формат "10 April 2025"
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }); // Формат "15:10"
  };

  // --- ПОЧАТОК ВИПРАВЛЕНЬ ---
  // Отримуємо поточний об'єкт вбрання з масиву allPhotos за індексом activePhoto
  const currentOutfit = allPhotos && allPhotos.length > 0 && activePhoto < allPhotos.length
                        ? allPhotos[activePhoto]
                        : null;

  // Визначаємо зображення, назву та підтекст
  // Якщо немає об'єктів у allPhotos, використовуємо заглушки.
  // partslyCloudyIcon тут використовується як приклад заглушки зображення.
  // В ідеалі варто мати окремий файл з плейсхолдером "без зображення".
  const defaultPlaceholderImage = partlyCloudyIcon; // Або будь-яка інша імпортована заглушка
  const defaultPlaceholderName = t('noOutfitAvailable');
  const defaultPlaceholderSubtext = t('addClothesToClosetSuggestion');

  const currentOutfitImage = currentOutfit ? currentOutfit.imageUrl : defaultPlaceholderImage;
  const currentOutfitName = currentOutfit ? currentOutfit.name : defaultPlaceholderName;
  // Підтекст можна змінювати залежно від того, чи доступний об'єкт вбрання
  const currentOutfitSubtext = currentOutfit ? t('goodOutfitOption') : defaultPlaceholderSubtext;
  // --- КІНЕЦЬ ВИПРАВЛЕНЬ ---
  
  // Read selected period from localStorage
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const stored = localStorage.getItem('selectedPeriod');
    return stored ? JSON.parse(stored) : null;
  });
  
  // ... (остальная твоя логика getMockTemp, getOutfitSuggestion, getOutfitImage, outfitSets остается без изменений) ...

  if (loading && !weather) { // Добавил !weather, чтобы не показывать лоадер если данные уже есть
    return (
      <div className="weather-dashboard-container">
        <div className="loading-message">{t('loadingWeatherData')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-dashboard-container">
        <div className="error-message">{t('weatherDataError')} {error}</div>
      </div>
    );
  }

  // Основной рендер компонента
  return (
    <div className="weather-dashboard-container"> {/* Общий контейнер страницы */}

      
      <main className="dashboard-content"> {/* Контент между Navbar и Footer */}
        {/* Tabs (оставляем как есть, если нужны) */}
        <div className="tabs-container">
          {[t('insideTab'),t('mixTab'),t('outsideTab')].map(tab => (
            <div key={tab} className={`tab${tab===t('mixTab') ? ' active':''}`}>{tab}</div>
          ))}
        </div>

        {/* Блок предложений по выбранному периоду времени (из TimelineSelector) */}
        {selectedPeriod && (() => {
          const temp = Math.floor(Math.random() * 16) + 10; // getMockTemp(selectedPeriod.start, selectedPeriod.end);
          let suggestion = "Placeholder suggestion"; // getOutfitSuggestion(temp);
          // Эта логика у тебя была, просто немного упрощаю для фокуса на дизайне главного блока
          if (temp < 15) {
            suggestion = t('tShirtHoodieSuggestion');
          } else {
            suggestion = t('whiteTShirtSuggestion');
          }
          return (
            <div className="timeline-suggestion-banner">
              <span>{t('selectedPeriodLabel')} <b>{selectedPeriod.start}–{selectedPeriod.end}</b> ({selectedPeriod.desc})</span>
              <span>{t('temperatureLabel')} <b>{temp}{t('celsiusSymbol')}</b> — {t('suggestionLabel')} <b>{suggestion}</b></span>
            </div>
          );
        })()}


        {/* Основная карточка с одеждой, погодой - НОВЫЙ ДИЗАЙН */}
        <section className="outfit-display-card">
          <div className="outfit-card-header-pills">
            <div className="info-pill date-pill">{formatDate(currentDateTime)}</div>
            <div className="info-pill time-pill">{formatTime(currentDateTime)}</div>
          </div>

          <div className="outfit-card-body">
            <div className="outfit-image-carousel">
              {/* Карусель изображений */}
              <img 
                src={currentOutfitImage} // Использовать currentOutfitImage, определенное выше
                alt={currentOutfitName} // Использовать currentOutfitName, определенное выше
                className="current-outfit-image"
              />
              {/* Точки для навигации по карусели, если фото больше одного */}
              {allPhotos && allPhotos.length > 1 && (
                <div className="carousel-dots">
                  {allPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      className={`dot${idx === activePhoto ? ' active' : ''}`}
                      onClick={() => setActive(idx)}
                      aria-label={`${t('showOutfit')} ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="outfit-details">
              <div className="current-temperature">{weather?.current?.temperature ?? 'N/A'}{t('celsiusSymbol')}</div>
              <h2 className="outfit-name">{currentOutfitName}</h2> {/* Использовать currentOutfitName */}
              <p className="outfit-subtext">{currentOutfitSubtext}</p> {/* Использовать currentOutfitSubtext */}
              {/* <p className="weather-condition-summary">{weather?.current?.description ?? 'Weather data unavailable'}</p> */}
              {/* Можно добавить больше деталей о погоде тут */}
            </div>
          </div>
          
          <div className="outfit-card-actions">
            {/* <button className="heart-button">🤍</button> {/* Иконка сердца */}
             {/* ИЛИ SVG/IMG иконка */}
             <span className="heart-icon" role="button" tabIndex={0} onClick={() => console.log('Heart clicked!')}>
                {/* Вставить SVG сердца сюда или использовать текстовый символ */}
                {/* Например: <img src={heartIconOutline} alt="Favorite" /> */}
                ♡ 
             </span>
          </div>
        </section>
        
        {/* Кнопка Add Clothes (под основной карточкой) */}
        <button className="add-clothes-button" onClick={() => navigate('/closet')}> {/* Уточни путь для добавления */}
          {/* <img src={plusIcon} alt="" className="plus-icon"/> */}
          <span>{t('addClothesButton')}</span>
        </button>


        {/* Daily alert (оставляем твою логику) */}
        <div className="daily-alert-row">
          <div className="daily-alert-clickable" onClick={() => navigate('/timeline')}>
            <img src={calendarIcon} alt="calendar" className="calendar-icon-small" />
            <div>
              <div className="alert-title"><b>{t('adjustDayScheduleTitle')}</b></div>
              <div className="alert-desc">{t('getRelevantSuggestions')}</div>
            </div>
          </div>
        </div>

        {/* Hourly forecast (оставляем твою логику) */}
        <section className="weather-hourly-forecast">
          <div className="forecast-header">
            <h2>{t('weatherForTheDay')}</h2>
            <div className="location-dropdown-container" onClick={() => setOpen(o => !o)}>
              {t('locationSymbol')} {city} ▼
              {dropdownOpen && (
                <div className="city-dropdown">
                  {cities.filter(c => c !== city).map((c,i) => (
                    <div key={i} className="city-dropdown-item" onClick={(e) => { e.stopPropagation(); setCity(c); setOpen(false); }}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="hourly-forecast-list">
            {weather?.hourly?.slice(0, 6).map((hour, index) => ( // Ограничим до 6 для примера
              <div className="hourly-forecast-item" key={index}>
                <img src={weatherIcons[hour.weatherIcon] || cloudIcon} alt="" className="forecast-item-icon" />
                <div className="forecast-item-temp">{hour.temperature}°</div>
                <div className="forecast-item-time">{hour.time}</div>
              </div>
            ))}
          </div>
        </section>
      </main> {/* Конец dashboard-content */}
    </div> // Конец weather-dashboard-container
  );
}