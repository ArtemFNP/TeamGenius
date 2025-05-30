import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/images/home.png';
import closetIcon from '../assets/images/closet1.png';
import photoIcon from '../assets/images/photo.png';
import '../styles/WeatherDashboard.css';
import Navbar from '../components/Navbar';
import '../styles/OutfitDisplay.css';

export default function OutfitPage() {
  const navigate = useNavigate();
  const fileInput = useRef();
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImages([...images, URL.createObjectURL(e.target.files[0])]);
    }
  };

  return (
    <div className="weather-dashboard wide">
      <Navbar />
      <div style={{ margin: '48px auto', maxWidth: 900, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 32 }}>Your Outfits</h2>
        <OutfitDisplay />
        <button
          className="upload-btn"
          onClick={() => fileInput.current.click()}
          style={{ padding: '16px 32px', fontSize: '1.2em', borderRadius: 12, background: '#4f8cff', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 32 }}
        >
          Upload Outfit Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', marginTop: 32 }}>
          {images.length === 0 && <div style={{ color: '#888', fontSize: 20 }}>No outfits uploaded yet.</div>}
          {images.map((img, idx) => (
            <img key={idx} src={img} alt="outfit" style={{ maxWidth: 300, maxHeight: 300, borderRadius: 16, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }} />
          ))}
        </div>
      </div>
    </div>
  );
} 