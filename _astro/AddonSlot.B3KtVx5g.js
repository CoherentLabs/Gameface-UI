import { a as createSignal, j as createEffect, k as on, l as onCleanup, g as getNextElement, i as insert, n as createRenderEffect, p as className, s as style, t as template } from './web.bikURqO-.js';
import { d as debounce, D as DEFAULT_DELAY } from './TextInput.module.BailTvmT.js';

function useTextInput(props) {
  const [value, setValue] = createSignal(props.value ?? "");
  createEffect(on(() => props.value ?? "", (newValue) => {
    if (!exceedsMaxSymbols(newValue)) setValue(newValue);
  }, {
    defer: true
  }));
  const exceedsMaxSymbols = (newValue) => {
    const maxSymbols = props["max-symbols"];
    if (!maxSymbols) return false;
    return newValue.length > maxSymbols;
  };
  const delayUpdate = debounce((newValue) => props.onChange?.(newValue), typeof props.delay === "number" ? props.delay : DEFAULT_DELAY);
  const applyValue = (newValue) => {
    delayUpdate.cancel();
    setValue(newValue);
    props.onChange?.(newValue);
  };
  const handleChange = (e) => {
    if (!e.target) return;
    const input = e.target;
    const newValue = input.value;
    if (props.readonly) {
      input.value = value();
      return;
    }
    if (exceedsMaxSymbols(newValue)) {
      input.value = value();
      return;
    }
    setValue(newValue);
    props.delay ? delayUpdate(newValue) : props.onChange?.(newValue);
  };
  const changeValue = (newVal) => {
    if (exceedsMaxSymbols(newVal)) return;
    applyValue(newVal);
  };
  const clear = () => changeValue("");
  onCleanup(() => delayUpdate.cancel());
  return {
    value,
    handleChange,
    changeValue,
    clear
  };
}

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const AddonSlot = (props) => {
  if (!props.token()) return null;
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    insert(_el$, () => props.token().children);
    createRenderEffect((_p$) => {
      var _v$ = `${props.className ?? ""} ${props.token().class ?? ""}`, _v$2 = props.token().style;
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

export { AddonSlot as A, useTextInput as u };
