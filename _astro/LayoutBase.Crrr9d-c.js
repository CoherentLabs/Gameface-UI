import { g as getNextElement, u as use, i as insert, t as template } from './web.bikURqO-.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.C3DpOC_C.js';

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const LayoutBase = (props) => {
  const navConfig = () => {
    if (!props.onAction && !props.anchor) return void 0;
    return {
      anchor: props.anchor,
      ...props.onAction
    };
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    use(navigationActions, _el$, () => navConfig());
    use(baseComponent, _el$, () => props);
    use((el) => {
      if (!props.ref) return;
      if (props.refObject) {
        props.ref({
          ...props.refObject,
          element: el
        });
      } else {
        props.ref(el);
      }
    }, _el$);
    insert(_el$, () => props.children);
    return _el$;
  })();
};

export { LayoutBase as L };
