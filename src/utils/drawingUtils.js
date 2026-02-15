export const PALETTE = {
    ground: [
        { h: 85, s: 30, l: 85 },
        { h: 75, s: 25, l: 80 },
        { h: 95, s: 20, l: 75 }
    ],
    stems: [
        { h: 95, s: 35, l: 40 },
        { h: 80, s: 40, l: 45 },
        { h: 110, s: 30, l: 35 },
        { h: 45, s: 35, l: 50 },
        { h: 120, s: 20, l: 30 } // Pothos darker stem
    ],
    flowers: [
        { h: 12, s: 85, l: 62 },
        { h: 215, s: 70, l: 65 },
        { h: 42, s: 95, l: 65 },
        { h: 275, s: 45, l: 68 },
        { h: 335, s: 75, l: 70 },
        { h: 25, s: 90, l: 60 }
    ],
    sunflower: {
        petals: { h: 45, s: 95, l: 60 },
        center: { h: 25, s: 40, l: 20 },
        secondary: { h: 35, s: 90, l: 50 }
    },
    pothos: [
        { h: 100, s: 45, l: 35 }, // Rich green
        { h: 85, s: 40, l: 45 },  // Lighter green
        { h: 60, s: 30, l: 75 }   // Variegated cream
    ],
    butterflies: [
        { main: { h: 25, s: 95, l: 55 }, sec: { h: 0, s: 0, l: 10 } },   // Monarch Orange
        { main: { h: 190, s: 90, l: 50 }, sec: { h: 210, s: 80, l: 20 } }, // Blue Morpho
        { main: { h: 280, s: 80, l: 60 }, sec: { h: 300, s: 70, l: 30 } }, // Purple Emperor
        { main: { h: 50, s: 95, l: 60 }, sec: { h: 40, s: 80, l: 20 } },  // Swallowtail Yellow
        { main: { h: 330, s: 90, l: 65 }, sec: { h: 350, s: 70, l: 30 } }  // Pink Petal
    ],
    centers: { h: 45, s: 80, l: 45 },
    leaves: { h: 100, s: 35, l: 42 }
};

export class Brush {
    constructor(ctx) {
        this.ctx = ctx;
    }

