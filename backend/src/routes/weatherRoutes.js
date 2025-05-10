import express from 'express';
import { getWeather } from '../controllers/weatherApi.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await getWeather();
  res.json(data);
});

export default router; 