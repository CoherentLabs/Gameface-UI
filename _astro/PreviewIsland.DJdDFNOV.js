import { o as onMount, g as getNextElement, n as createRenderEffect, G as setStyleProperty, u as use, t as template } from './web.bikURqO-.js';

const MODE_VALUES = /* @__PURE__ */ new Set(["fit", "shrink", "none"]);
function parseShorthand(value) {
  const parts = value.trim().split(/\s+/);
  let mode = "none";
  let minSize = 6;
  let maxSize = 128;
  if (MODE_VALUES.has(parts[0])) {
    mode = parts[0];
    if (parts[1]) minSize = parseFloat(parts[1]);
    if (parts[2]) maxSize = parseFloat(parts[2]);
  } else if (parts.length >= 2) {
    mode = "fit";
    minSize = parseFloat(parts[0]);
    maxSize = parseFloat(parts[1]);
  } else if (parts.length === 1) {
    mode = "fit";
    minSize = parseFloat(parts[0]);
  }
  return { mode, minSize, maxSize };
}
const RULE_RE = /([^{}@][^{}]*)\{([^{}]*)\}/g;
const PROP_RE = /\bcoh-font-fit(-mode|-min-size|-max-size)?\s*:\s*([^;}\n]+)/g;
function scanStyleElement(text, out) {
  RULE_RE.lastIndex = 0;
  let ruleMatch;
  while ((ruleMatch = RULE_RE.exec(text)) !== null) {
    const rawSelector = ruleMatch[1].trim();
    const ruleBody = ruleMatch[2];
    const decls = {};
    PROP_RE.lastIndex = 0;
    let propMatch;
    while ((propMatch = PROP_RE.exec(ruleBody)) !== null) {
      decls[propMatch[1] ?? ""] = propMatch[2].trim();
    }
    if (Object.keys(decls).length === 0) continue;
    let mode = "none";
    let minSize = 6;
    let maxSize = 128;
    if (decls[""] !== void 0) {
      const parsed = parseShorthand(decls[""]);
      mode = parsed.mode;
      minSize = parsed.minSize;
      maxSize = parsed.maxSize;
    }
    if (decls["-mode"] !== void 0) mode = decls["-mode"].trim();
    if (decls["-min-size"] !== void 0) minSize = parseFloat(decls["-min-size"]);
    if (decls["-max-size"] !== void 0) maxSize = parseFloat(decls["-max-size"]);
    if (mode === "none") continue;
    const config = { mode, minSize, maxSize };
    for (const sel of rawSelector.split(",")) {
      const trimmed = sel.trim();
      if (trimmed) out.set(trimmed, config);
    }
  }
}
function buildSelectorMap(doc) {
  const map = /* @__PURE__ */ new Map();
  for (const styleEl of doc.querySelectorAll("style")) {
    if (styleEl.textContent) scanStyleElement(styleEl.textContent, map);
  }
  return map;
}
function fitElement(el, config, win) {
  const availW = el.clientWidth;
  const availH = el.clientHeight;
  if (availW === 0 && availH === 0) return;
  el.style.fontSize = "";
  const cssSize = parseFloat(win.getComputedStyle(el).fontSize);
  const lo0 = config.minSize;
  const hi0 = config.mode === "shrink" ? Math.min(cssSize, config.maxSize) : config.maxSize;
  if (hi0 <= lo0) return;
  if (config.mode === "shrink") {
    if (el.scrollWidth <= availW && el.scrollHeight <= availH) return;
  }
  let lo = lo0;
  let hi = hi0;
  let best = lo0;
  for (let i = 0; i < 16 && hi - lo > 0.5; i++) {
    const mid = (lo + hi) / 2;
    el.style.fontSize = `${mid}px`;
    if (el.scrollWidth <= availW && el.scrollHeight <= availH) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  el.style.fontSize = `${best}px`;
}
function buildElementMap(doc, selectorMap) {
  const elementMap = /* @__PURE__ */ new Map();
  for (const [selector, config] of selectorMap) {
    try {
      for (const el of doc.querySelectorAll(selector)) {
        elementMap.set(el, config);
      }
    } catch {
    }
  }
  return elementMap;
}
function applyCohFontFitPolyfill(doc, win) {
  let selectorMap = buildSelectorMap(doc);
  let elementMap = buildElementMap(doc, selectorMap);
  for (const [el, config] of elementMap) {
    fitElement(el, config, win);
  }
  const resizeObserver = new win.ResizeObserver((entries) => {
    for (const entry of entries) {
      const config = elementMap.get(entry.target);
      if (config) fitElement(entry.target, config, win);
    }
  });
  for (const el of elementMap.keys()) {
    resizeObserver.observe(el);
  }
  function rescan() {
    resizeObserver.disconnect();
    selectorMap = buildSelectorMap(doc);
    elementMap = buildElementMap(doc, selectorMap);
    for (const [el, config] of elementMap) {
      fitElement(el, config, win);
      resizeObserver.observe(el);
    }
  }
  const headObserver = new win.MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.tagName === "STYLE") {
          rescan();
          return;
        }
      }
    }
  });
  headObserver.observe(doc.head, { childList: true });
  const bodyObserver = new win.MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const el = node;
        const candidates = [el, ...el.querySelectorAll("*")];
        for (const candidate of candidates) {
          for (const [selector, config] of selectorMap) {
            try {
              if (candidate.matches(selector)) {
                elementMap.set(candidate, config);
                fitElement(candidate, config, win);
                resizeObserver.observe(candidate);
              }
            } catch {
            }
          }
        }
      }
    }
  });
  bodyObserver.observe(doc.body, { childList: true, subtree: true });
}

