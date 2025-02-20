# Relative Component

## Overview

The `Relative` component is a structural element designed to offset content or act as a **bounding box** for Absolute components. By applying offsets using the `top`, `left`, `right`, and `bottom` props, the `Relative` component allows precise positioning of nested content relative to its original position.

## Usage 

The primary use case for the `Relative` component is to offset nested content within the document structure or serve as a container for `Absolute` components.

```tsx
import Relative from '@components/Layout/Relative/Relative';
import Block from '@components/Layout/Block/Block';

const App = () => {
    return (
        <Relative top="50px" right="50px">
            <Block>Content with top and right offset by 50px</Block>
        </Relative>
    );
};

export default App;
```

## API

### Props
|Prop Name |Type |Default | Description |
|---|---|---|---|
| `style` | `JSX.CSSProperties` | `{}` | Inline styles to apply directly to the component's root element. |
| `class` | `string` | `""` | Additional CSS classes to apply to the component |
| `ref` | `BaseComponentRef` | `undefined` | Retrieves the component's DOM element and assigns it to a variable. The HTML element can be accessed using the `element` property of the returned ref object. |
| `top`, `left`, `right`, `bottom` | `string` | `""` | Specify the offset of the `Relative` component. It accepts any valid css unit value |

## Guide

### Offsetting content

The `Relative` component's position is controlled by its position props ( `top`, `left`, `right`, `bottom` ). Under the hood the component uses [CSS position](https://developer.mozilla.org/en-US/docs/Web/CSS/position) to offset the element. You can pass any valid CSS unit (e.g., `px`, `%`, `vh`, `em`) to these props to specify the directional offset of the component.

#### Example
```tsx
import Relative from '@components/Layout/Relative/Relative';
import Block from '@components/Layout/Block/Block';

const App = () => {
    return (
        <Relative top="15vh" right="200px">
            <Block>Content with top offset of 15vh and right offset by 50px</Block>
        </Relative>
    );
};

export default App;
```

**Important:** Since the `Relative` component uses `position: relative`, the offset applied is purely visual. The component remains part of the document flow, meaning that any subsequent content will still be positioned as if the `Relative` component occupies its original space.

If you need to remove content from the document flow entirely (e.g., for tooltips, modals, or overlays), consider using the [Absolute Component](), which positions elements relative to their closest positioned ancestor or the viewport. 

### Usage with the Absolute component

One of the main purposes of the `Relative` component is to act as the **bounding box** for nested `Absolute` components. When an `Absolute` component is used within a `Relative` component, its position is calculated relative to the `Relative` component's boundaries. This relationship ensures precise control over the placement of the `Absolute` component without affecting other elements on the page.

#### Example

```tsx
import Relative from '@components/Layout/Relative/Relative';
import Absolute from '@components/Layout/Absolute/Absolute';
import Block from '@components/Layout/Block/Block';

const App = () => {
    return (
        <Relative style={{ width: '300px', height: '200px', border: '1px solid black' }}>
            <Block>Normally positioned content</Block>
            <Absolute top="20px" left="40px">
                This content is positioned 20px from the top and 40px from the left of the Relative container.
            </Absolute>
            <Absolute bottom="0" right="0">
                Positioned at the bottom right corner of the Relative container.
            </Absolute>
        </Relative>
    );
};

export default App;
```

### Accessing the HTML element

To access the HTML DOM element of the `Relative` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `BaseComponentRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Relative` component

#### Example

```tsx
import { BaseComponentRef } from '@components/types/ComponentProps';
import Relative from '@components/Layout/Relative/Relative';
import Block from '@components/Layout/Block/Block';

let relativeRef!: BaseComponentRef

const App = () => {
    return (
        <Relative ref={relativeRef} top="50px" right="50px">
            <Block>Content with top and right offset by 50px</Block>
        </Relative>
    );
};

export default App;
```

Now you can access the HTML element of `relativeRef` with `relativeRef.element` and make modifications to it if needed. 