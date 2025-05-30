// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // Путь к CSS файлу, который теперь в src/styles/

// Предположим иконка профиля как часть UI, либо текстовый вариант
// import profileIconImage from '../assets/images/your-profile-icon.svg'; // Укажи свой путь

const Navbar = () => {
  const navigate = useNavigate();

  // Маршруты, совпадающие с твоим App.js
  const navLinks = [
    { path: '/', text: 'HOME' },
    { path: '/closet', text: 'WARDROBE' }, // /closet теперь
    { path: '/outfit-selector', text: 'CLOTHES FITTER' }, // Предположим, это Clothes Fitter
  ];

  const handleProfileClick = () => {
    // navigate('/profile'); // Укажи путь к странице профиля, если она есть
    console.log('Profile clicked - navigate to profile page');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">SMART STYLE</Link>
      </div>
      <nav className="navbar-links">
        {navLinks.map((link) => (
          <Link key={link.text} to={link.path} className="navbar-link-item">
            {link.text}
          </Link>
        ))}
      </nav>
      <div className="navbar-profile" onClick={handleProfileClick} role="button" tabIndex={0}  onKeyDown={(e) => e.key === 'Enter' && handleProfileClick()}>
        {/* <img src={profileIconImage} alt="Profile" className="profile-icon-img" /> */}
        <span className="profile-text">My Profile</span>
        <span className="profile-arrow"></span> {/* Это иконка "Login" из Material Icons, нужна установка шрифта или замена на SVG/текст "→" */}
                                                         {/* Или простой текст "→" → */}
      </div>
    </header>
  );
};

export default Navbar;