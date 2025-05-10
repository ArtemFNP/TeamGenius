import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks/useWeather';
import './WeatherDashboard.css';

import calendarIcon from '../assets/images/calendar.png';
import rainIcon from '../assets/images/rainy.png';
import thunderIcon from '../assets/images/rain_storm.png';
import cloudIcon from '../assets/images/cloud.png';
import partlyCloudyIcon from '../assets/images/partly_cloudy.png';
import allPhotos from '../assets/images/gallery';

const cities = ['Antwerp, Belgium', 'Berlin, Germany', 'Paris, France'];

// Weather icon mapping
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
  const [activePhoto, setActive] = useState(0);
  const { weather, loading, error, city, setCity } = useWeather();

  // captions array must match allPhotos length
  const captions = [
    'Light beige cotton T-shirt',
    'Denim jacket with fleece lining',
    'Classic white sneakers',
  ];

  if (loading) {
    return (
      <div className="weather-dashboard wide">
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-dashboard wide">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="weather-dashboard wide">
      {/* Top navbar */}
      <nav className="top-navbar">
        <div className="nav-item" onClick={() => navigate('/outfit-selector')}>Closet</div>
        <div className="nav-item active" onClick={() => navigate('/')}>Home</div>
        <div className="nav-item" onClick={() => navigate('/outfit')}>Add item</div>
      </nav>

      {/* Tabs */}
      <div className="tabs-container">
        {['Inside','Mix','Outside'].map(tab => (
          <div key={tab} className={`tab${tab==='Mix' ? ' active':''}`}>{tab}</div>
        ))}
      </div>

      {/* Main card */}
      <section className="weather-main-card large wide">
        <div className="weather-date-time large wide">
          <span>{new Date().toLocaleDateString()}</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>

        <div className="weather-main-content large wide">
          {/* Photo + dots */}
          <div className="photo-display">
            <img
              src={allPhotos[activePhoto]}
              alt={`Outfit ${activePhoto+1}`}
            />
            <div className="dots-container">
              {allPhotos.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot${idx===activePhoto ? ' active':''}`}
                  onClick={() => setActive(idx)}
                  aria-label={`Show photo ${idx+1}`}
                />
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="weather-info large wide">
            <div className="weather-temp large wide">{weather?.current?.temperature}° C</div>
            <div className="weather-desc large wide">
              <strong>{captions[activePhoto] || '—'}</strong>
            </div>
            <div className="weather-update large wide">{weather?.current?.description}</div>
            <div className="weather-extra-info wide">
              Humidity: {weather?.current?.humidity}% | Wind: {weather?.current?.windSpeed} km/h
            </div>
          </div>
        </div>
      </section>

      {/* Daily alert */}
      <div className="daily-alert-row wide">
        <div
          className="daily-alert-clickable calendar wide"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/timeline')}
        >
          <img src={calendarIcon} alt="calendar" className="calendar-icon-large wide" />
          <div>
            <div className="alert-title schedule wide"><b>Adjust your day schedule</b></div>
            <div className="alert-desc schedule wide">Get most relevant suggestions</div>
          </div>
        </div>
      </div>

      {/* Hourly forecast */}
      <section className="weather-hourly">
        <div className="weather-hourly-header">
          <h2>Weather for the day</h2>
          <div className="location-right" onClick={() => setOpen(o => !o)}>
            📍 {city} ▼
            {dropdownOpen && (
              <div className="city-dropdown">
                {cities.filter(c => c!==city).map((c,i) => (
                  <div key={i} className="city-dropdown-item" onClick={() => { setCity(c); setOpen(false); }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hourly-list wide">
          {weather?.hourly?.map((hour, index) => (
            <div className="hourly-item wide" key={index}>
              <img src={weatherIcons[hour.weatherIcon]} alt="" className="weather-icon-large wide" />
              <div className="hourly-temp wide">{hour.temperature}°</div>
              <div className="hourly-time wide">{hour.time}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
