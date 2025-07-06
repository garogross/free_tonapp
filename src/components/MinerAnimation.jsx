import React, { useState, useEffect } from 'react';

const MinerAnimation = React.memo(({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);

      const timeout = setTimeout(() => {
        setCurrentImage(prev => (prev + 1) % images.length);
        setIsAnimating(false);
      }, 250);

      return () => clearTimeout(timeout);
    }, 1000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <img
      src={images[currentImage]}
      alt="Miner animation"
      className={`miner-gif ${isAnimating ? 'miner-transition' : ''}`}
    />
  );
});

export default MinerAnimation;
