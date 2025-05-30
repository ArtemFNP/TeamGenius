import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks/useWeather';
import '../styles/WeatherDashboard.css';
import Navbar from '../components/Navbar';


import calendarIcon from '../assets/images/calendar.png';
import rainIcon from '../assets/images/rainy.png';
import thunderIcon from '../assets/images/rain_storm.png';
import cloudIcon from '../assets/images/cloud.png';
import partlyCloudyIcon from '../assets/images/partly_cloudy.png';
import allPhotos from '../assets/images/gallery';
import hoodieImg from '../assets/images/hoodie.png';
import tshirtBlackImg from '../assets/images/tshirtblack.png';
import tshirtWhiteImg from '../assets/images/tshirtwhite123.jpg';
import pantsImg from '../assets/images/2.png';



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

  // Read selected period from localStorage
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const stored = localStorage.getItem('selectedPeriod');
    return stored ? JSON.parse(stored) : null;
  });

  // Mock: get temperature for selected period (in real app, fetch from API)
  const getMockTemp = (start, end) => {
    // Just return a random temp for demo
    return Math.floor(Math.random() * 16) + 10; // 10-25°C
  };

  // Mock: get outfit suggestion based on temp
  const getOutfitSuggestion = (temp) => {
    if (temp < 14) return 'Wear a jacket and pants';
    if (temp < 20) return 'A t-shirt and jeans are fine';
    return 'T-shirt and shorts!';
  };

  // Функция для выбора картинки по рекомендации
  const getOutfitImage = (suggestion) => {
    if (suggestion.toLowerCase().includes('hoodie')) return hoodieImg;
    if (suggestion.toLowerCase().includes('black')) return tshirtBlackImg;
    if (suggestion.toLowerCase().includes('white')) return tshirtWhiteImg;
    if (suggestion.toLowerCase().includes('t-shirt')) {
      // Рандомно белая или чёрная футболка
      return Math.random() > 0.5 ? tshirtBlackImg : tshirtWhiteImg;
    }
    return tshirtWhiteImg;
  };

  // Сеты одежды для разных рекомендаций
  const outfitSets = [
    {
      suggestion: 'T-shirt and hoodie would be a nice option!',
      items: [
        { img: hoodieImg, label: 'Hoodie' },
        { img: tshirtWhiteImg, label: 'White T-shirt' },
        { img: pantsImg, label: 'Pants' },
      ]
    },
    {
      suggestion: 'Black t-shirt would be a nice option!',
      items: [
        { img: tshirtBlackImg, label: 'Black T-shirt' },
        { img: pantsImg, label: 'Pants' },
      ]
    },
    {
      suggestion: 'White t-shirt would be a nice option!',
      items: [
        { img: tshirtWhiteImg, label: 'White T-shirt' },
        { img: pantsImg, label: 'Pants' },
      ]
    },
  ];
  const [setIndex, setSetIndex] = useState(0);

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
      <Navbar />
    
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

        {selectedPeriod && (() => {
          const temp = getMockTemp(selectedPeriod.start, selectedPeriod.end);
          let suggestion = getOutfitSuggestion(temp);
          // Улучшаем рекомендации для примера
          let items = [];
          if (temp < 15) {
            suggestion = 'T-shirt and hoodie would be a nice option!';
            items = [
              { img: hoodieImg, label: 'Hoodie' },
              { img: tshirtWhiteImg, label: 'White T-shirt' },
              { img: pantsImg, label: 'Pants' },
            ];
          } else {
            suggestion = 'White t-shirt would be a nice option!';
            items = [
              { img: tshirtWhiteImg, label: 'White T-shirt' },
              { img: pantsImg, label: 'Pants' },
            ];
          }
          return (
            <div style={{ marginBottom: 24, fontSize: 20, fontWeight: 500 }}>
              <div>
                <span style={{ fontWeight: 700 }}>{selectedPeriod.start}–{selectedPeriod.end}</span> {selectedPeriod.desc}
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Сет одежды */}
                <div style={{ display: 'flex', gap: 12 }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={item.img} alt={item.label} style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                      <span style={{ marginTop: 6, fontSize: 15 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <span style={{ marginLeft: 24 }}>
                  Temperature: <b>{temp}°C</b> —
                  Suggestion: <b>{suggestion}</b>
                </span>
              </div>
            </div>
          );
        })()}

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
