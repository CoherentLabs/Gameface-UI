/**
 * Determines which side of the viewport a given DOMRect overflows.
 * Returns the opposite side as a suggested position for repositioning (e.g., if it overflows top, returns 'bottom').
 *
 * @param rect - The bounding rectangle of the element to check.
 * @returns The suggested position ('top' | 'right' | 'bottom' | 'left') if overflow is detected, otherwise undefined.
 */
export function getSafePosition(rect: DOMRect) {
    const overflows = {
        top: rect.top < 0,
        left: rect.left < 0,
        bottom: rect.bottom > (window.innerHeight || document.documentElement.clientHeight),
        right: rect.right > (window.innerWidth || document.documentElement.clientWidth)
    };

    if (overflows.top && !overflows.bottom) return 'bottom';
    if (overflows.bottom && !overflows.top) return 'top';
    if (overflows.left && !overflows.right) return 'right';
    if (overflows.right && !overflows.left) return 'left';
}