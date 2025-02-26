# MaskImage Component

## Overview

The `MaskImage` component allows you to create a container with an image that will be used as a mask layer over the content inside the component. It supports images in `.png`, `.jpg`, or `.svg` formats that can be imported directly from your assets folder.

## Usage

The `MaskImage` component is used to wrap other UI elements, masking them with an image. All the content inside the component will be visible in the colored area of the image.

To use the component, import it and set the `src` attribute to a valid URL of the image to be used as a mask. If no other `options` are specified, the content will be masked with the original dimensions of the mask image without repeating it. Note that the mask size is different from the container size. To set the dimensions of the `MaskImage` container, use either the `style` or `class` attributes. To set the mask size, use the `size` property within the `options` object, for example, `options={{ size: 'contain' }}`.

```jsx
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';

const App = () => {
    return (
        <MaskImage src={Mask} options={{ size: 'contain' }} style={{ width: '150px', height: '150px' }}>
            <div>Masked content</div>
        </MaskImage>
    );
};

export default App;
```

In this example, the `MaskImage` component wraps the `<div>Masked content</div>` and masks it with the image. The container has a width and height of `150px`. The `options` attribute sets the mask image to fit inside the container, regardless of its original size. The mask image source is specified by importing the image file via `import Mask from '../../assets/mask.png';`.

## API

### Props

