import express from 'express';
import { register, login, updateUser, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/users/:userId', updateUser);
router.get('/me', authenticateToken, getMe);

export default router; 