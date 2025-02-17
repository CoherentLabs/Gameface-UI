export function clamp(newValue: number, minValue: number, maxValue: number) {
    return Math.min(Math.max(newValue, minValue), maxValue)
}