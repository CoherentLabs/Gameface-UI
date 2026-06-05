// PreviewIsland.tsx — the Solid island that does the runtime work

import { onMount, JSX } from 'solid-js';

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
        console.log('setupIframe fired, doc =', doc);
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

        console.log('props.hash =', props.hash);

        const { js, css } = await resolveDemoUrl(props.hash);

        if (css) {
            const style = doc.createElement('style');
            style.textContent = css;
            doc.head.appendChild(style);
        }

        const absolute = new URL(js, window.location.origin).href;
        const win = iframeRef.contentWindow as any;
        const mod = await win.eval(`import("${absolute}")`);
        mod.default(doc.body);

        console.log('ready set, body =', doc.body);
    };

    onMount(() => {
        console.log('onMount ran');
        const doc = iframeRef.contentDocument;
        console.log('doc at onMount:', doc, 'body:', doc?.body);

        console.log('code at onMount:', componentCode());

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
            srcdoc="<!DOCTYPE html><html><head></head><body></body></html>"
            style={{
                width: '100%',
                height: `300px`,
                border: 'none',
                display: 'block',
            }}
        ></iframe>
    );
}

// Stub — adapt from your polyfills.ts, but operate on the passed window.
function applyPolyfills(win: Window & typeof globalThis) {
    if (!win) return;
    // e.g. (win.HTMLElement.prototype.scroll as any) = null;
    // e.g. patch win.setInterval for zero-delay support
    // Gameface does not support scroll
    (win.HTMLElement.prototype.scroll as any) = null;

    // setInterval with no delay polyfill
    const originalSetInterval = win.setInterval;
    win.setInterval = ((callback: Function, delay = 0) => {
        return originalSetInterval(callback, delay);
    }) as typeof win.setInterval;

    // Promise.withResolvers polyfill
    if (!win.Promise.withResolvers) {
        win.Promise.withResolvers = function <T>() {
            let resolve!: (value: T | PromiseLike<T>) => void;
            let reject!: (reason?: any) => void;
            const promise = new win.Promise<T>((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return { promise, resolve, reject };
        };
    }
}
