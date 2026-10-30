import { r as render, c as createComponent } from './web.fJ3rGgJk.js';
import { F as Flex } from './Flex.DSQIqgjA.js';
import { B as Block } from './Block.Me0smBbc.js';
import './LayoutBase.CNacoN_g.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';
import './supportsGamefaceFeature.92YPCua1.js';
import './gamefaceVersion.ACI438bm.js';

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
