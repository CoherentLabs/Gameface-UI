import type { Plugin } from 'vite';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { demoRegistry } from './gfui-demo-registry'; // adjust path if needed

const CACHE_DIR = path.resolve('node_modules/.gfui-demo-cache');
mkdirSync(CACHE_DIR, { recursive: true });

const DEV_URL = '/@gfui-demo/';

/**
 * Strips the JS wrapper Vite puts around `?inline` CSS so we get raw CSS text.
 * `?inline` modules come back as: export default "<css>"
 */
function extractInlineCss(jsModuleCode: string): string {
    const m = jsModuleCode.match(/export default\s+("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/);
    if (!m) return '';
    try {
        // eslint-disable-next-line no-new-func
        return Function(`return (${m[1]})`)();
    } catch {
        return '';
    }
}

/**
 * Walks the demo's import graph using the Rollup plugin context (`ctx`),
 * and for every *.module.scss it finds, loads its ?inline form and
 * concatenates the compiled CSS. Cascade order follows import order.
 */
async function collectDemoCss(ctx: any, entryFile: string): Promise<string> {
    const seen = new Set<string>();
    const cssParts: string[] = [];

    const visit = async (id: string, importer?: string) => {
        const resolved = await ctx.resolve(id, importer, { skipSelf: true });
        if (!resolved) return;
        const resolvedId = resolved.id;
        if (seen.has(resolvedId)) return;
        seen.add(resolvedId);

        // Component module SCSS -> grab compiled CSS via ?inline.
        if (/\.module\.scss$/.test(resolvedId)) {
            try {
                const loaded = await ctx.load({ id: resolvedId + '?inline', resolveDependencies: false });
                const cssText = extractInlineCss(loaded?.code ?? '');
                if (cssText) cssParts.push(cssText);
            } catch {
                /* ignore */
            }
            return;
        }

        // Traverse only JS/TS modules for further imports.
        if (!/\.(tsx?|jsx?|mjs)$/.test(resolvedId)) return;

        const info = await ctx.load({ id: resolvedId, resolveDependencies: true });
        const deps = [...(info?.importedIds ?? []), ...(info?.dynamicallyImportedIds ?? [])];
        for (const dep of deps) {
            await visit(dep, resolvedId);
        }
    };

    await visit(entryFile);
    return cssParts.join('\n');
}

export function gfuiDemoPlugin(): Plugin {
    let isBuild = false;
    const refIds = new Map<string, string>();
    const cssByHash = new Map<string, string>();

    return {
        name: 'gfui-demo',

        configResolved(c) {
            isBuild = c.command === 'build';
        },

        // ---- DEV: serve the demo module on demand (compiled by Vite) ----
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url?.startsWith(DEV_URL)) return next();
                const hash = req.url.slice(DEV_URL.length).replace(/\.tsx$/, '');
                const code = demoRegistry.get(hash);
                if (code == null) return next();

                const file = path.join(CACHE_DIR, `${hash}.tsx`);
                writeFileSync(file, code);
                const rel = '/' + path.relative(process.cwd(), file).replace(/\\/g, '/');
                const result = await server.transformRequest(rel);
                if (!result) return next();

                res.setHeader('Content-Type', 'application/javascript');
                res.end(result.code);
            });
        },

        // ---- BUILD: emit a chunk per demo AND collect its transitive CSS ----
        async buildStart() {
            if (!isBuild) return;

            for (const [hash, code] of demoRegistry) {
                const file = path.join(CACHE_DIR, `${hash}.tsx`);
                writeFileSync(file, code);

                refIds.set(hash, this.emitFile({ type: 'chunk', id: file, name: `gfui-demo-${hash}` }));

                // `this` here is the Rollup plugin context — pass it to the helper.
                const css = await collectDemoCss(this, file);
                cssByHash.set(hash, css);
            }
        },

        // ---- BUILD: write manifest with JS url + collected CSS string ----
        generateBundle(_o) {
            if (!isBuild) return;
            const manifest: Record<string, { js: string; css: string }> = {};
            for (const [hash, refId] of refIds) {
                manifest[hash] = {
                    js: this.getFileName(refId),
                    css: cssByHash.get(hash) ?? '',
                };
            }
            this.emitFile({
                type: 'asset',
                fileName: 'gfui-demo-manifest.json',
                source: JSON.stringify(manifest),
            });
        },
    };
}
