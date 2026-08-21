import { c as createComponent, r as render } from './web.BgHhn69X.js';
import { B as Button } from './Button.BTMKj5lc.js';
import './BaseComponent.DR8Y59bT.js';
import './store.DVrtUaE7.js';

const styles = {
	"rounded-button": "_rounded-button_1b1g2_1"
};

const RoundedButton = (props) => {
  props.class = props.class ? `${styles["rounded-button"]} ${props.class}` : styles["rounded-button"];
  return createComponent(Button, props);
};

const _1a65jly = (root) => render(() => [createComponent(RoundedButton, {
  disabled: true,
  size: "large",
  children: "Large button"
}), createComponent(RoundedButton, {
  size: "middle",
  children: "Button with middle size"
}), createComponent(RoundedButton, {
  size: "small",
  children: "Small size button"
}), createComponent(RoundedButton, {
  textFit: false,
  size: "small",
  children: "Small size button with no fitting the text"
})], root);

export { _1a65jly as default };
