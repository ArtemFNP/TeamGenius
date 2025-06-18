// src/hooks/useMannequinSlots.js
import { useState } from 'react';

export function useMannequinSlots() {
  const [selectedHeadwear, setSelectedHeadwear] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedFootwear, setSelectedFootwear] = useState(null);

  const resetAllSlots = () => {
    setSelectedHeadwear(null);
    setSelectedTop(null);
    setSelectedOuterwear(null);
    setSelectedBottom(null);
    setSelectedFootwear(null);
  };

  const setItemInSlot = (item) => {
    if (!item.category) {
        console.warn(`Item category is not defined for: ${item.name}. Assigning to top slot by default.`);
        setSelectedTop(item);
        return;
    }

    const normalizedCategory = item.category.toLowerCase();

    switch (normalizedCategory) {
      case 'headwear':
      case 'cap':
      case 'hat':
        // removed 'accessory' from here: if 'accessory' is not a headwear.
        setSelectedHeadwear(item);
        break;

      case 'outerwear':
      case 'jacket':
      case 'hoodie':
      case 'coat':
        setSelectedOuterwear(item);
        break;

      case 'top':
      case 't-shirt':
      case 'shirt':
      case 'blouse':
      case 'sweatshirt':
      case 'longsleeve':
        setSelectedTop(item);
        break;

      case 'bottom':
      case 'pants':
      case 'shorts':
      case 'jeans':
      case 'joggers':
      case 'trousers':
        setSelectedBottom(item);
        break;

      case 'shoes':
      case 'footwear':
      case 'sneakers':
      case 'boots':
      case 'sandals':
        setSelectedFootwear(item);
        break;

      default:
        console.warn(`Category '${item.category}' for item: ${item.name} not assigned to any specific mannequin slot. It will not be displayed on the mannequin.`);
    }
  };

  return {
    selectedHeadwear, setSelectedHeadwear,
    selectedTop, setSelectedTop,
    selectedOuterwear, setSelectedOuterwear,
    selectedBottom, setSelectedBottom,
    selectedFootwear, setSelectedFootwear,
    resetAllSlots,
    setItemInSlot
  };
}