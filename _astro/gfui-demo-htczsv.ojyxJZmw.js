import { r as render, c as createComponent, g as getNextElement, t as template } from './web.BVcuNnQ8.js';
import { I as InlineTextBlock } from './InlineTextBlock.Dz1vm3nC.js';
import './BaseComponent.DPzDIAqq.js';
import './store.BQv4smX3.js';

var _tmpl$ = /* @__PURE__ */ template(`<img width=50 height=50 src=https://images.pexels.com/photos/7623316/pexels-photo-7623316.jpeg>`);
const htczsv = (root) => render(() => createComponent(InlineTextBlock, {
  get children() {
    return ["Text with ", getNextElement(_tmpl$), " image."];
  }
}), root);

export { htczsv as default };
