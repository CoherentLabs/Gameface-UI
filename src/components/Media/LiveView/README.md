# LiveView Component

## Overview

The `LiveView` component enables embedding dynamic textures rendered by Unreal into the UI. For more details on live views, refer to our Unreal documentation [here](https://docs.coherent-labs.com/unreal-gameface/advanced-features/texturesinui/liveviews/).

## Usage

To render a live view in your UI, use the `LiveView` component as shown below:

```jsx
import LiveView from '@components/Media/LiveView/LiveView';

const App = () => {
    return (
        <LiveView src={'TextureRenderTarget2D\'/Game/LiveViews/LiveViewRT.LiveViewRT\''} style={{ width: '150px', height: '150px' }} />
    );
};

export default App;
```

### Styling the Component

You can style the `LiveView` component using either the `class` or `style` attribute.

For inline styles, pass an object with the desired properties. For example, you can set the `width` and `height` of the image as shown [here](#usage).

However, for better performance, it is recommended to use the `class` attribute. To do this, create a CSS file with the desired styles and apply them to the `LiveView` component:

**MyLiveView.module.css:**

```css
.my-live-view {
    width: 150px;
    height: 150px;
}
```

```jsx
import LiveView from '@components/Media/LiveView/LiveView';
import styles from './MyLiveView.module.css';

const App = () => {
    return (
        <LiveView src={'TextureRenderTarget2D\'/Game/LiveViews/LiveViewRT.LiveViewRT\''} class={styles['my-live-view']} />
    );
};

export default App;
```
