import 'dotenv/config';

const apiKey = process.env.WEATHER_KEY;

// City coordinates mapping
const cityCoordinates = {
  'Antwerp, Belgium': { lat: '51.2199', lon: '4.4035' },
  'Berlin, Germany': { lat: '52.5200', lon: '13.4050' },
  'Paris, France': { lat: '48.8566', lon: '2.3522' }
};

// Weather condition to icon mapping
const weatherIconMap = {
  'Clear': 'partly_cloudy.png',
  'Clouds': 'cloud.png',
  'Rain': 'rainy.png',
  'Thunderstorm': 'rain_storm.png',
  'Drizzle': 'rainy.png',
  'Snow': 'rain_storm.png',
  'Mist': 'cloud.png'
};

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.getHours().toString();
}

export async function getWeather(city = 'Antwerp, Belgium') {
  try {
    const coords = cityCoordinates[city];
    if (!coords) {
      throw new Error('Invalid city');
    }

    // Fetch current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();

    if (currentData.cod !== 200) {
      throw new Error(currentData.message || 'Failed to fetch weather data');
    }

    // Fetch hourly forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (forecastData.cod !== '200') {
      throw new Error(forecastData.message || 'Failed to fetch forecast data');
    }

    // Filter and format hourly forecast
    const hourlyForecast = forecastData.list
      .slice(0, 12)
      .map(item => ({
        time: formatTime(item.dt),
        date: item.dt_txt.split(' ')[0],
        temperature: Math.round(item.main.temp),
        weatherIcon: weatherIconMap[item.weather[0].main] || 'partly_cloudy.png',
        description: item.weather[0].description
      }));

    console.log('Hourly Forecast sent from backend:', hourlyForecast);

    // Format the response
    return {
      current: {
        temperature: Math.round(currentData.main.temp),
        weatherIcon: weatherIconMap[currentData.weather[0].main] || 'partly_cloudy.png',
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        city: city,
        minTemp: Math.round(currentData.main.temp_min),
        maxTemp: Math.round(currentData.main.temp_max)
      },
      hourly: hourlyForecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

