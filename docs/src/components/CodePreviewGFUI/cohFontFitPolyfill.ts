interface FontFitConfig {
    mode: 'fit' | 'shrink';
    minSize: number;
    maxSize: number;
}

// One CSS rule's worth of coh-font-fit declarations, keyed by selector.
type SelectorConfigMap = Map<string, FontFitConfig>;

// ── CSS parsing ───────────────────────────────────────────────────────────────

const MODE_VALUES = new Set(['fit', 'shrink', 'none']);

function parseShorthand(value: string): Omit<FontFitConfig, 'mode'> & { mode: string } {
    const parts = value.trim().split(/\s+/);
    let mode = 'none';
    let minSize = 6;
    let maxSize = 128;

    if (MODE_VALUES.has(parts[0])) {
        mode = parts[0];
        if (parts[1]) minSize = parseFloat(parts[1]);
        if (parts[2]) maxSize = parseFloat(parts[2]);
    } else if (parts.length >= 2) {
        // <min> <max> form — mode implied as 'fit'
        mode = 'fit';
        minSize = parseFloat(parts[0]);
        maxSize = parseFloat(parts[1]);
    } else if (parts.length === 1) {
        // Single numeric value (treated as min-size only — unusual, but safe fallback)
        mode = 'fit';
        minSize = parseFloat(parts[0]);
    }

    return { mode, minSize, maxSize };
}

// Flat-CSS rule regex: matches "selector { ... }" blocks.
// Works on compiled (non-nested) CSS that Vite outputs.
const RULE_RE = /([^{}@][^{}]*)\{([^{}]*)\}/g;

// Matches any coh-font-fit* declaration inside a rule body.
const PROP_RE = /\bcoh-font-fit(-mode|-min-size|-max-size)?\s*:\s*([^;}\n]+)/g;

function scanStyleElement(text: string, out: SelectorConfigMap): void {
    RULE_RE.lastIndex = 0;
    let ruleMatch: RegExpExecArray | null;

    while ((ruleMatch = RULE_RE.exec(text)) !== null) {
        const rawSelector = ruleMatch[1].trim();
        const ruleBody = ruleMatch[2];

        // Gather all coh-font-fit* declarations in this rule body
        const decls: Record<string, string> = {};
        PROP_RE.lastIndex = 0;
        let propMatch: RegExpExecArray | null;
        while ((propMatch = PROP_RE.exec(ruleBody)) !== null) {
            // suffix is '', '-mode', '-min-size', or '-max-size'
            decls[propMatch[1] ?? ''] = propMatch[2].trim();
        }

        if (Object.keys(decls).length === 0) continue;

        // Resolve mode / min / max
        let mode = 'none';
        let minSize = 6;
        let maxSize = 128;

        if (decls[''] !== undefined) {
            const parsed = parseShorthand(decls['']);
            mode = parsed.mode;
            minSize = parsed.minSize;
            maxSize = parsed.maxSize;
        }
        if (decls['-mode'] !== undefined) mode = decls['-mode'].trim();
        if (decls['-min-size'] !== undefined) minSize = parseFloat(decls['-min-size']);
        if (decls['-max-size'] !== undefined) maxSize = parseFloat(decls['-max-size']);

        if (mode === 'none') continue;

        const config: FontFitConfig = { mode: mode as 'fit' | 'shrink', minSize, maxSize };

        // A selector string may be comma-separated
        for (const sel of rawSelector.split(',')) {
            const trimmed = sel.trim();
            if (trimmed) out.set(trimmed, config);
        }
    }
}

function buildSelectorMap(doc: Document): SelectorConfigMap {
    const map: SelectorConfigMap = new Map();
    for (const styleEl of doc.querySelectorAll('style')) {
        if (styleEl.textContent) scanStyleElement(styleEl.textContent, map);
    }
    return map;
}

// ── Fitting algorithm ─────────────────────────────────────────────────────────

