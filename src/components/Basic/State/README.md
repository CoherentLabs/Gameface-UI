# State Component

## Overview

The `State` component allows you to define multiple UI states, with only one being rendered at a time based on the active state. This component can be used for various purposes:

* Simulating a router - Define different UI states that render based on the selected state. You can create UI elements to control the active state, and when the control changes, the `State` component updates the UI accordingly.
* Creating different states for a component - For example, you can create different crosshairs for different weapons in a game. A pistol can have a smaller crosshair, while a bazooka can have a larger one.

## Usage

The `State` component must wrap different states as child elements using the `Match` component. You can set the default state when the UI loads using the `default` attribute of the `State` component.

Each `Match` component should wrap a different state of the UI, and you need to set the `name` attribute of the `Match` component to define the name of that state. Setting `name` to `''` will be used as a fallback state if no other defined state matches during a state change.

```tsx
import State, { Match } from '@components/Basic/State/State';

const App = () => {
    return (
        <State default='state-1'>
            <Match name=''>
                Fallback
            </Match>
            <Match name='state-1'>
                State 1
            </Match>
            <Match name='state-2'>
                State 2
            </Match>
        </State>
    );
};

export default App;
```
In this case, the `State 1` text will be rendered as the `State` component will match `state-1` as the default state.

## API

### `State` Props 
| Prop Name | Type | Default | Description |
|---|---|---|---|
| `style` | `JSX.CSSProperties` | `{}` | Inline styles to apply directly to the component's root element. |
| `class` | `string` | `""` | Additional CSS classes to apply to the component. |
| `ref` | `StateComponentRef` | `undefined` | Retrieves the state's properties and methods, assigning them to a local variable. |
| `name` | `string` | `undefined` | The identifier for the state component. This name can be used to access the state component's methods later through the `states` object. |
| `default` | `string` | `undefined` | The default state to be rendered initially. |
| `onBeforeStateChange` | `(currentState?: string, nextState?: string, currentStateElement?: JSX.Element) => {}` | `undefined` | Callback invoked right before the state changes. It receives the current and next state names and the `HTML` element of the current state before the change. |
| `onStateChanged` | `(currentState?: string, prevState?:string, currentStateElement?: JSX.Element) => {}` | `undefined` | Callback invoked after the state changes. It receives the current and previous state names and the `HTML` element of the current state after the change. |

### `Match` Props 
| Prop Name | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `Required` | Specifies the name of the state to be matched. |

### `State` Methods

You can access the state methods via the `ref` of the `State` component or through the `states` object. You can see more in the guide about how to use them.

| Method | Parameters | Return Value | Description |
|---|---|---|---|
| `changeState` | `value`: string \| ((prevState: string) => string) | `void` | Changes the state of the `State` component. You can pass a string value directly or a function that has the previous state as argument and returns the new state as a string. |
| `currentState` | None | `string` | Returns the current state as a string. To get the current state, call `ref.currentState()`. |

## Guide

### Dynamically update the state through ref

To dynamically update the state of the `State` component, you need to use a ref of type `StateComponentRef`. Once you have the ref, you can use the `changeState` method to switch the active state.

```tsx
import State, { Match, StateComponentRef } from '@components/Basic/State/State';

const App = () => {
    let ref: StateComponentRef;

    const changeStateToTwo = () => {
        ref.changeState('state-2');
    };

    const changeStateToOne = () => {
        // Use a callback to access the previous state if needed
        ref.changeState((prevState) => prevState !== 'state-2' ? prevState : 'state-1');
    };

    return (
        <State default='state-1' ref={ref!}>
            <Match name='state-1'>
                <div onClick={changeStateToTwo}>State 1</div>
            </Match>
            <Match name='state-2'>
                <div onClick={changeStateToOne}>State 2</div>
            </Match>
        </State>
    );
};

export default App;
```

In this example, the `default` attribute is set on the `State` component, so `State 1` is rendered initially. The `changeState` method from the `ref` object is used to change the state. The first method demonstrates changing the state by passing the next state as a string, while the second method shows how to access the previous state before changing to the next state.

### Dynamically update state using the `states` object

The `State` component exports a `states` object that holds information for all `State` components in the UI. Only `State` components with a specified `name` attribute are included in this collection. If the `name` attribute is omitted, the component won't be added to the collection.

Accessing methods for a `State` component is easier using the `states` object compared to using `ref`. Import the `states` collection from the `State` component and access specific state methods like this: `states['state-name'].changeState`.

Here's an example of dynamically changing states via the `states` object:

