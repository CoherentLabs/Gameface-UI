import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin, ResolvedConfig } from 'vite';
import { build } from 'vite';
import solid from 'vite-plugin-solid';
import solidStyleToCss from 'vite-solid-style-to-css';
import { demoRegistry } from './gfui-demo-registry';
import { GFUI_DEMO_DIR } from './gfui-demo-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '../../../..');
const REPO_ROOT = path.resolve(DOCS_ROOT, '..');

const REQUEST_PREFIX = '/@gfui-demo/';

function resolveDemoFilePath(hash: string): string | null {
  const filePath = path.join(GFUI_DEMO_DIR, `${hash}.tsx`);

  if (fs.existsSync(filePath)) {
    return filePath;
  }

  const fromRegistry = demoRegistry.get(hash);
  if (fromRegistry) {
    fs.mkdirSync(GFUI_DEMO_DIR, { recursive: true });
    fs.writeFileSync(filePath, fromRegistry, 'utf-8');
    return filePath;
  }

  return null;
}

function getAliases() {
  return {
    '@components': path.join(REPO_ROOT, 'src/components'),
    '@custom-components': path.join(REPO_ROOT, 'src/custom-components'),
    '@assets': path.join(REPO_ROOT, 'src/assets'),
  };
}

function getScssOptions() {
  return {
    additionalData: `@use '@assets/scss/variables' as *;`,
    api: 'modern' as const,
  };
}

function listDemoEntries(): { hash: string; filePath: string; ext: string }[] {
  if (!fs.existsSync(GFUI_DEMO_DIR)) return [];

  return fs
    .readdirSync(GFUI_DEMO_DIR)
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => {
      const hash = name.replace(/\.tsx$/, '');
      return {
        hash,
        filePath: path.join(GFUI_DEMO_DIR, name),
        ext: 'tsx',
      };
    });
}

async function buildDemoChunks(outDir: string): Promise<Record<string, { js: string; css: string }>> {
  const entries = listDemoEntries();
  const manifest: Record<string, { js: string; css: string }> = {};
  const demoOutDir = path.join(outDir, 'gfui-demos');
  fs.mkdirSync(demoOutDir, { recursive: true });

  for (const { hash, filePath } of entries) {
    await build({
      configFile: false,
      plugins: [solidStyleToCss(), solid()],
      resolve: {
        alias: getAliases(),
        dedupe: ['solid-js', 'solid-js/web', 'solid-js/store'],
      },
      css: {
        preprocessorOptions: {
          scss: getScssOptions(),
        },
      },
      build: {
        outDir: demoOutDir,
        emptyOutDir: false,
        minify: false,
        lib: {
          entry: filePath,
          formats: ['es'],
          fileName: () => `${hash}.js`,
        },
        rollupOptions: {
          output: {
            assetFileNames: `${hash}[extname]`,
          },
        },
        cssCodeSplit: false,
      },
    });

    let css = '';
    for (const file of fs.readdirSync(demoOutDir)) {
      if (file.startsWith(hash) && file.endsWith('.css')) {
        css = `/gfui-demos/${file}`;
        break;
      }
    }

    manifest[hash] = {
      js: `/gfui-demos/${hash}.js`,
      css,
    };
  }

  return manifest;
}

export function gfuiDemoPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig;
  let isBuild = false;

  return {
    name: 'vite-plugin-gfui-demo',
    enforce: 'pre',

    configResolved(config) {
      resolvedConfig = config;
      isBuild = config.command === 'build';
    },

    resolveId(id) {
      if (!id.startsWith(REQUEST_PREFIX) || !id.endsWith('.tsx')) return;

      const match = id.match(/\/@gfui-demo\/([^.]+)\.tsx$/);
      if (!match) return;

      return resolveDemoFilePath(match[1]) ?? undefined;
    },

    async closeBundle() {
      if (!isBuild) return;

      const manifest = await buildDemoChunks(resolvedConfig.build.outDir);
      const manifestPath = path.join(resolvedConfig.build.outDir, 'gfui-demo-manifest.json');
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    },
  };
}
