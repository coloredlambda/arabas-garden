import { useEffect, useRef, useState } from 'react';
import { Brush, Stem, Flower, Butterfly, PALETTE } from '../utils/drawingUtils';

const COMPOSITE_FILTER = 'url(#watercolor) blur(0.3px)';

export const useGardenAnimation = (displayCanvasRef, paintCanvasRef, mode = 'wildflower') => {
    const [complete, setComplete] = useState(false);
    const animationIdRef = useRef(null);
    const stemsRef = useRef([]);
    const flowersRef = useRef([]);
    const butterfliesRef = useRef([]);
    const brushRef = useRef(null);
    const butterflyBrushRef = useRef(null);

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
        butterflyBrushRef.current = new Brush(displayCtx);
        stemsRef.current = [];
        flowersRef.current = [];
        butterfliesRef.current = [];
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
            density = Math.floor(width / 25); // Increased for lushness
        } else if (mode === 'mixed') {
            speciesList = ['wildflower', 'sunflower', 'pothos'];
            density = Math.floor(width / 35);
        }

        // Initialize Stems
        for (let i = 0; i < density; i++) {
            const species = speciesList[Math.floor(Math.random() * speciesList.length)];

            // For mixed mode, reduce pothos frequency
            if (mode === 'mixed' && species === 'pothos' && Math.random() < 0.5) {
                continue;
            }

            let x = Math.random() * width;
            const depth = Math.random();

            let y, scale, h;
            let initialAngle = -Math.PI / 2; // Default: upwards

            if (species === 'pothos') {
                const spawn = Math.random();
                if (mode === 'pothos') {
                    // Pothos mode: grow from bottom, sides, center, or TOP
                    if (spawn < 0.25) { // Bottom
                        y = height + 20;
                        x = Math.random() * width;
                    } else if (spawn < 0.5) { // Left/Right edges
                        y = Math.random() * height;
                        x = spawn < 0.37 ? -20 : width + 20;
                    } else if (spawn < 0.75) { // Top
                        y = -20;
                        x = Math.random() * width;
                        initialAngle = Math.PI / 2; // Grow downwards
                    } else { // Center ground/random points
                        y = Math.random() * height;
                        x = (width * 0.1) + Math.random() * (width * 0.8);
                        initialAngle = (Math.random() - 0.5) * Math.PI * 2; // Random direction
                    }
                } else {
                    // Mixed mode: keep to edges (bottom or sides)
                    if (spawn < 0.45) { // Bottom
                        y = height + 20;
                        x = Math.random() * width;
                    } else { // Sides
                        y = Math.random() * height;
                        x = spawn < 0.75 ? -20 : width + 20;
                    }
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

            const stem = new Stem(x, y, h * scale, scale, species, initialAngle);

            // Filter segments that enter the protected zone
            stem.segments = stem.segments.filter(seg => !isInsideProtectedZone(seg.x, seg.y));
            if (stem.segments.length > 0) {
                stem.tip = stem.segments[stem.segments.length - 1];
                stemsRef.current.push(stem);
            }
        }

        // Initialize Butterflies
        const butterflyCount = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < butterflyCount; i++) {
            butterfliesRef.current.push(new Butterfly(width, height));
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

            // Butterflies are always active and drawn on displayCtx (no trails)
            butterfliesRef.current.forEach(butterfly => {
                butterfly.update();
                butterfly.draw(butterflyBrushRef.current);
                active = true;
            });

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
