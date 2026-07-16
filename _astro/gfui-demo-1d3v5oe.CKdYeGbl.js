import { C as useContext, b as createMemo, g as getNextElement, i as insert, p as createRenderEffect, q as className, s as style, t as template, v as getNextMarker, c as createComponent, z as delegateEvents, a as createSignal, k as createEffect, l as on, o as onMount, u as use, w as Show, A as runHydrationEvents, D as createContext, r as render } from './web.e96V-LtU.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.hFDI9VqW.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.BmESB2kC.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import '@solid-primitives/jsx-tokenizer';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';

const control = "_control_snxsg_7";
const disabled = "_disabled_snxsg_22";
const handle = "_handle_snxsg_29";
const indicator = "_indicator_snxsg_32";
const styles = {
	"toggle-button": "_toggle-button_snxsg_1",
	control: control,
	"label-left-enabled": "_label-left-enabled_snxsg_15",
	"label-right-enabled": "_label-right-enabled_snxsg_18",
	disabled: disabled,
	handle: handle,
	"indicator-checked": "_indicator-checked_snxsg_32",
	indicator: indicator,
	"handle-checked": "_handle-checked_snxsg_64"
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div>`);
const Indicator = createTokenComponent();
const ToggleButtonIndicator = (props) => {
  const toggleButtonContext = useContext(ToggleButtonContext);
  const IndicatorToken = useToken(Indicator, props.parentChildren);
  const indicatorClasses = createMemo(() => {
    const classes = [styles.indicator];
    if (IndicatorToken()?.class) classes.push(IndicatorToken()?.class ?? "");
    if (toggleButtonContext?.checked()) {
      classes.push(styles["indicator-checked"]);
    }
    return classes.join(" ");
  });
  const indcatorStyles = createMemo(() => {
    const styles2 = {};
    Object.assign(styles2, IndicatorToken()?.style || {});
    return styles2;
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$3);
    insert(_el$, () => IndicatorToken()?.children);
    createRenderEffect((_p$) => {
      var _v$ = indicatorClasses(), _v$2 = indcatorStyles();
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

var _tmpl$$2 = /* @__PURE__ */ template(`<div>`);
const Handle = createTokenComponent();
const ToggleButtonHandle = (props) => {
  const toggleButtonContext = useContext(ToggleButtonContext);
  const HandleToken = useToken(Handle, props.parentChildren);
  const handleClasses = createMemo(() => {
    const classes = [styles.handle];
    if (HandleToken()?.class) classes.push(HandleToken()?.class ?? "");
    if (toggleButtonContext?.checked()) {
      classes.push(styles["handle-checked"]);
      if (HandleToken()?.["class-checked"]) classes.push(`${HandleToken()?.["class-checked"]}`);
    }
    return classes.join(" ");
  });
  const handleStyles = createMemo(() => {
    const styles2 = {};
    Object.assign(styles2, HandleToken()?.style || {});
    if (toggleButtonContext?.checked() && HandleToken()?.["style-checked"]) {
      Object.assign(styles2, HandleToken()?.["style-checked"]);
    }
    return styles2;
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2);
    insert(_el$, () => HandleToken()?.children);
    createRenderEffect((_p$) => {
      var _v$ = handleClasses(), _v$2 = handleStyles();
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

var _tmpl$$1 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/><!$><!/>`);
const Control = createTokenComponent();
const ToggleButtonControl = (props) => {
  const ControlToken = useToken(Control, props.parentChildren);
  const LabelLeftToken = useToken(LabelLeft, props.parentChildren);
  const LabelRightToken = useToken(LabelRight, props.parentChildren);
  const controlClasses = createMemo(() => {
    const classes = [styles.control];
    if (LabelLeftToken()) classes.push(styles["label-left-enabled"]);
    if (LabelRightToken()) classes.push(styles["label-right-enabled"]);
    if (ControlToken()?.class) classes.push(ControlToken()?.class ?? "");
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$3] = getNextMarker(_el$6.nextSibling);
    insert(_el$, () => ControlToken()?.children, _el$3, _co$);
    insert(_el$, createComponent(ToggleButtonIndicator, {
      get parentChildren() {
        return ControlToken()?.children;
      }
    }), _el$5, _co$2);
    insert(_el$, createComponent(ToggleButtonHandle, {
      get parentChildren() {
        return ControlToken()?.children;
      }
    }), _el$7, _co$3);
    createRenderEffect((_p$) => {
      var _v$ = controlClasses(), _v$2 = ControlToken()?.style || {};
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

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/><!$><!/>`);
const LabelLeft = createTokenComponent();
const LabelRight = createTokenComponent();
const ToggleButtonContext = createContext();
const ToggleButton = (props) => {
  const LabelLeftToken = useToken(LabelLeft, props.children);
  const LabelRightToken = useToken(LabelRight, props.children);
  const [checked, setChecked] = createSignal(props.checked ?? false);
  let element;
  createEffect(() => {
    if (props.checked !== void 0) {
      setChecked(props.checked);
    }
  });
  const toggleButtonClasses = createMemo(() => {
    const classes = [styles["toggle-button"]];
    if (props.disabled) {
      if (props["class-disabled"]) classes.push(`${styles.disabled} ${props["class-disabled"]}`);
      else classes.push(styles.disabled);
    }
    if (checked() && props["class-checked"]) {
      classes.push(`${props["class-checked"]}`);
    }
    return classes.join(" ");
  });
  props.componentClasses = () => toggleButtonClasses();
  const toggle = () => {
    if (props.disabled) return;
    setChecked((prev) => !prev);
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
      setChecked,
      element
    });
  });
  return createComponent(ToggleButtonContext.Provider, {
    value: {
      checked
    },
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$3] = getNextMarker(_el$6.nextSibling);
      _el$.$$click = toggle;
      use(navigationActions, _el$, () => mergeNavigationActions(props, {
        "select": toggle
      }));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(Show, {
        get when() {
          return LabelLeftToken();
        },
        get children() {
          return LabelLeftToken()?.children;
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(ToggleButtonControl, {
        get parentChildren() {
          return props.children;
        }
      }), _el$5, _co$2);
      insert(_el$, createComponent(Show, {
        get when() {
          return LabelRightToken();
        },
        get children() {
          return LabelRightToken()?.children;
        }
      }), _el$7, _co$3);
      runHydrationEvents();
      return _el$;
    }
  });
};
const ToggleButton$1 = Object.assign(ToggleButton, {
  LabelLeft,
  LabelRight,
  Control,
  Indicator,
  Handle
});
delegateEvents(["click"]);

const _1d3v5oe = (root) => render(() => createComponent(ToggleButton$1, {
  get children() {
    return [createComponent(ToggleButton$1.LabelLeft, {
      children: "Off"
    }), createComponent(ToggleButton$1.LabelRight, {
      children: "On"
    })];
  }
}), root);

export { _1d3v5oe as default };
