# Absolute Component

## Overview

The `Absolute` component is a structural element designed to wrap content and position it precisely, independent of the normal document structure. It is ideal for creating dynamic notifications, pop-ups, overlays, moving nameplates, and other UI elements that require precise placement.

By default, the `Absolute` component positions its content relative to the closest `Relative` component parent. If no `Relative` component is present, it positions relative to the body.

## Usage 

The primary use case for the `Absolute` component is to position nested content precisely within a document. The component lets you define offsets using the `top`, `left`, `right`, and `bottom` properties.

```tsx
import Relative from 'gf-ui-components/Layout/Relative/Relative';
import Absolute from 'gf-ui-components/Layout/Absolute/Absolute';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Relative>
            <Absolute top="50px" right="50px">
                <Block>Content with top and right offset by 50px</Block>
            </Absolute>
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
| `top`, `left`, `right`, `bottom` | `string` | `""` | Specify the position offset of the `Absolute` component. It accepts any valid css unit value |

## Guide

### Positioning the component

The primary purpose of the `Absolute` component is to position content precisely. To achieve optimal control, it is recommended to nest the `Absolute` component within a `Relative` component. This allows the `Relative` component to act as a bounding box, ensuring the `Absolute` component is positioned relative to it rather than the document or screen.

#### Example

```tsx
import Relative from 'gf-ui-components/Layout/Relative/Relative';
import Absolute from 'gf-ui-components/Layout/Absolute/Absolute';
import Block from 'gf-ui-components/Layout/Block/Block';

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

To access the HTML DOM element of the `Absolute` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `BaseComponentRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Absolute` component

#### Example

```tsx
import Relative from 'gf-ui-components/Layout/Relative/Relative';
import Absolute from 'gf-ui-components/Layout/Absolute/Absolute';
import Block from 'gf-ui-components/Layout/Block/Block';
import { BaseComponentRef } from 'gf-ui-components/types/ComponentProps';

const App = () => {
    let absoluteRef!: BaseComponentRef

    return (
        <Relative>
            <Absolute ref={absoluteRef} top="50px" right="50px">
                <Block>Content with top and right offset by 50px</Block>
            </Absolute>
        </Relative>
    );
};

export default App;
```

Now you can access the HTML element of `absoluteRef` with `absoluteRef.element` and make modifications to it if needed. 