function fitElement(
    el: HTMLElement,
    config: FontFitConfig,
    win: Window & typeof globalThis,
): void {
    // Bail if the element has no rendered size (not in layout yet)
    const availW = el.clientWidth;
    const availH = el.clientHeight;
    if (availW === 0 && availH === 0) return;

    // Remove our previous inline override so we measure the CSS-cascade value
    el.style.fontSize = '';
    const cssSize = parseFloat(win.getComputedStyle(el).fontSize);

    const lo0 = config.minSize;
    const hi0 = config.mode === 'shrink' ? Math.min(cssSize, config.maxSize) : config.maxSize;

    if (hi0 <= lo0) return;

    // For 'shrink': if text already fits at the CSS-defined size, do nothing
    if (config.mode === 'shrink') {
        if (el.scrollWidth <= availW && el.scrollHeight <= availH) return;
    }

    // Binary search for the largest font-size where the content fits both dimensions
    let lo = lo0;
    let hi = hi0;
    let best = lo0;

    for (let i = 0; i < 16 && hi - lo > 0.5; i++) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = `${mid}px`;
        // Reading scrollWidth/scrollHeight forces a synchronous layout recalc
        if (el.scrollWidth <= availW && el.scrollHeight <= availH) {
            best = mid;
            lo = mid;
        } else {
            hi = mid;
        }
    }

    el.style.fontSize = `${best}px`;
}

// ── Element discovery ─────────────────────────────────────────────────────────

function buildElementMap(
    doc: Document,
    selectorMap: SelectorConfigMap,
): Map<HTMLElement, FontFitConfig> {
    const elementMap = new Map<HTMLElement, FontFitConfig>();

    for (const [selector, config] of selectorMap) {
        try {
            for (const el of doc.querySelectorAll<HTMLElement>(selector)) {
                elementMap.set(el, config);
            }
        } catch {
            // Ignore selectors that aren't valid in this context
        }
    }

    return elementMap;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function applyCohFontFitPolyfill(
    doc: Document,
    win: Window & typeof globalThis,
): void {
    let selectorMap = buildSelectorMap(doc);
    let elementMap = buildElementMap(doc, selectorMap);

    // Initial fit pass
    for (const [el, config] of elementMap) {
        fitElement(el, config, win);
    }

    // ResizeObserver: refit when a fitted element's container changes size
    const resizeObserver = new win.ResizeObserver((entries) => {
        for (const entry of entries) {
            const config = elementMap.get(entry.target as HTMLElement);
            if (config) fitElement(entry.target as HTMLElement, config, win);
        }
    });
    for (const el of elementMap.keys()) {
        resizeObserver.observe(el);
    }

    // Full re-scan: called when a new <style> element appears in <head>
    function rescan(): void {
        // Unobserve all previously tracked elements
        resizeObserver.disconnect();

        selectorMap = buildSelectorMap(doc);
        elementMap = buildElementMap(doc, selectorMap);

        for (const [el, config] of elementMap) {
            fitElement(el, config, win);
            resizeObserver.observe(el);
        }
    }

    // MutationObserver on <head>: re-scan when new <style> elements are injected
    const headObserver = new win.MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if ((node as Element).tagName === 'STYLE') {
                    rescan();
                    return;
                }
            }
        }
    });
    headObserver.observe(doc.head, { childList: true });

    // MutationObserver on <body>: fit new elements that match known selectors
    const bodyObserver = new win.MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                const el = node as HTMLElement;

                // Check the added element itself and all its descendants
                const candidates = [el, ...el.querySelectorAll<HTMLElement>('*')];
                for (const candidate of candidates) {
                    for (const [selector, config] of selectorMap) {
                        try {
                            if (candidate.matches(selector)) {
                                elementMap.set(candidate, config);
                                fitElement(candidate, config, win);
                                resizeObserver.observe(candidate);
                            }
                        } catch {
                            // Invalid selector — skip
                        }
                    }
                }
            }
        }
    });
    bodyObserver.observe(doc.body, { childList: true, subtree: true });
}
