# Layout3D Component

## Overview

The `Layout3D` component is a structural element designed to act as a container for 3D transformations. It sets up a 3D scene by defining a `distance` property, which controls the perspective. This perspective determines how far the user is from the z-plane of the 3D scene, affecting how 3D transformations appear.

## Usage 

The default use case for the `Layout` component is as a container for 3D scenes. It pairs seamlessly with the `Transform` component to apply 3D transformations.

```tsx
import Layout3D from 'gf-ui-components/Layout/Layout3D/Layout3D';
import Transform from 'gf-ui-components/Layout/Transform/Transform';

const App = () => {
    return (
        <Layout3D distance='2500px'>
            <Transform matrix={{
                scale={x: 2, z: 2},
                translate={z: 150}
            }}>Element scaled by 2 by the x and y axes and translated towards the user by 150px. 
            </Transform>
        </Layout3D>
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
| `distance` | `string` | `0` | Defines the perspective distance (z-plane to user). Use valid CSS unit values (e.g., `px`, `em`, `%`). |

## Guide

### Setting Up a 3D Scene

The `Layout3D` component is the foundational container for 3D scenes. By specifying the `distance` prop, you control the perspective effect. Combine it with the `Transform` component to achieve dynamic 3D transformations.

```tsx
import Layout3D from 'gf-ui-components/Layout/Layout3D/Layout3D';
import Transform from 'gf-ui-components/Layout/Transform/Transform';

const App = () => {
    return (
        <Layout3D distance="1200px">
            <Transform matrix={{
                rotate: { y: 45 },
                translate: { z: -200 }
            }}>
                Rotated by 45° on the y-axis and moved 200px away from the user.
            </Transform>
        </Layout3D>
    );
};

export default App;
```

### Accessing the HTML element

To access the HTML DOM element of the `Layout3D` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `BasicBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Layout3D` component

#### Example

```tsx
import Layout3D from 'gf-ui-components/Layout/Layout3D/Layout3D';
import Transform from 'gf-ui-components/Layout/Transform/Transform';
import { BasicBaseRef } from 'gf-ui-components/types/ComponentProps';

const App = () => {
    let layout3DRef!: BasicBaseRef

    return (
        <Layout3D ref={layout3DRef} distance='2500px'>
            <Transform matrix={{
                scale={x: 2, z: 2},
                translate={z: 150}
            }}>Element scaled by 2 by the x and y axes and translated towards the user by 150px. 
            </Transform>
        </Layout3D>
    );
};

export default App;
```

Now you can access the HTML element of `Layout3D` with `layout3DRef.element` and make modifications to it if needed. 

