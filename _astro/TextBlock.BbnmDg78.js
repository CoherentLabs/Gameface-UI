import { g as getNextElement, u as use, i as insert, t as template } from './web.e96V-LtU.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.BmESB2kC.js';

var _tmpl$ = /* @__PURE__ */ template(`<p>`);
const TextBlock = (props) => {
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

export { TextBlock as T };
