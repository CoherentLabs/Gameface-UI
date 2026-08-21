/**
 * Measures the length of a path we generated ourselves.
 *
 * Gameface implements neither `getTotalLength()` nor `getPointAtLength()` on
 * SVG paths (verified on 3.2.0.2), so the draw-on reveal has no engine support
 * to lean on. Since the chart emits its own geometry, the length can be derived
 * from the command list instead of measured off the DOM.
 *
 * Straight segments are exact. Curves are sampled: a cubic's arc length has no
 * closed form, but chord summation converges quickly, and 16 samples per
 * segment is already well under a pixel over a chart-sized curve.
 */

const CUBIC_SAMPLES = 16;

const cubicLength = (
    x0: number, y0: number,
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
) => {
    let length = 0;
    let px = x0;
    let py = y0;

    for (let i = 1; i <= CUBIC_SAMPLES; i++) {
        const t = i / CUBIC_SAMPLES;
        const mt = 1 - t;
        const a = mt * mt * mt;
        const b = 3 * mt * mt * t;
        const c = 3 * mt * t * t;
        const d = t * t * t;

        const x = a * x0 + b * x1 + c * x2 + d * x3;
        const y = a * y0 + b * y1 + c * y2 + d * y3;

        length += Math.hypot(x - px, y - py);
        px = x;
        py = y;
    }

    return length;
};

const COMMANDS = /([MLCZmlcz])([^MLCZmlcz]*)/g;
const NUMBERS = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;

/**
 * Total length of an `M`/`L`/`C`/`Z` path in user units.
 *
 * Only the commands d3-shape emits for our generators are handled; anything
 * else is skipped rather than guessed at.
 */
export const measurePathLength = (d: string): number => {
    if (!d) return 0;

    let length = 0;
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;

    COMMANDS.lastIndex = 0;
    let command: RegExpExecArray | null;

    while ((command = COMMANDS.exec(d)) !== null) {
        const type = command[1].toUpperCase();
        const numbers = (command[2].match(NUMBERS) ?? []).map(Number);

        if (type === 'M') {
            // A path may restart — a line with gaps does exactly that — and the
            // jump between subpaths is not drawn, so it must not be counted.
            for (let i = 0; i + 1 < numbers.length; i += 2) {
                x = numbers[i];
                y = numbers[i + 1];
                if (i === 0) {
                    startX = x;
                    startY = y;
                }
            }
        } else if (type === 'L') {
            for (let i = 0; i + 1 < numbers.length; i += 2) {
                length += Math.hypot(numbers[i] - x, numbers[i + 1] - y);
                x = numbers[i];
                y = numbers[i + 1];
            }
        } else if (type === 'C') {
            for (let i = 0; i + 5 < numbers.length; i += 6) {
                length += cubicLength(
                    x, y,
                    numbers[i], numbers[i + 1],
                    numbers[i + 2], numbers[i + 3],
                    numbers[i + 4], numbers[i + 5],
                );
                x = numbers[i + 4];
                y = numbers[i + 5];
            }
        } else if (type === 'Z') {
            length += Math.hypot(startX - x, startY - y);
            x = startX;
            y = startY;
        }
    }

    return length;
};