| Prop Name | Type | Default | Description |
|---|---|---|---|
| `style` | `JSX.CSSProperties` | `{}` | Inline styles to apply directly to the component's root element. |
| `class` | `string` | `""` | Additional CSS classes to apply to the component. |
| `ref` | `BaseComponentRef` | `undefined` | Retrieves the component's DOM element and assigns it to a variable. The HTML element can be accessed using the `element` property of the returned ref object. |
| `src` | `string` | `undefined` | The URL source of the mask image. |
| `options` | `{ repeat?: ImageRepeat; size?: ImageSize; position?: ImagePosition; }` | `undefined` | Configures the mask image. You can set whether the mask repeats (default is no repeat), its size, and its position. For more information, check the [options object properties](#options-object-properties). |

### `options` object properties

| Prop Name | Accepted values | Default | Description |
|---|---|---|---|
| `repeat` | `'both' \| 'x' \| 'y'` | None | Specifies whether the mask image should repeat. By default, it does not repeat. If set to `both`, the mask repeats on both the `x` and `y` axes. If set to `x`, it repeats on the `x` axis, and if set to `y`, it repeats on the `y` axis. |
| `size` | `'contain' \| 'cover' \| any valid [mask size](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-size) string` | None | By default, the mask image is rendered at its original size. This property can be used to adjust the size using `contain` or `cover` values, or any valid string for the `mask-size` property. |
| `position` | Any valid combination of `top`, `center`, `bottom`, `left`, `right` values or a valid [mask-position](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-position) string | None | Sets the position of the mask image inside the container. The default is `top left`. |

## Guide

### Loading an image as a mask

To use an image as a mask with the `MaskImage` component, import the component and set the `src` attribute to the image URL:

```jsx
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';

const App = () => {
    return (
        <MaskImage src={Mask}>
            <div>Masked content</div>
        </MaskImage>
    );
};

export default App;
```

### Setting the size of the mask image container

To define the size of the mask image container, use either the `style` or `class` attributes. The example below shows how to set the `width` and `height` of the container to `150px` using the `style` attribute:

```jsx
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';

const App = () => {
    return (
        <MaskImage src={Mask} style={{ width: '150px', height: '150px' }}>
            <div>Masked content</div>
        </MaskImage>
    );
};

export default App;
```

Since the `style` attribute is defined with an object, you can easily reuse this object across different `MaskImage` components if they need to have the same size. This pattern can also be applied to the `options` attribute, as it also accepts an object value:

```jsx
import { JSX } from 'solid-js';
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';

const App = () => {
    const maskStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <MaskImage src={Mask} style={maskStyle}>
            <div>Masked content 1</div>
        </MaskImage>
        <MaskImage src={Mask} style={maskStyle}>
            <div>Masked content 2</div>
        </MaskImage>
    );
};

export default App;
```

If the component's styles are static and won't change at runtime, using the `class` attribute is recommended for better performance:

**App.module.css:**

```css
.mask-image {
    width: 150px;
    height: 150px;
}
```

```jsx
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';
import styles from './App.module.css';

const App = () => {
    return (
        <MaskImage src={Mask} class={styles['mask-image']}>
            <div>Masked content</div>
        </MaskImage>
    );
};

export default App;
```

### Setting the mask image size

After defining the container size, you can set the mask image size using the `options.size` property. This property accepts `'contain'`, `'cover'`, or any valid `mask-size` CSS value, such as `100px 100px` or `100%`. For more details, refer to the [mask-size documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-size). The example below shows two containers with different mask sizes: one using `contain` and the other with a custom size.

```jsx
import { JSX } from 'solid-js';
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';

const App = () => {
    const maskStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <MaskImage src={Mask} options={{ size: 'contain' }} style={maskStyle}>
            <div>Masked content 1</div>
        </MaskImage>
        <MaskImage src={Mask} options={{ size: '100px 100px' }} style={maskStyle}>
            <div>Masked content 2</div>
        </MaskImage>
    );
};

export default App;
```

In the second container, the mask image will have a `width` and `height` of `100px`, making the mask smaller than the container's `150px` dimensions.

### Repeating the mask image

By default, the `MaskImage` component applies the mask image without repeating it. If the image is smaller than the container, only a single instance of the mask image will be used to mask the content. To change this behavior and repeat the mask image, you can use the `options.repeat` property with one of the following values:

1. `'x'` - Repeat on the horizontal axis.
2. `'y'` - Repeat on the vertical axis.
3. `'both'` - Repeat on both axes.

```jsx
import { JSX } from 'solid-js';
import { ImageBaseOptions } from '@components/Media/ImageBase/ImageBase';
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';

const App = () => {
    const maskSize: ImageBaseOptions = { size: '100px 100px' };
    const maskStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <MaskImage src={Mask} options={{ ...maskSize, repeat: 'x' }} style={maskStyle}>
            <div>Masked content 1</div>
        </MaskImage>
        <MaskImage src={Mask} options={{ ...maskSize, repeat: 'y' }} style={maskStyle}>
            <div>Masked content 2</div>
        </MaskImage>
        <MaskImage src={Mask} options={{ ...maskSize, repeat: 'both' }} style={maskStyle}>
            <div>Masked content 3</div>
        </MaskImage>
    );
};

export default App;
```

In this example, we reuse common options for all the `MaskImage` components by setting the `maskSize` variable. Note that it is preferred to set the type of `maskSize` to `ImageBaseOptions` to take advantage of autocompletion for available options when using VSCode with the TypeScript plugin.

### Positioning the mask image

By default, the `MaskImage` component positions the mask image starting from the top-left edge of the container. You can change this behavior using the `options.position` property, which accepts any valid mask position string. For more details, refer to the [mask-position documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-position).

The following example demonstrates positioning the mask using the `top`, `left`, `right`, `bottom` presets, and a custom value for the `position` option:

```jsx
import { JSX } from 'solid-js';
import { ImageBaseOptions } from '@components/Media/ImageBase/ImageBase';
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';

const App = () => {
    const maskSize: ImageBaseOptions = { size: '100px 100px' };
    const maskStyle: JSX.CSSProperties = { width: '150px', height: '150px' };

    return (
        <MaskImage src={Mask} options={{ ...maskSize, position: 'top left' }} style={maskStyle}>
            <div>Masked content 1</div>
        </MaskImage>
        <MaskImage src={Mask} options={{ ...maskSize, position: 'center right' }} style={maskStyle}>
            <div>Masked content 2</div>
        </MaskImage>
        <MaskImage src={Mask} options={{ ...maskSize, position: 'bottom center' }} style={maskStyle}>
            <div>Masked content 3</div>
        </MaskImage>
    );
};

export default App;
```

### Accessing the HTML element

To access the HTML DOM element of the `MaskImage` component:

1. Declare a variable to hold the ref without initializing it.
2. The variable should be of type `BaseComponentRef`, which you need to import.
3. Set the declared variable as the value of the `ref` prop of the `MaskImage` component.

```tsx
import MaskImage from '@components/Media/MaskImage/MaskImage';
import Mask from '../../assets/mask.png';
import { BaseComponentRef } from '@components/types/ComponentProps';

const App = () => {
    let ref!: BaseComponentRef;

    return (
        <MaskImage src={Mask} ref={ref}>
            <div>Masked content</div>
        </MaskImage>
    );
};

export default App;
```

You can now access the HTML element of `MaskImage` using `ref.element` and make modifications as needed.
