import { r as render, c as createComponent } from './web.BgHhn69X.js';
import { B as Button } from './Button.BTMKj5lc.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';

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
