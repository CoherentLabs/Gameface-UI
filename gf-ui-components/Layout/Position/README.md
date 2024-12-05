# Position Component

## Overview

The `Position` component is a structural element designed to wrap content and position it precisely, independent of the normal document structure. It simplifies specifying the position of an element manually by providing predifined locations. For specific component movement by coordinates, use the `Absolute` component. 

By default, the `Position` component, just like the `Absolute` component, positions its content relative to the closest `Relative` component parent. If no `Relative` component is present, it positions relative to the body.

## Usage 

The primary use case for the `Position` component is to quickly position elements relative to their parent container. The component lets you specify the desired position by using the `top`, `left`, `right`, `bottom`, and `center`  properties or combining them.

```tsx
import Relative from 'gf-ui-components/Layout/Relative/Relative';
import Position from 'gf-ui-components/Layout/Position/Position';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Relative style={{width: '50vw', height: '50vh'}}>
            <Position top right>
                <Block>Content placed on the top right</Block>
            </Position>
            <Position center>
                <Block>Content placed in the center</Block>
            </Position>
        </Relative>

        <Position bottom left>
            <Block>Content placed in the bottom left of the body</Block>
        </Position>
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
| `ref` | `LayoutBaseRef` | `undefined` | Retrieves the component's DOM element and assigns it to a variable. The HTML element can be accessed using the `element` property of the returned ref object. |
| `top` | `boolean` | `false` | Aligns the element to the top of the container. |
| `bottom` | `boolean` | `false` | Aligns the element to the bottom of the container. |
| `left` | `boolean` | `false` | Aligns the element to the left of the container. |
| `right` | `boolean` | `false` | Aligns the element to the right of the container. |
| `center` | `boolean` | `false` | Aligns the element to the center of the container. |

## Guide

### Positioning Elements

The primary purpose of the `Position` component is to simplify positioning content. To achieve optimal control, it is recommended to nest the `Position` component within a `Relative` component. This allows the `Relative` component to act as a bounding box, ensuring the `Position` component is positioned relative to it rather than the document or screen.

#### Example

```tsx
import Relative from 'gf-ui-components/Layout/Relative/Relative';
import Position from 'gf-ui-components/Layout/Position/Position';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Relative style={{width: '50vw', height: '50vh'}}>
            <Position top right>
                <Block>Content placed on the top right</Block>
            </Position>
            <Position bottom center>
                <Block>Content placed on the bottom center</Block>
            </Position>
            <Position center>
                <Block>Content placed in the center</Block>
            </Position>
        </Relative>
    );
};

export default App;
```

### Stretching Component to fill the container

By providing the opposite directions either `top bottom` or `left right`, you can extend the `Position` component to stretch either from top to bottom or left to right

#### Example

```tsx
import Relative from 'gf-ui-components/Layout/Relative/Relative';
import Position from 'gf-ui-components/Layout/Position/Position';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Relative style={{width: '50vw', height: '50vh'}}>
            <Position top bottom>
                <Block>Takes the whole height</Block>
            </Position>
            <Position left right>
                <Block>Takes the whole width</Block>
            </Position>
        </Relative>
    );
};

export default App;
```

### Accessing the HTML element

To access the HTML DOM element of the `Position` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `LayoutBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Position` component

#### Example

```tsx
import Position from 'gf-ui-components/Layout/Position/Position';
import Block from 'gf-ui-components/Layout/Block/Block';
import { LayoutBaseRef } from 'gf-ui-components/Layout/LayoutBase';

const App = () => {
    let positionRef!: LayoutBaseRef;

    return (
        <Position ref={positionRef} top right>
            <Block>Aligned to the top-right corner</Block>
        </Position>
    );
};

export default App;
```

Now you can access the HTML element of `positionRef` with `positionRef.element` and make modifications to it if needed. 