// src/components/Footer.js
import React from 'react';
import '../styles/Footer.css'; // Стили будут в отдельном файле

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section footer-logo-section">
          {/* Если лого в футере - текстом или img */}
          <div className="footer-logo-text">SMART STYLE</div> 
        </div>
        <div className="footer-section footer-links-section">
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/technologies">Technologies</a>
          <a href="/join">Join Us</a>
          <a href="/conditions">Conditions</a>
          <a href="/licenses">Licenses</a>
          <a href="/faq">F.A.Q</a>
          <a href="/sitemap">Sitemap</a>
        </div>
        <div className="footer-section footer-social-section">
          <div className="social-title">BUILD YOUR WORLD</div> {/* Изменил заголовок согласно макету */}
          <span>SOCIALIZE WITH US</span>
          <div className="social-icons">
            {/* Замени на свои SVG или <img> иконки */}
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span className="social-icon placeholder-icon">IG</span></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><span className="social-icon placeholder-icon">TW</span></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><span className="social-icon placeholder-icon">IN</span></a>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        2023 © MADE - BY ARTEM FILATOV - ALL RIGHTS RESERVED
      </div>
    </footer>
  );
};

export default Footer;