import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

/**
 * Serves every folder in the views root as a page without asking the author to
 * write the boilerplate that used to live in each view: `index.html`,
 * `index.tsx` and `index.css`.
 *
 * A view is a folder holding a component file named after it - `hud/Hud.tsx`,
 * `chart-playground/ChartPlayground.tsx` - with the page as its default export.
 * The HTML document and the module that renders the component are generated in
 * memory, both in dev and in the production build.
 */

const ENTRY_FILE = '__view-entry.js';
const HTML_FILE = 'index.html';
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx'];
const GLOBAL_STYLE_NAMES = ['global.scss', 'global.css'];

export interface View {
    /** Folder name, which is also the URL segment the view is served from. */
    name: string;
    /** Absolute path to the view folder. */
    dir: string;
    /** Absolute path to the component file rendered as the page. */
    component: string;
}

const toPosix = (value: string) => value.replace(/\\/g, '/');

/** `chart-playground` and `ChartPlayground` are the same name to us. */
const toComparable = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

const cleanUrl = (url: string) => url.replace(/[?#].*$/, '');

/** Path part of a request URL, or null when it is not decodable. */
function toPathname(url: string) {
    try {
        return decodeURI(cleanUrl(url));
    } catch {
        return null;
    }
}

function findComponent(dir: string, viewName: string) {
    const wanted = toComparable(viewName);

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isFile()) continue;

        const extension = path.extname(entry.name);
        if (!COMPONENT_EXTENSIONS.includes(extension)) continue;
        if (toComparable(path.basename(entry.name, extension)) !== wanted) continue;

        return path.join(dir, entry.name);
    }

    return null;
}

function findGlobalStyle(dir: string) {
    for (const name of GLOBAL_STYLE_NAMES) {
        const file = path.join(dir, name);
        if (fs.existsSync(file)) return file;
    }

    return null;
}

