import { r as render, c as createComponent } from './web.ibFHgs_k.js';
import { G as GridTile, a as Grid } from './Grid.D30mfugK.js';
import { B as Block } from './Block.DzhU8s7j.js';
import './LayoutBase.DEk-c953.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';
import './supportsGamefaceFeature.ByqsM1VI.js';

const _1567nsg = (root) => render(() => createComponent(Grid, {
  cols: 3,
  rows: 3,
  get children() {
    return [createComponent(GridTile, {
      row: 2,
      col: 2,
      get children() {
        return createComponent(Block, {
          children: "Placed in row 2 column 2"
        });
      }
    }), createComponent(GridTile, {
      row: 3,
      col: 2,
      get children() {
        return createComponent(Block, {
          children: "Placed in row 3 column 2"
        });
      }
    }), createComponent(GridTile, {
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

export { _1567nsg as default };
