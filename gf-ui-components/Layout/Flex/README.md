# Flex Component

## Overview

The `Flex` component is a structural element designed to simplify the creation of flexible and responsive layouts. It is a wrapper that provides easy application for applying CSS flexbox properties. The Flex component supports various configurations for direction, wrapping, alignment, and spacing.

## Usage 

The primary use case for the `Flex` component is as a container for flexible and responsive layouts. It abstracts common flexbox properties into easy-to-use props.

```tsx
import Flex from 'gf-ui-components/Layout/Flex/Flex';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Flex
            direction="row"
            wrap="wrap"
            justify-content="space-between"
            align-items="center"
            style={{ height: '100vh' }}
        >
            <Block>Item 1</Block>
            <Block>Item 2</Block>
            <Block>Item 3</Block>
        </Flex>
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
| `direction` | `"row"`, `"row-reverse"`, `"column"`, `"column-reverse"` | `"row"` | Specifies the CSS `flex-direction` property, which determines the main axis direction (horizontal or vertical) and the order of items. For example, `"row"` arranges items left-to-right, while `"column-reverse"` arranges them bottom-to-top. |
| `wrap` | `"nowrap"`, `"wrap-reverse"`, `"wrap"` | `"nowrap"` | Specifies the CSS `wrap` property, which controls whether flex items wrap onto multiple lines. For example, `"wrap"` allows items to flow onto new rows or columns, while `"nowrap"` keeps them on a single line. |
| `justify-content` | `"start"`, `"center"`, `"end"`, `"space-between"`, `"space-around"` | `"start"` | Specifies the CSS `justify-content` property, which aligns items along the main axis (horizontal in row and vertical in column). Options like `"space-between"` distribute items with equal gaps, while `"center"` centers them. |
| `align-items` | `"start"`, `"center"`, `"end"`, `"stretch"` | `"stretch"` | Specifies the CSS `align-items` property, which controls the alignment of items along the cross axis (perpendicular to the main axis). For example, `"stretch"` makes all items stretch to fill the container, while `"center"` aligns them in the middle. |
| `align-content` | `"start"`, `"center"`, `"end"`, `"stretch"` | `"stretch"` | Specifies the CSS `align-content` property, which controls the spacing between rows or columns in a multi-line flex container. For example, `"space-between"` evenly distributes rows, while `"center"` aligns them in the middle of the container. |

## Guide

### Creating flexible layouts

The `Flex` component provides an intuitive API for creating flexible layouts.

#### Centering content in the middle of the Flex component

```tsx
import Flex from 'gf-ui-components/Layout/Flex/Flex';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Flex direction="column" justify-content="center" align-items="center" style={{ height: '25vh' }}>
            <Block>Item 1</Block>
            <Block>Item 2</Block>
            <Block>Item 3</Block>
        </Flex>
    );
};

export default App;
```

- `direction="column"` stacks items vertically.
- `justify-content="center"` centers items along the main axis.
- `align-items="center"` centers items along the secondary axis.

#### Distributing available space between items

```tsx
import Flex from 'gf-ui-components/Layout/Flex/Flex';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Flex justify-content="space-between" align-items="center" style={{ height: '25vh' }}>
            <Block style={{width: "20%"}} >Item 1</Block>
            <Block style={{width: "20%"}} >Item 2</Block>
            <Block style={{width: "20%"}} >Item 3</Block>
            <Block style={{width: "20%"}} >Item 4</Block>
        </Flex>
    );
};

export default App;
```

- `justify-content="space-between"` distributes available space equally between the items.
- `align-items="center"` centers items along the secondary axis.

#### Nested Flex components

To create more complex layout, you can nest as much `Flex` components as you need to achieve your desired layout. 

```tsx
import Flex from 'gf-ui-components/Layout/Flex/Flex';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Flex justify-content="space-around" align-items="start" style={{ height: '25vh' }}>
            <Flex direction="column" >
                <Block>Item 1</Block>
                <Block>Item 2</Block>
            </Flex>
            <Flex direction="column-reverse">
                <Block>Item 1</Block>
                <Block>Item 2</Block>
            </Flex>
        </Flex>
    );
};

export default App;
```

- `justify-content="space-around"` distributes available space equally around the items.
- `align-items="start"` aligns items at the start along the secondary axis.
- `direction="column"` stacks items vertically.
- `direction="column-reverse"` stacks items vertically in reverse order.

### Accessing the HTML element

To access the HTML DOM element of the `Flex` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `LayoutBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Flex` component

#### Example

```tsx
import Flex from 'gf-ui-components/Layout/Flex/Flex';
import Block from 'gf-ui-components/Layout/Block/Block';
import { LayoutBaseRef } from 'gf-ui-components/Layout/LayoutBase';

const App = () => {
    let flexRef!: LayoutBaseRef

    return (
        <Flex ref={flexRef} wrap="wrap" justify-content="space-between" align-items="center">
            <Block>Item 1</Block>
            <Block>Item 2</Block>
            <Block>Item 3</Block>
        </Flex>
    );
};
```

Now you can access the HTML element of `Flex` with `flexRef.element` and make modifications to it if needed. 

