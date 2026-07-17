import { g as getNextElement, H as spread, A as runHydrationEvents, t as template, y as delegateEvents, f as createMemo, x as addEventListener, i as insert, c as createComponent, n as createRenderEffect, p as className, s as style, a as createSignal, j as createEffect, k as on, l as onCleanup, v as Show, q as getNextMarker, r as render } from './web.bikURqO-.js';
import { s as styles$1, P as Placeholder, I as Input, d as debounce, D as DEFAULT_DELAY, a as InputBase, b as InputWrapper } from './TextInput.module.BailTvmT.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.ChN_WbXL.js';
import './mergeNavigationActions.C3r_vRJZ.js';
import './BaseComponent.C3DpOC_C.js';
import './store.C9Zlw18N.js';

var _tmpl$$3 = /*#__PURE__*/template(`<svg width=100% height=100% viewBox="0 0 32 18"fill=none xmlns=http://www.w3.org/2000/svg><path d="M29 3L15.7413 15L9.37065 9L3 3"stroke=#FFFFFF stroke-width=5 stroke-linecap=round stroke-linejoin=round>`);
const ArrowDownIcon = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$3);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

var _tmpl$$2 = /*#__PURE__*/template(`<svg width=100% height=100% viewBox="0 0 32 18"fill=none xmlns=http://www.w3.org/2000/svg><path d="M3 15L16.2587 3L22.6294 9L29 15"stroke=#FFFFFF stroke-width=5 stroke-linecap=round stroke-linejoin=round>`);
const ArrowUpIcon = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$2);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

