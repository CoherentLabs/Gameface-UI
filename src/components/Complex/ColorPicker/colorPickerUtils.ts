import { ColorData } from "./ColorPicker";
import hexTransperancies from "./hexTransperancies";

/**
 * Converts an HSVA (Hue, Saturation, Value, Alpha) color representation into RGBA and HEX formats.
 *
 * @param hsva - An object representing the HSVA color data.
 *   - `h` (number): Hue component, ranging from 0 to 360.
 *   - `s` (number): Saturation component, ranging from 0 to 100.
 *   - `v` (number): Value (brightness) component, ranging from 0 to 100.
 *   - `a` (number): Alpha (opacity) component, ranging from 0 to 1.
 *
 * @returns An object containing:
 *   - `rgba` (string): The RGBA color representation in the format `rgba(r, g, b, a)`.
 *   - `hex` (string): The HEX color representation in the format `#RRGGBBAA`.
 *
 * @example
 * const hsvaColor = { h: 200, s: 50, v: 75, a: 0.5 };
 * const result = parseHSVAColor(hsvaColor);
 * console.log(result.rgba); // "rgba(96, 144, 191, 0.50)"
 * console.log(result.hex);  // "#6090BFFF"
 */
export function parseHSVAColor(hsva: ColorData) {
    const saturation = hsva.s / 100;
    const value = hsva.v / 100;
    let chroma = saturation * value;
    let hueBy60 = hsva.h / 60;
    let x = chroma * (1 - Math.abs(hueBy60 % 2 - 1));
    let m = value - chroma;

    chroma = (chroma + m);
    x = (x + m);

    const index = Math.floor(hueBy60) % 6;
    const red = [chroma, x, m, m, x, chroma][index];
    const green = [x, chroma, chroma, x, m, m][index];
    const blue = [m, m, x, chroma, chroma, x][index];

    return {
        rgba: `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${hsva.a < 1 && hsva.a > 0 ? hsva.a.toFixed(2) : hsva.a})`,
        hex: (
            '#' +
            Math.round(red * 255).toString(16).padStart(2, '0') +
            Math.round(green * 255).toString(16).padStart(2, '0') +
            Math.round(blue * 255).toString(16).padStart(2, '0') +
            hexTransperancies[Math.round(hsva.a * 100) as keyof typeof hexTransperancies]
        ).toUpperCase(),
    };
}

/**
 * Converts an RGBA color string to an HSVA color representation.
 *
 * @param rgba - The RGBA color string in the format `rgba(r, g, b, a)` or `rgb(r, g, b)`.
 *               `r`, `g`, and `b` are integers between 0 and 255, and `a` is a float between 0 and 1.
 * @returns An object representing the HSVA color, containing:
 *          - `h`: Hue, an integer between 0 and 360.
 *          - `s`: Saturation, an integer between 0 and 100.
 *          - `v`: Value, an integer between 0 and 100.
 *          - `a`: Alpha, a float between 0 and 1.
 * @throws Will throw an error if the input string is not in a valid RGBA format.
 */
function RGBAToHSVA(rgba: string): ColorData {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) {
        throw new Error("Invalid RGBA color format");
    }
    const r = parseInt(match[1], 10) / 255;
    const g = parseInt(match[2], 10) / 255;
    const b = parseInt(match[3], 10) / 255;
    const a = match[4] ? parseFloat(match[4]) : 1;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        } else if (max === g) {
            h = ((b - r) / delta + 2) * 60;
        } else {
            h = ((r - g) / delta + 4) * 60;
        }
    }
    const s = max === 0 ? 0 : (delta / max) * 100;
    const v = max * 100;
    return {
        h: Math.round(h),
        s: Math.round(s),
        v: Math.round(v),
        a: parseFloat(a.toFixed(2)),
    };
}

/**
 * Parses an initial color value and converts it into a `ColorData` object.
 * 
 * This function supports two color formats:
 * - HEX: A string starting with `#`, followed by 6 or 8 hexadecimal characters.
 *   - Example: `#RRGGBB` or `#RRGGBBAA`
 *   - Converts the HEX color into RGBA format and then into HSVA format.
 * - RGBA/RGB: A string starting with `rgba` or `rgb`.
 *   - Example: `rgba(255, 0, 0, 1)` or `rgb(255, 0, 0)`
 *   - Directly converts the RGBA/RGB color into HSVA format.
 * 
 * @param color - The input color string in HEX or RGBA/RGB format.
 * @returns A `ColorData` object representing the color in HSVA format.
 * @throws An error if the input color format is invalid.
 */
export function parseInitialValue(color: string): ColorData {
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        if (hex.length === 6 || hex.length === 8) {
            const r = parseInt(hex.slice(0, 2), 16) / 255;
            const g = parseInt(hex.slice(2, 4), 16) / 255;
            const b = parseInt(hex.slice(4, 6), 16) / 255;
            const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
            return RGBAToHSVA(`rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`);
        }
    }
    if (color.startsWith("rgba") || color.startsWith("rgb")) {
        return RGBAToHSVA(color);
    }
    throw new Error("Invalid color format. Please provide a valid HEX or RGBA color.");
}
