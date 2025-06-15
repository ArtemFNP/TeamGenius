// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react'; // Добавили useState, useEffect, useRef
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; 
import { useLanguage } from '../contexts/LanguageContext';

import dragonLogoImg from '../assets/images/dragonlogo.png'; 
import logoutIconImg from '../assets/images/logout.png';   

// Можно использовать SVG для гамбургера или текстовый символ
// import hamburgerIcon from '../assets/images/hamburger-icon.svg'; // Если есть SVG

const Navbar = () => {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null); // Для закрытия меню по клику вне
  const navigate = useNavigate();

  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { path: '/', text: 'HOME' },
    { path: '/closet', text: 'WARDROBE' },
    { path: '/outfit-selector', text: 'CLOTHES FITTER' },
  ];

  const handleLogoutClick = () => {
    console.log('Logout clicked - implement logout logic');
    setIsMobileMenuOpen(false); // Закрыть меню при клике
    // navigate('/login'); 
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
      // Проверяем, что меню открыто, клик был не по кнопке гамбургера и не внутри самого меню
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Дополнительно проверим, что клик не был по самой кнопке гамбургера, 
        // чтобы избежать немедленного закрытия при открытии
        if (!event.target.closest('.hamburger-menu-button')) {
           closeMobileMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);


  return (
    <header className="navbar-container">
      <div className="navbar-left-section"> {/* Объединим лого и гамбургер для мобилок */}
        <button 
          className="hamburger-menu-button" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {/* Простой символ гамбургера или ваша SVG иконка */}
          {isMobileMenuOpen ? <span>✕</span> : <span>☰</span>} {/* Крестик и гамбургер */}
          {/* <img src={hamburgerIcon} alt="Menu" /> */}
        </button>
        <div className="navbar-logo-area">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}> 
            <img src={dragonLogoImg} alt="Dragon Logo" className="dragon-logo-img" />
            <span className="smart-style-text">SMART STYLE</span>
          </Link>
        </div>
      </div>
      
      {/* Для десктопа ссылки будут здесь, для мобильных они будут в выпадающем меню */}
      <nav className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        {navLinks.map((link) => (
          <Link 
            key={link.text} 
            to={link.path} 
            className="navbar-link-item"
            onClick={closeMobileMenu} // Закрывать меню при клике на ссылку
          >
            {link.text}
          </Link>
        ))}
        {/* Можно добавить кнопку выхода в мобильное меню, если она не видна отдельно */}
        <div 
          className="navbar-action-icon logout-icon-mobile-menu" 
          onClick={handleLogoutClick} 
          role="button" 
          tabIndex={0}  
          onKeyDown={(e) => e.key === 'Enter' && handleLogoutClick()}
          aria-label="Logout"
        >
          <img src={logoutIconImg} alt="Logout" className="action-icon-img" />
          <span>Logout</span>
        </div>
      </nav>

      {/* Иконка выхода, видимая на десктопе */}
      <div 
        className="navbar-action-icon logout-icon-desktop" 
        onClick={handleLogoutClick} 
        role="button" 
        tabIndex={0}  
        onKeyDown={(e) => e.key === 'Enter' && handleLogoutClick()}
        aria-label="Logout"
      >
        <img src={logoutIconImg} alt="Logout" className="action-icon-img" />
      </div>
    </header>
  );
};

export default Navbar;