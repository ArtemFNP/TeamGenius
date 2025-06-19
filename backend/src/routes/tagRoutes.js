import express from 'express';
import { addTag, getTags } from '../controllers/tagController.js';

const router = express.Router();

// POST /api/tags - Add a new tag
router.post('/', addTag);

// GET /api/tags/:userId - Get all tags for a specific user
router.get('/:userId', getTags);

export default router; 