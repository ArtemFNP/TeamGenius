import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const API_URL = 'http://localhost:5500/api/weather';

export function useWeather(initialCity = 'Antwerp, Belgium') {
  const [weather, setWeather] = useLocalStorage('lastWeatherData', null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(initialCity);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, setWeather]);

  return { weather, loading, error, city, setCity };
} 