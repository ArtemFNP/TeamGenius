import React from 'react';
import './WeatherDashboard.css';
import tshirtImg from '../assets/images/tshirt.png';
import rainIcon from '../assets/images/rainy.png';
import thunderIcon from '../assets/images/rain_storm.png';
import cloudIcon from '../assets/images/cloud.png';
import partlyCloudyIcon from '../assets/images/partly_cloudy.png';
import nightStormIcon from '../assets/images/night_storm.png';
import { useNavigate } from 'react-router-dom';

const hourlyWeather = [
  { time: '4:00 PM', temp: 15, icon: partlyCloudyIcon },
  { time: '5:00 PM', temp: 14, icon: rainIcon },
  { time: '6:00 PM', temp: 13, icon: thunderIcon },
  { time: '7:00 PM', temp: 12, icon: cloudIcon },
];

const dailyWeather = [
  { day: 'Tuesday', desc: 'Thunderstorm', temp: 19, icon: thunderIcon, selected: true },
  { day: 'Wednesday', desc: 'Heavy Rain', temp: 17, icon: rainIcon },
  { day: 'Thursday', desc: 'Heavy Rain', temp: 17, icon: rainIcon },
];

const transportOptions = ['Car', 'Bike', 'Public Transport', 'Walk'];

export default function WeatherDashboard() {
  const navigate = useNavigate();
  const [transport, setTransport] = React.useState(transportOptions[0]);

  return (
    <div className="weather-dashboard">
      <header className="weather-header">
        <div className="location">
          <span role="img" aria-label="location">📍</span> Antwerp, Belgium <span className="dropdown">▼</span>
        </div>
        <div className="search">
          <span role="img" aria-label="search">🔍</span>
        </div>
      </header>
      <section className="weather-main-card">
        <div className="weather-date-time">
          <span>10 April 2025</span>
          <span>3:30 PM</span>
        </div>
        <div className="weather-main-content">
          <img src={tshirtImg} alt="T-shirt" className="weather-tshirt" />
          <div className="weather-info">
            <div className="weather-temp">16° C</div>
            <div className="weather-desc"><b>H&M T-Shirt</b></div>
            <div className="weather-update">Best for inside activities</div>
          </div>
        </div>
      </section>
      <section className="weather-hourly">
        <h2>Weather for the day</h2>
        <div className="hourly-list">
          {hourlyWeather.map((h, i) => (
            <div className="hourly-item" key={i}>
              <img src={h.icon} alt="icon" className="weather-icon-large" />
              <div className="hourly-temp">{h.temp}°</div>
              <div className="hourly-time">{h.time}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="weather-daily">
        <h2>Daily</h2>
        <div className="daily-alert-row">
          <div className="daily-alert-clickable" onClick={() => navigate('/outfit-selector')} role="button" tabIndex={0}>
            <img src={rainIcon} alt="alert" className="alert-icon-large" />
            <div>
              <div className="alert-title"><b>Tomorrow, rain is likely in the afternoon</b></div>
              <div className="alert-desc">Don't forget to bring an umbrella</div>
            </div>
          </div>
          <div className="transport-dropdown">
            <select value={transport} onChange={e => setTransport(e.target.value)}>
              {transportOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div className="daily-list">
          {dailyWeather.map((d, i) => (
            <div className={`daily-item${d.selected ? ' selected' : ''}`} key={i}>
              <img src={d.icon} alt="icon" className="weather-icon-large" />
              <div className="daily-info">
                <div className="daily-day">{d.day}</div>
                <div className="daily-desc">{d.desc}</div>
              </div>
              <div className="daily-temp">{d.temp}° C</div>
              <span className="daily-arrow">▶</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 