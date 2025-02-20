# Tab Component

## Overview

The `Tab` component conditionally renders its content based on the active tab state managed by the parent `Tabs` component. Each `Tab` is assigned a unique `location` prop, and only the `Tab` whose location matches the currently active tab will display its content. The `Tab` component shouldn't be used outside of the `Tabs` component.

## Usage 

To use the tab system, wrap your tab links and tab content with the `Tabs` component. Assign a unique `location` string to each Tab and its corresponding `TabLink`. Optionally, set a default tab using the `default` prop.

```tsx
import Tabs from '@components/Layout/Tabs/Tabs'
import Tabs from '@components/Layout/Tab/Tab'
import TabLink from '@components/Layout/TabLink/TabLink'
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';
import styles from './App.module.css';

const App = () => {
    return (
        <Tabs default='Local'>
            <Flex >
                <TabLink class={styles.link} location='Local'>Local</TabLink>
                <TabLink class={styles.link} location='Online'>Online</TabLink>
            </Flex>
            <Tab location='Local'>
                <Block>Local Multiplayer</Block>
            </Tab>
            <Tab location='Online'>
                <Block>Online Multiplayer</Block>
            </Tab>    
        </Tabs>
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
| `ref` | `BaseComponentRef` | `undefined` | A reference to the component that gives you access to its methods and the underlying HTML element. Useful if you need to control scrolling programmatically. |
| `location` | `string` | `undefined` | A unique identifier for the tab. This value must match the `location` prop of a corresponding `TabLink` component to correctly associate the tab with its trigger. Only the `Tab` with a `location` matching the active tab state in the `Tabs` component will be displayed. |
| `keepInMemory` | `boolean` | `false` | A `boolean`  flag specifying whether the content of the Tab should be preserved in memory. Use this option if you want to improve scripting performance at the cost of increased memory usage and initial load time. Keep in mind that when this option is set to true, the content of the Tab will be initialized in memory upon component mount, even if the Tab is never rendered. |

## Guide

### Store Tab content in memory

If you want to optimize tab switching and reduce scripting time, you can enable the `keepInMemory` flag for individual tabs. This ensures that the `Tab`'s children are stored in memory upon component mount, regardless of whether the `Tab` has been rendered. This is especially useful if the `Tab` contains complex components.

#### Example

```tsx
import Tabs from '@components/Layout/Tabs/Tabs'
import Tabs from '@components/Layout/Tab/Tab'
import TabLink from '@components/Layout/TabLink/TabLink'
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';
import styles from './App.module.css';

const App = () => {
    return (
        <Tabs default='Local'>
            <Flex >
                <TabLink class={styles.link} location='Local'>Local</TabLink>
                <TabLink class={styles.link} location='Online'>Online</TabLink>
            </Flex>
            <Tab keepInMemory location='Local'>
                <Block>Local Multiplayer</Block>
            </Tab>
            <Tab keepInMemory location='Online'>
                <Block>Online Multiplayer</Block>
            </Tab>    
        </Tabs>
    );
};

export default App;
```

In this example, both the "Local" and "Online" multiplayer tabs will be kept in memory, allowing for faster switching between them.