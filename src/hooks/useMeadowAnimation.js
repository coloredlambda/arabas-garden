import { useEffect, useRef, useState } from 'react';
import { Brush, Stem, Flower, PALETTE } from '../utils/drawingUtils';

const COMPOSITE_FILTER = 'url(#watercolor) blur(0.3px)';

export const useMeadowAnimation = (displayCanvasRef, paintCanvasRef) => {
    const [poemVisible, setPoemVisible] = useState(false);
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

        // Draw Ground
        const groundH = height * 0.15;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = height - Math.random() * groundH;
            const w = 100 + Math.random() * 200;
            const col = PALETTE.ground[Math.floor(Math.random() * PALETTE.ground.length)];
            brushRef.current.wash(x, y, w, w * 0.3, col, 0.05);
        }

        // Initialize Stems
        const density = Math.floor(width / 25);
        for (let i = 0; i < density; i++) {
            const x = Math.random() * width;
            const depth = Math.random();
            const y = height + 10 + depth * 40;
            const scale = 0.5 + depth * 0.7;
            const h = (height * 0.3) + Math.random() * (height * 0.4);
            stemsRef.current.push(new Stem(x, y, h * scale, scale));
        }

        stemsRef.current.sort((a, b) => a.scale - b.scale);

        const loop = () => {
            let active = false;

            stemsRef.current.forEach(stem => {
                const done = stem.update();
                stem.draw(brushRef.current);
                if (!done) active = true;
                else if (stem.type === 'flower' && !stem.hasFlower) {
                    flowersRef.current.push(new Flower(stem.tip.x, stem.tip.y, stem.scale));
                    stem.hasFlower = true;
                    if (Math.random() > 0.7 && stem.segments.length > 20) {
                        const nodeIdx = Math.floor(stem.segments.length * 0.7);
                        const node = stem.segments[nodeIdx];
                        flowersRef.current.push(new Flower(node.x + 20 * stem.scale, node.y, stem.scale * 0.7));
                    }
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
                setPoemVisible(true);
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
    }, []);

    return { poemVisible };
};