    stroke(x1, y1, x2, y2, color, width, opacity) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);

        const h = color.h + (Math.random() * 8 - 4);
        const s = color.s + (Math.random() * 10 - 5);
        const l = color.l + (Math.random() * 10 - 5);

        this.ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${opacity})`;
        this.ctx.lineWidth = width * (0.85 + Math.random() * 0.3);
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    blob(x, y, radius, color, opacity, angle, stretch) {
        const baseAngle = angle == null ? Math.random() * Math.PI : angle;
        const baseStretch = stretch == null ? (1.1 + Math.random() * 0.2) : stretch;

        const passes = 2;
        for (let i = 0; i < passes; i++) {
            const jx = (Math.random() - 0.5) * radius * 0.4;
            const jy = (Math.random() - 0.5) * radius * 0.4;
            const r = Math.max(0.5, radius * (0.8 + Math.random() * 0.4));
            const rx = r * baseStretch;
            const ry = r * (0.7 + Math.random() * 0.3);
            const h = color.h + (Math.random() * 12 - 6);
            const l = color.l + (Math.random() * 8 - 4);
            const a = baseAngle + (Math.random() - 0.5) * 0.2;

            this.ctx.beginPath();
            this.ctx.ellipse(x + jx, y + jy, rx, ry, a, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${h}, ${color.s}%, ${l}%, ${opacity})`;
            this.ctx.fill();
        }
    }

    wash(x, y, width, height, color, opacity) {
        const grd = this.ctx.createRadialGradient(x, y, 0, x, y, width);
        grd.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${opacity})`);
        grd.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);

        this.ctx.fillStyle = grd;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(1, height / width);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, width, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    butterflyWing(x, y, size, angle, side, wingType, color, opacity, flap) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        this.ctx.scale(side === 'right' ? 1 : -1, 1);

        // Flap affects horizontal scale (width as seen from top/front)
        const flapFactor = Math.cos(flap * Math.PI * 2);
        const flapWidth = Math.max(0.1, 0.4 + flapFactor * 0.6);
        this.ctx.scale(flapWidth, 1);

        const passes = 3;
        for (let i = 0; i < passes; i++) {
            const jitterX = (Math.random() - 0.5) * 2;
            const jitterY = (Math.random() - 0.5) * 2;
            const s = size * (0.9 + Math.random() * 0.2);

            const h = color.h + (Math.random() * 10 - 5);
            const l = color.l + (Math.random() * 10 - 5);
            this.ctx.fillStyle = `hsla(${h}, ${color.s}%, ${l}%, ${opacity / passes})`;

            this.ctx.beginPath();
            this.ctx.moveTo(jitterX, jitterY);
            if (wingType === 'top') {
                // Top wing (larger, swept back slightly)
                this.ctx.bezierCurveTo(jitterX + s * 0.5, jitterY - s * 1.5, jitterX + s * 2.5, jitterY - s * 0.5, jitterX + s * 1.5, jitterY + s * 0.2);
                this.ctx.bezierCurveTo(jitterX + s * 1.0, jitterY + s * 0.5, jitterX + s * 0.2, jitterY + s * 0.2, jitterX, jitterY);
            } else {
                // Bottom wing (smaller, more rounded)
                this.ctx.bezierCurveTo(jitterX + s * 1.2, jitterY + s * 0.5, jitterX + s * 1.5, jitterY + s * 1.8, jitterX + s * 0.5, jitterY + s * 1.2);
                this.ctx.bezierCurveTo(jitterX + s * 0.2, jitterY + s * 0.8, jitterX, jitterY + s * 0.2, jitterX, jitterY);
            }
            this.ctx.fill();
        }
        this.ctx.restore();
    }
}

export class Stem {
    constructor(x, y, height, scale, species = 'wildflower', initialAngle = null) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.targetHeight = height;
        this.currentHeight = 0;
        this.segments = [];
        this.growSpeed = (1.5 + Math.random() * 2) * (species === 'sunflower' ? 0.7 : 1);
        this.done = false;
        this.species = species;
        this.type = (species === 'pothos') ? 'vine' : (Math.random() > 0.3 ? 'flower' : 'grass');
        this.color = (species === 'pothos') ? PALETTE.stems[4] : PALETTE.stems[Math.floor(Math.random() * 4)];
        this.hasFlower = false;

        let cx = x;
        let cy = y;

        // Initial angle: Fallback to species defaults if initialAngle is not provided
        let ca = initialAngle;
        if (ca === null) {
            ca = -Math.PI / 2;
            if (species === 'wildflower') ca += (Math.random() - 0.5) * 0.4;
            if (species === 'pothos') ca = Math.PI / 2 + (Math.random() - 0.5) * 1.0; // Trail downwards
        }

        const stepSize = (species === 'sunflower' ? 10 : 6) * scale;
        const totalSteps = Math.floor(height / stepSize);

        this.leaves = [];
        for (let i = 0; i < totalSteps; i++) {
            // Sway/Curve logic
            let jitter = (species === 'sunflower') ? 0.05 : 0.12;
            ca += (Math.random() - 0.5) * jitter;

            // Discipline for upright plants
            if (species !== 'pothos') {
                if (ca < -Math.PI / 2 - 0.4) ca += 0.03;
                if (ca > -Math.PI / 2 + 0.4) ca -= 0.03;
            }

            let nx = cx + Math.cos(ca) * stepSize;
            let ny = cy + Math.sin(ca) * stepSize;

            this.segments.push({
                x: nx,
                y: ny,
                angle: ca
            });

            // Add leaves
            if (species === 'sunflower' && i > totalSteps * 0.3 && Math.random() < 0.2) {
                this.addLeaf(nx, ny, ca, i, 'broad');
            } else if (species === 'pothos' && Math.random() < 0.4) {
                this.addLeaf(nx, ny, ca, i, 'heart');
            } else if (species === 'wildflower') {
                if (this.type === 'flower' && i > totalSteps * 0.2 && i < totalSteps * 0.85 && Math.random() < 0.15) {
                    this.addLeaf(nx, ny, ca, i);
                } else if (this.type === 'grass' && i > totalSteps * 0.3 && Math.random() < 0.25) {
                    this.addLeaf(nx, ny, ca, i, 'grass');
                }
            }
            cx = nx;
            cy = ny;
        }
        this.tip = { x: cx, y: cy };
    }

    addLeaf(x, y, angle, index, leafType = 'pointy') {
        const side = Math.random() < 0.5 ? -1 : 1;
        const leafAngle = angle + side * (0.8 + Math.random() * 0.6);

        let length = (15 + Math.random() * 20) * this.scale;
        let width = (4 + Math.random() * 4) * this.scale;
        let leafColor = PALETTE.leaves;

        if (leafType === 'grass') {
            length = (20 + Math.random() * 30) * this.scale;
            width = (2 + Math.random() * 2) * this.scale;
        } else if (leafType === 'broad') {
            length = (25 + Math.random() * 35) * this.scale;
            width = (15 + Math.random() * 20) * this.scale;
        } else if (leafType === 'heart') {
            length = (15 + Math.random() * 25) * this.scale;
            width = (12 + Math.random() * 18) * this.scale;
            leafColor = PALETTE.pothos[Math.floor(Math.random() * PALETTE.pothos.length)];
        }

        if (!this.leaves[index]) this.leaves[index] = [];
        this.leaves[index].push({
            angle: leafAngle,
            length: length,
            width: width,
            drawn: false,
            cos: Math.cos(leafAngle),
            sin: Math.sin(leafAngle),
            type: leafType,
            color: leafColor
        });
    }

    update() {
        if (this.currentHeight < this.segments.length) {
            this.currentHeight += this.growSpeed;
            if (this.currentHeight >= this.segments.length) {
                this.currentHeight = this.segments.length;
                this.done = true;
            }
        }
        return this.done;
    }

    draw(brush) {
        const maxIndex = Math.floor(this.currentHeight);
        if (maxIndex < 1) return;

        const drawEnd = this.hasFlower ? Math.max(1, maxIndex - 1) : maxIndex;
        const startIdx = Math.max(1, drawEnd - Math.ceil(this.growSpeed) - 1);

        for (let i = startIdx; i < drawEnd; i++) {
            const prev = this.segments[i - 1];
            const curr = this.segments[i];
            const t = i / this.segments.length;

            let stemWidth = (this.species === 'sunflower' ? 8 : 4.0) * this.scale * (1 - t * 0.4);
            if (this.species === 'pothos') stemWidth = 3 * this.scale;

            brush.stroke(prev.x, prev.y, curr.x, curr.y, this.color, stemWidth, 0.25);
            brush.stroke(prev.x, prev.y, curr.x, curr.y, { ...this.color, l: this.color.l - 10 }, stemWidth * 0.6, 0.15);

            if (this.leaves[i]) {
                for (let leaf of this.leaves[i]) {
                    if (!leaf.drawn) {
                        this.drawLeaf(brush, curr.x, curr.y, leaf);
                        leaf.drawn = true;
                    }
                }
            }
        }
    }

    drawLeaf(brush, x, y, leaf) {
        const tipX = x + leaf.cos * leaf.length;
        const tipY = y + leaf.sin * leaf.length;
        const midX = x + leaf.cos * (leaf.length * 0.5);
        const midY = y + leaf.sin * (leaf.length * 0.5);
        const c = leaf.color;

        if (leaf.type === 'grass') {
            brush.stroke(x, y, tipX, tipY, c, leaf.width, 0.3);
        } else if (leaf.type === 'broad') {
            brush.blob(midX, midY, leaf.width, c, 0.2, leaf.angle, 1.8);
            brush.stroke(x, y, tipX, tipY, { ...c, l: c.l - 15 }, leaf.width * 0.2, 0.2);
        } else if (leaf.type === 'heart') {
            // Heart shape approx with two overlapping blobs
            const offset = leaf.width * 0.3;
            brush.blob(midX + Math.cos(leaf.angle + 0.5) * offset, midY + Math.sin(leaf.angle + 0.5) * offset, leaf.width * 0.6, c, 0.2, leaf.angle, 1.5);
            brush.blob(midX + Math.cos(leaf.angle - 0.5) * offset, midY + Math.sin(leaf.angle - 0.5) * offset, leaf.width * 0.6, c, 0.2, leaf.angle, 1.5);
            brush.stroke(x, y, tipX, tipY, { ...c, l: c.l - 10 }, 1, 0.1);
        } else {
            brush.blob(midX, midY, leaf.width * 2, c, 0.15, leaf.angle, 2.5);
            brush.stroke(x, y, tipX, tipY, { ...c, l: c.l - 15 }, leaf.width * 0.3, 0.2);
        }
    }
}

export class Flower {
    constructor(x, y, scale, species = 'wildflower') {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.species = species;
        this.age = 0;
        this.maxAge = (species === 'sunflower' ? 150 : 100) + Math.random() * 50;

        this.petals = [];
        this.centers = [];

        if (species === 'sunflower') {
            this.generateSunflower();
        } else {
            this.type = Math.floor(Math.random() * 5);
            const colorIdx = Math.floor(Math.random() * PALETTE.flowers.length);
            this.mainColor = PALETTE.flowers[colorIdx];
            this.secColor = PALETTE.flowers[(colorIdx + 1) % PALETTE.flowers.length];
            this.generateWildflower();
        }
    }

    generateSunflower() {
        const count = 30 + Math.floor(Math.random() * 20);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            this.petals.push({
                angle: angle,
                dist: (15 + Math.random() * 10) * this.scale,
                radius: (8 + Math.random() * 4) * this.scale,
                stretch: 3.5,
                cos: Math.cos(angle),
                sin: Math.sin(angle),
                color: Math.random() > 0.5 ? PALETTE.sunflower.petals : PALETTE.sunflower.secondary
            });
        }
        // Large center
        const centerDensity = 40;
        for (let i = 0; i < centerDensity; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = Math.random() * 12 * this.scale;
            this.centers.push({
                x: Math.cos(a) * d,
                y: Math.sin(a) * d,
                r: (2 + Math.random() * 2) * this.scale
            });
        }
    }

    generateWildflower() {
        const count = this.type === 0 ? 4 : (this.type === 1 ? 12 : (this.type === 2 ? 8 : (this.type === 3 ? 20 : 6)));
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            let dist = 10 * this.scale;
            let radius = 10 * this.scale;
            let stretch = 1.5;

            if (this.type === 0) { dist = 8 * this.scale; radius = 15 * this.scale; stretch = 1.2; }
            else if (this.type === 1) { dist = 12 * this.scale; radius = 4 * this.scale; stretch = 2.5; }
            else if (this.type === 3) { dist = 5 * this.scale; radius = 8 * this.scale; stretch = 3.0; }

            this.petals.push({
                angle: angle,
                dist: dist + Math.random() * 5 * this.scale,
                radius: radius + Math.random() * 3 * this.scale,
                stretch: stretch,
                cos: Math.cos(angle),
                sin: Math.sin(angle),
                color: Math.random() > 0.8 ? this.secColor : this.mainColor
            });
        }

        const centerCount = this.type === 3 ? 15 : 5;
        for (let i = 0; i < centerCount; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = Math.random() * 3 * this.scale;
            this.centers.push({
                x: Math.cos(a) * d,
                y: Math.sin(a) * d,
                r: (1.5 + Math.random()) * this.scale
            });
        }
    }

    draw(brush) {
        if (this.age > this.maxAge) return;
        this.age++;

        const growth = Math.min(1, this.age / 60);
        const bloom = 0.2 + growth * 0.8;
        const sway = Math.sin(Date.now() * 0.001 + this.x) * 2 * this.scale;
        const fx = this.x + sway;
        const fy = this.y;

        for (let p of this.petals) {
            if (Math.random() > 0.6) continue;
            const dist = p.dist * bloom;
            const radius = p.radius * bloom;
            const px = fx + p.cos * dist;
            const py = fy + p.sin * dist;

            brush.blob(px, py, radius, p.color, (this.species === 'sunflower' ? 0.1 : 0.06), p.angle, p.stretch);
        }

        if (growth > 0.6) {
            const centerCol = (this.species === 'sunflower') ? PALETTE.sunflower.center : PALETTE.centers;
            for (let c of this.centers) {
                if (Math.random() > 0.3) {
                    brush.blob(fx + c.x * bloom, fy + c.y * bloom, c.r, centerCol, 0.1, 0, 1);
                }
            }
        }
    }
}

export class Butterfly {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.angle = Math.random() * Math.PI * 2;

        const palette = PALETTE.butterflies[Math.floor(Math.random() * PALETTE.butterflies.length)];
        this.mainColor = palette.main;
        this.secColor = palette.sec;

        this.scale = 0.5 + Math.random() * 0.5;
        this.flap = 0;
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        // Wander steering
        this.angle += (Math.random() - 0.5) * 0.2;
        const speed = 1.2 + Math.sin(Date.now() * 0.001 + this.phase) * 0.8;
        this.vx = Math.cos(this.angle) * speed;
        this.vy = Math.sin(this.angle) * speed;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around with margin
        const margin = 50;
        if (this.x < -margin) this.x = this.width + margin;
        if (this.x > this.width + margin) this.x = -margin;
        if (this.y < -margin) this.y = this.height + margin;
        if (this.y > this.height + margin) this.y = -margin;

        this.flap = Math.sin(Date.now() * 0.02 + this.phase);
        return false; // Still active
    }

    draw(brush) {
        const wingSize = 12 * this.scale;
        const flapPhase = (Date.now() * 0.01 + this.phase) % (Math.PI * 2);

        // Draw wings
        // Right side
        brush.butterflyWing(this.x, this.y, wingSize, this.angle, 'right', 'top', this.mainColor, 0.6, flapPhase);
        brush.butterflyWing(this.x, this.y, wingSize * 0.7, this.angle, 'right', 'bottom', this.secColor, 0.5, flapPhase);

        // Left side
        brush.butterflyWing(this.x, this.y, wingSize, this.angle, 'left', 'top', this.mainColor, 0.6, flapPhase);
        brush.butterflyWing(this.x, this.y, wingSize * 0.7, this.angle, 'left', 'bottom', this.secColor, 0.5, flapPhase);

        // Body (head + thorax + abdomen)
        const bodyCol = { h: 0, s: 0, l: 15 };
        // Thorax
        brush.blob(this.x, this.y, 2 * this.scale, bodyCol, 0.3, this.angle, 1.2);
        // Head
        const hx = this.x + Math.cos(this.angle) * 3 * this.scale;
        const hy = this.y + Math.sin(this.angle) * 3 * this.scale;
        brush.blob(hx, hy, 1.5 * this.scale, bodyCol, 0.3, this.angle, 1);
        // Abdomen
        const ax = this.x - Math.cos(this.angle) * 4 * this.scale;
        const ay = this.y - Math.sin(this.angle) * 4 * this.scale;
        brush.blob(ax, ay, 1.8 * this.scale, bodyCol, 0.3, this.angle, 2.5);
    }
}
