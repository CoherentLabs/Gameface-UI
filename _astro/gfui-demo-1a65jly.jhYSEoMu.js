import { c as createComponent, r as render } from './web.ibFHgs_k.js';
import { B as Button } from './Button.Bt2yARSH.js';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';

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
