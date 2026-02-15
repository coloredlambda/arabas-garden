import React, { useState, useRef, useEffect } from 'react';
import soundtrack from '../assets/soundtrack.mp3';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const attemptPlay = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay was prevented, waiting for interaction");
        
        // Add one-time listener for any user interaction to start the music
        const startOnInteraction = async () => {
          try {
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

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
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

      {/* Mute/Unmute Button */}
      <button 
        onClick={toggleMute}
        className="group relative flex items-center justify-center w-10 h-10 transition-all hover:scale-105"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <div className="absolute inset-0 bg-[#e8dcc4] rounded-full blur-[2px] group-hover:bg-[#dfd0b1] transition-colors" style={{ filter: 'url(#watercolor)' }} />
        <span className="relative z-10 text-[#594a3e] text-[0.9rem]">
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 5-7 7 7 7"/>
              <path d="M11 9L11 15"/>
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 5-7 7 7 7"/>
              <path d="M11 9L11 15"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </span>
      </button>

      <div className="text-[0.7rem] uppercase tracking-widest text-[#594a3e] opacity-60 italic">
      </div>
    </div>
  );
};

export default MusicPlayer;
