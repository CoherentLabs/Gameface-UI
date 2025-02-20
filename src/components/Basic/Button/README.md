# Button Component

## Overview

The `Button` component is used to create button elements in the UI.

## Usage

The `Button` component provides various configuration options to create different types of buttons. For example, you can create disabled buttons, larger or smaller buttons, rounded buttons, and more.

```tsx
import Button from '@components/Basic/Button/Button';

const App = () => {
    return (
        <>
            <Button disabled size='large'>Large button</Button>
            <Button size='middle'>Rounded button with middle size</Button>
            <Button size='small'>Small size button</Button>
            <Button textFit={false} size='small'>Small size button with no fitting the text</Button>
        </>
    );
};

export default App;
```

## API

### Props

| Prop Name  | Type                                   | Default     | Description                                                                                                                                                                                  |
| ---------- | -------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `style`    | `JSX.CSSProperties`                    | `{}`        | Inline styles to apply directly to the component's root element.                                                                                                                             |
| `class`    | `string`                               | `""`        | Additional CSS classes to apply to the component                                                                                                                                             |
| `ref`      | `HTMLButtonElement  \| undefined`      | `undefined` | Retrieves the component's DOM element and assigns it to a variable. The HTML element can be accessed directly by the ref object.                                                             |
| `disabled` | `boolean`                              | `false`     | Specify if the button is disabled                                                                                                                                                            |
| `size`     | `'large' \| 'middle' \| 'small'` | `''`        | Specify the size of the button. If an empty string is passed, the button won't have any size. In that case, please specify the size through the `class` or `style` properties. |
| `textFit`     | `boolean` | `true`        | Specify if the text inside the button should be fitted. By default, this option is **enabled**. |

## Guide

### Custom size

To customize the size of the button, you can omit the `size` property and set the desired size using the `style` property or by applying a CSS class to the button.

```tsx
import Button from '@components/Basic/Button/Button';

const App = () => {
    return (
        <Button style={{ width: '100px', height: '100px' }}>Button</Button>
    );
};

export default App;
```

### Disabling the button

It is enough to set `disabled` attribute to the button.

```tsx
import Button from '@components/Basic/Button/Button';

const App = () => {
    return (
        <Button disabled>Button</Button>
    );
};

export default App;
```

### Custom font-size

To customize the `font-size` of the text inside the button, set the `textFit` property to `false` (it is enabled by default). Then, you can specify the `font-size` using the `style` property or by applying a `class` to the button.

```tsx
import Button from '@components/Basic/Button/Button';

const App = () => {
    return (
        <Button textFit={false} style={{ fontSize: '10px' }}>Button</Button>
    );
};

export default App;
```

### Accessing the HTML element

To access the `HTML` element of the component and make other modifications, you can add a `ref` property to the button.

```tsx
import Button from '@components/Basic/Button/Button';

const App = () => {
    let ref: HTMLButtonElement;

    return (
        <Button ref={ref!} size="middle">Button</Button>
    );
};

export default App;
```
