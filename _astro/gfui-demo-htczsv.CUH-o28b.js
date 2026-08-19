import { r as render, c as createComponent, g as getNextElement, t as template } from './web.Dte3IpIp.js';
import { I as InlineTextBlock } from './InlineTextBlock.CFViRBE3.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';

var _tmpl$ = /* @__PURE__ */ template(`<img width=50 height=50 src=https://images.pexels.com/photos/7623316/pexels-photo-7623316.jpeg>`);
const htczsv = (root) => render(() => createComponent(InlineTextBlock, {
  get children() {
    return ["Text with ", getNextElement(_tmpl$), " image."];
  }
}), root);

export { htczsv as default };
