# Column Component

## Overview

The `Column` components are structural elements designed to create grid layouts when used in conjunction with the Row component. Each `Column` component represents a fraction of the row's width, ranging from `Column1` (1/12th of the row's width) to `Column12` (the entire row's width).

These components leverage a flexbox-based grid system, making it easy to create responsive layouts.

## Usage 

The primary use case for the `Column` components is to define the width of content within a `Row` component. If you don't specify a number `<Column>` equals `<Column12>`.

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
        <Row>
            <Column>I also take the full row</Column>
        </Row>
    );
};

export default App;
```

You can also nest rows and columns to create more complex layouts.

```tsx
import Row from 'gf-ui-components/Layout/Row/Row';
import { Column, Column6 } from 'gf-ui-components/Layout/Column/Column'

const App = () => {
    return (
        <Row>
            <Column6>
                <Row>
                    <Column>Nested column</Column> 
                </Row>
            </Column6>
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

The `Column` components define the width of their content within a Row. The predefined components (`Column1` to `Column12`) correspond to fractions of the row's total width. For example:

- `Column1`: 1/12th of the row's width (8.33333%).
- `Column6`: Half of the row's width (50%).
- `Column12`: Full row width (100%).

#### Example
```tsx
import Row from 'gf-ui-components/Layout/Row/Row';
import { Column1, Column6 } from 'gf-ui-components/Layout/Column/Column'

const App = () => {
    return (
        <Row>
            <Column1>I take 8.33333% of the row</Column1>
            <Column1>I take 8.33333% of the row</Column1>
            <Column1>I take 8.33333% of the row</Column1>
            <Column1>I take 8.33333% of the row</Column1>
            <Column1>I take 8.33333% of the row</Column1>
            <Column1>I take 8.33333% of the row</Column1>
            <Column6>I take 50% of the row</Column6>
        </Row>
        <Row>
            <Column12>I take 100% of the row</Column12>
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
    let columnRef!: BasicBaseRef

    return (
        <Row>
            <Column ref={columnRef}>I take 2/12 of the row</Column>
        </Row>
    );
};

export default App;
```

Now you can access the HTML element of `columnRef` with `columnRef.element` and make modifications to it if needed. 