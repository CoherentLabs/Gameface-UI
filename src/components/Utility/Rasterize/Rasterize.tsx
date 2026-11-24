import { children, createEffect, type JSX, type ParentComponent } from 'solid-js';
import { applyRasterizeAttributes, RASTERIZE_ATTRIBUTES, type RasterizeConfig } from './types';

interface RasterizeProps extends RasterizeConfig {
    children?: JSX.Element;
}

/**
 * Marks its children for decoration baking by vite-gameface-rasterize.
 *
 * It renders no element of its own. The children are resolved and the attributes are written
 * onto them directly, because a wrapper would be a real box for cohtml to lay out and paint -
 * and adding layout work to a tool whose purpose is removing render work would be an odd trade.
 *
 * With the build plugin absent this is a passthrough: the attributes sit unread in the DOM and
 * the CSS renders live, which is also exactly what happens during `vite dev`.
 *
 * @example
 * <Rasterize mode="slice" states={['hover']}>
 *     <div class="panel">…</div>
 * </Rasterize>
 */
const Rasterize: ParentComponent<RasterizeProps> = (props) => {
    const resolved = children(() => props.children);

    createEffect(() => {
        for (const node of resolved.toArray()) {
            if (node instanceof Element) {
                applyRasterizeAttributes(node, {
                    mode: props.mode,
                    states: props.states,
                    id: props.id,
                    scale: props.scale,
                });
            }
        }
    });

    return <>{resolved()}</>;
};

interface RasterizeLiveProps {
    children?: JSX.Element;
}

/**
 * Keeps its children as live DOM inside an element-mode bake.
 *
 * Bindings, animations and interactable elements are detected and preserved automatically, so
 * this is for declaring intent about something the detector cannot see - and it silences the
 * "these were excluded" warning for that node, because at that point you have said it on purpose.
 */
export const RasterizeLive: ParentComponent<RasterizeLiveProps> = (props) => {
    const resolved = children(() => props.children);

    createEffect(() => {
        for (const node of resolved.toArray()) {
            if (node instanceof Element) node.setAttribute(RASTERIZE_ATTRIBUTES.live, '');
        }
    });

    return <>{resolved()}</>;
};

export default Rasterize;
