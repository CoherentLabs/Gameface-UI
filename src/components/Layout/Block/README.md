# Block Component

## Overview

The `Block` component is a structural element designed to act as an element container. The `Block` component is meant to be used as a wrapper of your other components for logical or styling purposes.

## Usage 

The default use case for the `Block` component is as an element container.

```tsx
import Bottom from '@components/Layout/Bottom/Bottom';
import Block from '@components/Layout/Block/Block';

const App = () => {
    return (
        <Block>
            <Bottom>Bottom Content</Bottom>
        </Block>
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

## Guide

### Accessing the HTML element

To access the HTML DOM element of the `Block` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `BaseComponentRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Block` component

#### Example

```tsx
import Bottom from '@components/Layout/Bottom/Bottom';
import Block from '@components/Layout/Block/Block';
import { BaseComponentRef } from '@components/types/ComponentProps';

const App = () => {
    let BlockRef!: BaseComponentRef

    return (
        <Block ref={BlockRef}>
            <Bottom>Bottom Section</Bottom>
        </Block>
    );
};
```

Now you can access the HTML element of `Block` with `BlockRef.element` and make modifications to it if needed. 