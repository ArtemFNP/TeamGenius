// src/pages/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импортируем Navbar и Footer (пути скорректированы)
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Импортируем все ваши страницы (они находятся в той же папке src/pages)
import WeatherDashboard from './WeatherDashboard';
import Closet from './Closet';
import OutfitSelector from './OutfitSelector';
import OutfitPage from './OutfitPage';
import TimelineSelector from './TimelineSelector';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage'; // Import LoginPage
import RegisterPage from './RegisterPage'; // Import RegisterPage
import UserProfile from './UserProfile'; // Import UserProfile

// Импорт модальных окон
import LicensesModal from '../components/LicensesModal';
import FAQModal from '../components/FAQModal';

// Импортируем глобальные стили. Пути скорректированы, так как App.js в src/pages.
import '../styles/App.css';       // <-- Для .app-content-wrapper и .app-main-content
import '../styles/variables.css'; // <-- Для ваших CSS переменных (только variables)

import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../hooks/useAuth'; // Import AuthProvider
import PrivateRoutes from '../components/PrivateRoutes'; // Import PrivateRoutes

function App() {
  console.log('App component mounted');
  const [isLicensesModalOpen, setIsLicensesModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);

  const openLicensesModal = () => setIsLicensesModalOpen(true);
  const closeLicensesModal = () => setIsLicensesModalOpen(false);

  const openFAQModal = () => setIsFAQModalOpen(true);
  const closeFAQModal = () => setIsFAQModalOpen(false);

  return (
    <LanguageProvider>
      <Router>
        <AuthProvider> {/* Wrap the entire application with AuthProvider */}
          {/* Это ваша обертка для прижатия футера (sticky footer) */}
          <div className="app-content-wrapper">
            <Navbar /> {/* Navbar рендерится здесь один раз, глобально */}

            {/* Основной контент страниц. Этот контейнер будет "растягиваться". */}
            <main className="app-main-content">
              <Routes>
                <Route path="/login" element={<LoginPage />} /> {/* Public Login Route */}
                <Route path="/register" element={<RegisterPage />} /> {/* Public Register Route */}
                
                <Route element={<PrivateRoutes />}> {/* Protected Routes */}
                  <Route path="/" element={<WeatherDashboard />} />
                  <Route path="/outfit-selector" element={<OutfitSelector />} />
                  <Route path="/closet" element={<Closet />} />
                  <Route path="/outfit" element={<OutfitPage />} />
                  <Route path="/timeline" element={<TimelineSelector />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/profile" element={<UserProfile />} /> {/* Add UserProfile Route */}
                  {/* Add more protected routes here if needed */}
                </Route>
              </Routes>
            </main>

            {/* Передаем функции открытия модалок в Footer */}
            <Footer 
              openLicensesModal={openLicensesModal} 
              openFAQModal={openFAQModal} 
            />

            {/* Рендеринг модальных окон (скрыты, если isOpen = false) */}
            <LicensesModal isOpen={isLicensesModalOpen} onClose={closeLicensesModal} />
            <FAQModal isOpen={isFAQModalOpen} onClose={closeFAQModal} />
          </div>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;