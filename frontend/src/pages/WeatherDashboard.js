import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WeatherDashboard.css';
import tshirtImg from '../assets/images/tshirt.png';
import rainIcon from '../assets/images/rainy.png';
import thunderIcon from '../assets/images/rain_storm.png';
import cloudIcon from '../assets/images/cloud.png';
import partlyCloudyIcon from '../assets/images/partly_cloudy.png';
import nightStormIcon from '../assets/images/night_storm.png';
import calendarIcon from '../assets/images/calendar.png';
import searchIcon from '../assets/images/search.png';
import homeIcon from '../assets/images/home.png';
import closetIcon from '../assets/images/closet1.png';
import photoIcon from '../assets/images/photo.png';

const hourlyWeather = [
  { time: '4:00 PM', temp: 15, icon: partlyCloudyIcon },
  { time: '5:00 PM', temp: 14, icon: rainIcon },
  { time: '6:00 PM', temp: 13, icon: thunderIcon },
  { time: '7:00 PM', temp: 12, icon: cloudIcon },
  { time: '9:00 PM', temp: 11, icon: cloudIcon },
  { time: '11:00 PM', temp: 7, icon: cloudIcon },
];

const dailyWeather = [
  { day: 'Tuesday', desc: 'Thunderstorm', temp: 19, icon: thunderIcon, selected: true },
  { day: 'Wednesday', desc: 'Heavy Rain', temp: 17, icon: rainIcon },
  { day: 'Thursday', desc: 'Heavy Rain', temp: 17, icon: rainIcon },
];

const cities = ['Antwerp, Belgium', 'Berlin, Germany', 'Paris, France'];

export default function WeatherDashboard() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState(cities[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="weather-dashboard wide">
      <nav className="top-navbar">
        <div className="nav-item" onClick={() => navigate('/outfit-selector')}>
          <img src={closetIcon} alt="closet" className="nav-icon" />
          <span>Closet</span>
        </div>
        <div className="nav-item active" onClick={() => navigate('/') }>
          <img src={homeIcon} alt="home" className="nav-icon" />
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/outfit')}>
          <img src={photoIcon} alt="add item" className="nav-icon" />
          <span>Add item</span>
        </div>
      </nav>
      <div className="search-bar-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <img src={searchIcon} alt="search" className="search-bar-icon" />
      </div>
      <div className="tabs-container">
        <div className="tab">Inside</div>
        <div className="tab active">Mix</div>
        <div className="tab">Outside</div>
      </div>
      <section className="weather-main-card large wide">
        <div className="weather-date-time large wide">
          <span>10 April 2025</span>
          <span>3:30 PM</span>
        </div>
        <div className="weather-main-content large wide">
          <img src={tshirtImg} alt="T-shirt" className="weather-tshirt large wide" />
          <div className="weather-info large wide">
            <div className="weather-temp large wide">16° C</div>
            <div className="weather-desc large wide"><b>H&M T-Shirt</b></div>
            <div className="weather-update large wide">Best for inside activities</div>
            <div className="weather-extra-info wide">Humidity: 60% | Wind: 12 km/h | UV: Moderate</div>
          </div>
        </div>
      </section>
      <div className="daily-alert-row wide">
        <div className="daily-alert-clickable calendar wide" role="button" tabIndex={0}>
          <img src={calendarIcon} alt="calendar" className="calendar-icon-large wide" />
          <div>
            <div className="alert-title schedule wide"><b>Adjust your day schedule</b></div>
            <div className="alert-desc schedule wide">Get most relevant suggestions</div>
          </div>
        </div>
      </div>
      <section className="weather-hourly">
        <div className="weather-hourly-header">
          <h2>Weather for the day</h2>
          <div className="location-right" tabIndex={0} role="button" onClick={() => setDropdownOpen(v => !v)}>
            <span role="img" aria-label="location">📍</span> {city} <span className="dropdown">▼</span>
            {dropdownOpen && (
              <div className="city-dropdown">
                {cities.filter(c => c !== city).map((c, i) => (
                  <div key={i} className="city-dropdown-item" onClick={e => { setCity(c); setDropdownOpen(false); }}>{c}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hourly-list wide">
          {hourlyWeather.map((h, i) => (
            <div className="hourly-item wide" key={i}>
              <img src={h.icon} alt="icon" className="weather-icon-large wide" />
              <div className="hourly-temp wide">{h.temp}°</div>
              <div className="hourly-time wide">{h.time}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 