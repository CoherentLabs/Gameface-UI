# GridTile Component

## Overview

The `GridTile` component is content wrapper component made to be used only within the `Grid` component. It is used to specify on which row and column the content inside it should be placed on the `Grid`.

## Usage 

The `GridTile` component must be provided with the specific row and column through the `rows` and `cols` props. You can dynamically move, remove and replace the tile in specific cells using the provided methods.

```tsx
import Grid from 'gf-ui-components/Layout/Grid/Grid';
import GridTile from 'gf-ui-components/Layout/GridTile/GridTile';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    return (
        <Grid cols={3} rows={3} >
            <GridTile row={2} col={2}><Block>Placed in row 2 column 2</Block></GridTile>
            <GridTile row={3} col={2}><Block>Placed in row 3 column 2</Block></GridTile>
            <GridTile row={3} col={3}><Block>Placed in row 3 column 3</Block></GridTile>
        </Grid>
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
| `ref` | `BasicBaseRef` | `undefined` | Retrieves the `GridTile`'s properties, methods and HTML element and assigns them to a local variable |
| `row` | `number` | `Required` | The row index where the tile will be placed. |
| `col` | `number` | `Required` | The column  index where the tile will be placed. |

### Methods
|Method |Parameters |Return Value |Description |
|---|---|---|---|
| `moveTile` | `newRow`: number, `newCol`: number | `void` | Moves the tile to a different place on the grid. Will throw an error if the row and column don't exist. |
| `removeItem` | `void` | `void` | Removes the tile from the grid. Will throw an error if the row and column don't exist. |
| `replaceTile` | `newTile`: JSX.ELement | `void` | Inserts new content on the place of the tile. Will throw an error if the row and column don't exist. |

## Guide

### Dynamically Updating the GridTile 

The `GridTile` component provides methods to dynamically move, remove and replace the component. These methods can be accessed via the `ref` prop. 

The steps to achieve it are as follows:

1. Declare a variable to hold the ref but don't initialize it with a value
2. The declared value should have a type of `GridRef`, which you need to import
3. Set the declared variable as the value of the `ref` prop of the `Grid` component
4. Call the methods from the `ref`

#### Example
```tsx
import Grid from 'gf-ui-components/Layout/Grid/Grid';
import GridTile { GridTileRef } from 'gf-ui-components/Layout/GridTile/GridTile';
import Block from 'gf-ui-components/Layout/Block/Block';

const App = () => {
    let gridTileRef!: GridTileRef;

    const replaceTile = () => {
        const newBlock = (<Block>New</Block>)
        gridTileRef.replaceTile(1, 1, newBlock);
    }

    const moveTile = () => {
        gridRef.moveTile(1, 1);
    }

    return (
        <Grid ref={gridTileRef} cols={3} rows={3} >
            <GridTile row={2} col={2}><Block>Placed in row 2 column 2</Block></GridTile>
        </Grid>
        <Block click={replaceTile}>Replace Tile</Block>
        <Block click={moveTile}>Move Tile</Block>
    );
};

export default App;
```