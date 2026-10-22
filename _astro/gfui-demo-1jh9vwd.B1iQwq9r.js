import { r as render, c as createComponent } from './web.PcCDJqbu.js';
import { F as Flex } from './Flex.5ir57tMk.js';
import { B as Block } from './Block.JKuDRt1X.js';
import './LayoutBase.BnpdRw2f.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
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
