import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { globSync } from 'glob';
import { relative, extname, resolve } from 'node:path';

const root = 'src/views';

export default defineConfig({
  root: root,
  plugins: [
    solidPlugin(),
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
});
