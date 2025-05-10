import { getWeather } from './weatherApi.js';
import { getAIResponse } from './geminiApi.js';

export async function getTimelineSuggestion(req, res) {
  try {
    const { city, startTime, endTime } = req.body;
    if (!city || !startTime || !endTime) {
      return res.status(400).json({ error: 'city, startTime, and endTime are required' });
    }

    // Fetch weather forecast for the city
    const weatherData = await getWeather(city);
    // Find relevant hourly forecasts within the selected time range
    const selectedHours = weatherData.hourly.filter(hour => {
      // hour.time is like '16:00', '18:00', etc.
      const hourNum = parseInt(hour.time.split(':')[0], 10);
      const startNum = parseInt(startTime.split(':')[0], 10);
      const endNum = parseInt(endTime.split(':')[0], 10);
      // Handle overnight ranges
      if (endNum < startNum) {
        return hourNum >= startNum || hourNum <= endNum;
      }
      return hourNum >= startNum && hourNum <= endNum;
    });

    // Build weather summary for the prompt
    const temps = selectedHours.map(h => h.temperature);
    const avgTemp = temps.length ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : weatherData.current.temperature;
    const conditions = [...new Set(selectedHours.map(h => h.description))].join(', ');
    const weatherSummary = `${avgTemp}°C, ${conditions}`;

    // Build prompt
    const prompt = `Suggest an outfit for being outside in ${city} from ${startTime} to ${endTime}. The weather will be: ${weatherSummary}.`;
    const aiResult = await getAIResponse(prompt);
    res.json({ suggestion: aiResult, prompt });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to get timeline suggestion' });
  }
} 