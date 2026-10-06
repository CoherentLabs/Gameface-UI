
export default function hasEngine(): boolean {
    return typeof window.engine !== 'undefined' && typeof window.engine.on === 'function';
}