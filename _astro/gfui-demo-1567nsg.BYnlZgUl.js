import { r as render, c as createComponent } from './web.bikURqO-.js';
import { G as GridTile, a as Grid } from './Grid.BGW1pRfE.js';
import { B as Block } from './Block.D0mtNQi7.js';
import './LayoutBase.Crrr9d-c.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';
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
