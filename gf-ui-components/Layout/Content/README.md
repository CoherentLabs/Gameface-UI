# Content Component

## Overview

The `Content` component is a structural element designed to act as a wrapper of the main section of your page. Typically, the `Content` component is used alongside the `Top` and `Bottom` components to achieve better page structure.

## Usage 

The primary use case for the `Content` component is as a container for the main content area of the page.

```tsx
import Layout from 'gf-ui-components/Layout/Layout/Layout';
import Top from 'gf-ui-components/Layout/Top/Top';
import Content from 'gf-ui-components/Layout/Content/Content';
import Bottom from 'gf-ui-components/Layout/Bottom/Bottom';

const App = () => {
    return (
        <Layout>
            <Top>Top Menu</Top>
            <Content style={{ display: 'flex', flexDirection: 'column'}}>Main Content</Content>
            <Bottom >Bottom Section</Bottom>
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

To access the HTML DOM element of the `Content` component.

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `LayoutBaseRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Content` component

#### Example

```tsx
import Layout from 'gf-ui-components/Layout/Layout/Layout';
import Top from 'gf-ui-components/Layout/Top/Top';
import Content from 'gf-ui-components/Layout/Content/Content';
import Bottom from 'gf-ui-components/Layout/Bottom/Bottom';
import { LayoutBaseRef } from 'gf-ui-components/Layout/LayoutBase';

const App = () => {
    let contentRef!: LayoutBaseRef

    return (
        <Layout ref={contentRef}>
            <Top>Top Section</Top>
            <Content ref={contentRef}>Main Content</Content>
            <Bottom>Bottom Section</Bottom>
        </Layout>
    );
};
```

Now you can access the HTML element of `contentRef` with `contentRef.element` and make modifications to it if needed. 