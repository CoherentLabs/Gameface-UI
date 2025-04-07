import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import { globSync } from 'glob';
import path, { relative, extname, resolve } from 'node:path';
import solidStyleToCssPlugin from 'vite-solid-style-to-css';
import solidGameface from 'vite-gameface';

const root = 'src/views';

export default defineConfig({
  root: root,
  plugins: [
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
        globSync('src/views/**/index.html').map((file) =>
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
  }
});
