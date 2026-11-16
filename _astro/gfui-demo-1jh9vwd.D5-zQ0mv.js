import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { F as Flex } from './Flex.mF9WS-00.js';
import { B as Block } from './Block.CLwnscjE.js';
import './LayoutBase.H5ylNxTU.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
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
