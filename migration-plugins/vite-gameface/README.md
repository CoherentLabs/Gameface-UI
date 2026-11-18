# Vite Gameface Plugin

A Vite plugin with Gameface runtime fixes for Solid 2 apps. It injects them as an inline script at the top of every HTML page, so they run before your app.

Version 2 is for Solid 2 and Vite 8. For Solid 1, use `vite-gameface@1`.

```js
import solid from '@solidjs/vite-plugin';
import solidGameface from 'vite-gameface';

export default defineConfig({
    plugins: [
        solid({
            // Gameface needs complete HTML in Solid's templates
            solid: {
                omitQuotes: false,
                omitAttributeSpacing: false,
                omitNestedClosingTags: false,
                omitLastClosingTag: false,
            },
        }),
        solidGameface(),
    ],
});
```

You can read the full documentation for the plugin [here](https://frontend-tools.coherent-labs.com/gameface-vite-plugin/getting-started/).
