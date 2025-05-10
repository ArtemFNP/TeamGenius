import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
const router = express.Router();

const dataPath = path.resolve('src/models/clothes.json');

// GET all clothing items
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'Failed to read clothes data' });
  }
});

// GET single clothing item by id
router.get('/:id', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const items = JSON.parse(data);
    const item = items.find(i => i.id === Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read clothes data' });
  }
});

// POST new clothing item (mock, not persistent)
router.post('/', (req, res) => {
  // In real app, validate and save to DB
  const newItem = { ...req.body, id: clothingItems.length + 1 };
  clothingItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT update clothing item (mock, not persistent)
router.put('/:id', (req, res) => {
  const idx = clothingItems.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  clothingItems[idx] = { ...clothingItems[idx], ...req.body };
  res.json(clothingItems[idx]);
});

// DELETE clothing item (mock, not persistent)
router.delete('/:id', (req, res) => {
  const idx = clothingItems.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = clothingItems.splice(idx, 1);
  res.json(removed[0]);
});

export default router; 