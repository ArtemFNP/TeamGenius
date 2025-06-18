// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // <-- CSS файл остается
import { useLanguage } from '../contexts/LanguageContext'; // <-- Импорт хука языка
import { useAuth } from '../hooks/useAuth'; // Import useAuth

import dragonLogoImg from '../assets/images/dragonlogo.png'; // Убедитесь, что путь к логотипу правильный
import logoutIconImg from '../assets/images/logout.png';   // Убедитесь, что путь к иконке правильный

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null); // Для закрытия меню по клику вне
  const navigate = useNavigate();

  const { language, setLanguage, t } = useLanguage(); // Использование хука для доступа к языку и функции перевода
  const { user, logout } = useAuth(); // Get user and logout from auth context

  // Обновляем navLinks для использования ключей локализации
  // Внимание: пути /closet и /outfit-selector. Убедитесь, что это ваши актуальные пути.
  // В предыдущих ответах я использовал /wardrobe и /clothes-fitter, исходя из вашей структуры.
  const navLinks = [
    { path: '/', textKey: 'home' },
    { path: '/closet', textKey: 'wardrobe' }, // <-- Здесь 'wardrobe' - это ключ в файлах локализации
    { path: '/outfit-selector', textKey: 'clothesFitter' }, // <-- Здесь 'clothesFitter' - это ключ
    { path: '/timeline', textKey: 'timeline' }, // Add timeline route
    { path: '/about', textKey: 'about' }, // Add about route
  ];

  const handleLogoutClick = () => {
    logout(); // Use the logout function from useAuth
    closeMobileMenu(); // Закрыть меню при клике на выход
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value); // Обновляем состояние языка через контекст
    closeMobileMenu(); // Можно закрыть меню после смены языка (опционально)
  };
  
  // Закрытие мобильного меню по клику вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, что меню открыто И клик был вне мобильного меню И не по кнопке гамбургера
      if (isMobileMenuOpen && mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.hamburger-menu-button')) {
         closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="navbar-container">
      <div className="navbar-left-section">
        <button 
          className="hamburger-menu-button" 
          onClick={toggleMobileMenu}
          aria-label={t(isMobileMenuOpen ? 'closeMenu' : 'openMenu')}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <span>✕</span> : <span>☰</span>}
        </button>
        <div className="navbar-logo-area">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}> 
            <img src={dragonLogoImg} alt="Dragon Logo" className="dragon-logo-img" /> 
            <span className="smart-style-text">{t('smartStyleLogo')}</span> 
          </Link>
        </div>
      </div>
      
      {/* Ссылки и мобильное/десктопное меню */}
      <nav className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        {navLinks.map((link) => (
          <Link 
            key={link.textKey}
            to={link.path} 
            className="navbar-link-item"
            onClick={closeMobileMenu}
          >
            {t(link.textKey)}
          </Link>
        ))}

        <div className="navbar-language-selector mobile-menu-language-selector">
          <select 
            value={language} 
            onChange={handleLanguageChange} 
            aria-label={t('selectLanguage')}
          >
            <option value="en">{t('languageEnglish')}</option>
            <option value="uk">{t('languageUkrainian')}</option>
          </select>
        </div>

        {user && (
          <Link 
            to="/profile" 
            className="navbar-action-icon profile-icon-mobile-menu" 
            onClick={closeMobileMenu}
            aria-label={t('userProfile')}
          >
            <div className="diamond-avatar-placeholder-small">
              <span>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <span>{t('profile')}</span>
          </Link>
        )}

        {user && (
          <div 
            className="navbar-action-icon logout-icon-mobile-menu" 
            onClick={handleLogoutClick} 
            role="button" 
            tabIndex={0}  
            onKeyDown={(e) => e.key === 'Enter' && handleLogoutClick()}
            aria-label={t('logout')}
          >
            <img src={logoutIconImg} alt={t('logout')} className="action-icon-img" />
            <span>{t('logout')}</span>
          </div>
        )}

        {!user && (
          <Link 
            to="/login" 
            className="navbar-action-icon login-icon-mobile-menu" 
            onClick={closeMobileMenu}
            aria-label={t('login')}
          >
            <span>{t('login')}</span>
          </Link>
        )}
      </nav>

      {/* Контейнер для десктопных элементов (переключатель языка и выход) */}
      <div className="navbar-desktop-actions">
        {/* Переключатель языка для ДЕСКТОПА */}
        <div className="navbar-language-selector desktop-language-selector">
          <select 
            value={language} 
            onChange={handleLanguageChange} 
            aria-label={t('selectLanguage')}
          >
            <option value="en">{t('languageEnglish')}</option>
            <option value="uk">{t('languageUkrainian')}</option>
          </select>
        </div>

        {user && (
          <Link 
            to="/profile" 
            className="navbar-action-icon profile-icon-desktop" 
            aria-label={t('userProfile')}
          >
            <div className="diamond-avatar-placeholder-small">
              <span>{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</span>
            </div>
          </Link>
        )}

        {user && (
          <div 
            className="navbar-action-icon logout-icon-desktop" 
            onClick={handleLogoutClick} 
            role="button" 
            tabIndex={0}  
            onKeyDown={(e) => e.key === 'Enter' && handleLogoutClick()}
            aria-label={t('logout')}
          >
            <img src={logoutIconImg} alt={t('logout')} className="action-icon-img" />
          </div>
        )}

        {!user && (
          <Link 
            to="/login" 
            className="navbar-action-icon login-icon-desktop" 
            aria-label={t('login')}
          >
            <span>{t('login')}</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;