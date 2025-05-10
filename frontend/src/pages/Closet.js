import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/images/home.png';
import closetIcon from '../assets/images/closet1.png';
import photoIcon from '../assets/images/photo.png';
import '../pages/WeatherDashboard.css';

export default function Closet() {
  const navigate = useNavigate();
  const fileInput = useRef();
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="weather-dashboard wide">
      <nav className="top-navbar">
        <div className="nav-item active" onClick={() => navigate('/outfit-selector')}>
          <img src={closetIcon} alt="closet" className="nav-icon" />
          <span>Closet</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/') }>
          <img src={homeIcon} alt="home" className="nav-icon" />
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/closet')}>
          <img src={photoIcon} alt="add item" className="nav-icon" />
          <span>Add item</span>
        </div>
      </nav>
      <div style={{ margin: '48px auto', maxWidth: 600, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 32 }}>Add a new item to your closet</h2>
        <button
          className="upload-btn"
          onClick={() => fileInput.current.click()}
          style={{ padding: '16px 32px', fontSize: '1.2em', borderRadius: 12, background: '#4f8cff', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 32 }}
        >
          Upload Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {image && (
          <div style={{ marginTop: 32 }}>
            <img src={image} alt="preview" style={{ maxWidth: 400, maxHeight: 400, borderRadius: 16, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }} />
          </div>
        )}
      </div>
    </div>
  );
} 