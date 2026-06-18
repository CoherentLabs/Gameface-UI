import { onMount } from 'solid-js';
import resetCSS from './reset.scss?inline';
import resetBrowserCSS from './reset-browser.scss?inline';

interface PreviewIslandProps {
  css?: string | string[];
  code?: string;
  height?: number;
  hash?: string;
  lang?: string;
}

async function resolveDemoUrl(hash: string): Promise<{ js: string; css: string }> {
  if (import.meta.env.DEV) {
    return { js: `/@gfui-demo/${hash}.tsx`, css: '' };
  }

  const manifest = await (await fetch('/gfui-demo-manifest.json')).json();
  const entry = manifest[hash];
  if (!entry) {
    throw new Error(`GFUI demo "${hash}" was not found in gfui-demo-manifest.json`);
  }

  return {
    js: entry.js.startsWith('/') ? entry.js : `/${entry.js}`,
    css: entry.css ? (entry.css.startsWith('/') ? entry.css : `/${entry.css}`) : '',
  };
}

function isHtmlDemo(lang?: string, code?: string): boolean {
  if (lang === 'html') return true;
  if (!code) return false;
  const trimmed = code.trim();
  return trimmed.startsWith('<') && !trimmed.includes('export default');
}

function mountHtml(doc: Document, html: string) {
  doc.body.replaceChildren();
  const template = doc.createElement('template');
  template.innerHTML = html.trim();
  doc.body.append(...template.content.childNodes);
}

function applyPolyfills(win: Window & typeof globalThis) {
  if (!win) return;

  (win.HTMLElement.prototype.scroll as unknown) = null;

  const originalSetInterval = win.setInterval;
  win.setInterval = ((callback: TimerHandler, delay = 0) => {
    return originalSetInterval(callback, delay);
  }) as typeof win.setInterval;

  if (!win.Promise.withResolvers) {
    win.Promise.withResolvers = function <T>() {
      let resolve!: (value: T | PromiseLike<T>) => void;
      let reject!: (reason?: unknown) => void;
      const promise = new win.Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

export default function PreviewIsland(props: PreviewIslandProps) {
  let iframeRef!: HTMLIFrameElement;

  const setupIframe = async () => {
    const doc = iframeRef.contentDocument;
    if (!doc?.body) return;

    const resetStyle = doc.createElement('style');
    resetStyle.textContent = `${resetCSS}\n${resetBrowserCSS}`;
    doc.head.appendChild(resetStyle);

    applyPolyfills(iframeRef.contentWindow as Window & typeof globalThis);

    const extraCss = props.css;
    if (extraCss) {
      const style = doc.createElement('style');
      style.textContent = Array.isArray(extraCss) ? extraCss.join('\n') : extraCss;
      doc.head.appendChild(style);
    }

    if (isHtmlDemo(props.lang, props.code)) {
      mountHtml(doc, props.code ?? '');
      return;
    }

    if (!props.hash) return;

    const { js, css } = await resolveDemoUrl(props.hash);

    if (css) {
      const style = doc.createElement('style');
      style.textContent = await (await fetch(css)).text();
      doc.head.appendChild(style);
    }

    const absolute = new URL(js, window.location.origin).href;
    const win = iframeRef.contentWindow as Window & { eval: (code: string) => Promise<{ default: (root: HTMLElement) => void }> };
    const mod = await win.eval(`import("${absolute}")`);

    doc.body.replaceChildren();
    mod.default(doc.body);
  };

  onMount(() => {
    const doc = iframeRef.contentDocument;

    if (doc?.body) {
      void setupIframe();
    } else {
      iframeRef.addEventListener('load', () => void setupIframe(), { once: true });
    }
  });

  return (
    <iframe
      ref={iframeRef}
      title="Gameface preview"
      srcdoc="<!DOCTYPE html><html><head></head><body></body></html>"
      style={{
        width: '100%',
        height: `${props.height ?? 300}px`,
        border: 'none',
        display: 'block',
      }}
    />
  );
}
