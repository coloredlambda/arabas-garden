import React, { useState, useRef, useEffect } from 'react';
import soundtrack from '../assets/soundtrack.mp3';

const MusicPlayer = ({ onCycleMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const attemptPlay = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.currentTime = 17;
        }
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay was prevented, waiting for interaction");
        
        // Add one-time listener for any user interaction to start the music
        const startOnInteraction = async () => {
          try {
            if (audioRef.current) {
              audioRef.current.currentTime = 17;
            }
            await audioRef.current.play();
            setIsPlaying(true);
            window.removeEventListener('click', startOnInteraction);
            window.removeEventListener('touchstart', startOnInteraction);
          } catch (e) {
            console.error("Interaction play failed", e);
          }
        };

        window.addEventListener('click', startOnInteraction);
        window.addEventListener('touchstart', startOnInteraction);
        
        return () => {
          window.removeEventListener('click', startOnInteraction);
          window.removeEventListener('touchstart', startOnInteraction);
        };
      }
    };
    attemptPlay();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="mt-6 flex items-center gap-6 opacity-0 animate-[fadeIn_3s_1.5s_forwards_ease-out] pointer-events-auto">
      <audio ref={audioRef} src={soundtrack} loop autoPlay />
      
      {/* Play/Pause Button */}
      <button 
        onClick={togglePlay}
        className="group relative flex items-center justify-center w-10 h-10 transition-all hover:scale-105"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <div className="absolute inset-0 bg-[#e8dcc4] rounded-full blur-[2px] group-hover:bg-[#dfd0b1] transition-colors" style={{ filter: 'url(#watercolor)' }} />
        <span className="relative z-10 text-[#594a3e] text-[0.9rem]">
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </button>

      {/* Cycle Garden Button */}
      <button 
        onClick={onCycleMode}
        className="group relative flex items-center justify-center p-2 transition-all hover:scale-105"
        aria-label="Next Garden"
      >
        <div className="absolute inset-0 bg-[#e8dcc4] rounded-full blur-[2px] group-hover:bg-[#dfd0b1] transition-colors" style={{ filter: 'url(#watercolor)' }} />
        <div className="relative z-10 flex items-center gap-2 px-3 py-1">
          <span className="text-[#594a3e] text-[0.7rem] uppercase tracking-widest font-medium">NEXT</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </button>

      <div className="text-[0.7rem] uppercase tracking-widest text-[#594a3e] opacity-60 italic">
      </div>
    </div>
  );
};

export default MusicPlayer;
