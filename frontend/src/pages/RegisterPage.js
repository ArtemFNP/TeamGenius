import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
// import '../styles/Auth.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ username, email, password });
      alert('Реєстрація успішна! Тепер ви можете увійти.');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка реєстрації.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ім'я користувача" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Імейл" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
        <button type="submit">Зареєструватися</button>
        <p>Вже є акаунт? <Link to="/login">Увійти</Link></p>
      </form>
    </div>
  );
}