const button = "_button_1tm67_1";
const styles = {
	button: button,
	"button-container": "_button-container_1tm67_16"
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const InputControlButton = (props) => {
  const InputControlButtonClasses = createMemo(() => {
    const classes = [styles.button];
    classes.push(props.token()?.position === "before" ? styles$1.before : styles$1.after);
    classes.push(props.token()?.class ?? "");
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1);
    addEventListener(_el$, "click", props.click, true);
    insert(_el$, () => props.token()?.children || (props.orientation === "up" ? createComponent(ArrowUpIcon, {}) : createComponent(ArrowDownIcon, {})));
    createRenderEffect((_p$) => {
      var _v$ = InputControlButtonClasses(), _v$2 = props.token()?.style;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const IncreaseControl = createTokenComponent();
const DecreaseControl = createTokenComponent();
const NumberInput = (props) => {
  const [value, setValue] = createSignal(props.value ?? "");
  const IncreaseControlToken = useToken(IncreaseControl, props.children);
  const DecreaseControlToken = useToken(DecreaseControl, props.children);
  const inputRef = {
    current: void 0
  };
  createEffect(on(() => props.value, (newValue) => {
    if (!newValue) {
      setValue("");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const parsed = Number(newValue);
    if (isNaN(parsed)) return;
    const clamped = clampValue(parsed).newValue;
    setValue(clamped);
    if (inputRef.current) inputRef.current.value = String(clamped);
  }, {
    defer: true
  }));
  const transformValue = (value2) => {
    const isNegative = value2.length && value2[0] === "-";
    const newValue = value2.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    return isNegative ? "-" + newValue : newValue;
  };
  const handleChange = (e) => {
    if (!e.target) return;
    const input = e.target;
    const inputValue = transformValue(input.value);
    if (props.readonly) {
      input.value = value();
      return;
    }
    if (inputValue === "") return clear();
    const parsed = Number(inputValue);
    const {
      newValue,
      hasClamped
    } = clampValue(parsed);
    setValue(newValue);
    props.delay ? delayUpdate(newValue) : props.onChange?.(newValue);
    input.value = hasClamped ? newValue : inputValue;
  };
  const changeValue = (value2) => {
    if (isNaN(value2)) {
      return console.error(`${value2} is not a valid value! Please provide a number.`);
    }
    const newValue = clampValue(value2).newValue;
    applyValue(newValue);
  };
  const clear = () => applyValue("");
  const increaseValue = () => {
    if (props.readonly || !inputRef.current) {
      if (inputRef.current) inputRef.current.value = value();
      return;
    }
    const currValue = Number(inputRef.current.value);
    const step = props.step || 1;
    const newValue = clampValue(currValue + step).newValue;
    applyValue(newValue);
  };
  const decreaseValue = () => {
    if (props.readonly || !inputRef.current) {
      if (inputRef.current) inputRef.current.value = value();
      return;
    }
    const currValue = Number(inputRef.current.value);
    const step = props.step || 1;
    const newValue = clampValue(currValue - step).newValue;
    applyValue(newValue);
  };
  const delayUpdate = debounce((newValue) => props.onChange?.(newValue), typeof props.delay === "number" ? props.delay : DEFAULT_DELAY);
  const applyValue = (newValue) => {
    if (!inputRef.current) return;
    delayUpdate.cancel();
    inputRef.current.value = String(newValue);
    setValue(newValue);
    props.onChange?.(newValue);
  };
  function clampValue(value2) {
    let newValue = value2, hasClamped = false;
    if (props.max !== void 0 && props.max < value2) {
      newValue = props.max;
      hasClamped = true;
    }
    if (props.min !== void 0 && props.min > value2) {
      newValue = props.min;
      hasClamped = true;
    }
    return {
      newValue,
      hasClamped
    };
  }
  onCleanup(() => delayUpdate.cancel());
  const increaseBtnPosition = createMemo(() => IncreaseControlToken()?.position ?? "after");
  const decreaseBtnPosition = createMemo(() => DecreaseControlToken()?.position ?? "after");
  const showIncreaseBefore = createMemo(() => !!IncreaseControlToken() && increaseBtnPosition() === "before");
  const showIncreaseAfter = createMemo(() => !!IncreaseControlToken() && increaseBtnPosition() === "after");
  const showDecreaseBefore = createMemo(() => !!DecreaseControlToken() && decreaseBtnPosition() === "before");
  const showDecreaseAfter = createMemo(() => !!DecreaseControlToken() && decreaseBtnPosition() === "after");
  const refObject = {
    value,
    changeValue,
    increaseValue,
    decreaseValue,
    clear
  };
  return createComponent(InputWrapper, {
    props,
    inputRef,
    refObject,
    navActions: {
      "move-up": () => {
        document.activeElement === inputRef.current && increaseValue();
      },
      "move-down": () => {
        document.activeElement === inputRef.current && decreaseValue();
      }
    },
    get children() {
      return [createComponent(Show, {
        get when() {
          return showIncreaseBefore() || showDecreaseBefore();
        },
        get children() {
          var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
          insert(_el$, createComponent(Show, {
            get when() {
              return showIncreaseBefore();
            },
            get children() {
              return createComponent(InputControlButton, {
                orientation: "up",
                click: increaseValue,
                token: IncreaseControlToken,
                position: "before"
              });
            }
          }), _el$3, _co$);
          insert(_el$, createComponent(Show, {
            get when() {
              return showDecreaseBefore();
            },
            get children() {
              return createComponent(InputControlButton, {
                orientation: "down",
                click: decreaseValue,
                token: DecreaseControlToken,
                position: "before"
              });
            }
          }), _el$5, _co$2);
          createRenderEffect(() => className(_el$, styles["button-container"]));
          return _el$;
        }
      }), createComponent(InputBase, {
        type: "number",
        value,
        ref: (el) => inputRef.current = el,
        handleChange,
        get parentChildren() {
          return props.children;
        },
        get hasBefore() {
          return showIncreaseBefore() || showDecreaseBefore();
        },
        get hasAfter() {
          return showIncreaseAfter() || showDecreaseAfter();
        }
      }), createComponent(Show, {
        get when() {
          return showIncreaseAfter() || showDecreaseAfter();
        },
        get children() {
          var _el$6 = getNextElement(_tmpl$), _el$7 = _el$6.firstChild, [_el$8, _co$3] = getNextMarker(_el$7.nextSibling), _el$9 = _el$8.nextSibling, [_el$0, _co$4] = getNextMarker(_el$9.nextSibling);
          insert(_el$6, createComponent(Show, {
            get when() {
              return showIncreaseAfter();
            },
            get children() {
              return createComponent(InputControlButton, {
                orientation: "up",
                click: increaseValue,
                token: IncreaseControlToken,
                position: "after"
              });
            }
          }), _el$8, _co$3);
          insert(_el$6, createComponent(Show, {
            get when() {
              return showDecreaseAfter();
            },
            get children() {
              return createComponent(InputControlButton, {
                orientation: "down",
                click: decreaseValue,
                token: DecreaseControlToken,
                position: "after"
              });
            }
          }), _el$0, _co$4);
          createRenderEffect(() => className(_el$6, styles["button-container"]));
          return _el$6;
        }
      })];
    }
  });
};
const NumberInput$1 = Object.assign(NumberInput, {
  IncreaseControl,
  DecreaseControl,
  Input,
  Placeholder
});

const _1yp28nd = (root) => render(() => createComponent(NumberInput$1, {}), root);

export { _1yp28nd as default };
