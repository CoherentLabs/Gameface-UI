import { clamp } from "@components/utils/clamp";

export type Stick = { x: number; y: number; mag: number; angleDeg: number };
/** Converts mouse event coordinates to normalized stick coordinates and angle/magnitude */
export function mouseToStick(e: MouseEvent, rect: DOMRect): Stick {
    // center of wheel
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // mouse delta to center
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // normalize to [-1, 1] based on radius
    const R = Math.min(rect.width, rect.height) / 2;
    const nx = clamp(dx / R, -1, 1);
    const ny = clamp(dy / R, -1, 1);

    return stickToPolar(nx, ny);
}

/** Converts angle to slice index */
export function angleToSlice(angleDeg: number, sliceInDeg: number) {
    // add half a slice to make the slices centered on their angle, then modulo to [0, 360)
    return Math.floor(((angleDeg + (sliceInDeg / 2)) % 360) / sliceInDeg);
}

/** Converts a normalized stick ([-1,1] both axes) to correct angle and magnitude. */
export function stickToPolar(x: number, y: number): Stick {
    const rad = Math.atan2(x, -y); // swap, flip Y → 0° is up, clockwise positive
    const angleDeg = (rad * 180 / Math.PI + 360) % 360; // normalize to [0, 360)
    const mag = Math.min(1, Math.hypot(x, y)); // magnitude 0..1 (for deadzone)
    return { x, y, mag, angleDeg };
}