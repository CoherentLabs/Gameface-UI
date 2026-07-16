import { r as render, c as createComponent } from './web.ibFHgs_k.js';
import { a as Grid } from './Grid.D30mfugK.js';
import { B as Block } from './Block.DzhU8s7j.js';
import './LayoutBase.DEk-c953.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';
import './supportsGamefaceFeature.ByqsM1VI.js';

const _34wct1 = (root) => render(() => createComponent(Grid, {
  cols: 3,
  rows: 3,
  gap: "1vmax",
  style: {
    width: "30vmax",
    height: "30vmax"
  },
  get children() {
    return [createComponent(Grid.Tile, {
      row: 2,
      col: 2,
      get children() {
        return createComponent(Block, {
          children: "Placed in row 2 column 2"
        });
      }
    }), createComponent(Grid.Tile, {
      row: 3,
      col: 2,
      get children() {
        return createComponent(Block, {
          children: "Placed in row 3 column 2"
        });
      }
    }), createComponent(Grid.Tile, {
      row: 3,
      col: 3,
      get children() {
        return createComponent(Block, {
          children: "Placed in row 3 column 3"
        });
      }
    })];
  }
}), root);

export { _34wct1 as default };
