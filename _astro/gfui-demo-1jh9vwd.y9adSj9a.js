import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { F as Flex } from './Flex.DmNeaI0S.js';
import { B as Block } from './Block.CkY4DVWC.js';
import './LayoutBase.YBdG0cVn.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';
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
