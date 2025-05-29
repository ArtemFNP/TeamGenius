import React, { useState, useEffect } from 'react';
import tshirtImage from '../assets/images/tshirt.png';
import pantsImage from '../assets/images/2.png';
import jacketImage from '../assets/images/3.png';

const OutfitDisplay = () => {
  const [currentOutfit, setCurrentOutfit] = useState({
    tshirt: {
      image: tshirtImage,
      description: 'Classic white t-shirt'
    },
    pants: {
      image: pantsImage,
      description: 'Blue jeans'
    },
    jacket: {
      image: jacketImage,
      description: 'Black leather jacket'
    }
  });

  // Mock function to simulate API response
  const getMockResponse = () => {
    const outfits = {
      tshirt: [
        { image: tshirtImage, description: 'Classic white t-shirt' },
        { image: tshirtImage, description: 'Graphic print t-shirt' },
        { image: tshirtImage, description: 'Striped t-shirt' }
      ],
      pants: [
        { image: pantsImage, description: 'Blue jeans' },
        { image: pantsImage, description: 'Black chinos' },
        { image: pantsImage, description: 'Cargo pants' }
      ],
      jacket: [
        { image: jacketImage, description: 'Black leather jacket' },
        { image: jacketImage, description: 'Denim jacket' },
        { image: jacketImage, description: 'Bomber jacket' }
      ]
    };

    // Randomly select one outfit for each category
    return {
      tshirt: outfits.tshirt[Math.floor(Math.random() * outfits.tshirt.length)],
      pants: outfits.pants[Math.floor(Math.random() * outfits.pants.length)],
      jacket: outfits.jacket[Math.floor(Math.random() * outfits.jacket.length)]
    };
  };

  // Function to update outfit
  const updateOutfit = () => {
    const newOutfit = getMockResponse();
    setCurrentOutfit(newOutfit);
  };

  return (
    <div className="outfit-display">
      <div className="outfit-grid">
        {Object.entries(currentOutfit).map(([item, details]) => (
          <div key={item} className="outfit-item">
            <img src={details.image} alt={item} className="outfit-image" />
            <p className="outfit-description">{details.description}</p>
          </div>
        ))}
      </div>
      <button onClick={updateOutfit} className="update-button">
        Get New Outfit
      </button>
    </div>
  );
};

export default OutfitDisplay; 