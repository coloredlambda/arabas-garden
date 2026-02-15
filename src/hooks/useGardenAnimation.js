import { useEffect, useRef, useState } from 'react';
import { Brush, Stem, Flower, PALETTE } from '../utils/drawingUtils';

const COMPOSITE_FILTER = 'url(#watercolor) blur(0.3px)';

export const useGardenAnimation = (displayCanvasRef, paintCanvasRef, mode = 'wildflower') => {
    const [complete, setComplete] = useState(false);
    const animationIdRef = useRef(null);
    const stemsRef = useRef([]);
    const flowersRef = useRef([]);
    const brushRef = useRef(null);

    const init = () => {
        if (!displayCanvasRef.current || !paintCanvasRef.current) return;

        const displayCanvas = displayCanvasRef.current;
        const paintCanvas = paintCanvasRef.current;
        const displayCtx = displayCanvas.getContext('2d', { alpha: true, desynchronized: true });
        const paintCtx = paintCanvas.getContext('2d', { alpha: true });

        const width = window.innerWidth;
        const height = window.innerHeight;

        displayCanvas.width = width;
        displayCanvas.height = height;
        paintCanvas.width = width;
        paintCanvas.height = height;
        paintCtx.lineCap = 'round';
        paintCtx.lineJoin = 'round';

        paintCtx.clearRect(0, 0, width, height);
        brushRef.current = new Brush(paintCtx);
        stemsRef.current = [];
        flowersRef.current = [];
        setComplete(false);

        // Protected Zone (Top Right)
        const protectedZone = {
            x: width - 450,
            y: 0,
            width: 450,
            height: 450
        };

        const isInsideProtectedZone = (x, y) => {
            return x > protectedZone.x && y < protectedZone.height;
        };

        // Ground Wash
        const groundH = height * 0.15;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = height - Math.random() * groundH;
            const w = 100 + Math.random() * 200;
            const col = PALETTE.ground[Math.floor(Math.random() * PALETTE.ground.length)];
            brushRef.current.wash(x, y, w, w * 0.3, col, 0.05);
        }

        // Determine species and density based on mode
        let speciesList = ['wildflower'];
        let density = Math.floor(width / 30);

        if (mode === 'sunflower') {
            speciesList = ['sunflower'];
            density = Math.floor(width / 60);
        } else if (mode === 'pothos') {
            speciesList = ['pothos'];
            density = Math.floor(width / 40);
        } else if (mode === 'mixed') {
            speciesList = ['wildflower', 'sunflower', 'pothos'];
            density = Math.floor(width / 35);
        }

        // Initialize Stems
        for (let i = 0; i < density; i++) {
            const species = speciesList[Math.floor(Math.random() * speciesList.length)];
            let x = Math.random() * width;
            const depth = Math.random();

            let y, scale, h;

            if (species === 'pothos') {
                // Pothos now grows from bottom or sides
                const side = Math.random();
                if (side < 0.4) { // Bottom
                    y = height + 20;
                    x = Math.random() * width;
                } else if (side < 0.7) { // Left side
                    y = Math.random() * height;
                    x = -20;
                } else { // Right side
                    y = Math.random() * height;
                    x = width + 20;
                }
                scale = 0.6 + depth * 0.8;
                h = (height * 0.4) + Math.random() * (height * 0.5);
            } else if (species === 'sunflower') {
                y = height + 20 + depth * 40;
                scale = 0.8 + depth * 1.0;
                h = (height * 0.5) + Math.random() * (height * 0.3);
            } else {
                y = height + 10 + depth * 40;
                scale = 0.5 + depth * 0.7;
                h = (height * 0.2) + Math.random() * (height * 0.5);
            }

            // Don't start a plant inside the protected zone if it's near the top
            if (isInsideProtectedZone(x, y)) {
                continue;
            }

            const stem = new Stem(x, y, h * scale, scale, species);

            // Filter segments that enter the protected zone
            stem.segments = stem.segments.filter(seg => !isInsideProtectedZone(seg.x, seg.y));
            if (stem.segments.length > 0) {
                stem.tip = stem.segments[stem.segments.length - 1];
                stemsRef.current.push(stem);
            }
        }

        // Sort
        stemsRef.current.sort((a, b) => a.scale - b.scale);

        const loop = () => {
            let active = false;

            stemsRef.current.forEach(stem => {
                const done = stem.update();
                stem.draw(brushRef.current);
                if (!done) active = true;
                else if (stem.type === 'flower' && !stem.hasFlower) {
                    // Extra check for flower position
                    if (!isInsideProtectedZone(stem.tip.x, stem.tip.y)) {
                        flowersRef.current.push(new Flower(stem.tip.x, stem.tip.y, stem.scale, stem.species));
                    }
                    stem.hasFlower = true;
                }
            });

            flowersRef.current.forEach(flower => {
                flower.draw(brushRef.current);
                if (flower.age < flower.maxAge) active = true;
            });

            // Render Frame
            displayCtx.clearRect(0, 0, width, height);
            displayCtx.filter = COMPOSITE_FILTER;
            displayCtx.drawImage(paintCanvas, 0, 0);
            displayCtx.filter = 'none';

            if (active) {
                animationIdRef.current = requestAnimationFrame(loop);
            } else {
                setComplete(true);
            }
        };

        loop();
    };

    useEffect(() => {
        const timeoutId = setTimeout(init, 200);

        const handleResize = () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        };
    }, [mode]);

    return { complete };
};
