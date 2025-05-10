// TimelineSelector.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './WeatherDashboard.css'; // keeps global styles
import './TimelineSelector.css';

export default function TimelineSelector() {
  const navigate = useNavigate();
  const timelineRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [dragInfo, setDragInfo] = useState(null);

  // convert px → time between 06:00–24:00
  const pxToTime = px => {
    const { width } = timelineRef.current.getBoundingClientRect();
    let pct = Math.max(0, Math.min(1, px / width));
    const totalMins = Math.round(pct * 18 * 60) + 6 * 60;
    const h = String(Math.floor(totalMins / 60)).padStart(2, '0');
    const m = String(totalMins % 60).padStart(2, '0');
    return `${h}:${m}`;
  };

  // drag handlers
  const onMouseDown = e => {
    if (e.button !== 0) return;
    setDragInfo({ startX: e.nativeEvent.offsetX, currentX: e.nativeEvent.offsetX });
  };
  const onMouseMove = e => {
    dragInfo && setDragInfo(info => ({ ...info, currentX: e.nativeEvent.offsetX }));
  };
  const onMouseUp = () => {
    if (!dragInfo) return;
    const { startX, currentX } = dragInfo;
    const start = pxToTime(Math.min(startX, currentX));
    const end = pxToTime(Math.max(startX, currentX));
    const desc = prompt(`Describe period ${start}–${end}:`, '');
    desc !== null && setBlocks(bs => [...bs, { start, end, desc }]);
    setDragInfo(null);
  };

  // hours from 6 to 24
  const hours = Array.from({ length: 19 }, (_, i) => i + 6);

  return (
    <div className="weather-dashboard wide">
      {/* Top navbar */}
      <nav className="top-navbar">
        <div className="nav-item" onClick={() => navigate('/outfit-selector')}>Closet</div>
        <div className="nav-item" onClick={() => navigate('/')}>Home</div>
        <div className="nav-item" onClick={() => navigate('/outfit')}>Add item</div>
      </nav>

      {/* Timeline card without search & tabs */}
      <section className="weather-main-card large wide">
        <h2 style={{ marginBottom: '1rem' }}>Select Your Day's Period (06:00–24:00)</h2>

        <div
          className="timeline"
          ref={timelineRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ marginTop: '1rem' }}
        >
          {hours.map(h => (
            <div key={h} className="timeline-hour" style={{ left: `${((h - 6) / 18) * 100}%` }}>
              <span>{String(h).padStart(2, '0')}:00</span>
            </div>
          ))}

          {/* live selection */}
          {dragInfo && (
            <div
              className="timeline-drag"
              style={{
                left: `${(Math.min(dragInfo.startX, dragInfo.currentX) / timelineRef.current.clientWidth) * 100}%`,
                width: `${(Math.abs(dragInfo.currentX - dragInfo.startX) / timelineRef.current.clientWidth) * 100}%`
              }}
            />
          )}

          {/* saved blocks */}
          {blocks.map((b, i) => {
            const [sh, sm] = b.start.split(':').map(Number);
            const [eh, em] = b.end.split(':').map(Number);
            const startPct = ((sh * 60 + sm) - 6 * 60) / (18 * 60) * 100;
            const widthPct = ((eh * 60 + em) - (sh * 60 + sm)) / (18 * 60) * 100;
            return (
              <div
                key={i}
                className="timeline-block"
                style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                title={`${b.start}–${b.end}: ${b.desc}`}
              >
                <span className="block-label">{b.desc}</span>
              </div>
            );
          })}
        </div>

        <div className="blocks-summary" style={{ marginTop: '1.5rem' }}>
          {blocks.map((b, i) => (
            <div key={i} className="block-item">
              <strong>{b.start}–{b.end}</strong> {b.desc}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
