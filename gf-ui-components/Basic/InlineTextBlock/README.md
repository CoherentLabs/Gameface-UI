# InlineTextBlock component

## Overview

The `InlineTextBlock` component is used to create a text block element that can display all its children inline. It renders a `p` element with the `cohinline` attribute, allowing you to have text with images, for example, on a single line.

## Usage

Using the `InlineTextBlock` component is straightforward. After importing it, you can include any child elements, such as text or images, inside the component.

```tsx
import InlineTextBlock from 'gf-ui-components/Basic/InlineTextBlock/InlineTextBlock';

const App = () => {
    return (
        <>
            <InlineTextBlock>
                Text with <img src="url"/> image.
            </InlineTextBlock>
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

To access the HTML element of the component and make modifications, you can add a `ref` property to the inline text block.

```tsx
import InlineTextBlock from 'gf-ui-components/Basic/InlineTextBlock/InlineTextBlock';

const App = () => {
    let ref: HTMLParagraphElement;

    return (
        <InlineTextBlock ref={ref!}>
            Text with <img src="url"/> image.
        </InlineTextBlock>
    );
};

export default App;
```
