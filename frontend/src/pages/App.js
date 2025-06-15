import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Убедись, что путь верный
import WeatherDashboard from './WeatherDashboard'; // Твоя главная страница
import Closet from './Closet'; // Твоя страница 
import OutfitSelector from './OutfitSelector';
import OutfitPage from './OutfitPage';

import '../styles/App.css';
import '../styles/variables.css';
import '../styles/Navbar.css';
import TimelineSelector from './TimelineSelector';
import { LanguageProvider } from '../contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
    <Router>
       <div className="app-content-wrapper"> {/* Эта обертка для прижатия футера */}
      <Routes>
          {/* <Navbar /> */} 

        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/outfit-selector" element={<OutfitSelector />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/outfit" element={<OutfitPage />} />
        <Route path="/timeline" element={<TimelineSelector />} />
      </Routes>
      </div>
    </Router>
    </LanguageProvider>
  );
}

export default App;
