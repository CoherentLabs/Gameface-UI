# Gameface UI project template

## Creating a view

To create a new view, follow the structure of `src/views/hud` or `src/views/menu`. Start by making a new folder `src/views/${viewName}`, and within it, include `index.html`, `index.tsx`, `index.css`, and `${viewName}.tsx` files.

## Build & run the project in production

To create a production build, run `npm run build` from this folder. This will generate a production build within the `dist` directory.

Each view located in `src/views` will be built into `dist/${viewName}`. For instance, `src/views/hud` will be built in `dist/hud`.

To run the project, open the specific view by loading the `index.html` in the corresponding `dist/${viewName}` directory. For example, to load the hud view, open `dist/hud/index.html`.

## Run in development

To start the project in development mode, run `npm run dev` from this folder. This will start a server on `localhost:${port}`, typically on port `3000`.

To view a specific page during development, navigate to the following URL, for example: `http://localhost:3000/hud/` to load the hud view.

With the development server running, HOT module replacement will be enabled, so any changes you make will immediately be reflected.

## SVG components

Working with inline SVGs is beneficial when you need to modify them at runtime, such as changing the `fill` of a `path` element. Gameface UI facilitates this process, making it straightforward.

You can import any SVG as either a component or an image. Importing an SVG as a component allows you to access its DOM elements and make changes programmatically.

### Using SVG as component

Let's use the following SVG located at `assets/icon.svg`:

```jsx
<svg width="1041" height="1093" viewBox="0 0 1041 1093" fill="none">
    <path id="1" d="M1035.89 625.051L412.595 4.74938L7.43612 64.5186L450.156 706.635L1034.54 628.858L1035.89 625.051Z" fill="white" stroke="#666666" stroke-width="8"/>
    <path id="2" d="M877.305 1088.51L1034.62 628.829L451.771 707.409L384.432 1088.51L877.305 1088.51Z" fill="white" stroke="#666666" stroke-width="8"/>
</svg>
```

This SVG contains `path` elements with ids `1` and `2`, which we will use to access and modify these elements.

To import the SVG as a component, use the standard import syntax with the `?component-solid` postfix:

```jsx
import Icon from '../../assets/icon.svg?component-solid';
```

By using the `?component-solid` postfix, Gameface UI will inline the SVG into the DOM tree during the build process.

**Note:** If you import the SVG without the `?component-solid` postfix, it will resolve to the asset's URL. You can then render it using an `img` tag with the URL as the `src` attribute. However, this method does not allow runtime modifications to the SVG.

```jsx
import icon from '../../assets/icon.svg';

const Hud = () => {
    return (
        <img src={icon} />
    );
}
```

Once imported, you can render the SVG component within your view:

```jsx
import Icon from '../../assets/icon.svg?component-solid';

const Hud = () => {
    return (
        <Icon />
    );
}
```

This approach will inline the `Icon` directly into the HTML when building the UI.

### Modify SVG elements at runtime

Since the SVG is rendered as a solid component, you can access its DOM properties and children, allowing for runtime modifications.

To achieve this, add a reference to the SVG component and apply the desired changes:

```jsx
import Icon from '../../assets/icon.svg?component-solid';

const Hud = () => {
    let ref: SVGSVGElement;

    return (
        <Icon ref={ref!} />
    );
}
```

For example, to change the fill color of the `path` element with id `1`:

```jsx
import Icon from '../../assets/icon.svg?component-solid';

const Hud = () => {
    let ref: SVGSVGElement;

    onMounted(() => {
        setTimeout(() => {
            const path1 = ref.querySelector('#1') as SVGPathElement;
            path1.setAttribute('fill', 'red');
        }, 500);
    });

    return (
        <Icon ref={ref!} />
    );
}
```

This code will change the fill color of the `path` element with id `1` to red, 500ms after the `Hud` component has been mounted.
