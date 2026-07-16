import { r as render, c as createComponent } from './web.e96V-LtU.js';
import { F as Flex } from './Flex.CpSggdCw.js';
import { B as Block } from './Block.BLGOfwhy.js';
import './LayoutBase.D9nt2oGz.js';
import './BaseComponent.BmESB2kC.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';
import './supportsGamefaceFeature.ByqsM1VI.js';

const _1jh9vwd = (root) => render(() => createComponent(Flex, {
  direction: "row",
  wrap: "wrap",
  "justify-content": "space-between",
  "align-items": "center",
  gap: "1vmax",
  style: {
    height: "100vh"
  },
  get children() {
    return [createComponent(Block, {
      children: "Item 1"
    }), createComponent(Block, {
      children: "Item 2"
    }), createComponent(Block, {
      children: "Item 3"
    })];
  }
}), root);

export { _1jh9vwd as default };
