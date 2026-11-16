import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { a as Grid } from './Grid.B0ORts3A.js';
import { B as Block } from './Block.CLwnscjE.js';
import './LayoutBase.H5ylNxTU.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
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
