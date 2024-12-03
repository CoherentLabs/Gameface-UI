# Layout3D Component

## Overview

The `Layout3D` component is a structural element designed to act as a page container in your application. The `Layout` component is meant to be used as a general top-level wrapper of your page.

## Usage 

The default use case for the `Layout` component is as a container for major sections of your app, such as the main content area or an overall page layout wrapper.

```tsx
import Layout from 'gf-ui-components/Layout/Layout/Layout';
import Top from 'gf-ui-components/Layout/Top/Top';
import Content from 'gf-ui-components/Layout/Content/Content';
import Bottom from 'gf-ui-components/Layout/Bottom/Bottom';

const App = () => {
    return (
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Top>Top Section</Top>
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
| `ref` | `LayoutBaseRef` | `undefined` | Retrieves the component's DOM element and assigns it to a variable. The HTML element can be accessed using the `element` property of the returned ref object. |

## Guide

### Accessing the HTML element

To access the HTML DOM element of the `Layout` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `LayoutBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Layout` component

#### Example

```tsx
import Layout from 'gf-ui-components/Layout/Layout/Layout';
import Top from 'gf-ui-components/Layout/Top/Top';
import Content from 'gf-ui-components/Layout/Content/Content';
import Bottom from 'gf-ui-components/Layout/Bottom/Bottom';
import { LayoutBaseRef } from 'gf-ui-components/Layout/LayoutBase';

const App = () => {
    let layoutRef!: LayoutBaseRef

    return (
        <Layout ref={layoutRef}>
            <Top>Top Section</Top>
            <Content>Main Content</Content>
            <Bottom>Bottom Section</Bottom>
        </Layout>
    );
};
```

Now you can access the HTML element of `Layout` with `layoutRef.element` and make modifications to it if needed. 

