import React from 'react';

const UILayer = ({ complete, mode }) => {
  const titles = {
    wildflower: "Meadow Study No. 4",
    sunflower: "Sunflower Study No. 2",
    pothos: "Foliage Study No. 1",
    mixed: "Garden Study No. 7"
  };

  const poems = {
    wildflower: (
      <>
        The earth laughs in flowers,<br />
        A wild, chaotic chorus of color<br />
        Singing to the open sky.
      </>
    ),
    sunflower: (
      <>
        Heads held high to catch the light,<br />
        Gilded giants in the sun's embrace,<br />
        Watching the day turn into gold.
      </>
    ),
    pothos: (
      <>
        Green cascades of heart-shaped dreams,<br />
        Climbing silence, trailing time,<br />
        Life in a quiet, verdant rhythm.
      </>
    ),
    mixed: (
      <>
        A tapestry of wild and domestic,<br />
        Beauty found in the tangled mess,<br />
        Nature's diverse and breathing art.
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
        className={`text-[1.05rem] italic text-[#594a3e] transition-opacity duration-[2000ms] ease-out leading-[1.7] ${complete ? 'opacity-[0.85]' : 'opacity-0'}`}
      >
        {poems[mode]}
      </div>
    </div>
  );
};

export default UILayer;
