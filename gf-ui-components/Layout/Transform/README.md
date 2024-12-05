# Transform Component

## Overview

The `Transform` component is a versatile utility component designed for applying CSS transformations such as `translate`, `rotate`, `scale`, and `skew`. It also allows you to define a `transform-origin`, specifying the point from which transformations originate. The `Transform` component is ideal for creating dynamic visual effects, animations, and 3D interactions.

## Usage 

The `Transform` component can be used to apply individual `translate`, `rotate`, `scale`, or `skew` transformation or a combination of them with the `matrix` property.

```tsx
import Content from 'gf-ui-components/Layout/Content/Content';
import Transform from 'gf-ui-components/Layout/Transform/Transform';

const App = () => {
    return (
        <Content>
            <Transform rotate={{z: 15}} origin="top right">
                Rotated by 15°, originating from the top right corner of the element.
            </Transform>
            <Transform matrix={{ translate: {x: 15}, skew: {x: 15}, scale: {x: 1.5, y: 1.5} }} >
                Moved to the right by 15px, skewed by 15deg and increased the width and height of the element by 1.5
            </Transform>
        </Content>
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
| `translate` | `{ x?: number; y?: number; z?: number; }` | `undefined` | Moves the element along the x, y, or z axis in `pixels`. For example, `{ x: 50 }` translates the element 50px to the right. |
| `rotate` | `{ x?: number; y?: number; z?: number; }` | `undefined` | Rotates the element around the x, y, or z axis in `degrees`. For example, `{ z: 45 }` rotates the element 45° around the z-axis. |
| `scale` | `{ x?: number; y?: number; z?: number; }` | `undefined` | Scales the element along the x, y, or z axis. For example, `{ x: 1.5 }` increases the width of the element by 50%. |
| `skew` | `{ x?: number; y?: number; }` | `undefined` | Skews the element along the x or y axis in degrees. For example, `{ x: 15 }` skews the element 15° along the x-axis. |
| `matrix` | `{ translate?: {...}; rotate?: {...}; scale?: {...}; skew?: {...}; }` | `undefined` | Defines a custom transformation matrix as a combination of multiple transformations. |
| `origin` | `"top"`, `"center"`, `"bottom"`, `"right"`, `"left"`, `{ x?: string; y?: string; z?: string }` | `undefined` | Defines the `transform-origin` property, specifying the point of origin for transformations. It can accept preset values, combination of 2 values like: `top left`, `top right`, etc.  or custom coordinates as an object (e.g., `{ x: '50%', y: '50%', z: '0' }`). |

## Guide

### Applying Transformations

The Transform component lets you apply transformations such as `translation`, `rotation`, `scaling`, and `skewing`. These can be specified individually or combined using the matrix prop. Keep in mind that you must use the `matrix` property to apply 2 or more transformations at once

```tsx
import Layout3D from 'gf-ui-components/Layout/Layout3D/Layout3D';
import Content from 'gf-ui-components/Layout/Content/Content';
import Transform from 'gf-ui-components/Layout/Transform/Transform';

const App = () => {
    return (
        <Layout3D distance="2500px">
            <Transform translate={{ x: 100, z: -50 }}>
                Translated by 100px on the x axis and -50px away from the 3D scene.
            </Transform>
        </Layout3D>
        <Content>
            <Transform matrix={{ translate: {x: 15}, skew: {x: 15}, scale: {x: 1.5, y: 1.5} }} >
                Moved to the right by 15px, skewed by 15deg and increased the width and height of the element by 1.5.
            </Transform>
        </Content>
    );
};

export default App;
```

### Changing the origin of transformation

You can define an `origin` for transformations, specifying where the transformations originate. This can be set using presets like `center` or custom coordinates for more control

```tsx
import Content from 'gf-ui-components/Layout/Content/Content';
import Transform from 'gf-ui-components/Layout/Transform/Transform';

const App = () => {
    return (
        <Content>
            <Transform rotate={{ z: 45 }} origin="top left">
                Rotated around the top-left corner
            </Transform>
        </Content>
    );
};

export default App;
```

For more control:

```tsx
import Content from 'gf-ui-components/Layout/Content/Content';
import Transform from 'gf-ui-components/Layout/Transform/Transform';

const App = () => {
    return (
        <Content>
            <Transform rotate={{ z: 45 }} origin={{ x: '10%', y: '100%' }} >
                Rotated around the top-left corner with 10% offset to the right
            </Transform>
        </Content>
    );
};

export default App;
```

The second origin is almost the same as the first one, with the difference being that it starts 10% to the right from the top-left corner.

### Accessing the HTML element

To access the HTML DOM element of the `Transform` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `LayoutBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Transform` component

#### Example

```tsx
import Transform from 'gf-ui-components/Layout/Transform/Transform';
import Block from 'gf-ui-components/Layout/Block/Block';
import { LayoutBaseRef } from 'gf-ui-components/Layout/LayoutBase';

const App = () => {
    let transformRef!: LayoutBaseRef;

    return (
        <Transform ref={transformRef} translate={{ x: 100 }}>
            <Block>Element with translation</Block>
        </Transform>
    );
};

export default App;
```

Now you can access the HTML element of `transformRef` with `transformRef.element` and make modifications to it if needed. 

