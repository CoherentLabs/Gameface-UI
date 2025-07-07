export function waitForFrames(callback: () => void, frames: number = 3) {
    if (frames === 0) return callback();
    frames--;
    requestAnimationFrame(() => waitForFrames(callback, frames));
}