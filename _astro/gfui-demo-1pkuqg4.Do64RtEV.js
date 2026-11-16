import { r as render, c as createComponent } from './web.DSByG9TV.js';
import { B as Button } from './Button.B86u4I5g.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';

const _1pkuqg4 = (root) => render(() => [createComponent(Button, {
  disabled: true,
  size: "large",
  children: "Large button"
}), createComponent(Button, {
  size: "middle",
  children: "Rounded button with middle size"
}), createComponent(Button, {
  size: "small",
  children: "Small size button"
}), createComponent(Button, {
  textFit: false,
  size: "small",
  children: "Small size button with no fitting the text"
})], root);

export { _1pkuqg4 as default };
