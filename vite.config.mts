import { defineConfig } from 'vite';
import solidPlugin from '@solidjs/vite-plugin';
import solidSvg from 'vite-plugin-solid-svg';
import path, { resolve } from 'node:path';
import solidStyleToCssPlugin from 'vite-solid-style-to-css';
import solidGameface from 'vite-gameface';
import eslint from 'vite-plugin-eslint';
import gamefaceViews from './scripts/vite/views-plugin.mts';
import gamefaceImages from './scripts/vite/images-plugin.mts';
import styleTomPlugin from './scripts/babel/style-tom-plugin.mts';
import { styleTomReport } from './scripts/babel/style-tom-report.mts';

export default defineConfig(({ mode }) => {
  const root = mode === 'test' ? 'tests/src/views' : 'src/views';

  return {
    root: root,
    plugins: [
      gamefaceViews({ root: resolve(import.meta.dirname, root) }),
      eslint({
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        emitWarning: true,
        emitError: false,
      }),
      solidStyleToCssPlugin(),
      gamefaceImages({
        assets: resolve(import.meta.dirname, 'src/assets'),
        types: resolve(import.meta.dirname, 'src/components/Media/Image/ImageTypes.ts'),
      }),
      styleTomReport(),
      solidPlugin({
        babel: {
          plugins: [styleTomPlugin]
        },
        solid: {
          moduleName: path.resolve(import.meta.dirname, './src/components/BaseComponent/gameface-dom.ts')
        }
      }),
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
      outDir: resolve(import.meta.dirname, 'dist'),
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
        '@components': path.resolve(import.meta.dirname, "./src/components"),
        '@custom-components': path.resolve(import.meta.dirname, "./src/custom-components"),
        '@recipes': path.resolve(import.meta.dirname, "./src/recipes"),
        '@assets': path.resolve(import.meta.dirname, "./src/assets"),
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
