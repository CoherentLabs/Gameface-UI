# EventBus

## Overview

The `EventBus` is a utility class that allows components to communicate with each others. It can be used to send and receive events across components without having to pass props down the component tree.

## Usage

The `EventBus` class can be imported and used in any component.

```tsx
import eventBus from '@components/tools/EventBus/EventBus';

const Button = () => {
    const handleClick = () => {
        eventBus.emit('button-clicked', 'Button was clicked');
    };

    return (
        <button onClick={handleClick}>Click Me</button>
    );
};

export default Button;
```

```tsx
import { onMount } from "solid-js";
import Button from './Button';
import eventBus from '@components/tools/EventBus/EventBus';

const App = () => {
    const handleClickButton = (data: string) => {
        console.log(data);
    };

    onMount(() => {
        eventBus.on('button-clicked', handleClickButton);
    });

    onCleanup(() => {
        eventBus.off('button-clicked', handleClickButton);
    });

    return (
        <Button />
    );
};

export default App;
```

## API

### Types

#### `EventCallback`

The `EventCallback` type is a function that is called when an event is emitted.

```tsx
type EventCallback = (...args: any[]) => any;
```

#### `LogLevel`

The `LogLevel` type represents the log level of the event bus.

```tsx
type LogLevel = 'warn' | 'none';
```

### Methods

#### `emit`

The `emit` method is used to send an event to all listeners.

```tsx
eventBus.emit(eventName: string, ...args: any[]): void
```

| Parameter   | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `eventName` | `string` | The name of the event to emit               |
| `...args`   | `any[]`  | The arguments data to send to the listeners |

#### `on`

The `on` method is used to listen for an event.

```tsx
eventBus.on(eventName: string, callback: EventCallback): void
```

| Parameter   | Type                  | Description                                    |
| ----------- | --------------------- | ---------------------------------------------- |
| `eventName` | `string`              | The name of the event to listen for            |
| `callback`  | `EventCallback`       | The function to call when the event is emitted |

#### `off`

The `off` method is used to stop listening for an event.

```tsx
eventBus.off(eventName: string): void
```

| Parameter   | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `eventName` | `string` | The name of the event to stop listening for |

#### `hasRegistered`

The `hasRegistered` method is used to check if an event has been registered or has a specific callback.

```tsx
eventBus.hasRegistered(eventName: string, callback?: EventCallback): boolean
```

| Parameter   | Type                  | Description                                    |
| ----------- | --------------------- | ---------------------------------------------- |
| `eventName` | `string`              | The name of the event to listen for            |
| `callback`  | `EventCallback`       | The function to call when the event is emitted |

### Properties

#### `logLevel`

The `logLevel` property is used to set the log level of the event bus.

```tsx
eventBus.logLevel: LogLevel
```

The default log level is `'warn'`. To disable warning logs, set the `logLevel` property to `'none'`.

```tsx
eventBus.logLevel = 'none';
```

## Guide

### Listening for an event

To listen for an event, use the `on` method of the `EventBus` class.

```tsx
const callback = (data: string) => {
    console.log(data);
};

onMount(() => {
    eventBus.on('button-clicked', callback);
});
```

### Emitting an event

To emit an event, use the `emit` method of the `EventBus` class.

```tsx
const handleClick = () => {
    eventBus.emit('button-clicked');
};
```

### Cleaning up

To stop listening for an event, use the `off` method of the `EventBus` class.

```tsx
const callback = (data: string) => {
    console.log(data);
};

onMount(() => {
    eventBus.on('button-clicked', callback);
});

onCleanup(() => {
    eventBus.off('button-clicked', callback);
});
```

### Multiple listeners

You can have multiple listeners for the same event.

```tsx
const callback = (data: string) => {
    console.log(data);
};

const callback2 = (data: string) => {
    console.log(data);
};

onMount(() => {
    eventBus.on('button-clicked', callback);
    eventBus.on('button-clicked', callback2);
});

onCleanup(() => {
    eventBus.off('button-clicked', callback);
    eventBus.off('button-clicked', callback2);
});
```

### Listen once

You can listen for an event only once.

```tsx
onMount(() => {
    eventBus.once('button-clicked', (data: string) => {
        console.log(data);
    });
});
```

Here the callback will be called only once when the event is emitted. This is very convinient when you want to use arrow functions as they will be **automatically removed**.

### Checking if an event has been registered

You can check if an event has been registered or has a specific callback via `hasRegistered` method of the `EventBus` class.

By checking if an event has been registered, you can:

* Avoid registering the same event with the same callback multiple times.

```tsx
const callback = (data: string) => {
    console.log(data);
};

onMount(() => {
    if (!eventBus.hasRegistered('button-clicked', callback)) {
        eventBus.on('button-clicked', callback);
    }
});
```

* Avoid emitting an event if not registered.

```tsx
const handleClick = () => {
    if (eventBus.hasRegistered('button-clicked')) {
        eventBus.emit('button-clicked', 'Button was clicked');
    }
};
```

* Cleaning up an event listener if it has been registered.

```tsx
const callback = (data: string) => {
    console.log(data);
};

onMount(() => {
    if (eventBus.hasRegistered('button-clicked', callback)) {
        eventBus.off('button-clicked', callback);
    }
});
```

If you omit checking that event has been registered and something went wrong, `EventBus` will log a warning message to the console.

### Additional notes

Always remember to clean up your event listeners to prevent memory issues and potential bugs.
