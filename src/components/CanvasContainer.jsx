import React, { useRef } from 'react';
import { useGardenAnimation } from '../hooks/useGardenAnimation';

const CanvasContainer = ({ mode = 'wildflower', onComplete }) => {
  const displayCanvasRef = useRef(null);
  const paintCanvasRef = useRef(null);
  
  const { complete } = useGardenAnimation(displayCanvasRef, paintCanvasRef, mode);

  React.useEffect(() => {
    if (complete && onComplete) {
      onComplete();
    }
  }, [complete, onComplete]);

  return (
    <div className="relative w-full h-full z-[1]">
      <canvas id="artCanvas" ref={displayCanvasRef} className="block" />
      <canvas ref={paintCanvasRef} className="hidden" />
    </div>
  );
};

export default CanvasContainer;
