import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherDashboard from './WeatherDashboard';
import OutfitSelector from './OutfitSelector';
import '../styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherDashboard />} />
        <Route path="/outfit-selector" element={<OutfitSelector />} />
      </Routes>
    </Router>
  );
}

export default App;
