// These methods are used to make stop propagation events work in solid JS when used in Gameface.
// This is because solid JS uses event delegation and they rely on cancelBubble to stop propagation.
// However Gameface currently doesn't set the cancelBubble property when stopPropagation is called, so we need to do it manually here.

// Remove when Gameface sets cancelBubble when stopPropagation is called.
export const stopImmediatePropagation = (e: Event) => {
    e.stopImmediatePropagation();
    e.cancelBubble = true;
}

export const stopPropagation = (e: Event) => {
    e.stopPropagation();
    e.cancelBubble = true;
}