import { createEffect, type Accessor } from 'solid-js';
import { applyRasterizeAttributes, RASTERIZE_ATTRIBUTES, type RasterizeConfig } from './types';

/**
 * `use:rasterize` - the same marker as the <Rasterize> component, applied to the element it sits
 * on. Prefer this form when you already have the element in hand; there is nothing between the
 * directive and the DOM node.
 *
 * @example
 * <div use:rasterize={{ mode: 'slice', states: ['hover'] }} class="panel">…</div>
 * <div use:rasterize class="panel">…</div>
 */
export function rasterize(element: Element, accessor: Accessor<RasterizeConfig | boolean | undefined>): void {
    createEffect(() => {
        const value = accessor();
        applyRasterizeAttributes(element, typeof value === 'object' && value !== null ? value : {});
    });
}

/**
 * `use:rasterizeLive` - keeps this element as live DOM inside an element-mode bake, and states
 * that it was on purpose so the exclusion is not reported as something to look at.
 */
export function rasterizeLive(element: Element): void {
    element.setAttribute(RASTERIZE_ATTRIBUTES.live, '');
}
