import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { a as Grid } from './Grid.DLhAKtEP.js';
import { B as Block } from './Block.Me0smBbc.js';
import './LayoutBase.CNacoN_g.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';
import './supportsGamefaceFeature.92YPCua1.js';
import './gamefaceVersion.ACI438bm.js';

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