const resetCSS = "@charset \"UTF-8\";\n/*\n* Gameface Fidelity Reset\n* ----------------------\n* Load this file BEFORE any author stylesheets.\n* Companion script: reset.js (load at end of <body>).\n*\n* Purpose: makes a Chromium browser approximate Gameface rendering:\n*   - border-box sizing everywhere\n*   - Flex-only layout model (implicit column, explicit flex stays row)\n*   - No visible scrollbars (content still scrollable)\n*   - Inline via [cohinline] attribute  (p[cohinline] convention)\n*   - Browser UA defaults stripped\n*/\n/* ─── Box model ─────────────────────────────────────────────────────────── */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/* ─── Base typography root ───────────────────────────────────────────────── */\nhtml {\n  font-size: 16px;\n  line-height: 1;\n  -webkit-text-size-adjust: 100%;\n}\n\n/* ─── Viewport body ──────────────────────────────────────────────────────── */\n/*                                                                            */\n/*  Gameface renders the UI as a fixed-size overlay clipped to the viewport. */\n/*  overflow: hidden matches the engine's viewport clipping.                  */\n/*  user-select: none matches game UIs being non-selectable by default.       */\nbody {\n  position: absolute;\n  width: 100vw;\n  height: 100vh;\n  user-select: none;\n  background-color: transparent;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  background-color: #24292e;\n  color: white;\n}\n\n/* ─── Universal UA-default strip ────────────────────────────────────────── */\n* {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  list-style: none;\n  text-decoration: none;\n  vertical-align: baseline;\n}\n\n/* ─── Anchor ─────────────────────────────────────────────────────────────── */\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n/* ─── Form controls ─────────────────────────────────────────────────────── */\nbutton,\ninput,\nselect,\ntextarea,\noptgroup,\noption {\n  -webkit-appearance: none;\n  appearance: none;\n  background: none;\n  color: inherit;\n  font: inherit;\n  border: none;\n  outline: none;\n}\n\ntextarea {\n  resize: none;\n  overflow: auto;\n}\n\n/* ─── Media ──────────────────────────────────────────────────────────────── */\nimg,\nvideo,\ncanvas,\nsvg {\n  display: block;\n  max-width: 100%;\n}\n\n/* ─── Tables ─────────────────────────────────────────────────────────────── */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n/* ─── Scrollbars: hidden but content remains scrollable ─────────────────── */\n/*     Gameface has no native scrollbar rendering.                           */\n* {\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n\n*::-webkit-scrollbar {\n  display: none;\n}\n\n/* ─── Flex item defaults ─────────────────────────────────────────────────── */\n/*                                                                            */\n/*  Yoga (Gameface's layout engine) does not shrink flex items by default    */\n/*  and has no concept of minimum intrinsic size constraints.                 */\n/*  flex-shrink: 0  prevents the browser from compressing items in ways      */\n/*  Gameface never would.                                                     */\n/*  min-width/height: 0  removes the browser's auto minimum that stops flex  */\n/*  items shrinking below their content size.                                 */\nbody * {\n  flex-shrink: 0;\n  min-width: 0;\n  min-height: 0;\n}\n\n/* ─── Row-direction exceptions ───────────────────────────────────────────── */\n/*                                                                            */\n/*  These elements carry semantic inline/row intent and should default to    */\n/*  row direction even when the JS pass has not run (e.g. before             */\n/*  DOMContentLoaded) or for elements the JS intentionally skips.            */\n/*  This complements — rather than replaces — the JS flex pass.             */\nspan,\np,\nbutton {\n  flex-direction: row;\n}\n\n/* ─── Implicit flex model hook (applied by reset.js) ────────────────────── */\n/*                                                                            */\n/*  reset.js reads the computed display of each element.  If it is NOT       */\n/*  already \"flex\" or \"none\", it adds the .gf-block class so the element     */\n/*  stacks its children vertically — matching Gameface's implicit block       */\n/*  model (which treats everything as flex with flex-direction: column).      */\n/*                                                                            */\n/*  Elements the author wrote `display: flex` on are left untouched, so      */\n/*  they keep the browser's native `row` default, matching Gameface.          */\n/*                                                                            */\n/*  Author rules that override display (e.g. `.hidden { display: none }`)    */\n/*  win because they carry higher specificity or are declared after this      */\n/*  file in the cascade.                                                      */\n.gf-block {\n  display: flex;\n  flex-direction: column;\n}\n\n/* ─── Inline simulation ──────────────────────────────────────────────────── */\n/*                                                                            */\n/*  Gameface has no true display:inline; the engine uses a                   */\n/*  `<p cohinline>` convention to render inline-like text spans.             */\n/*  This rule approximates it in the browser.                                */\n[cohinline] {\n  display: inline;\n}";

