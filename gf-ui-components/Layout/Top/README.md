# Top Component

## Overview

The `Top` component is a structural element designed to act as a wrapper of the top-level elements in your page. The `Top` component is meant to be used as a wrapper of your top menus, navigation bars, etc. Typically, the `Top` component is used alongside the `Content` and `Bottom` components to achieve better page structure.

## Usage 

The primary use case for the `Top` component is as a top level section container.

```tsx
import Layout from 'gf-ui-components/Layout/Layout/Layout';
import Top from 'gf-ui-components/Layout/Top/Top';
import Content from 'gf-ui-components/Layout/Content/Content';
import Bottom from 'gf-ui-components/Layout/Bottom/Bottom';

const App = () => {
    return (
        <Layout>
            <Top style={{ display: 'flex', flexDirection: 'column', height: '20vh' }}>Top Menu</Top>
            <Content>Main Content</Content>
            <Bottom>Bottom Section</Bottom>
        </Layout>
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

### Accessing the HTML element

To access the HTML DOM element of the `Top` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `BasicBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Top` component

#### Example

```tsx
import Layout from 'gf-ui-components/Layout/Layout/Layout';
import Top from 'gf-ui-components/Layout/Top/Top';
import Content from 'gf-ui-components/Layout/Content/Content';
import Bottom from 'gf-ui-components/Layout/Bottom/Bottom';
import { BasicBaseRef } from 'gf-ui-components/types/ComponentProps';

const App = () => {
    let topRef!: BasicBaseRef

    return (
        <Layout ref={topRef}>
            <Top ref={topRef}>Top Section</Top>
            <Content>Main Content</Content>
            <Bottom>Bottom Section</Bottom>
        </Layout>
    );
};
```

Now you can access the HTML element of `topRef` with `topRef.element` and make modifications to it if needed.
