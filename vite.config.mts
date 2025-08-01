import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import { globSync } from 'glob';
import path, { relative, extname, resolve } from 'node:path';
import solidStyleToCssPlugin from 'vite-solid-style-to-css';
import solidGameface from 'vite-gameface';
import eslint from 'vite-plugin-eslint';

const root = process.env.NODE_ENV === 'test' ? 'tests/src/views' : 'src/views';
const pathPattern = process.env.NODE_ENV === 'test' ? 'tests/src/views/**/index.html' : 'src/views/**/index.html'

export default defineConfig({
  root: root,
  plugins: [
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
    target: 'esnext',
    modulePreload: false,
    rollupOptions: {
      input: Object.fromEntries(
        globSync(pathPattern).map((file) =>
          [
            relative(root, file.slice(0, file.length - extname(file).length)),
            resolve(__dirname, file)
          ].map((file) => file.replace(/\\/g, '/')))
      ),
      output: {
        format: 'es',
        dir: 'dist',
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, "./src/components"),
      '@custom-components': path.resolve(__dirname, "./src/custom-components"),
      '@assets': path.resolve(__dirname, "./src/assets"),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '@assets/scss/variables' as *;
        `
      }
    }
  }
});
