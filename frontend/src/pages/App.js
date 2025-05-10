import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherDashboard from './WeatherDashboard';
import OutfitSelector from './OutfitSelector';
import Closet from './Closet';
import OutfitPage from './OutfitPage';
import '../styles/App.css';
import TimelineSelector from './TimelineSelector';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/outfit-selector" element={<OutfitSelector />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/outfit" element={<OutfitPage />} />
        <Route path="/timeline" element={<TimelineSelector />} />

      </Routes>
    </Router>
  );
}

export default App;
