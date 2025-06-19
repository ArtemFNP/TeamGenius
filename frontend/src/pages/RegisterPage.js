import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
// import '../styles/Auth.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ username, email, password });
      alert(t('registerPage.registrationSuccess'));
    } catch (err) {
      setError(err.response?.data?.message || t('registerPage.registrationError'));
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{t('registerPage.title')}</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('registerPage.usernamePlaceholder')} required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('registerPage.emailPlaceholder')} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('registerPage.passwordPlaceholder')} required />
        <button type="submit">{t('registerPage.registerButton')}</button>
        <p>{t('registerPage.alreadyHaveAccount')} <Link to="/login">{t('registerPage.loginLink')}</Link></p>
      </form>
    </div>
  );
}