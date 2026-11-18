# Solid Style to CSS Plugin

The `solid-style-to-css` plugin, found in the `vite-custom-plugins` directory, is designed to convert the `style={{}}` properties into CSS class names. This plugin extracts styles from the `style`, generates unique class names, and moves the styles into a CSS file (for production builds) or a style block (during development). This optimization improves performance by minimizing inline styles and utilizing CSS for better caching and reusability.

You can read the full documentation for the plugin [here](https://frontend-tools.coherent-labs.com/vite-solid-style-to-css-plugin/getting-started/).
