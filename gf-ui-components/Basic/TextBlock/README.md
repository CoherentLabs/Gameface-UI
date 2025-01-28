# TextBlock component

## Overview

The `TextBlock` component is used to render text. Internally, it simply outputs an HTML `p` element containing the text.

## Usage

Using the `TextBlock` component is simple. After importing it, you can add text as a child element.

```tsx
import TextBlock from 'gf-ui-components/Basic/TextBlock/TextBlock';

const App = () => {
    return (
        <>
            <TextBlock>
                Text content.
            </TextBlock>
        </>
    );
};

export default App;
```

## API

### Props

| Prop Name  | Type                                   | Default     | Description                                                                                                                                                                                  |
| ---------- | -------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `style`    | `JSX.CSSProperties`                    | `{}`        | Styles applied directly to the root element of the component..                                                                                                                             |
| `class`    | `string`                               | `""`        | Additional CSS classes to apply to the component.                                                                                                                                             |
| `ref`      | `HTMLButtonElement  \| undefined`      | `undefined` | Obtains the component's DOM element and assigns it to a variable, allowing direct access to the HTML element via the ref object.                                                             |

## Guide

### Accessing the HTML element

To access the HTML element of the component and make modifications, you can add a `ref` property to the text block.

```tsx
import TextBlock from 'gf-ui-components/Basic/TextBlock/TextBlock';

const App = () => {
    let ref: HTMLParagraphElement;

    return (
        <TextBlock ref={ref!}>
            Text content.
        </TextBlock>
    );
};

export default App;
```
