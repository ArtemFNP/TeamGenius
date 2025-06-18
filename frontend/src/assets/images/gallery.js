// src/assets/images/gallery.js
import img1 from './clothes/1.png';           
import img2 from './clothes/2.png';           
import img3 from './clothes/3.png';           
import imgHoodie from './clothes/hoodie.png';
import imgTshirtBlack from './clothes/tshirtblack.png';
import imgTshirtWhite from './clothes/tshirtwhite123.png'; 

const allClosetItems = [
  // Все ваши предметы, которые вы ранее предоставили, они тегированы корректно
  // для использования в slots и rules-based AI
  { id: 'c1', imageUrl: img1, name: 'Beige T-Shirt', category: 'top', warmthRating: 1, isWaterproof: false, isClosedToe: false, style: 'casual', color: 'beige', pattern: 'solid', occasion: 'daily', gender: 'unisex' },
  { id: 'c2', imageUrl: img2, name: 'Black Joggers', category: 'bottom', warmthRating: 2, isWaterproof: false, isClosedToe: false, style: 'casual', color: 'black', pattern: 'solid', occasion: 'daily', gender: 'unisex' },
  { id: 'c3', imageUrl: img3, name: 'Black Jacket', category: 'outerwear', warmthRating: 3, isWaterproof: false, isClosedToe: false, style: 'casual', color: 'black', pattern: 'solid', occasion: 'daily', gender: 'unisex' },
  { id: 'c4', imageUrl: imgHoodie, name: 'Comfy Hoodie', category: 'outerwear', warmthRating: 3, isWaterproof: false, isClosedToe: false, style: 'casual', color: 'navy', pattern: 'solid', occasion: 'daily', gender: 'unisex' },
  { id: 'c5', imageUrl: imgTshirtBlack, name: 'Black T-Shirt', category: 'top', warmthRating: 1, isWaterproof: false, isClosedToe: false, style: 'casual', color: 'black', pattern: 'solid', occasion: 'daily', gender: 'unisex' },
  { id: 'c6', imageUrl: imgTshirtWhite, name: 'Classic White T-Shirt', category: 'top', warmthRating: 1, isWaterproof: false, isClosedToe: false, style: 'casual', color: 'white', pattern: 'solid', occasion: 'daily', gender: 'unisex' },
];

export default allClosetItems;