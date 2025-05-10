const apiKey = 'b0296554a016f37282949d02134eb75f'; // Your OpenWeatherMap API key
const city = 'Antwerp'; // Changed to Antwerp
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);

    })
    .catch(error => {
        console.error('Error fetching weather data:', error);

    });
