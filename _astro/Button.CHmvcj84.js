import { m as mergeProps, f as createMemo, g as getNextElement, u as use, i as insert, t as template } from './web.bikURqO-.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.C3DpOC_C.js';

const button = "_button_19d2e_1";
const styles = {
	button: button,
	"button-text-fit": "_button-text-fit_19d2e_8",
	"button-small": "_button-small_19d2e_11",
	"button-middle": "_button-middle_19d2e_16",
	"button-large": "_button-large_19d2e_21",
	"button-disabled": "_button-disabled_19d2e_26"
};

var _tmpl$ = /* @__PURE__ */ template(`<button>`);
const buttonSizes = /* @__PURE__ */ new Set(["large", "middle", "small"]);
const getButtonClasses = (props) => {
  const buttonClasses = [styles.button];
  if (props.textFit) buttonClasses.push(styles[`button-text-fit`]);
  if (props.disabled) buttonClasses.push(styles[`button-disabled`]);
  if (!props.size) buttonClasses.push(styles[`button-middle`]);
  if (buttonSizes.has(props.size)) buttonClasses.push(styles[`button-${props.size}`]);
  return buttonClasses;
};
const Button = (props) => {
  const mergedProps = mergeProps({
    textFit: true
  }, props);
  props.componentClasses = createMemo(() => getButtonClasses(mergedProps).join(" "));
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    use(navigationActions, _el$, () => ({
      anchor: props.anchor,
      ...props.onAction
    }));
    use(baseComponent, _el$, () => props);
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, () => props.children);
    return _el$;
  })();
};

export { Button as B };
