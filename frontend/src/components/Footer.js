// src/components/Footer.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import '../styles/Footer.css'; // Стили будут в отдельном файле

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section footer-logo-section">
          {/* Если лого в футере - текстом или img */}
          <div className="footer-logo-text">SMART STYLE</div> 
        </div>
        <div className="footer-section footer-links-section">
          <Link to="/about">{t('about')}</Link>
          <Link to="/faq">{t('faq')}</Link>
        </div>
        <div className="footer-section footer-social-section">
          <div className="social-title">{t('buildYourWorld')}</div> {/* Изменил заголовок согласно макету */}
          <span>{t('socializeWithUs')}</span>
          <div className="social-icons">
            {/* Замени на свои SVG или <img> иконки */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span className="social-icon placeholder-icon">IG</span></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><span className="social-icon placeholder-icon">TW</span></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><span className="social-icon placeholder-icon">IN</span></a>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        {t('copyright', { year: new Date().getFullYear(), author: 'ARTEM FILATOV' })}
      </div>
    </footer>
  );
};

export default Footer;