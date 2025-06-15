import img1 from './clothes/1.png';           
import img2 from './clothes/2.png';           
import img3 from './clothes/3.png';           
import imgHoodie from './clothes/hoodie.png';
import imgTshirtBlack from './clothes/tshirtblack.png';
import imgTshirtWhite from './clothes/tshirtwhite123.png'; 
// Если у тебя есть другие картинки (например, для кепок, штанов),
// импортируй их здесь и добавь соответствующие объекты в массив ниже.
// Пример: import imgPants from './clothes/pants.png';
// Пример: import imgCap from './clothes/cap.png';

const allClosetItems = [
  // Item 1: Beige T-Shirt
  { 
    id: 'c1', 
    imageUrl: img1, 
    name: 'Beige T-Shirt', 
    category: 'top',             // ОК: Футболки идут в 'top'
    warmthRating: 1,             
    isWaterproof: false,
    isClosedToe: false,          
    style: 'casual',
    color: 'beige',
    pattern: 'solid',
    occasion: 'daily',
    gender: 'unisex'
  },
  // Item 2: Black Joggers
  { 
    id: 'c2', 
    imageUrl: img2, // Предполагается, что это изображение штанов (а не jacket, как ранее было в gallery.js примере)
    name: 'Black Joggers', 
    category: 'bottom',       // <--- ИСПРАВЛЕНО: 'bottom' - стандартная категория для штанов
    warmthRating: 2,             
    isWaterproof: false,         
    isClosedToe: false, // Неприменимо
    style: 'casual',
    color: 'black', // <-- Изменил на black, если они черные джоггеры
    pattern: 'solid',
    occasion: 'daily',
    gender: 'unisex'
  },
  // Item 3: Black Jacket
  { 
    id: 'c3', 
    imageUrl: img3, // Предполагается, что это изображение куртки (а не shoes, как ранее было в gallery.js примере)
    name: 'Black Jacket', 
    category: 'outerwear',    // <--- ИСПРАВЛЕНО: Куртки - это 'outerwear'
    warmthRating: 3,             // Уровень тепла для куртки
    isWaterproof: false,         
    isClosedToe: false,       // Неприменимо
    style: 'casual',
    color: 'black', // <-- Изменил на black
    pattern: 'solid',
    occasion: 'daily',
    gender: 'unisex'
  },
  // Item 4: Comfy Hoodie
  { 
    id: 'c4', 
    imageUrl: imgHoodie, 
    name: 'Comfy Hoodie', 
    category: 'outerwear',       // ОК: Худи - это 'outerwear'
    warmthRating: 3,             
    isWaterproof: false,
    isClosedToe: false,
    style: 'casual',
    color: 'navy',
    pattern: 'solid',
    occasion: 'daily',
    gender: 'unisex'
  },
  // Item 5: Black T-Shirt
  { 
    id: 'c5', 
    imageUrl: imgTshirtBlack, 
    name: 'Black T-Shirt', 
    category: 'top',             // ОК: Футболка - это 'top'
    warmthRating: 1,
    isWaterproof: false,
    isClosedToe: false,
    style: 'casual',
    color: 'black',
    pattern: 'solid',
    occasion: 'daily',
    gender: 'unisex'
  },
  // Item 6: Classic White T-shirt
  { 
    id: 'c6', 
    imageUrl: imgTshirtWhite, 
    name: 'Classic White T-Shirt', 
    category: 'top',             // ОК: Футболка - это 'top'
    warmthRating: 1,
    isWaterproof: false,
    isClosedToe: false,
    style: 'casual',
    color: 'white',
    pattern: 'solid',
    occasion: 'daily',
    gender: 'unisex'
  },
  
  // Добавляйте другие ваши предметы одежды сюда по аналогии.
  // Например, если у вас есть "Брюки" (Pants), вы бы добавили:
  /*
  { 
    id: 'c7', 
    imageUrl: imgPants, // Предполагается, что вы импортировали imgPants
    name: 'Casual Pants', 
    category: 'bottom',          // Штаны/брюки идут в 'bottom'
    warmthRating: 2,
    isWaterproof: false,
    isClosedToe: false,
    style: 'casual',
    color: 'grey',
    pattern: 'solid',
    occasion: 'daily',
    gender: 'unisex'
  },
  */
  // Например, если у вас есть "Кепка" (Cap):
  /*
  { 
    id: 'c8', 
    imageUrl: imgCap, // Предполагается, что вы импортировали imgCap
    name: 'Baseball Cap', 
    category: 'headwear',        // Кепки/шапки идут в 'headwear'
    warmthRating: 1,
    isWaterproof: false,
    isClosedToe: false,
    style: 'sporty',
    color: 'red',
    pattern: 'logo',
    occasion: 'daily',
    gender: 'unisex'
  },
  */
];

export default allClosetItems; // Экспортируем массив объектов