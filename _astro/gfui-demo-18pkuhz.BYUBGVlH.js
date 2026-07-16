import { g as getNextElement, i as insert, n as createRenderEffect, p as className, s as style, t as template, y as getNextMarker, c as createComponent, q as delegateEvents, C as useContext, b as createMemo, o as onMount, u as use, z as Show, w as runHydrationEvents, F as For, a as createSignal, D as createContext, r as render } from './web.DT9QqbDn.js';
import { c as createTokenComponent, u as useToken, a as useTokens } from './tokenComponents.D7hEHUQ6.js';
import { b as baseComponent, n as navigationActions } from './BaseComponent.dZiros1M.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import './store.CXp9XCH2.js';

const radio = "_radio_xsce9_1";
const disabled = "_disabled_xsce9_11";
const control = "_control_xsce9_15";
const indicator = "_indicator_xsce9_19";
const before = "_before_xsce9_33";
const selected = "_selected_xsce9_57";
const styles = {
	radio: radio,
	"radio-button": "_radio-button_xsce9_4",
	disabled: disabled,
	control: control,
	indicator: indicator,
	before: before,
	selected: selected
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div>`);
const ButtonIndicator = createTokenComponent();
const RadioButtonIndicator = (props) => {
  const IndicatorSlot = useToken(ButtonIndicator, props.parentChildren);
  return (() => {
    var _el$ = getNextElement(_tmpl$$3);
    insert(_el$, () => IndicatorSlot?.()?.children);
    createRenderEffect((_p$) => {
      var _v$ = `${styles.indicator} ${props.selected ? styles.selected : ""} ${IndicatorSlot?.()?.class || ""}`, _v$2 = IndicatorSlot?.()?.style || {};
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

var _tmpl$$2 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const ButtonControl = createTokenComponent();
const RadioButtonControl = (props) => {
  const ControlSlot = useToken(ButtonControl, props.parentChildren);
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    insert(_el$, () => ControlSlot?.()?.children, _el$3, _co$);
    insert(_el$, createComponent(RadioButtonIndicator, {
      get parentChildren() {
        return ControlSlot?.()?.children;
      },
      get selected() {
        return props.selected;
      }
    }), _el$5, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = `${styles.control} ${props.before ? styles.before : ""} ${ControlSlot?.()?.class || ""}`, _v$2 = ControlSlot?.()?.style || {};
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

var _tmpl$$1 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/><!$><!/><!$><!/>`);
const ButtonLabel = createTokenComponent();
const Button = createTokenComponent();
const RadioButton = (props) => {
  const LabelToken = useToken(ButtonLabel, props.button.children);
  const radio = useContext(RadioContext);
  if (props.button.selected) radio?.changeOption(props.button.value);
  const isSelected = () => radio?.selected() === props.button.value;
  const buttonClasses = createMemo(() => {
    const classes = [styles["radio-button"]];
    if (props.button.disabled) {
      if (props.button["class-disabled"]) classes.push(`${styles.disabled} ${props.button["class-disabled"]}`);
      else classes.push(styles.disabled);
    }
    if (isSelected() && props.button["class-selected"]) classes.push(props.button["class-selected"] ?? "");
    return classes.join(" ");
  });
  props.button.componentClasses = () => buttonClasses();
  const handleClick = (e) => {
    if (props.button.disabled) return;
    radio?.changeOption(props.button.value);
    props.button.click?.(e);
  };
  onMount(() => {
    radio?.radioOptions.push(props.button.value);
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$3] = getNextMarker(_el$6.nextSibling), _el$8 = _el$7.nextSibling, [_el$9, _co$4] = getNextMarker(_el$8.nextSibling);
    _el$.$$click = handleClick;
    use(baseComponent, _el$, () => props.button);
    var _ref$ = props.button.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.button.ref = _el$;
    insert(_el$, createComponent(Show, {
      get when() {
        return LabelToken?.()?.before;
      },
      get children() {
        return LabelToken?.()?.children;
      }
    }), _el$3, _co$);
    insert(_el$, createComponent(RadioButtonControl, {
      get parentChildren() {
        return props.button.children;
      },
      get selected() {
        return isSelected();
      },
      get before() {
        return LabelToken?.()?.before;
      }
    }), _el$5, _co$2);
    insert(_el$, createComponent(Show, {
      get when() {
        return !LabelToken?.();
      },
      get children() {
        return props.button.children;
      }
    }), _el$7, _co$3);
    insert(_el$, createComponent(Show, {
      get when() {
        return !LabelToken?.()?.before;
      },
      get children() {
        return LabelToken?.()?.children;
      }
    }), _el$9, _co$4);
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

const RadioButtons = (props) => {
  const ButtonsTokens = useTokens(Button, props.parentChildren);
  return createComponent(For, {
    get each() {
      return ButtonsTokens();
    },
    children: (button) => createComponent(RadioButton, {
      button
    })
  });
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const RadioContext = createContext();
const Radio = (props) => {
  const [selected, setSelected] = createSignal("");
  const radioOptions = [];
  let element;
  const checkboxClasses = createMemo(() => {
    const classes = [styles.radio];
    if (props.disabled) {
      if (props["class-disabled"]) classes.push(`${styles.disabled} ${props["class-disabled"]}`);
      else classes.push(styles.disabled);
    }
    return classes.join(" ");
  });
  props.componentClasses = () => checkboxClasses();
  const changeOption = (newOption) => {
    if (props.disabled) return;
    setSelected(newOption);
    props.onChange?.(newOption);
  };
  const changeSelected = (direction) => {
    const idx = radioOptions.indexOf(selected());
    const targetIdx = direction === "prev" ? idx - 1 : idx + 1;
    if (targetIdx >= 0 && targetIdx < radioOptions.length) {
      changeOption(radioOptions[targetIdx]);
    }
  };
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      selected,
      changeOption,
      changeSelected,
      element
    });
  });
  const defaultActions = {
    "move-left": () => changeSelected("prev"),
    "move-right": () => changeSelected("next")
  };
  return createComponent(RadioContext.Provider, {
    value: {
      selected,
      changeOption,
      radioOptions
    },
    get children() {
      var _el$ = getNextElement(_tmpl$);
      use(navigationActions, _el$, () => mergeNavigationActions(props, defaultActions));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(RadioButtons, {
        get parentChildren() {
          return props.children;
        }
      }));
      return _el$;
    }
  });
};
const Radio$1 = Object.assign(Radio, {
  Button,
  ButtonLabel,
  ButtonControl,
  ButtonIndicator
});

const _18pkuhz = (root) => render(() => createComponent(Radio$1, {
  get children() {
    return [createComponent(Radio$1.Button, {
      selected: true,
      value: "red",
      children: "red"
    }), createComponent(Radio$1.Button, {
      value: "green",
      children: "green"
    }), createComponent(Radio$1.Button, {
      value: "blue",
      children: "blue"
    })];
  }
}), root);

export { _18pkuhz as default };
