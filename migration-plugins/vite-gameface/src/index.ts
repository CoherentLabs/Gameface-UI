import type { Plugin } from 'vite';

export interface GamefacePluginOptions { }

/**
 * Makes `Node.prototype.insertBefore(node, undefined)` behave like `insertBefore(node, null)` (append).
 *
 * Solid 2's DOM runtime appends children with `parent.insertBefore(node, marker)`, where `marker` can be
 * `undefined`. Browsers treat `undefined` as `null`, but Gameface throws "Arguments[1] expect type : Node".
 *
 * The `Symbol.for` guard makes the patch idempotent, so it can coexist with other copies of it
 * (e.g. the temporary one in Gameface UI's `gameface-dom.ts`).
 *
 * Plain JavaScript in a string: it is inlined into the page as is, without going through the bundler.
 */
const INSERT_BEFORE_POLYFILL = `(function () {
    if (typeof Node === 'undefined') return;
    var PATCHED = Symbol.for('gameface-ui.insertBeforePatched');
    var native = Node.prototype.insertBefore;
    if (native[PATCHED]) return;
    var insertBefore = function (node, child) {
        return native.call(this, node, child === undefined ? null : child);
    };
    insertBefore[PATCHED] = true;
    Node.prototype.insertBefore = insertBefore;
})();`;

/**
 * Gameface runtime fixes for Solid 2 apps.
 *
 * Injects the fixes as an inline classic `<script>` at the top of `<head>`, so they run before any
 * module script (module scripts are deferred). Applies to every HTML page Vite processes, in dev and in build.
 */
export default function solidGameface(_options: GamefacePluginOptions = {}): Plugin {
    return {
        name: 'gameface',
        transformIndexHtml: {
            order: 'pre',
            handler() {
                return [
                    {
                        tag: 'script',
                        children: INSERT_BEFORE_POLYFILL,
                        injectTo: 'head-prepend',
                    },
                ];
            },
        },
    };
}
