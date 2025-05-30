// src/pages/Closet.js
import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Closet.css'; 
import uploadIcon from '../assets/images/uploadicon.png'; 

// Импортируем наш массив изображений
import importedClosetItems from '../assets/images/gallery'; // Убедись, что путь к gallery.js верный

const CLOTH_TYPES = [
  { value: '', label: 'Select type' },
  { value: 't-shirt', label: 'T-Shirt' },
  { value: 'pants', label: 'Pants' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'jacket', label: 'Jacket' },
  { value: 'dress', label: 'Dress' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'cap', label: 'Cap' } // Добавил обратно типы
  // Добавь еще типы по необходимости
];

export default function Closet() {
  const fileInputRef = useRef(null);
  // const [imagePreview, setImagePreview] = useState(null); // Можно убрать, если загруженное сразу в сетку
  const [selectedClothType, setSelectedClothType] = useState('');
  // const [fileName, setFileName] = useState(''); // Можно убрать, если не показываем имя загружаемого

  // Используем импортированные изображения как начальное состояние
  const [closetItems, setClosetItems] = useState(importedClosetItems); 
  const [selectedItemForPopup, setSelectedItemForPopup] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
          alert('Invalid file type. Please upload .png, .svg, or .jpg');
          return;
      }
      // setFileName(file.name); // Если нужно
      const newItem = {
          id: `local-${Date.now()}`, // Уникальный локальный ID
          imageUrl: URL.createObjectURL(file),
          name: file.name.split('.')[0].trim() || "New Item"
      };
      setClosetItems(prevItems => [newItem, ...prevItems]);
      console.log("Added new item locally:", newItem);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  const openItemPopup = (item) => {
    setSelectedItemForPopup(item);
  };

  const closeItemPopup = () => {
    setSelectedItemForPopup(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedItemForPopup && event.target.classList.contains('popup-overlay')) {
        closeItemPopup();
      }
    };
    const handleEscapeKey = (event) => {
        if (event.key === 'Escape' && selectedItemForPopup) {
            closeItemPopup();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedItemForPopup]);

  return (
    <div className="closet-page-container">
      <Navbar />
      <main className="closet-main-content">
        <h1 className="closet-title">
          Your upload new clothes - click on that button!
        </h1>

        <div className="closet-upload-interaction-area">
          <div className="type-selector-container">
            <label htmlFor="clothType" className="cloth-type-label">Choose your type of cloth</label>
            <select 
              id="clothType"
              value={selectedClothType} 
              onChange={(e) => setSelectedClothType(e.target.value)}
              className="cloth-type-dropdown"
            >
              {CLOTH_TYPES.map(type => (
                <option key={type.value} value={type.value} disabled={type.value === ''}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div 
            className="upload-area" 
            onClick={handleUploadAreaClick}
            onKeyDown={(e) => e.key === 'Enter' && handleUploadAreaClick()}
            role="button"
            tabIndex={0}
            aria-label="Upload new clothes image"
          >
            <img src={uploadIcon} alt="Upload Icon" className="upload-icon" />
          </div>
        </div>
        
        <p className="upload-instructions">
          Supported formats: .png, .svg, .jpg
        </p>
        <input
          type="file"
          accept=".png, .svg, .jpg, .jpeg"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        <p className="item-appearance-text">It will appear just here:</p> 

        <div className="closet-items-grid">
          {closetItems.map(item => ( // Теперь используем closetItems из состояния
            <div 
              key={item.id} 
              className="closet-item-card" 
              onClick={() => openItemPopup(item)}
              onKeyDown={(e) => e.key === 'Enter' && openItemPopup(item)}
              role="button"
              tabIndex={0}
            >
              <img src={item.imageUrl} alt={item.name || "Closet item"} className="closet-item-image" />
            </div>
          ))}
        </div>
      </main>

      {selectedItemForPopup && (
        <div className="popup-overlay"> {/* Убрал onClick отсюда, т.к. есть useEffect */}
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-button" onClick={closeItemPopup} aria-label="Close popup">×</button>
            <img src={selectedItemForPopup.imageUrl} alt={selectedItemForPopup.name || "Selected item"} className="popup-image" />
            <h3 className="popup-item-name">{selectedItemForPopup.name || "Item Details"}</h3>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}