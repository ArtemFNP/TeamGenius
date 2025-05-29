import { getWeather } from './weatherApi.js';
import { getAIResponse } from './geminiApi.js';
import { prompts } from './prompts.js';

export async function getTimelineSuggestion(req, res) {
  try {
    const { city, startTime, endTime, goal, timeline } = req.body;
    if (!city || !goal || (!timeline && (!startTime || !endTime))) {
      return res.status(400).json({ error: 'city, goal, and either timeline or startTime/endTime are required' });
    }

    // Fetch weather forecast for the city
    const weatherData = await getWeather(city);
    let selectedHours = [];
    let timeString = '';

    if (timeline && Array.isArray(timeline) && timeline.length > 0) {
      // Use the provided timeline (array of time slots, e.g., ['16:00', '18:00', ...])
      selectedHours = weatherData.hourly.filter(hour => timeline.includes(hour.time));
      timeString = timeline.join(', ');
    } else {
      // Fallback: use startTime/endTime logic
      selectedHours = weatherData.hourly.filter(hour => {
        const hourNum = parseInt(hour.time.split(':')[0], 10);
        const startNum = parseInt(startTime.split(':')[0], 10);
        const endNum = parseInt(endTime.split(':')[0], 10);
        if (endNum < startNum) {
          return hourNum >= startNum || hourNum <= endNum;
        }
        return hourNum >= startNum && hourNum <= endNum;
      });
      timeString = `${startTime} to ${endTime}`;
    }

    // Build weather summary for the prompt
    const temps = selectedHours.map(h => h.temperature);
    const avgTemp = temps.length ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : weatherData.current.temperature;
    const conditions = [...new Set(selectedHours.map(h => h.description))].join(', ');
    const weatherSummary = `${avgTemp}°C, ${conditions}`;

    // Use prompt template from prompts.js
    const promptTemplate = prompts[0][1].prompt;
    // Build the prompt string
    const prompt = `${promptTemplate}\nDestination: ${goal}\nCity: ${city}\nTime: ${timeString}\nWeather: ${weatherSummary}`;

    const aiResult = await getAIResponse(prompt);
    res.json({ suggestion: aiResult, prompt });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to get timeline suggestion' });
  }
} 