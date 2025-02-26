# Tabs Component

## Overview

The `Tabs` component provides tab-switching functionality by using a context to manage state. It works in conjunction with two child components:

- `Tab`: Wraps the content of each tab and displays it only when its associated tab is active.
- `TabLink`: Renders a clickable element that switches the active tab when clicked.

You can also nest Tabs or generate them dynamically, and you can run custom logic before or after a tab change.

**Note:** The `Tabs` component does not render an HTML element. 

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
| `default` | `string` | `undefined` | Specifies the default active tab. The value must match the location of one of the `Tab` components. |
| `ref` | `TabsComponentRef` | `undefined` | A reference to the component that gives you access to its methods (e.g., to switch tabs from your code). |
| `onBeforeTabChange` | `async (currentLocation?: string) => void` | `undefined` | Callback invoked right before the Tab changes. It receives the current location before the change. |
| `onTabChanged` | `async (newLocation?: string) => void` | `undefined` | Callback invoked right after the Tab changes. It receives the new location after the change. |

### Methods
|Method |Parameters |Return Value |Description |
|---|---|---|---|
| `changeTab` | `newTab`: string  | `void` | Switches the active tab programmatically. This method is accessed via the component’s `ref`. |

## Guide

### Changing active tab Programmatically

You can change tabs via code by using the `changeTab` method exposed through a component reference. Here’s how:

1. Declare a variable to hold the ref but don't initialize it with a value.
2. The declared value should have a type of `TabsComponentRef`, which you need to import.
3. Set the declared variable as the value of the `ref` prop of the `Tabs` component.
4. Call the `changeTab` method from the `ref`.

#### Example
```tsx
import Tabs, { TabsComponentRef } from '@components/Layout/Tabs/Tabs'
import Button from '@components/Layout/Button/Button';
import Tabs from '@components/Layout/Tabs/Tabs'
import Tabs from '@components/Layout/Tab/Tab'
import TabLink from '@components/Layout/TabLink/TabLink'
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';

const App = () => {
    let tabsRef!: TabsComponentRef;

    const goToTab = () => {
        // Programmatically change the active tab.
        tabsRef.changeTab('Online');
    };

    return (
        <>
            <Button size="small" click={goToTab}>Go To Tab</Button>
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
        </>
    );
};

export default App;
```

## Nested Tabs

You can nest `Tabs` inside a `Tab` component to create sub-tabs for more complex UIs.

### Example

```tsx
import Tabs from '@components/Layout/Tabs/Tabs'
import Tabs from '@components/Layout/Tab/Tab'
import TabLink from '@components/Layout/TabLink/TabLink'
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';

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
                
                <Tabs default="Competetive">
                    <Flex >
                        <TabLink class={styles.link} location='Casual'>Casual</TabLink>
                        <TabLink class={styles.link} location='Competetive'>Competetive</TabLink>
                    </Flex>

                    <Tab location='Local'>
                        <Block>Casual Multiplayer</Block>
                    </Tab>
                    <Tab location='Online'>
                        <Block>Competetive Multiplayer</Block>
                    </Tab>
                </Tabs>

            </Tab>    
        </Tabs>
    );
};

export default App;
```

In this example the content inside the 'Online Multiplayer' `Tab` has a subsection which can lead the user in either casual or competetive multiplayer.  

## Dynamic Tabs

You can dynamically generate tabs by mapping over an array for example and rendering `TabLink` and `Tab` components with matching location props.

### Example

```tsx
import Tabs from '@components/Layout/Tabs/Tabs'
import Tabs from '@components/Layout/Tab/Tab'
import TabLink from '@components/Layout/TabLink/TabLink'
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';

const App = () => {
    const array = Array.from({ length: 10 }, (_, index) => index);
    return (
        <Tabs default={'location0'}>
            <For each={array}>{(element, i) =>
                <>
                    <TabLink location={`location${i()}`}>
	                    <Block style={buttonStyle}>{element}</Block>
                    </TabLink>
                    <Tab location={`location${i()}`}>
	                    <Block>tab {i()}</Block>
	                </Tab>
                </>
            }</For>
        </Tabs>
    );
};

export default App;
```

In this example we are dynamically generating 10 different `TabLink` and `Tab` components with the `location` prop being generated dynamically as well!

## Executing logic before or after tab change

You can run custom logic just before or after a tab change by supplying callbacks via the `onBeforeTabChange` and `onTabChanged` props.

* `onBeforeTabChange`: Called right before the tab changes.
* `onTabChanged`: Called immediately after the tab changes.

These functions can be both synchronous or asynchronous.

### Example (Synchronous)
```tsx
import Tabs from '@components/Layout/Tabs/Tabs'
import Tabs from '@components/Layout/Tab/Tab'
import TabLink from '@components/Layout/TabLink/TabLink'
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';

const App = () => {

    const beforeTabChanged = (currentLocation?: string) => {
        console.log(`Location before change: ${currentLocation}`)
    }

    const afterTabChanged = (newLocation?: string) => {
        console.log(`Location after change: ${newLocation}`)
    }

    return (
        <Tabs onBeforeTabChange={beforeTabChanged} oonTabChanged={afterTabChanged} default='Local'>
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

With this setup, if you change the Tabs back and forth by clicking on the `TabLink` elements, you will see log messages such as:

```log
Location before change: Local
Location after change: Online
Location before change: Online
Location after change: Local
```

### Example (Asynchronous)

With the `onBeforeTabChange` and `onTabChanged` props you can run asynchronous logic such as fetching data from the server before or after a tab has changed. To do so, you need to provide an async function as callback.

```tsx
import Tabs from '@components/Layout/Tabs/Tabs'
import Tabs from '@components/Layout/Tab/Tab'
import TabLink from '@components/Layout/TabLink/TabLink'
import Block from '@components/Layout/Block/Block';
import Flex from '@components/Layout/Flex/Flex';

const App = () => {

    const beforeTabChanged = async (currentLocation?: string) => {
        console.log(`Location before change: ${currentLocation}`)
        // Simulate fetching data or another async operation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Data fatched!')
    }

    const afterTabChanged = (newLocation?: string) => {
        console.log(`Location after change: ${newLocation}`)
    }

    return (
        <Tabs onBeforeTabChange={beforeTabChanged} onTabChanged={afterTabChanged} default='Local'>
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

With this setup, if you change the Tabs back and forth by clicking on the `TabLink` elements, you will see log messages such as:

```log
Location before change: Local
Data fatched!
Location after change: Online
Location before change: Online
Data fatched!
Location after change: Local
```