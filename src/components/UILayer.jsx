import React from 'react';

import MusicPlayer from './MusicPlayer';

const UILayer = ({ complete, mode }) => {
  const titles = {
    wildflower: "Wildflowers Study No. 1",
    sunflower: "Sunflower Study No. 2",
    pothos: "Pothos Ivy Study No. 3",
    mixed: "Garden Study No. 4"
  };

  const poems = {
    wildflower: (
      <>
        I love their randomness,<br />
        They can be anything,<br />
        You and I too, could be, anything...
      </>
    ),
    sunflower: (
      <>
        My favorite flower,<br />
        The only one I really know,<br />
        You're my big little sunflower.
      </>
    ),
    pothos: (
      <>
        You made me fall in love with pothos,<br />
        Their clinginess, climbing upwards and towards the light,<br />
        We should learn from them.
      </>
    ),
    mixed: (
      <>
        I will make you a garden one day,<br />
        For now, it has to be digital,<br />
        Here for you to imagine.<br />
        <span style={{ fontStyle: 'italic' }}>I love you, Nana Araba</span>
      </>
    )
  };

  return (
    <div className="absolute top-[80px] right-[50px] z-[20] flex flex-col items-end text-right max-w-[400px] pointer-events-none">
      <h1 className="font-normal text-[1.4rem] text-[#3a3228] m-0 mb-[12px] tracking-[0.1em] uppercase opacity-0 animate-[fadeIn_2.5s_0s_forwards_ease-out] border-b border-[#594a3e33] pb-[8px] inline-block">
        {titles[mode]}
      </h1>
      <div 
        id="poemText" 
        className="text-[1.05rem] italic text-[#594a3e] opacity-0 animate-[fadeIn_3s_1s_forwards_ease-out] leading-[1.7]"
      >
        {poems[mode]}
      </div>
      <MusicPlayer />
    </div>
  );
};

export default UILayer;
