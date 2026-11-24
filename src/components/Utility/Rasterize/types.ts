/**
 * The attribute contract of vite-gameface-rasterize, v1.
 *
 * These names are the whole interface between authoring code and the build plugin. Nothing here
 * imports the plugin, and nothing here needs it to be installed: without it the attributes are
 * inert and the CSS renders live, which is exactly the intended fallback.
 */

export type RasterizeMode = 'auto' | 'slice' | 'flat' | 'element';

/** Pseudo-class variants the plugin can bake, plus `class:<name>` for app-driven ones. */
export type RasterizeState = 'hover' | 'active' | 'focus' | 'disabled' | (string & {});

export interface RasterizeConfig {
    /**
     * `flat` captures the decoration at the element's own size and needs a fixed size.
     * `slice` captures at a canonical size and emits a 9-slice, for anything sized at runtime.
     * `element` flattens the whole subtree into one image, keeping dynamic and interactable
     * descendants live. `auto` (the default) picks flat for fixed-size elements, slice otherwise.
     */
    mode?: RasterizeMode;
    /** Extra variants to bake, e.g. `['hover', 'active']` or `['class:selected']`. */
    states?: RasterizeState[];
    /** A stable asset name. Without one, the plugin derives an id from the decoration itself. */
    id?: string;
    /** Per-element override of the build's bake scale. */
    scale?: number;
}

export const RASTERIZE_ATTRIBUTES = {
    mark: 'data-rasterize',
    mode: 'data-rasterize-mode',
    states: 'data-rasterize-states',
    id: 'data-rasterize-id',
    scale: 'data-rasterize-scale',
    live: 'data-rasterize-live',
} as const;

/** Writes a config onto an element as the attributes the build plugin looks for. */
export function applyRasterizeAttributes(element: Element, config: RasterizeConfig): void {
    element.setAttribute(RASTERIZE_ATTRIBUTES.mark, '');

    if (config.mode && config.mode !== 'auto') element.setAttribute(RASTERIZE_ATTRIBUTES.mode, config.mode);
    else element.removeAttribute(RASTERIZE_ATTRIBUTES.mode);

    if (config.states?.length) element.setAttribute(RASTERIZE_ATTRIBUTES.states, config.states.join(','));
    else element.removeAttribute(RASTERIZE_ATTRIBUTES.states);

    if (config.id) element.setAttribute(RASTERIZE_ATTRIBUTES.id, config.id);
    else element.removeAttribute(RASTERIZE_ATTRIBUTES.id);

    if (config.scale) element.setAttribute(RASTERIZE_ATTRIBUTES.scale, String(config.scale));
    else element.removeAttribute(RASTERIZE_ATTRIBUTES.scale);
}
