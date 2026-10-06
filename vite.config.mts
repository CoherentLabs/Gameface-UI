import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import path, { resolve } from 'node:path';
import solidStyleToCssPlugin from 'vite-solid-style-to-css';
import solidGameface from 'vite-gameface';
import eslint from 'vite-plugin-eslint';
import gamefaceViews from './scripts/vite/views-plugin.mts';

export default defineConfig(({ mode }) => {
  const root = mode === 'test' ? 'tests/src/views' : 'src/views';

  return {
    root: root,
    plugins: [
      gamefaceViews({ root: resolve(__dirname, root) }),
      eslint({
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        emitWarning: true,
        emitError: false,
      }),
      solidStyleToCssPlugin(),
      solidPlugin(),
      solidSvg({
        defaultAsComponent: false,
        svgo: { enabled: false }
      }),
      solidGameface()
    ],
    server: {
      port: 3000,
    },
    base: './',
    build: {
      assetsInlineLimit: 0,
      cssMinify: false,
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      target: 'esnext',
      modulePreload: false,
      rollupOptions: {
        // `input` is filled in by the gameface-views plugin, one entry per view.
        output: {
          format: 'es',
          entryFileNames: '[name].js',
        },
      },
    },
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, "./src/components"),
        '@custom-components': path.resolve(__dirname, "./src/custom-components"),
        '@recipes': path.resolve(__dirname, "./src/recipes"),
        '@assets': path.resolve(__dirname, "./src/assets"),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use '@assets/scss/variables' as *;
        `,
          api: 'modern',
        }
      }
    }
  }
});