/** Every folder under `viewsRoot` that holds a component named after it. */
export function discoverViews(viewsRoot: string): View[] {
    if (!fs.existsSync(viewsRoot)) return [];

    const views: View[] = [];

    for (const entry of fs.readdirSync(viewsRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;

        const dir = path.join(viewsRoot, entry.name);
        const component = findComponent(dir, entry.name);
        if (!component) continue;

        views.push({ name: entry.name, dir, component });
    }

    return views;
}

/** Import specifier for `file`, written relative to the view folder. */
function importSpecifier(view: View, file: string) {
    const relative = toPosix(path.relative(view.dir, file));
    return relative.startsWith('.') ? relative : `./${relative}`;
}

/**
 * The module the generated document loads. It is plain JS on purpose - no JSX
 * to compile and nothing for the linter to pick up on a file that is not on
 * disk. `createComponent` is what JSX compiles to anyway.
 */
function generateEntry(view: View, viewsRoot: string) {
    const styles = [findGlobalStyle(viewsRoot), findGlobalStyle(view.dir)]
        .filter((file): file is string => file !== null)
        .map((file) => `import '${importSpecifier(view, file)}';`);

    return [
        `import { render } from 'solid-js/web';`,
        `import { createComponent } from 'solid-js';`,
        ...styles,
        `import View from '${importSpecifier(view, view.component)}';`,
        ``,
        `const root = document.getElementById('root');`,
        ``,
        `render(() => createComponent(View, {}), root);`,
        ``,
    ].join('\n');
}

function generateHtml(view: View) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${view.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/${view.name}/${ENTRY_FILE}" type="module"></script>
  </body>
</html>
`;
}

const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The page served at `/` in development.
 *
 * It renders in Gameface as well as in a browser, so it stays inside the engine
 * subset: no `<ul>`/`<li>` (no list layout), no `<h1>` (no default styling), no
 * `<a href>` (anchors do not navigate - a click handler sets `location.href`
 * instead), no numeric `font-weight` and no `system-ui` font. Sizes are in `rem`
 * off a viewport-derived root size so the page scales with the resolution.
 */
function generateIndexPage(views: View[], viewsRoot: string) {
    const items = views
        .map((view) => {
            const name = escapeHtml(view.name);
            const component = escapeHtml(toPosix(path.relative(viewsRoot, view.component)));

            return `        <div class="item" role="link" data-href="/${name}">
          <div class="name">${name}</div>
          <div class="path">${component}</div>
        </div>`;
        })
        .join('\n');

    const list = views.length
        ? `<div class="list">\n${items}\n      </div>`
        : `<div class="empty">No views yet. Create <span class="code">${escapeHtml(toPosix(viewsRoot))}/my-view/MyView.tsx</span> to add one.</div>`;

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Views</title>
    <style>
      html { font-size: 1.48vh; background-color: #16171b; }
      body { margin: 0; padding: 3rem 1.5rem; background-color: #16171b; color: #e8e8ea;
             display: flex; flex-direction: column; align-items: center; }
      .page { width: 40rem; max-width: 100%; }
      .title { font-size: 1.5rem; margin-bottom: 0.25rem; }
      .subtitle { color: #8a8d96; font-size: 0.875rem; margin-bottom: 2rem; }
      .list { display: flex; flex-direction: column; }
      .item { display: flex; justify-content: space-between; align-items: center;
              margin-bottom: 0.5rem; padding: 0.875rem 1.125rem;
              border: 0.0625rem solid #2c2e36; border-radius: 0.375rem;
              background-color: #1c1e24; cursor: pointer; }
      .item:hover { border-color: #4c8dff; background-color: #22252d; }
      .name { font-size: 1rem; }
      .path { color: #8a8d96; font-size: 0.8125rem; }
      .empty { color: #8a8d96; }
      .code { color: #e8e8ea; }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="title">Views</div>
      <div class="subtitle">${views.length} view${views.length === 1 ? '' : 's'} in ${escapeHtml(toPosix(viewsRoot))}</div>
      ${list}
    </div>
    <script>
      // Gameface does not navigate on <a href>, so the rows are plain elements
      // that navigate from script. Works the same in a browser.
      function bindView(element) {
        element.addEventListener('click', function () {
          window.location.href = element.getAttribute('data-href');
        });
      }

      var rows = document.querySelectorAll('[data-href]');
      for (var i = 0; i < rows.length; i++) bindView(rows[i]);
    </script>
  </body>
</html>
`;
}

export interface ViewsPluginOptions {
    /** Folder holding the view folders, relative to the project root or absolute. */
    root: string;
}

export default function gamefaceViews({ root }: ViewsPluginOptions): Plugin {
    const viewsRoot = path.resolve(root);
    const viewsRootPosix = toPosix(viewsRoot);

    let resolvedConfig: ResolvedConfig | undefined;

    const findView = (name: string) => discoverViews(viewsRoot).find((view) => view.name === name);

    /** The view a generated file belongs to, or null if the path is not ours. */
    const viewOf = (file: string, fileName: string) => {
        const normalized = toPosix(path.normalize(file));
        if (path.posix.basename(normalized) !== fileName) return null;

        const dir = path.posix.dirname(normalized);
        if (path.posix.dirname(dir) !== viewsRootPosix) return null;

        return findView(path.posix.basename(dir)) ?? null;
    };

    return {
        name: 'gameface-views',
        enforce: 'pre',

        config() {
            const input = Object.fromEntries(
                discoverViews(viewsRoot).map((view) => [
                    `${view.name}/index`,
                    toPosix(path.join(view.dir, HTML_FILE)),
                ])
            );

            // Without `mpa` Vite rewrites every unknown URL to `/index.html`,
            // which would swallow `/hud` before the middleware below sees it.
            return { appType: 'mpa', build: { rollupOptions: { input } } };
        },

        resolveId(source) {
            const fileName = path.basename(cleanUrl(source));
            if (fileName !== ENTRY_FILE && fileName !== HTML_FILE) return;

            // Build inputs come in as absolute paths, while the document
            // references its entry as `/<view>/__view-entry.js`, which is
            // relative to the views root.
            const candidates = [
                path.normalize(cleanUrl(source)),
                path.join(viewsRoot, cleanUrl(source)),
            ];

            return candidates.map(toPosix).find((file) => viewOf(file, fileName));
        },

        load(id) {
            const file = path.normalize(cleanUrl(id));

            const htmlView = viewOf(file, HTML_FILE);
            if (htmlView) return generateHtml(htmlView);

            const entryView = viewOf(file, ENTRY_FILE);
            if (entryView) return generateEntry(entryView, viewsRoot);

            return null;
        },

        configureServer(server) {
            // Registered after Vite's own middlewares so real files keep winning,
            // but before the one that would answer with a 404.
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

                    const pathname = toPathname(req.url ?? '/');
                    if (pathname === null) return next();

                    const segments = pathname.split('/').filter(Boolean);

                    const send = (html: string) => {
                        res.setHeader('Content-Type', 'text/html');
                        res.setHeader('Cache-Control', 'no-cache');
                        res.end(html);
                    };

                    if (segments.length === 0 || pathname === '/index.html') {
                        return send(generateIndexPage(discoverViews(viewsRoot), viewsRoot));
                    }

                    // `/hud`, `/hud/` and `/hud/index.html` all open the view.
                    if (segments.length > 2) return next();
                    if (segments.length === 2 && segments[1] !== HTML_FILE) return next();

                    const view = findView(segments[0]);
                    if (!view) return next();

                    const url = `/${view.name}/${HTML_FILE}`;
                    send(await server.transformIndexHtml(url, generateHtml(view), req.originalUrl));
                });
            };
        },

        configResolved(config) {
            resolvedConfig = config;
        },

        configurePreviewServer(server) {
            // The built views live in `<outDir>/<view>/index.html`; let them be
            // opened without the trailing slash, the same way dev does. This
            // looks at what was built rather than at the views folder, because
            // `vite preview` is not always run with the mode it was built with.
            return () => {
                server.middlewares.use((req, res, next) => {
                    const pathname = toPathname(req.url ?? '/');
                    const segments = pathname?.split('/').filter(Boolean) ?? [];

                    if (segments.length === 1) {
                        const outDir = resolvedConfig?.build.outDir ?? '';
                        const html = path.join(outDir, segments[0], HTML_FILE);
                        if (fs.existsSync(html)) req.url = `/${segments[0]}/${HTML_FILE}`;
                    }

                    next();
                });
            };
        },
    };
}
