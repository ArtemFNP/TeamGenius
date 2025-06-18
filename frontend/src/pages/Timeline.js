import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const goals = ['School', 'Gym', 'Walk', 'Work', 'Party', 'Other'];

export default function Timeline() {
  // Read the city from localStorage (from weather data)
  const [weatherData] = useLocalStorage('lastWeatherData', null);
  const currentCity = weatherData?.current?.city || 'Antwerp, Belgium'; // Fallback to a default city

  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('13:00');
  const [goal, setGoal] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use useLocalStorage to persist timeline selection
  const [lastTimelineSelection, setLastTimelineSelection] = useLocalStorage('lastTimelineSelection', {
    city: currentCity, // Use the city from localStorage
    startTime: '08:00',
    endTime: '13:00',
    goal: ''
  });

  // Update local storage whenever relevant state changes
  useEffect(() => {
    setLastTimelineSelection({
      city: currentCity, // Ensure city is updated here too
      startTime,
      endTime,
      goal
    });
  }, [currentCity, startTime, endTime, goal, setLastTimelineSelection]);

  // Simulate timeline selection
  const handleTimelineChange = (e, type) => {
    if (type === 'start') setStartTime(e.target.value);
    else setEndTime(e.target.value);
    setShowGoalModal(true);
  };

  const handleGoalSelect = (g) => {
    setGoal(g);
    setShowGoalModal(false);
  };

  const handleGoalInput = (e) => {
    setGoal(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuggestion('');
    try {
      const res = await fetch('http://localhost:5500/api/ai/timeline-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: currentCity, startTime, endTime, goal }) // Use currentCity
      });
      const data = await res.json();
      if (data.suggestion) setSuggestion(data.suggestion);
      else setError(data.error || 'No suggestion received');
    } catch (err) {
      setError('Failed to fetch suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <div style={{ background: 'linear-gradient(120deg, #4f8cff 60%, #6ea8fe)', borderRadius: 28, padding: 32, color: '#fff', marginBottom: 32 }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>Select Your Day's Period (06:00–24:00)</h2>
        {/* City selection removed - city will be taken from WeatherDashboard */}
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>{t('selectedCityLabel')}: {currentCity}</div> {/* Display current city */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <label>From:</label>
          <input type="time" value={startTime} min="06:00" max="24:00" step="1800" onChange={e => handleTimelineChange(e, 'start')} style={{ fontSize: 18, padding: 8, borderRadius: 8 }} />
          <label>To:</label>
          <input type="time" value={endTime} min="06:00" max="24:00" step="1800" onChange={e => handleTimelineChange(e, 'end')} style={{ fontSize: 18, padding: 8, borderRadius: 8 }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, marginTop: 16 }}>{startTime}–{endTime} {goal && `(${goal})`}</div>
      </div>

      {/* Modal for goal selection */}
      {showGoalModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 32, minWidth: 320, boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)' }}>
            <h3 style={{ marginBottom: 16, color: '#333' }}>What is your goal for this period?</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              {goals.map(g => (
                <button key={g} onClick={() => handleGoalSelect(g)} style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: '#4f8cff', color: '#fff', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>{g}</button>
              ))}
            </div>
            <input type="text" placeholder="Or type your own..." value={goal} onChange={handleGoalInput} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #b0b0b0', fontSize: 16, marginBottom: 12 }} />
            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShowGoalModal(false)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#eee', color: '#333', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust my outfit button */}
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <button
          onClick={handleSubmit}
          disabled={!goal || loading}
          style={{
            background: 'linear-gradient(90deg, #4f8cff 60%, #6ea8fe)',
            color: '#fff',
            fontSize: 22,
            fontWeight: 700,
            border: 'none',
            borderRadius: 16,
            padding: '18px 48px',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
            cursor: !goal || loading ? 'not-allowed' : 'pointer',
            opacity: !goal || loading ? 0.6 : 1,
            transition: 'opacity 0.2s',
            minWidth: 260
          }}
        >
          {loading ? 'Adjusting...' : 'Adjust my outfit'}
        </button>
      </div>

      {/* Suggestion block */}
      <div style={{
        width: '100%',
        minHeight: 300,
        background: 'linear-gradient(120deg, #4f8cff 60%, #6ea8fe)',
        borderRadius: 28,
        color: '#fff',
        fontSize: 22,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
        margin: '0 auto',
        marginBottom: 32,
        padding: 32,
        textAlign: 'center',
        height: 300
      }}>
        {loading ? 'Loading suggestion...' : error ? error : suggestion ? suggestion : 'Your outfit suggestion will appear here.'}
      </div>
    </div>
  );
} 