const resetBrowserCSS = "/* Copyright (C) Microsoft Corporation. All rights reserved. */\n/* stylelint-disable property-allowed-list, declaration-property-value-allowed-list */\n/* stylelint-disable selector-pseudo-element-allowed-list */\n/* stylelint-disable selector-pseudo-class-allowed-list */\n/* Combination of resets and trying to maintain cross browser compatibility - https://docs.coherent-labs.com/cpp-gameface/what_is_gfp/htmlfeaturesupport/ */\n/* CSS that can be applied to both gameface and browsers lives in in reset.pcss. CSS that is invalid in Gameface and shows warnings lives in reset-browser.pcss */\n/* Uses cohinline attribute to apply inline styles to try and match layout behaviour - https://docs.coherent-labs.com/cpp-gameface/content_development/inlinelayout/ */\n/* A browser sees \"cohinline\" as a standalone attribute and \"cohinline=true\" as the same, but coherent doesn't, so adding both variants just in case */\n[cohinline] {\n  display: inline;\n  vertical-align: text-bottom;\n}\n\n[cohinline] * {\n  display: inline;\n}\n\n[cohinline] img {\n  vertical-align: text-bottom;\n}\n\n[cohinline=true] {\n  display: inline;\n  vertical-align: text-bottom;\n}\n\n[cohinline=true] * {\n  display: inline;\n}\n\n[cohinline=true] img {\n  vertical-align: text-bottom;\n}\n\n*::-webkit-scrollbar {\n  display: none;\n}\n\n*:focus {\n  outline: none;\n}\n\ninput,\nbutton,\ntextarea,\nselect {\n  font-variant: inherit;\n}\n\nul[role=list],\nol[role=list] {\n  list-style: none;\n}";

