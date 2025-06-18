// src/hooks/useNewClothingItemForm.js
import { useState } from 'react';

export function useNewClothingItemForm() {
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState(null);
  const [newImageName, setNewImageName] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('');
  const [newImageWarmth, setNewImageWarmth] = useState(1);
  const [newImageIsWaterproof, setNewImageIsWaterproof] = useState(false);
  const [newImageIsClosedToe, setNewImageIsClosedToe] = useState(false); // Для обуви

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviewUrl(reader.result); // Base64 строка изображения
      };
      reader.readAsDataURL(file);
    } else {
      setNewImageFile(null);
      setNewImagePreviewUrl(null);
    }
  };

  const resetForm = () => {
    setNewImageFile(null);
    setNewImagePreviewUrl(null);
    setNewImageName('');
    setNewImageCategory('');
    setNewImageWarmth(1);
    setNewImageIsWaterproof(false);
    setNewImageIsClosedToe(false);
  };

  // Возвращаем все состояния и хэндлеры
  return {
    newImageFile, setNewImageFile,
    newImagePreviewUrl, setNewImagePreviewUrl,
    newImageName, setNewImageName,
    newImageCategory, setNewImageCategory,
    newImageWarmth, setNewImageWarmth,
    newImageIsWaterproof, setNewImageIsWaterproof,
    newImageIsClosedToe, setNewImageIsClosedToe,
    handleFileChange,
    resetForm,
  };
}