import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { R as Relative } from './Relative.fvMMsu2G.js';
import { B as Block } from './Block.JKuDRt1X.js';
import './LayoutBase.BnpdRw2f.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';

const _1lm50g8 = (root) => render(() => createComponent(Relative, {
  top: "50px",
  right: "50px",
  get children() {
    return createComponent(Block, {
      children: "Content with top and right offset by 50px"
    });
  }
}), root);

export { _1lm50g8 as default };
