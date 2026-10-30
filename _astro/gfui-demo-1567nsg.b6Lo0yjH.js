import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { G as GridTile, a as Grid } from './Grid.DLhAKtEP.js';
import { B as Block } from './Block.Me0smBbc.js';
import './LayoutBase.CNacoN_g.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';
import './supportsGamefaceFeature.92YPCua1.js';
import './gamefaceVersion.ACI438bm.js';

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
