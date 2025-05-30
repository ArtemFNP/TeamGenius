// src/assets/images/gallery.js (ПРИМЕР!)
// Тебе нужно будет импортировать все свои изображения здесь и экспортировать массив с ними.
// Важно, чтобы имена файлов совпадали с теми, что у тебя в assets/images/clothes/

import img1 from './clothes/1.png';           // Раньше tshirtImg
import img2 from './clothes/2.png';           // Раньше jacketImg
import img3 from './clothes/3.png';           // Раньше shoesImg
import imgHoodie from './clothes/hoodie.png';
import imgTshirtBlack from './clothes/tshirtblack.png';
import imgTshirtWhite from './clothes/tshirtwhite123.png'; 
// ... добавь другие, если есть

const allClosetImages = [
  { id: 'c1', imageUrl: img1, name: 'Beige T-Shirt' },
  { id: 'c2', imageUrl: img2, name: 'Denim Jacket' },
  { id: 'c3', imageUrl: img3, name: 'White Sneakers' },
  { id: 'c4', imageUrl: imgHoodie, name: 'Comfy Hoodie' },
  { id: 'c5', imageUrl: imgTshirtBlack, name: 'Black T-Shirt' },
  { id: 'c6', imageUrl: imgTshirtWhite, name: 'Classic White Tee' },
];

export default allClosetImages; // Экспортируем массив объектов