var _tmpl$ = /* @__PURE__ */ template(`<iframe title="Gameface preview"srcdoc="<!DOCTYPE html><html><head><meta name='viewport' content='width=1920, initial-scale=1.0, shrink-to-fit=no'></head><body></body></html>"style=width:100%;border:none;display:block;margin-top:0>`);
async function resolveDemoUrl(hash) {
  const manifest = await (await fetch("/gfui-demo-manifest.json")).json();
  const e = manifest[hash];
  return {
    js: e.js.startsWith("/") ? e.js : "/" + e.js,
    css: e.css ?? ""
  };
}
function PreviewIsland(props) {
  let iframeRef;
  const setupAutoHeight = () => {
    const doc = iframeRef.contentDocument;
    const win = iframeRef.contentWindow;
    if (!doc || !win) return;
    let last = 0;
    const measure = () => {
      const h = doc.body.scrollHeight;
      if (Math.abs(h - last) < 1) return;
      last = h;
      iframeRef.style.height = `${Math.max(h, 80)}px`;
    };
    measure();
    const RO = win.ResizeObserver;
    if (RO) new RO(measure).observe(doc.body);
    doc.fonts?.ready.then(measure);
  };
  const setupIframe = async () => {
    const doc = iframeRef.contentDocument;
    if (!doc) return;
    const resetStyle = doc.createElement("style");
    resetStyle.textContent = resetCSS + "\n" + resetBrowserCSS;
    doc.head.appendChild(resetStyle);
    applyPolyfills(iframeRef.contentWindow, iframeRef.contentDocument);
    const {
      js,
      css
    } = await resolveDemoUrl(props.hash);
    if (css) {
      const style = doc.createElement("style");
      style.textContent = css;
      doc.head.appendChild(style);
    }
    if (props.css) {
      const customCss = Array.isArray(props.css) ? props.css.join("\n") : props.css;
      const customStyle = doc.createElement("style");
      customStyle.textContent = customCss;
      doc.head.appendChild(customStyle);
    }
    const absolute = new URL(js, window.location.origin).href;
    const win = iframeRef.contentWindow;
    const mod = await win.eval(`import("${absolute}")`);
    mod.default(doc.body);
    applyCohFontFitPolyfill(doc, iframeRef.contentWindow);
    console.log("[PreviewIsland] fixed height:", props.height);
    if (props.height == null) {
      setupAutoHeight();
    } else {
      iframeRef.style.height = `${props.height}px`;
    }
  };
  onMount(() => {
    const doc = iframeRef.contentDocument;
    if (doc?.body) {
      setupIframe();
    } else {
      iframeRef.addEventListener("load", setupIframe, {
        once: true
      });
    }
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    var _ref$ = iframeRef;
    typeof _ref$ === "function" ? use(_ref$, _el$) : iframeRef = _el$;
    createRenderEffect((_p$) => {
      var _v$ = props.height ? `${props.height}px` : "auto", _v$2 = props.height ? void 0 : "80px";
      _v$ !== _p$.e && setStyleProperty(_el$, "height", _p$.e = _v$);
      _v$2 !== _p$.t && setStyleProperty(_el$, "min-height", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
}
function applyPolyfills(win, doc) {
  function convertElement(el) {
    if (el.hasAttribute("cohinline")) {
      return;
    }
    var computed = win.getComputedStyle(el).display;
    if (computed === "flex" || computed === "none") {
      return;
    }
    el.classList.add("gf-block");
  }
  function processSubtree(root) {
    convertElement(root);
    var descendants = root.querySelectorAll("*");
    for (var i = 0; i < descendants.length; i++) {
      convertElement(descendants[i]);
    }
  }
  function initialPass() {
    processSubtree(doc.body);
  }
  var observer = new MutationObserver(function(mutations) {
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
  function init() {
    initialPass();
    observer.observe(doc.body, {
      childList: true,
      subtree: true
    });
  }
  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

export { PreviewIsland as default };
