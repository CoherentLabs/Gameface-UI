export function clamp(newValue: number, minValue: number, maxValue: number) {
    console.log('test')
    return Math.min(Math.max(newValue, minValue), maxValue)
}