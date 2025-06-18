import pool from '../database/db.js'; // Потрібно створити файл для підключення до БД
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Функція реєстрації
export const register = async (req, res) => {
  const { username, email, password, displayName } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserQuery = `
      INSERT INTO users (username, email, password_hash, display_name) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, username, email, display_name
    `;
    
    const newUser = await pool.query(newUserQuery, [username, email, passwordHash, displayName || username]);

    res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // Помилка унікальності
      return res.status(409).json({ message: 'User with this email or username already exists.' });
    }
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Функція логіну
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Створюємо JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Токен буде дійсний 7 днів
    );
    
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};