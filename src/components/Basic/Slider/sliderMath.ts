import { clamp } from "@components/utils/clamp";

const calculatePercent = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
}

// rounds to the nearest step, trims float noise, then clamps to range
const snapToStepAndNormalize = (value: number, step: number, min: number, max: number) => {
    const snapped = Math.round(value / step) * step;
    return clamp(Number(snapped.toFixed(5)), min, max);
}

export type TrackGeometry = { start: number; trackStart: number; pixelRange: number };

const getTrackGeometry = (track: HTMLElement, clientX: number): TrackGeometry => {
    const { left, width } = track.getBoundingClientRect();
    return { start: clientX, trackStart: left, pixelRange: width };
}

export { calculatePercent, snapToStepAndNormalize, getTrackGeometry };
