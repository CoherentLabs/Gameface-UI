# BackgroundImage Component

## Overview

The `BackgroundImage` component allows you to create a container with an image as its background. It supports images in `.png`, `.jpg`, or `.svg` formats that can be imported directly from your assets folder.

## Usage

The `BackgroundImage` component is used to wrap other UI elements, applying a background image behind them. To use the component, import it and set the `src` attribute to a valid URL of the image to be used as the background. If no other `options` are specified, the background will be rendered with its original dimensions without repeating. Note that the background size is different from the container size. To set the dimensions of the `BackgroundImage` container, use either the `style` or `class` attributes. To set the background size inside the container, use the `size` property within the `options` object, for example, `options={{ size: 'contain' }}`.

```jsx
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';

const App = () => {
    return (
        <BackgroundImage src={Background} options={{ size: 'contain' }} style={{ width: '150px', height: '150px' }} >
            <div>Content</div>
        </BackgroundImage>
    );
};

export default App;
```

In this example, the `BackgroundImage` component wraps the `<div>Content</div>` with a background image. The container has a width and height of `150px`. The `options` attribute sets the background image to fit inside the container, regardless of its original size. The background image source is specified by importing the image file via `import Background from '../../assets/bg.png';`.

## API

### Props

| Prop Name | Type | Default | Description |
|---|---|---|---|
| `style` | `JSX.CSSProperties` | `{}` | Inline styles to apply directly to the component's root element. |
| `class` | `string` | `""` | Additional CSS classes to apply to the component. |
| `ref` | `BaseComponentRef` | `undefined` | Retrieves the component's DOM element and assigns it to a variable. The HTML element can be accessed using the `element` property of the returned ref object. |
| `src` | `string` | `undefined` | The URL source of the background image. |
| `options` | `{ repeat?: ImageRepeat; size?: ImageSize; position?: ImagePosition; }` | `undefined` | Configures the background image. You can set whether the background repeats (default is no repeat), its size, and its position. For more information, check the [options object properties](#options-object-properties). |

### `options` object properties

| Prop Name | Accepted values | Default | Description |
|---|---|---|---|
| `repeat` | `'both' \| 'x' \| 'y'` | None | Specifies whether the background image should repeat. By default, it does not repeat. If set to `both`, the background repeats on both the `x` and `y` axes. If set to `x`, it repeats on the `x` axis, and if set to `y`, it repeats on the `y` axis. |
| `size` | `'contain' \| 'cover' \| any valid [background size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) string` | None | By default, the background is rendered at its original size. This property can be used to adjust the size using `contain` or `cover` values, or any valid string for the `background-size` property. |
| `position` | Any valid combination of `top`, `center`, `bottom`, `left`, `right` values or a valid [background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) string | None | Sets the position of the background image inside the container. The default is `top left`. |

## Guide

### Loading an Image as Background

To load an image as a background using the `BackgroundImage` component, import the component and set the `src` attribute to the image URL:

```jsx
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';

const App = () => {
    return (
        <BackgroundImage src={Background}>
            <div>Content</div>
        </BackgroundImage>
    );
};

export default App;
```

### Setting the size of the background image container

To set the size of the background image container, use either the `style` or `class` attributes. The following example demonstrates setting the `width` and `height` of the container to `150px` using the `style` attribute:

```jsx
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';

const App = () => {
    return (
        <BackgroundImage src={Background} style={{ width: '150px', height: '150px' }}>
            <div>Content</div>
        </BackgroundImage>
    );
};

export default App;
```

Since the `style` attribute is defined with an object, you can easily reuse this object across different `BackgroundImage` components if they need to have the same size. This pattern can also be used for the `options` attribute, as it also accepts an object value:

```jsx
import { JSX } from 'solid-js';
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';

const App = () => {
    const bgStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <BackgroundImage src={Background} style={bgStyle}>
            <div>Content 1</div>
        </BackgroundImage>
        <BackgroundImage src={Background} style={bgStyle}>
            <div>Content 2</div>
        </BackgroundImage>
    );
};

export default App;
```

However, if the styles of the component are static and will not change at runtime, it is recommended to use the `class` attribute for better performance:

**App.module.css:**

```css
.bg-image {
    width: 150px;
    height: 150px;
}
```

```jsx
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';
import styles from './App.module.css';

const App = () => {
    return (
        <BackgroundImage src={Background} class={styles['bg-image']}>
            <div>Content</div>
        </BackgroundImage>
    );
};

export default App;
```

### Setting the size of the background image

After setting the container size, you can define the background image size within it using the `options.size` property. This property accepts the strings `'contain'` or `'cover'`, or any valid string for the `background-size` CSS property, such as `100px 100px` or `100%`. For a complete list of valid values, refer to the [background-size documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size). The following example demonstrates two background image containers: one with the size set to `contain` and another with a custom size.

```jsx
import { JSX } from 'solid-js';
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';

const App = () => {
    const bgStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <BackgroundImage src={Background} options={{ size: 'contain' }} style={bgStyle}>
            <div>Content 1</div>
        </BackgroundImage>
        <BackgroundImage src={Background} options={{ size: '100px 100px' }} style={bgStyle}>
            <div>Content 2</div>
        </BackgroundImage>
    );
};

export default App;
```

In the second container, the background image will have a `width` and `height` of `100px`, making it smaller than the container's `150px` dimensions. This ensures the entire image is visible within the container.

### Repeating the background image

By default, the `BackgroundImage` component renders the background image without repeating it. If the image is smaller than the container, only a single instance of the image will be shown. To change this behavior and repeat the background image, you can use the `options.repeat` property with one of the following values:

1. `'x'` - Repeat on the horizontal axis.
2. `'y'` - Repeat on the vertical axis.
3. `'both'` - Repeat on both axes.

```jsx
import { JSX } from 'solid-js';
import { ImageBaseOptions } from '@components/Media/ImageBase/ImageBase';
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';

const App = () => {
    const bgSize: ImageBaseOptions = { size: '100px 100px' };
    const bgStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <BackgroundImage src={Background} options={{ ...bgSize, repeat: 'x' }} style={bgStyle}>
            <div>Content 1</div>
        </BackgroundImage>
        <BackgroundImage src={Background} options={{ ...bgSize, repeat: 'y' }} style={bgStyle}>
            <div>Content 2</div>
        </BackgroundImage>
        <BackgroundImage src={Background} options={{ ...bgSize, repeat: 'both' }} style={bgStyle}>
            <div>Content 3</div>
        </BackgroundImage>
    );
};

export default App;
```

Here, we also reused common options for all the `BackgroundImage` components by setting the `bgSize` variable. **Note** that it is preferred to set the type of `bgSize` to `ImageBaseOptions`. This allows you to take advantage of autocompletion for available options when using VSCode with the TypeScript plugin.

### Positioning the background image

By default, the `BackgroundImage` component positions the image starting from the top-left edge of the container. You can change this behavior using the `options.position` property, which accepts any valid background position string. For more details, refer to the [background-position documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position).

The following example demonstrates positioning the background using the `top`, `left`, `right`, `bottom` presets, and a custom value for the `position` option:

```jsx
import { JSX } from 'solid-js';
import { ImageBaseOptions } from '@components/Media/ImageBase/ImageBase';
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';

const App = () => {
    const bgSize: ImageBaseOptions = { size: '100px 100px' };
    const bgStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <BackgroundImage src={Background} options={{ ...bgSize, position: 'top left' }} style={bgStyle}>
            <div>Content 1</div>
        </BackgroundImage>
        <BackgroundImage src={Background} options={{ ...bgSize, position: 'center right' }} style={bgStyle}>
            <div>Content 2</div>
        </BackgroundImage>
        <BackgroundImage src={Background} options={{ ...bgSize, position: 'bottom center' }} style={bgStyle}>
            <div>Content 3</div>
        </BackgroundImage>
    );
};

export default App;
```

### Accessing the HTML element

To access the HTML DOM element of the `BackgroundImage` component:

1. Declare a variable to hold the ref without initializing it.
2. The variable should be of type `BaseComponentRef`, which you need to import.
3. Set the declared variable as the value of the `ref` prop of the `BackgroundImage` component.

```tsx
import BackgroundImage from '@components/Media/BackgroundImage/BackgroundImage';
import Background from '../../assets/bg.png';
import { BaseComponentRef } from '@components/types/ComponentProps';

const App = () => {
    let ref!: BaseComponentRef;

    return (
        <BackgroundImage src={Background} ref={ref}>
            <div>Content</div>
        </BackgroundImage>
    );
};

export default App;
```

You can now access the HTML element of `BackgroundImage` using `ref.element` and make modifications as needed.
