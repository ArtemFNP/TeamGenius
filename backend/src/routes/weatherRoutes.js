import express from 'express';
import { getWeather } from '../controllers/weatherApi.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const city = req.query.city || 'Antwerp, Belgium';
    const data = await getWeather(city);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch weather data' });
  }
});

export default router; 