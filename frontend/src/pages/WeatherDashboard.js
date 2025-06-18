// src/pages/WeatherDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks/useWeather';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/WeatherDashboard.css';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ... (ваши импорты иконок, картинок и т.д. остаются) ...
import calendarIcon from '../assets/images/calendar.png';
import rainIcon from '../assets/images/rainy.png';
import thunderIcon from '../assets/images/rain_storm.png';
import cloudIcon from '../assets/images/cloud.png';
import partlyCloudyIcon from '../assets/images/partly_cloudy.png';
import allPhotos from '../assets/images/gallery';
import sunnyIcon from '../assets/images/sunny.png';

const cities = ['Antwerp, Belgium', 'Berlin, Germany', 'Paris, France', 'Kyiv, Ukraine', 'Kharkiv, Ukraine'];

const weatherIcons = {
  'sunny.png': sunnyIcon,
  'partly_cloudy.png': partlyCloudyIcon,
  'rainy.png': rainIcon,
  'rain_storm.png': thunderIcon,
  'cloud.png': cloudIcon
};

export default function WeatherDashboard() {
  const navigate = useNavigate();
  // const [search, setSearch] = useState(''); // Не используется, можно убрать
  const [dropdownOpen, setOpen] = useState(false);
  const [activePhoto, setActive] = useState(0);
  const { weather, loading, error, city, setCity } = useWeather();
  const { t } = useLanguage();

  const [displayDay, setDisplayDay] = useState('today');

  const [lastTimelineSelection] = useLocalStorage('lastTimelineSelection', null);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timerId);
  }, []);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const currentOutfit = allPhotos && allPhotos.length > 0 && activePhoto < allPhotos.length
                        ? allPhotos[activePhoto]
                        : null;

  const defaultPlaceholderImage = partlyCloudyIcon;
  const defaultPlaceholderName = t('noOutfitAvailable');
  const defaultPlaceholderSubtext = t('addClothesToClosetSuggestion');

  const currentOutfitImage = currentOutfit ? currentOutfit.imageUrl : defaultPlaceholderImage;
  const currentOutfitName = currentOutfit ? currentOutfit.name : defaultPlaceholderName;
  const currentOutfitSubtext = currentOutfit ? t('goodOutfitOption') : defaultPlaceholderSubtext;

  if (loading && !weather) {
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

  return (
    <div className="weather-dashboard-container">
      <main className="dashboard-content">
        <div className="tabs-container">
          <div key="currentSituation" className="tab active">{t('currentSituationTab')}</div>
        </div>

        {lastTimelineSelection && weather?.hourly?.length > 0 && (() => {
          const startHour = parseInt(lastTimelineSelection.startTime.split(':')[0], 10);
          const endHour = parseInt(lastTimelineSelection.endTime.split(':')[0], 10);

          let sumTemp = 0;
          let count = 0;
          let periodDescription = lastTimelineSelection.goal;

          weather.hourly.forEach(hourData => {
            const forecastHour = parseInt(hourData.time, 10);
            if (startHour <= endHour) {
              if (forecastHour >= startHour && forecastHour <= endHour) {
                sumTemp += hourData.temperature;
                count++;
              }
            } else {
              if (forecastHour >= startHour || forecastHour <= endHour) {
                sumTemp += hourData.temperature;
                count++;
              }
            }
          });

          const periodTemp = count > 0 ? Math.round(sumTemp / count) : 'N/A';

          let suggestion = periodDescription; 
          if (!suggestion) {
            if (periodTemp !== 'N/A') {
              if (periodTemp < 15) {
                suggestion = t('tShirtHoodieSuggestion');
              } else {
                suggestion = t('whiteTShirtSuggestion');
              }
            } else {
              suggestion = t('noWeatherSuggestion');
            }
          }

          return (
            <div className="timeline-suggestion-banner">
              <span>{t('selectedPeriodLabel')} <b>{lastTimelineSelection.startTime}–{lastTimelineSelection.endTime}</b> ({periodDescription || t('noPreset')})</span>
              <span>{t('temperatureLabel')} <b>{periodTemp}{t('celsiusSymbol')}</b> — {t('suggestionLabel')} <b>{suggestion}</b></span>
            </div>
          );
        })()}

        <section className="outfit-display-card">
          <div className="outfit-card-header-pills">
            <div className="info-pill date-pill">{formatDate(currentDateTime)}</div>
            <div className="info-pill time-pill">{formatTime(currentDateTime)}</div>
          </div>

          <div className="outfit-card-body">
            <div className="outfit-image-carousel">
              <img 
                src={currentOutfitImage}
                alt={currentOutfitName}
                className="current-outfit-image"
              />
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
              <h2 className="outfit-name">{currentOutfitName}</h2>
              <p className="outfit-subtext">{currentOutfitSubtext}</p>
            </div>
          </div>
          
          <div className="outfit-card-actions">
             <span className="heart-icon" role="button" tabIndex={0} onClick={() => console.log('Heart clicked!')}>
                ♡ 
             </span>
          </div>
        </section>
        
        <button className="add-clothes-button" onClick={() => navigate('/closet')}>
          <span>{t('addClothesButton')}</span>
        </button>

        <div className="daily-alert-row">
          <div className="daily-alert-clickable" onClick={() => navigate('/timeline')}>
            <img src={calendarIcon} alt="calendar" className="calendar-icon-small" />
            <div>
              <div className="alert-title"><b>{t('adjustDayScheduleTitle')}</b></div>
              <div className="alert-desc">{t('getRelevantSuggestions')}</div>
            </div>
          </div>
        </div>

        {/* ====================================================================== */}
        {/* ======================= НАЧАЛО ИСПРАВЛЕННОГО БЛОКА ======================= */}
        {/* ====================================================================== */}
        <section className="weather-hourly-forecast">
          <div className="forecast-header">
            <h2>{t('weatherForTheDay')}</h2>
            <div className="forecast-day-navigation">
              <span 
                className={`day-nav-link ${displayDay === 'today' ? 'active' : ''}`}
                onClick={() => setDisplayDay('today')}
              >
                {t('today')}
              </span>
              <span 
                className={`day-nav-link ${displayDay === 'tomorrow' ? 'active' : ''}`}
                onClick={() => setDisplayDay('tomorrow')}
              >
                {t('tomorrow')}
              </span>
            </div>
            <div className="location-dropdown-container" onClick={() => setOpen(o => !o)}>
              📍 {city} ▼
              {dropdownOpen && (
                <div className="city-dropdown">
                  {cities.filter(c => c !== city).map((c, i) => (
                    <div key={i} className="city-dropdown-item" onClick={(e) => { e.stopPropagation(); setCity(c); setOpen(false); }}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="hourly-forecast-list">
            {(() => {
              if (!weather?.hourly || weather.hourly.length === 0) {
                return <p className="no-hourly-data-message">{t('noHourlyWeatherData')}</p>;
              }

              const HOURS_TO_SHOW = 6;
              const TOMORROW_START_HOUR = 8;
             
              const today = new Date();
              const todayFormatted = today.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
              const currentHour = today.getHours();

              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              // Correct date formatting to YYYY-MM-DD to match backend data
              const tomorrowFormatted = tomorrow.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

              console.log('Raw hourly weather data from backend:', weather?.hourly);
              console.log('Today formatted:', todayFormatted, 'Tomorrow formatted:', tomorrowFormatted);

              const todayForecasts = weather.hourly
                .filter(hourData => {
                  const forecastHour = parseInt(hourData.time, 10);
                  return hourData.date === todayFormatted && forecastHour >= currentHour;
                });
              
              console.log('Today raw forecasts after filter:', todayForecasts);

              const tomorrowForecasts = weather.hourly
                .filter(hourData => {
                  const forecastHour = parseInt(hourData.time, 10);
                  // Filter for 8:00 to 23:00 for tomorrow
                  return hourData.date === tomorrowFormatted && forecastHour >= TOMORROW_START_HOUR && forecastHour <= 23;
                })
                .sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));

              console.log('Tomorrow raw forecasts after filter (before slice):', tomorrowForecasts);

              const finalTodayForecasts = todayForecasts.slice(0, HOURS_TO_SHOW);
              const finalTomorrowForecasts = tomorrowForecasts.slice(0, HOURS_TO_SHOW);

              const forecastsToDisplay = displayDay === 'today' ? finalTodayForecasts : finalTomorrowForecasts;
              
              console.log('Forecasts to display (final):', forecastsToDisplay);

              if (forecastsToDisplay.length === 0) {
                const message = displayDay === 'today' 
                  ? t('noMoreForecastsToday')
                  : t('noForecastsForTomorrowMorning');
                return <p className="no-hourly-data-message">{message}</p>;
              }

              return forecastsToDisplay.map((hourData) => {
                let displayIcon = sunnyIcon;
                if (hourData.weatherIcon && weatherIcons[hourData.weatherIcon]) {
                    displayIcon = weatherIcons[hourData.weatherIcon];
                }
                
                if (hourData.description && hourData.description.toLowerCase().includes('clear') && !hourData.description.toLowerCase().includes('rain')) {
                    displayIcon = sunnyIcon;
                }
                if (hourData.description && hourData.description.toLowerCase().includes('rain')) {
                  displayIcon = rainIcon;
                }
                
                const displayTime = `${String(hourData.time).padStart(2, '0')}:00`;

                return (
                  <div className="hourly-forecast-item" key={`${hourData.date}-${hourData.time}`}>
                    <img src={displayIcon} alt="Weather icon" className="forecast-item-icon" />
                    <div className="forecast-item-temp">{hourData.temperature}°</div>
                    <div className="forecast-item-time">{displayTime}</div>
                  </div>
                );
              });
            })()}
          </div>
        </section>
        {/* ====================================================================== */}
        {/* ======================== КОНЕЦ ИСПРАВЛЕННОГО БЛОКА ======================= */}
        {/* ====================================================================== */}
      </main>
    </div>
  );
}