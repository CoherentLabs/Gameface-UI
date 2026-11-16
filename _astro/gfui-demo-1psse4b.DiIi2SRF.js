import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { A as Absolute } from './Absolute.0UkUtT-_.js';
import { B as Block } from './Block.CLwnscjE.js';
import './LayoutBase.H5ylNxTU.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';

const _1psse4b = (root) => render(() => createComponent(Absolute, {
  top: "50px",
  right: "50px",
  get children() {
    return createComponent(Block, {
      children: "Content with top and right offset by 50px"
    });
  }
}), root);

export { _1psse4b as default };
