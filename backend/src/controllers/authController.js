import pool from '../database/db.js'; // Потрібно створити файл для підключення до БД
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Функція реєстрації
export const register = async (req, res) => {
  const { username, email, password, displayName } = req.body;
  console.log('Register attempt:', { username, email, displayName });

  if (!username || !email || !password) {
    console.log('Registration: Missing credentials.');
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log('Registration: Hashed password.');

    const newUserQuery = `
      INSERT INTO users (username, email, password_hash, display_name) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, username, email, display_name
    `;
    
    const newUser = await pool.query(newUserQuery, [username, email, passwordHash, displayName || username]);
    console.log('Registration: User created successfully.', newUser.rows[0]);

    res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      console.log('Registration: User already exists.', error.detail);
      return res.status(409).json({ message: 'User with this email or username already exists.' });
    }
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Функція логіну
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  if (!email || !password) {
    console.log('Login: Missing credentials.');
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      console.log('Login: User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    console.log('Login: User found.', user.email);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log('Login: Password mismatch for user:', user.email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    console.log('Login: Password matched.');

    // Створюємо JWT токен
    // Перевірка, чи JWT_SECRET присутній
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables!');
      return res.status(500).json({ message: 'Server configuration error: JWT secret missing.' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('Login: JWT token generated.');
    
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