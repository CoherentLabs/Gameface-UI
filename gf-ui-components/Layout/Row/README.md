# Row Component

## Overview

The `Row` component is a structural wrapper designed to be used to define a row in the layout where `Column` components will be used. It uses a flexbox-based layout system to create responsive rows of content.

## Usage 

The primary use case for the `Row` component is as a container for `Column` components, enabling the creation of grid-like structures.

```tsx
import Row from 'gf-ui-components/Layout/Row/Row';
import { Column2, Column10, Column12 } from 'gf-ui-components/Layout/Column/Column'

const App = () => {
    return (
        <Row>
            <Column2>I take 2/12 of the row</Column2>
            <Column10>I take 10/12 of the row</Column10>
        </Row>
        <Row>
            <Column12>I take the full row</Column12>
        </Row>
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
| `ref` | `BasicBaseRef` | `undefined` | Retrieves the component's DOM element and assigns it to a variable. The HTML element can be accessed using the `element` property of the returned ref object. |

## Guide

### Creating a Grid Layout

The `Row` component is designed to work seamlessly with `Column` components, where the `Row` acts as a horizontal container and the `Columns` define their widths. This makes it easy to create grid-like layouts for various use cases such as cards, forms, or responsive layouts.

#### Example
```tsx
import Row from 'gf-ui-components/Layout/Row/Row';
import { Column2, Column10, Column12 } from 'gf-ui-components/Layout/Column/Column'

const App = () => {
    return (
        <Row>
            <Column2>I take 2/12 of the row</Column2>
            <Column10>I take 10/12 of the row</Column10>
        </Row>
        <Row>
            <Column12>I take the full row</Column12>
        </Row>
    );
};

export default App;
```

### Accessing the HTML element

To access the HTML DOM element of the `Row` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `BasicBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Row` component

#### Example

```tsx
import { BasicBaseRef } from 'gf-ui-components/types/ComponentProps';
import Row from 'gf-ui-components/Layout/Row/Row';
import { Column } from 'gf-ui-components/Layout/Column/Column'

const App = () => {
    let rowRef!: BasicBaseRef;

    return (
        <Row ref={rowRef}>
            <Column>I take 2/12 of the row</Column>
        </Row>
    );
};

export default App;
```

Now you can access the HTML element of `rowRef` with `rowRef.element` and make modifications to it if needed. 