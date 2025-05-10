import express from 'express';
import { getAIResponse } from '../controllers/geminiApi.js';
const router = express.Router();

// POST /ai/prompt
router.post('/prompt', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });
  try {
    const result = await getAIResponse(prompt);
    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: 'AI error' });
  }
});

export default router; 