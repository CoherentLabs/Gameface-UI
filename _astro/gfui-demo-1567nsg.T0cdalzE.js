import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { G as GridTile, a as Grid } from './Grid.BaELt4oI.js';
import { B as Block } from './Block.JKuDRt1X.js';
import './LayoutBase.BnpdRw2f.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
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
