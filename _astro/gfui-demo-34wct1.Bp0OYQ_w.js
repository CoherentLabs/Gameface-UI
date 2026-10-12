import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { a as Grid } from './Grid.BjMflxWO.js';
import { B as Block } from './Block.Rb48TZBV.js';
import './LayoutBase.-cwEytOC.js';
import './BaseComponent.Irprgzr9.js';
import './store.BnPMRy2B.js';
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
