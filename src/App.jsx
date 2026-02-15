import React, { useState } from 'react';
import CanvasContainer from './components/CanvasContainer';
import UILayer from './components/UILayer';

function App() {
  const [complete, setComplete] = useState(false);
  const [mode, setMode] = useState('wildflower');
  const [key, setKey] = useState(0); // To force re-mount and re-animate

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setComplete(false);
    setKey(prev => prev + 1);
  };

  const handleRegenerate = () => {
    setComplete(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="w-full h-full overflow-hidden bg-[#fbf9f2] font-['Palatino_Linotype',_'Book_Antiqua',_Palatino,_serif]">
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="paper-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.25 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
          </filter>
          
          <filter id="watercolor">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" />
            <feGaussianBlur stdDeviation="0.7" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="1.1" intercept="0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Paper Texture */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[10] opacity-50 mix-blend-multiply">
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" filter="url(#paper-noise)" opacity="0.4" />
        </svg>
      </div>

      {/* Garden Selector UI */}
      <div className="absolute top-[30px] left-[30px] z-[30] flex gap-4 text-[0.8rem] uppercase tracking-widest text-[#594a3e]">
        {['wildflower', 'sunflower', 'pothos', 'mixed'].map((m) => (
          <button
            key={m}
            className={`border-b border-transparent transition-all pb-1 ${mode === m ? 'border-[#3a3228] text-[#3a3228]' : 'opacity-60 hover:opacity-100'}`}
            onClick={() => handleModeChange(m)}
          >
            {m === 'wildflower' ? 'Wild Meadow' : m === 'sunflower' ? 'Sunny Patch' : m === 'pothos' ? 'Ivy Wall' : 'Mixed Garden'}
          </button>
        ))}
        <button 
          onClick={handleRegenerate}
          className="ml-4 opacity-40 hover:opacity-100 transition-opacity italic"
        >
          Regenerate
        </button>
      </div>

      {/* Main Content */}
      <CanvasContainer 
        key={key}
        mode={mode} 
        onComplete={() => setComplete(true)} 
      />
      
      <UILayer complete={complete} mode={mode} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