```tsx
import State, { Match, states } from '@components/Basic/State/State';

const App = () => {
    const changeStateToTwo = () => {
        states['two-states'].changeState('state-2');
    };

    const changeStateToOne = () => {
        states['two-states'].changeState((prevState) => prevState !== 'state-2' ? prevState : 'state-1');
    };

    return (
        <State name='two-states' default='state-1'>
            <Match name='state-1'>
                <div onClick={changeStateToTwo}>State 1</div>
            </Match>
            <Match name='state-2'>
                <div onClick={changeStateToOne}>State 2</div>
            </Match>
        </State>
    );
};

export default App;
```

Using the `states` object, you can avoid setting the `ref` on the `State` component. Instead, set the `name` attribute to access its methods through the `states` object. Depending on your use case and preferences, you can use both `ref` and the `states` object to access `State` component methods.

The advantage of the `states` object over `ref` is that it can be imported and used throughout your project, whereas the usability of the `ref` object is limited to the file where it is set.

### Handling State Changes

To perform actions before or after the state changes, you can use the `onBeforeStateChange` and `onStateChanged` props of the `State` component. These methods accept arguments such as the current, previous, and next states, as well as the HTML element of the current state, which is the element wrapped inside the `Match` component for the current state.

Here's an enhanced example demonstrating how to use these handlers to log state changes:

```tsx
import State, { Match, StateComponentRef } from '@components/Basic/State/State';

const App = () => {
    let ref: StateComponentRef;

    const changeStateToTwo = () => {
        ref.changeState('state-2');
    };

    const changeStateToOne = () => {
        ref.changeState((prevState) => prevState !== 'state-2' ? prevState : 'state-1');
    };

    const onBeforeStateChange = (currentState?: string, nextState?: string) => console.log(`Changing from ${currentState} to ${nextState}`);
    const onStateChanged = (currentState?: string, prevState?: string) => console.log(`Changed from ${prevState} to ${currentState}`);

    return (
        <State default='state-1' onBeforeStateChange={onBeforeStateChange} onStateChanged={onStateChanged}>
            <Match name='state-1'>
                <div onClick={changeStateToTwo}>State 1</div>
            </Match>
            <Match name='state-2'>
                <div onClick={changeStateToOne}>State 2</div>
            </Match>
        </State>
    );
};

export default App;
```

With this setup, when you change the state by clicking on the `State 1` or `State 2` elements, you will see log messages such as:

```log
Changing from state-1 to state-2
Changed from state-1 to state-2
```

## Expected Behaviors

The `State` component does not support dynamically generated `Match` elements at runtime. All states must be predefined, and adding or removing states dynamically will result in undefined behavior.

Here is an incorrect example that demonstrates adding new `Match` components to the `State` component at runtime:

```tsx
const App = () => {
    const [states, updateStates] = createSignal(['1', '2', '3']);

    setInterval(() => {
        const stateName = parseInt(Math.random() * 1000) + '';
        updateStates((prev) => { prev.push(stateName); return prev; });
        stateRef.changeState(states()[stateName]);
    }, 1000);

    return (
        <State default='normal' ref={stateRef!}>
            <Match name=''>
                Fallback
            </Match>
            {states().map((state: string) => (
                <Match name={state}>
                    {state}
                </Match>
            ))}
        </State>
    );
};
```

In this example, a new state is added every 1000 milliseconds, and the `State` component attempts to switch to it. This dynamic addition of `Match` components will lead to undefined behavior and is not recommended.

## Example

Here's a minimal example demonstrating the usage of the `State` component to create a simple router with tabs and a 'router view'. The 'router view' is managed by the `State` component.

```tsx
import State, { Match, states } from '@components/Basic/State/State';

const App = () => {
    const tabs = ['page 1', 'page 2', 'page 3'];
    const changePage = (event: any) => {
        const tabName = event.currentTarget.dataset.tab;
        states['menu'].changeState(tabName);
    };

    return (
        <div className={styles.Hud}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {tabs.map((tab) => (
                    <div
                        style={{ margin: '10px', cursor: 'pointer' }}
                        data-tab={tab}
                        onClick={changePage}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <State name='menu' default='page 1'>
                <Match name=''>
                    Fallback
                </Match>
                <Match name='page 1'>
                    This is Page 1
                </Match>
                <Match name='page 2'>
                    This is Page 2
                </Match>
                <Match name='page 3'>
                    This is Page 3
                </Match>
            </State>
        </div>
    );
};

export default App;
```
