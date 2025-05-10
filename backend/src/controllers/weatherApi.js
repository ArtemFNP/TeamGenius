import 'dotenv/config';

const apiKey = process.env.WEATHER_KEY; // Your OpenWeatherMap API key
const city = 'Antwerp'; // Changed to Antwerp
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

const lat = '51.2199';
const lon = '4.4035';
const exclude = 'minutely,hourly'; // Optional: exclude data parts you don't need
// const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=metric`;
//it needs subscription

console.log(url);

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data.main);
        console.log(data.main.temp_min);
        console.log(data.main.temp_max);
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);

    });
