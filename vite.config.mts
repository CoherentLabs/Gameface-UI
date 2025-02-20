import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';
import solidGameface from './vite-custom-plugins/vite-gameface';
import { globSync } from 'glob';
import path, { relative, extname, resolve } from 'node:path';

const root = 'src/views';

export default defineConfig({
  root: root,
  plugins: [
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
    }
  }
});
