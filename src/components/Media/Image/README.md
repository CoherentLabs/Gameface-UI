# Image Component

## Overview

The `Image` component is designed to render image assets in your UI, utilizing the `img` HTML element internally.

## Usage

To render an image asset in your UI, use the `Image` component as follows:

1. First, import the asset into your file:

```jsx
import MyImage from '../../assets/my-image.png';
```

2. Then, render the image using the `Image` component by setting its `src` attribute:

```jsx
<Image src={MyImage} />
```

And the full example:

```jsx
import Image from '@components/Media/Image/Image';
import MyImage from '../../assets/my-image.png';

const App = () => {
    return (
        <Image src={MyImage} style={{ width: '150px', height: '150px' }} />
    );
};

export default App;
```

### Applying styles to the component

To style the image through the `Image` component, you can use either the `class` or `style` attribute.

For inline styles, pass an object with the desired properties. For example, you can set the `width` and `height` of the image as shown [here](#usage).

However, using the `class` attribute is recommended for better performance. To use the `class` attribute, create a CSS file defining the image styles and apply them to the `Image` component:

**MyImage.module.css:**

```css
.my-image {
    width: 150px;
    height: 150px;
}
```

```jsx
import Image from '@components/Media/Image/Image';
import MyImage from '../../assets/my-image.png';
import styles from './MyImage.module.css';

const App = () => {
    return (
        <Image src={MyImage} class={styles['my-image']} />
    );
};

export default App;
```
