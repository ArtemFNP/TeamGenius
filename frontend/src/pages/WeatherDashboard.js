// src/pages/WeatherDashboard.js
import React, { useState, useEffect } from 'react'; // Добавил useEffect для динамического времени
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks/useWeather';
import '../styles/WeatherDashboard.css';
import Navbar from '../components/Navbar';

// ... (твои импорты иконок, картинок и т.д. остаются) ...
import calendarIcon from '../assets/images/calendar.png';
import rainIcon from '../assets/images/rainy.png';
import thunderIcon from '../assets/images/rain_storm.png';
import cloudIcon from '../assets/images/cloud.png';
import partlyCloudyIcon from '../assets/images/partly_cloudy.png';
import allPhotos from '../assets/images/gallery'; // Предположим, что это массив путей к изображениям
// import plusIcon from '../assets/images/plusadd.png'; // Если нужен для кнопки Add Clothes

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


  // Используем фото из allPhotos для главного дисплея, если они есть. 
  // Если нет, можно оставить статическое или одно из предложенных
  const currentOutfitImage = allPhotos && allPhotos.length > 0 ? allPhotos[activePhoto] : tshirtWhiteImg; // Fallback to tshirtWhiteImg
  const currentOutfitName = "H&M White T-Shirt"; // Пример названия, можно брать из массива captions если allPhotos используется
  const currentOutfitSubtext = "That option is going to be good!";
  
  // captions array должен соответствовать allPhotos, если он используется
  // const captions = [ 
  //   'Light beige cotton T-shirt',
  //   'Denim jacket with fleece lining',
  //   'Classic white sneakers',
  // ];


  // Read selected period from localStorage
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const stored = localStorage.getItem('selectedPeriod');
    return stored ? JSON.parse(stored) : null;
  });
  
  // ... (остальная твоя логика getMockTemp, getOutfitSuggestion, getOutfitImage, outfitSets остается без изменений) ...

  if (loading && !weather) { // Добавил !weather, чтобы не показывать лоадер если данные уже есть
    return (
      <div className="weather-dashboard-container">
        <Navbar />
        <div className="loading-message">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-dashboard-container">
        <Navbar />
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  // Основной рендер компонента
  return (
    <div className="weather-dashboard-container"> {/* Общий контейнер страницы */}
      <Navbar />
      
      <main className="dashboard-content"> {/* Контент между Navbar и Footer */}
        {/* Tabs (оставляем как есть, если нужны) */}
        <div className="tabs-container">
          {['Inside','Mix','Outside'].map(tab => (
            <div key={tab} className={`tab${tab==='Mix' ? ' active':''}`}>{tab}</div>
          ))}
        </div>

        {/* Блок предложений по выбранному периоду времени (из TimelineSelector) */}
        {selectedPeriod && (() => {
          const temp = Math.floor(Math.random() * 16) + 10; // getMockTemp(selectedPeriod.start, selectedPeriod.end);
          let suggestion = "Placeholder suggestion"; // getOutfitSuggestion(temp);
          // Эта логика у тебя была, просто немного упрощаю для фокуса на дизайне главного блока
          if (temp < 15) {
            suggestion = 'T-shirt and hoodie would be a nice option!';
          } else {
            suggestion = 'White t-shirt would be a nice option!';
          }
          return (
            <div className="timeline-suggestion-banner">
              <span>Selected: <b>{selectedPeriod.start}–{selectedPeriod.end}</b> ({selectedPeriod.desc})</span>
              <span>Temp: <b>{temp}°C</b> — Suggestion: <b>{suggestion}</b></span>
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
              {/* Карусель изображений (если есть несколько, сейчас одно) */}
              <img 
                src={currentOutfitImage} 
                alt={currentOutfitName} 
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
                      aria-label={`Show outfit ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="outfit-details">
              <div className="current-temperature">{weather?.current?.temperature ?? 'N/A'}°C</div>
              <h2 className="outfit-name">{currentOutfitName}</h2>
              <p className="outfit-subtext">{currentOutfitSubtext}</p>
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
          <span>+ Add clothes</span>
        </button>


        {/* Daily alert (оставляем твою логику) */}
        <div className="daily-alert-row">
          <div className="daily-alert-clickable" onClick={() => navigate('/timeline')}>
            <img src={calendarIcon} alt="calendar" className="calendar-icon-small" />
            <div>
              <div className="alert-title"><b>Adjust your day schedule</b></div>
              <div className="alert-desc">Get most relevant suggestions</div>
            </div>
          </div>
        </div>

        {/* Hourly forecast (оставляем твою логику) */}
        <section className="weather-hourly-forecast">
          <div className="forecast-header">
            <h2>Weather for the day</h2>
            <div className="location-dropdown-container" onClick={() => setOpen(o => !o)}>
              📍 {city} ▼
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

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">SMART STYLE</div>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/services">Services</a>
            <a href="/technologies">Technologies</a>
            <a href="/join">Join Us</a>
            <a href="/conditions">Conditions</a>
            <a href="/licenses">Licenses</a>
            <a href="/faq">F.A.Q</a>
            <a href="/sitemap">Sitemap</a>
          </div>
          <div className="footer-social">
            <span>SOCIALIZE WITH US</span>
            <div className="social-icons">
              {/* Здесь должны быть SVG иконки или <img> */}
              <a href="#" aria-label="Instagram"><span className="social-icon placeholder-icon">IG</span></a>
              <a href="#" aria-label="Twitter"><span className="social-icon placeholder-icon">TW</span></a>
              <a href="#" aria-label="LinkedIn"><span className="social-icon placeholder-icon">IN</span></a>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          2023 © MADE - BY ARTEM FILATOV - ALL RIGHTS RESERVED
        </div>
      </footer>

    </div> // Конец weather-dashboard-container
  );
}