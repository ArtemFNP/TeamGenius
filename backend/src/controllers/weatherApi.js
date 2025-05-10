import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });


const apiKey = process.env.WEATHER_KEY; // Your OpenWeatherMap API key
const city = 'Antwerp'; // Changed to Antwerp
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

const lat = '51.2199';
const lon = '4.4035';
const exclude = 'minutely,hourly'; // Optional: exclude data parts you don't need
// const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=metric`;
//it needs subscription

export async function getWeather() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log("Weather Data:", data.main);
        // console.log("Min Temp:", data.main.temp_min);
        // console.log("Max Temp:", data.main.temp_max);
        return data.main; // Return weather data
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return { error: "Failed to fetch weather data" };
    }
}

