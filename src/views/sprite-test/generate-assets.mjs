/**
 * Regenerates the sprite-test asset set. See README.md.
 *
 *   npm i --no-save sharp
 *   node src/views/sprite-test/generate-assets.mjs
 *
 * Produces, under src/assets/sprite-test/:
 *   tiles/i0000.png … i0999.png   1000 distinct 64x64 PNGs
 *   svg/i0000.svg   … i0999.svg   the same 1000 as SVGs, ~220 shapes each
 *   atlas.png                     2048x2048, 32x32 grid of the PNG tiles
 *
 * Every tile is genuinely distinct — unique hue plus an index-derived pattern —
 * so nothing can dedupe to a single shared texture and quietly invalidate a run.
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.resolve(HERE, '../../assets/sprite-test');
const TILES = path.join(BASE, 'tiles');
const SVGS = path.join(BASE, 'svg');

const N = 1000;
const SIZE = 64;
const COLS = 32;          // 1000 tiles -> 32x32 grid -> 2048x2048 atlas
const SHAPES = 220;       // ≈ a real detailed flag, ~19 KB per file

// Deterministic PRNG so the set is reproducible run to run.
const rng = (seed) => {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
};

/** Simple tile: flat background plus one glyph. Cheap to rasterise. */
const simpleSvg = (i) => {
    const hue = (i * 137.508) % 360;                    // golden angle, maximal spread
    const bg = `hsl(${hue.toFixed(1)}, 65%, 45%)`;
    const fg = `hsl(${((hue + 180) % 360).toFixed(1)}, 80%, 88%)`;
    const r = 6 + (i % 7) * 3;
    const x = 10 + (i % 5) * 9;
    const y = 10 + ((i >> 3) % 5) * 9;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
        <rect width="${SIZE}" height="${SIZE}" rx="8" fill="${bg}"/>
        <circle cx="${x + 12}" cy="${y + 12}" r="${r}" fill="${fg}"/>
        <rect x="${(i % 11) * 4}" y="${SIZE - 14}" width="${12 + (i % 9) * 3}" height="6" fill="${fg}"/>
        <text x="4" y="${SIZE - 20}" font-family="monospace" font-size="11" fill="${fg}">${i}</text>
    </svg>`;
};

/** Complex tile: enough geometry that rasterising it is actually work. */
const complexSvg = (i) => {
    const r = rng(i + 1);
    const hue = (i * 137.508) % 360;
    let body = `<rect width="${SIZE}" height="${SIZE}" rx="8" fill="hsl(${hue.toFixed(1)},65%,45%)"/>`;
    for (let k = 0; k < SHAPES; k++) {
        const h = ((hue + k * 7) % 360).toFixed(1);
        const x = (r() * SIZE).toFixed(2);
        const y = (r() * SIZE).toFixed(2);
        const l = (35 + r() * 45).toFixed(0);
        const o = (0.3 + r() * 0.6).toFixed(2);
        if (k % 3 === 0) {
            body += `<circle cx="${x}" cy="${y}" r="${(r() * 6 + 1).toFixed(2)}" fill="hsl(${h},70%,${l}%)" opacity="${o}"/>`;
        } else if (k % 3 === 1) {
            body += `<path d="M${x} ${y} L${(r() * SIZE).toFixed(2)} ${(r() * SIZE).toFixed(2)} L${(r() * SIZE).toFixed(2)} ${(r() * SIZE).toFixed(2)} Z" fill="hsl(${h},70%,${l}%)" opacity="${o}"/>`;
        } else {
            body += `<ellipse cx="${x}" cy="${y}" rx="${(r() * 5 + 1).toFixed(2)}" ry="${(r() * 5 + 1).toFixed(2)}" fill="hsl(${h},60%,${l}%)" opacity="${o}"/>`;
        }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${body}</svg>`;
};

fs.mkdirSync(TILES, { recursive: true });
fs.mkdirSync(SVGS, { recursive: true });

const composite = [];
let pngBytes = 0;
let svgBytes = 0;

for (let i = 0; i < N; i++) {
    const name = `i${String(i).padStart(4, '0')}`;

    const svg = complexSvg(i);
    fs.writeFileSync(path.join(SVGS, `${name}.svg`), svg);
    svgBytes += Buffer.byteLength(svg);

    // PNGs come from the simple variant: they only need to be visually distinct,
    // and rasterisation cost is irrelevant once they are bitmaps.
    const buf = await sharp(Buffer.from(simpleSvg(i))).png({ compressionLevel: 9 }).toBuffer();
    fs.writeFileSync(path.join(TILES, `${name}.png`), buf);
    pngBytes += buf.length;

    composite.push({ input: buf, left: (i % COLS) * SIZE, top: Math.floor(i / COLS) * SIZE });
}

const rows = Math.ceil(N / COLS);
await sharp({
    create: { width: COLS * SIZE, height: rows * SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
    .composite(composite)
    .png({ compressionLevel: 9 })
    .toFile(path.join(BASE, 'atlas.png'));

const atlasBytes = fs.statSync(path.join(BASE, 'atlas.png')).size;
const kb = (n) => (n / 1024).toFixed(1);

console.log(`${N} tiles @ ${SIZE}x${SIZE}`);
console.log(`  png   ${kb(pngBytes)} KB across ${N} files`);
console.log(`  svg   ${kb(svgBytes)} KB across ${N} files (${SHAPES} shapes each)`);
console.log(`  atlas ${kb(atlasBytes)} KB, ${COLS * SIZE}x${rows * SIZE}, grid ${COLS}x${rows}`);
