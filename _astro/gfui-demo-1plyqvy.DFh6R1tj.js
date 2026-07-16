import { C as useContext, g as getNextElement, i as insert, n as createRenderEffect, p as className, s as style, t as template, y as getNextMarker, c as createComponent, q as delegateEvents, a as createSignal, b as createMemo, j as createEffect, k as on, o as onMount, u as use, z as Show, w as runHydrationEvents, D as createContext, r as render } from './web.DT9QqbDn.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.D7hEHUQ6.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.dZiros1M.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import './store.CXp9XCH2.js';

const checkbox = "_checkbox_13s4o_1";
const control = "_control_13s4o_7";
const before = "_before_13s4o_20";
const disabled = "_disabled_13s4o_25";
const indicator = "_indicator_13s4o_32";
const checked = "_checked_13s4o_47";
const styles = {
	checkbox: checkbox,
	control: control,
	before: before,
	disabled: disabled,
	indicator: indicator,
	checked: checked
};

var _tmpl$$2 = /* @__PURE__ */ template(`<div>`);
const Indicator = createTokenComponent();
const CheckboxIndicator = (props) => {
  const checkboxContext = useContext(CheckboxContext);
  const IndicatorToken = useToken(Indicator, props.parentChildren);
  return (() => {
    var _el$ = getNextElement(_tmpl$$2);
    insert(_el$, () => IndicatorToken()?.children);
    createRenderEffect((_p$) => {
      var _v$ = `${styles.indicator} ${checkboxContext?.checked() ? styles.checked : ""} ${IndicatorToken()?.class || ""}`, _v$2 = IndicatorToken()?.style || {};
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const Control = createTokenComponent();
const CheckboxControl = (props) => {
  const ControlToken = useToken(Control, props.parentChildren);
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    insert(_el$, () => ControlToken()?.children, _el$3, _co$);
    insert(_el$, createComponent(CheckboxIndicator, {
      get parentChildren() {
        return ControlToken()?.children;
      }
    }), _el$5, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = `${styles.control} ${props.before ? styles.before : ""} ${ControlToken()?.class || ""}`, _v$2 = ControlToken()?.style || {};
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/><!$><!/><!$><!/>`);
const Label = createTokenComponent();
const CheckboxContext = createContext();
const Checkbox = (props) => {
  const LabelToken = useToken(Label, props.children);
  const [checked, setChecked] = createSignal(props.checked ?? false);
  const isBefore = createMemo(() => LabelToken()?.before);
  let element;
  const checkboxClasses = createMemo(() => {
    const classes = [styles.checkbox];
    if (props.disabled) {
      if (props["class-disabled"]) classes.push(`${styles.disabled} ${props["class-disabled"]}`);
      else classes.push(styles.disabled);
    }
    if (checked() && props["class-checked"]) {
      classes.push(`${props["class-checked"]}`);
    }
    return classes.join(" ");
  });
  props.componentClasses = () => checkboxClasses();
  const toggle = () => {
    if (props.disabled) return;
    setChecked((prev) => !prev);
    props.onChange?.(checked());
  };
  createEffect(on(checked, (v) => {
    props.onChange?.(v);
  }, {
    defer: true
  }));
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      checked,
      value: props.value,
      setChecked,
      element
    });
  });
  return createComponent(CheckboxContext.Provider, {
    value: {
      checked
    },
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$3] = getNextMarker(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$4] = getNextMarker(_el$8.nextSibling);
      _el$.$$click = toggle;
      use(navigationActions, _el$, () => mergeNavigationActions(props, {
        "select": toggle
      }));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(Show, {
        get when() {
          return isBefore();
        },
        get children() {
          return LabelToken()?.children;
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(CheckboxControl, {
        get parentChildren() {
          return props.children;
        },
        get before() {
          return isBefore();
        }
      }), _el$5, _co$2);
      insert(_el$, createComponent(Show, {
        get when() {
          return !LabelToken();
        },
        get children() {
          return props.children;
        }
      }), _el$7, _co$3);
      insert(_el$, createComponent(Show, {
        get when() {
          return !isBefore();
        },
        get children() {
          return LabelToken()?.children;
        }
      }), _el$9, _co$4);
      runHydrationEvents();
      return _el$;
    }
  });
};
const Checkbox$1 = Object.assign(Checkbox, {
  Label,
  Control,
  Indicator
});
delegateEvents(["click"]);

const _1plyqvy = (root) => render(() => [createComponent(Checkbox$1, {
  value: "v-sync",
  children: "V-Sync"
}), createComponent(Checkbox$1, {
  value: "fullscreen",
  checked: true,
  children: "Fullscreen Mode"
}), createComponent(Checkbox$1, {
  value: "motion blur",
  checked: true,
  children: "Motion Blur"
}), createComponent(Checkbox$1, {
  value: "anti-aliasing",
  children: "Anti-Aliasing"
})], root);

export { _1plyqvy as default };
