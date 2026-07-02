// PreviewIsland.tsx — the Solid island that does the runtime work

import { onMount, JSX } from 'solid-js';
import { applyCohFontFitPolyfill } from './cohFontFitPolyfill';

// Environment CSS, imported as compiled strings at build time.
// ?inline runs the file through Vite's PostCSS/SCSS pipeline and returns CSS text.
import resetCSS from './reset.scss?inline';
import resetBrowserCSS from './reset-browser.scss?inline';

interface PreviewIslandProps {
    // The demo JSX, deferred via a thunk so it's created inside the Portal context.
    children: JSX.Element;
    // One or more component CSS strings (from `@components/.../X.module.scss?inline`).
    css?: string | string[];
    code?: string; // for future use: show source code alongside the demo
    // Optional fixed height; otherwise auto-fit via ResizeObserver.
    height?: number;
    hash?: string; // the demo hash to load the correct module from the plugin
}

async function resolveDemoUrl(hash: string): Promise<{ js: string; css: string }> {
    if (import.meta.env.DEV) {
        return { js: `/@gfui-demo/${hash}.tsx`, css: '' }; // dev: CSS auto-injected by Vite
    }
    const manifest = await (await fetch('/gfui-demo-manifest.json')).json();
    const e = manifest[hash];
    return {
        js: e.js.startsWith('/') ? e.js : '/' + e.js,
        css: e.css ?? '',
    };
}

export default function PreviewIsland(props: PreviewIslandProps) {
    let iframeRef!: HTMLIFrameElement;

    const componentCode = () => props.code ?? '';

    const setupIframe = async () => {
        const doc = iframeRef.contentDocument;
        if (!doc) return;

        // 1. Inject environment resets into the iframe head (under component styles).
        const resetStyle = doc.createElement('style');
        resetStyle.textContent = resetCSS + '\n' + resetBrowserCSS;
        doc.head.appendChild(resetStyle);

        // 2. (Optional) run JS polyfills against the IFRAME window.
        //    Note: with the Portal approach the demo's JS actually runs in the
        //    PARENT runtime, so these only affect code that runs inside the iframe.
        //    Kept here for the cases where it does matter; safe to no-op otherwise.
        applyPolyfills(iframeRef.contentWindow as Window & typeof globalThis);

        const { js, css } = await resolveDemoUrl(props.hash);

        if (css) {
            const style = doc.createElement('style');
            style.textContent = css;
            doc.head.appendChild(style);
        }

        // Author-provided CSS (demo-specific styling not covered by any component's own module.scss).
        if (props.css) {
            const customCss = Array.isArray(props.css) ? props.css.join('\n') : props.css;
            const customStyle = doc.createElement('style');
            customStyle.textContent = customCss;
            doc.head.appendChild(customStyle);
        }

        const absolute = new URL(js, window.location.origin).href;
        const win = iframeRef.contentWindow as any;
        const mod = await win.eval(`import("${absolute}")`);
        mod.default(doc.body);
        applyCohFontFitPolyfill(doc, iframeRef.contentWindow as Window & typeof globalThis);
    };

    onMount(() => {
        const doc = iframeRef.contentDocument;

        if (doc?.body) {
            // srcdoc already parsed, body exists — set up now
            setupIframe();
        } else {
            // not ready yet — wait for load
            iframeRef.addEventListener('load', setupIframe, { once: true });
        }
    });

    return (
        <iframe
            ref={iframeRef}
            title="Gameface preview"
            srcdoc="<!DOCTYPE html><html><head><meta name='viewport' content='width=1920, initial-scale=1.0, shrink-to-fit=no'></head><body></body></html>"
            style={{
                width: '100%',
                height: `100%`,
                border: 'none',
                display: 'block',
                'margin-top': '0',
                'min-height': '400px',
            }}
        ></iframe>
    );
}

// Stub — adapt from your polyfills.ts, but operate on the passed window.
function applyPolyfills(win: Window & typeof globalThis) {
    /**
     * Decide whether an element should become an implicit flex-column container.
     * Skips:
     *   - elements with the [cohinline] attribute (rendered inline by CSS)
     *   - elements already computed as display:flex (author wrote display:flex)
     *   - elements with display:none (hidden; Gameface also leaves these alone)
     *
     * @param {Element} el
     */
    function convertElement(el) {
        if (el.hasAttribute('cohinline')) {
            return;
        }

        var computed = window.getComputedStyle(el).display;

        if (computed === 'flex' || computed === 'none') {
            return;
        }

        el.classList.add('gf-block');
    }

    /**
     * Run convertElement on `root` and every descendant element.
     *
     * @param {Element} root
     */
    function processSubtree(root) {
        convertElement(root);

        var descendants = root.querySelectorAll('*');
        for (var i = 0; i < descendants.length; i++) {
            convertElement(descendants[i]);
        }
    }

    /**
     * Initial pass — run once the full DOM is available.
     */
    function initialPass() {
        processSubtree(document.body);
    }

    /**
     * MutationObserver — re-runs the conversion on any element added to the DOM
     * at runtime (dynamically rendered components, engine data-bind updates, etc.)
     */
    var observer = new MutationObserver(function (mutations) {
        for (var m = 0; m < mutations.length; m++) {
            var added = mutations[m].addedNodes;
            for (var n = 0; n < added.length; n++) {
                var node = added[n];
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processSubtree(node);
                }
            }
        }
    });

    /**
     * Bootstrap.
     */
    function init() {
        initialPass();

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already parsed (script deferred or placed at end of body)
        init();
    }
}
