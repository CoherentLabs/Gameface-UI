import { k as createMemo, n as createEffect, p as on, f as batch, o as onMount, c as createComponent, B as createContext, d as delegateEvents, A as useContext, b as createSignal, g as getNextElement, u as use, i as insert, e as runHydrationEvents, t as template, r as render } from './web.fJ3rGgJk.js';
import { c as createStore, u as unwrap } from './store.BS9ej-Rw.js';
import { I as Image } from './Image.Kah5Ev5A.js';
import { m as mappings, u as useNavigation, n as navigationActions, b as baseComponent, g as gamepad } from './BaseComponent.6jspVmqg.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';

const MAPPINGS = {
  // Letters
  KeyA: "A",
  KeyB: "B",
  KeyC: "C",
  KeyD: "D",
  KeyE: "E",
  KeyF: "F",
  KeyG: "G",
  KeyH: "H",
  KeyI: "I",
  KeyJ: "J",
  KeyK: "K",
  KeyL: "L",
  KeyM: "M",
  KeyN: "N",
  KeyO: "O",
  KeyP: "P",
  KeyQ: "Q",
  KeyR: "R",
  KeyS: "S",
  KeyT: "T",
  KeyU: "U",
  KeyV: "V",
  KeyW: "W",
  KeyX: "X",
  KeyY: "Y",
  KeyZ: "Z",
  // Digits
  Digit0: "0",
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  // Function keys
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F13: "F13",
  F14: "F14",
  F15: "F15",
  F16: "F16",
  F17: "F17",
  F18: "F18",
  F19: "F19",
  F20: "F20",
  F21: "F21",
  F22: "F22",
  F23: "F23",
  F24: "F24",
  // Numpad
  Numpad0: "Num 0",
  Numpad1: "Num 1",
  Numpad2: "Num 2",
  Numpad3: "Num 3",
  Numpad4: "Num 4",
  Numpad5: "Num 5",
  Numpad6: "Num 6",
  Numpad7: "Num 7",
  Numpad8: "Num 8",
  Numpad9: "Num 9",
  NumpadAdd: "+",
  NumpadSubtract: "-",
  NumpadMultiply: "*",
  NumpadDivide: "/",
  NumpadDecimal: ".",
  NumpadComma: ",",
  NumpadEnter: "Num Enter",
  NumpadEqual: "Num =",
  // Symbols
  Backquote: "`",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
  // Modifier keys
  ShiftLeft: "L Shift",
  ShiftRight: "R Shift",
  ControlLeft: "L Ctrl",
  ControlRight: "R Ctrl",
  AltLeft: "L Alt",
  AltRight: "R Alt",
  MetaLeft: "L Meta",
  MetaRight: "R Meta",
  // Other special keys
  Escape: "Esc",
  Tab: "Tab",
  CapsLock: "Caps",
  Space: "Space",
  Enter: "Enter",
  Backspace: "Back",
  Delete: "Del",
  Insert: "Ins",
  Home: "Home",
  End: "End",
  PageUp: "PgUp",
  PageDown: "PgDn",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  PrintScreen: "PrtSc",
  ScrollLock: "Scroll",
  Pause: "Pause",
  ContextMenu: "Menu",
  // Extra keys
  NumLock: "NumLock",
  AudioVolumeMute: "Mute",
  AudioVolumeDown: "Vol-",
  AudioVolumeUp: "Vol+",
  MediaTrackNext: "Next",
  MediaTrackPrevious: "Prev",
  MediaStop: "Stop",
  MediaPlayPause: "Play/Pause",
  BrowserBack: "BrowserBack",
  BrowserForward: "BrowserForward",
  BrowserRefresh: "BrowserRefresh",
  BrowserStop: "BrowserStop",
  BrowserSearch: "BrowserSearch",
  BrowserFavorites: "BrowserFav",
  BrowserHome: "BrowserHome",
  // Mouse buttons
  "0": "LMB",
  "1": "MMB",
  "2": "RMB",
  "3": "BMB",
  "4": "FMB",
  // Mouse wheel
  "WheelUp": "Wheel Up",
  "WheelDown": "Wheel Down"
};

const GLYPHS = {
  // Face Buttons
  "0": Image.icons.gamepad.xbox.a,
  "1": Image.icons.gamepad.xbox.b,
  "2": Image.icons.gamepad.xbox.x,
  "3": Image.icons.gamepad.xbox.y,
  // Shoulder Buttons (Bumpers)
  "4": Image.icons.gamepad.xbox.lb,
  "5": Image.icons.gamepad.xbox.rb,
  // Triggers
  "6": Image.icons.gamepad.xbox.lt,
  "7": Image.icons.gamepad.xbox.rt,
  // Navigation / Center Buttons
  "8": Image.icons.gamepad.xbox.view,
  // Often used as 'Back' or 'Select'
  "9": Image.icons.gamepad.xbox.menu,
  // Often used as 'Start'
  // Stick Presses (L3 / R3)
  "10": Image.icons.gamepad.xbox.leftStickPress,
  "11": Image.icons.gamepad.xbox.rightStickPress,
  // D-Pad
  "12": Image.icons.gamepad.xbox.dpadUp,
  "13": Image.icons.gamepad.xbox.dpadDown,
  "14": Image.icons.gamepad.xbox.dpadLeft,
  "15": Image.icons.gamepad.xbox.dpadRight,
  // Additional Button (Xbox Guide/Share)
  "16": Image.icons.gamepad.xbox.share,
  "right.joystick": Image.icons.gamepad.xbox.rightStick,
  "left.joystick": Image.icons.gamepad.xbox.leftStick,
  "left.joystick.down": Image.icons.gamepad.xbox.leftStick,
  "left.joystick.up": Image.icons.gamepad.xbox.leftStick,
  "left.joystick.left": Image.icons.gamepad.xbox.leftStick,
  "left.joystick.right": Image.icons.gamepad.xbox.leftStick,
  "right.joystick.down": Image.icons.gamepad.xbox.rightStick,
  "right.joystick.up": Image.icons.gamepad.xbox.rightStick,
  "right.joystick.left": Image.icons.gamepad.xbox.rightStick,
  "right.joystick.right": Image.icons.gamepad.xbox.rightStick
};

const KeybindsContext = createContext();
const Keybinds = (props) => {
  const KEYS = {
    ...MAPPINGS,
    ...props.overrides
  };
  const DISPLAY_LABELS = new Set(Object.values(KEYS));
  const GLYPHS$1 = {
    ...GLYPHS,
    ...props.glyphOverrides
  };
  const [bindings, setBindings] = createStore({});
  let defaults = props.defaults ?? void 0;
  const byKey = /* @__PURE__ */ new Map();
  const listeningText = createMemo(() => props.listeningText);
  const placeholder = createMemo(() => props.placeholder);
  createEffect(on(() => props.conflictPolicy, () => {
    mapBindings({
      ...bindings
    });
  }, {
    defer: true
  }));
  const sanitizeButtonInput = (input) => {
    if (input === null) return null;
    const num = Number(input);
    if (!isNaN(num) || typeof input === "number") {
      if (0 <= num && num <= 16) return String(input);
      else {
        console.warn(`${input} is not a valid gamepad button. Please ensure the number is between 0 and 16 inclusive`);
        return null;
      }
    }
    const button = input.toLowerCase();
    if (mappings.axisAliases.includes(button)) return button;
    const key = mappings.aliases[button];
    if (key) return String(mappings[key]);
    console.warn(`${input} is not a valid gamepad button.`);
    return null;
  };
  const verifyKey = (key) => {
    if (key === null) return null;
    if (DISPLAY_LABELS.has(key)) return key;
    console.warn(`${key} is not a valid value. If you want to use custom key names, please provide them via the "overrides" prop`);
    return null;
  };
  const mapBindings = (next) => {
    batch(() => {
      clearAll();
      for (const action in next) bind(action, next[action] ?? null);
    });
  };
  const clearAll = () => {
    for (const action in bindings) setBindings(action, null);
    byKey.clear();
  };
  const bind = (action, newKey) => {
    const prevKey = bindings[action];
    if (prevKey === newKey) return false;
    newKey = props.mode === "gamepad" ? sanitizeButtonInput(newKey) : verifyKey(newKey);
    const conflictAction = byKey.get(newKey);
    if (!conflictAction || conflictAction === action) {
      if (prevKey) byKey.delete(prevKey);
      setBindings(action, newKey);
      if (newKey !== null) byKey.set(newKey, action);
      return true;
    }
    switch (props.conflictPolicy) {
      case "block":
        console.warn(`${newKey} is already bound to ${conflictAction}, please unbind it first`);
        props.onConflict?.(action, newKey, conflictAction);
        return false;
      case "replace-existing":
        setBindings(action, newKey);
        byKey.set(newKey, action);
        setBindings(conflictAction, null);
        if (prevKey) byKey.delete(prevKey);
        props.onConflict?.(action, newKey, conflictAction);
        return true;
      case "swap":
        setBindings(action, newKey);
        setBindings(conflictAction, prevKey);
        byKey.set(newKey, action);
        if (prevKey) byKey.set(prevKey, conflictAction);
        props.onConflict?.(action, newKey, conflictAction);
        return true;
      default:
        setBindings(action, newKey);
        props.onConflict?.(action, newKey, conflictAction);
        return true;
    }
  };
  const unbindKey = (key) => {
    if (key === null) return;
    let success = byKey.delete(key);
    batch(() => {
      for (const action in bindings) {
        if (bindings[action] === key) {
          setBindings(action, null);
          if (success) {
            props.onChange?.(key, null, action);
          }
        }
      }
    });
  };
  const userBind = (action, newKey) => {
    const prevKey = bindings[action] || null;
    const success = bind(action, newKey);
    if (success) props.onChange?.(prevKey, newKey, action);
  };
  const reset = () => mapBindings({
    ...defaults
  });
  const getRawObject = () => unwrap(bindings);
  if (defaults) {
    mapBindings({
      ...defaults
    });
    defaults = {
      ...getRawObject()
    };
  } else {
    queueMicrotask(() => defaults = {
      ...getRawObject()
    });
  }
  onMount(() => {
    if (props.ref) {
      props.ref({
        bindings: getRawObject(),
        mapBindings,
        bind: userBind,
        unbindKey,
        clearAll,
        reset
      });
    }
  });
  const contextValue = {
    bindings,
    bind,
    listeningText,
    placeholder,
    KEYS,
    GLYPHS: GLYPHS$1,
    onChange: props.onChange,
    mode: props.mode
  };
  return createComponent(KeybindsContext.Provider, {
    value: contextValue,
    get children() {
      return props.children;
    }
  });
};

const keybind = "_keybind_11kr8_1";
const style = {
	keybind: keybind
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const Keybind = (props) => {
  const context = useContext(KeybindsContext);
  if (!context) {
    console.warn("Please use the Keybind component only inside the Keybinds component");
    return;
  }
  const [listening, setListening] = createSignal(false);
  let el;
  const nav = useNavigation();
  const label = createMemo(() => {
    if (listening()) return context.listeningText?.() ?? "Press any key...";
    const currentValue = context.bindings[props.action];
    if (!currentValue) return context.placeholder?.() ?? "";
    if (context.mode === "gamepad") {
      const DisplayValue = context.GLYPHS[currentValue];
      if (typeof DisplayValue === "function") {
        return DisplayValue({});
      }
      return DisplayValue;
    }
    return currentValue;
  });
  const startListening = () => {
    if (context.mode === "gamepad") return;
    setListening(true);
    el.focus();
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("mousedown", onMousedown, true);
    window.addEventListener("wheel", onWheel, true);
    window.addEventListener("mouseup", stopListening, {
      capture: true,
      passive: false
    });
  };
  const stopListening = () => {
    window.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("mousedown", onMousedown, true);
    window.removeEventListener("wheel", onWheel, true);
    window.removeEventListener("mouseup", stopListening, true);
    setListening(false);
  };
  const startListeningGamepad = () => {
    if (context.mode !== "gamepad") {
      startListening();
      return;
    }
    setListening(true);
    nav?.pauseInput();
    let isFinished = false;
    const registeredCallbacks = {};
    const stopAllListeners = () => {
      clearInterval(pollInterval);
      for (const alias in registeredCallbacks) {
        gamepad.off([alias], registeredCallbacks[alias]);
      }
    };
    const bindAndCleanup = (inputCode, isButton = false, pressedBtnObj) => {
      if (isFinished) return;
      isFinished = true;
      stopAllListeners();
      const prevKey = context.bindings[props.action] || null;
      const success = context.bind(props.action, inputCode);
      if (success) context.onChange?.(prevKey, String(inputCode), props.action);
      setListening(false);
      if (isButton && pressedBtnObj) {
        const releaseInterval = setInterval(() => {
          if (!pressedBtnObj.pressed) {
            clearInterval(releaseInterval);
            nav?.resumeInput();
          }
        }, 500);
      } else {
        nav?.resumeInput();
      }
    };
    mappings.axisAliases.forEach((alias, index) => {
      if (index <= 1) return;
      const callback = () => bindAndCleanup(alias);
      registeredCallbacks[alias] = callback;
      gamepad.on({
        actions: [alias],
        callback
      });
    });
    const pollInterval = setInterval(() => {
      const gamepad2 = navigator.getGamepads()[0];
      if (!gamepad2 || isFinished) return;
      let buttonIdx = -1;
      const pressedButton = gamepad2?.buttons.find((btn, idx) => {
        if (btn.pressed) {
          buttonIdx = idx;
          return btn;
        }
      });
      if (pressedButton) bindAndCleanup(buttonIdx, true, pressedButton);
    }, 150);
  };
  const eatEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  const onKeyDown = (e) => {
    bindKey(e, context.KEYS[e.code]);
  };
  const onMousedown = (e) => {
    bindKey(e, context.KEYS[String(e.button)]);
    window.addEventListener("mouseup", eatEvent, {
      capture: true,
      once: true
    });
  };
  const onWheel = (e) => {
    const wheelCode = e.deltaY < 0 ? "WheelUp" : "WheelDown";
    bindKey(e, context.KEYS[wheelCode]);
  };
  const bindKey = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    const prevKey = context.bindings[props.action] || null;
    const success = context.bind(props.action, code);
    stopListening();
    if (success) context.onChange?.(prevKey, code, props.action);
  };
  onMount(() => {
    if (props.ref) props.ref(el);
    if (context.bindings[props.action] === void 0) context.bind(props.action, props.value ?? null);
  });
  props.componentClasses = style.keybind;
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    _el$.$$mouseup = startListening;
    use(navigationActions, _el$, () => mergeNavigationActions(props, {
      "select": startListeningGamepad
    }));
    use(baseComponent, _el$, () => props);
    var _ref$ = el;
    typeof _ref$ === "function" ? use(_ref$, _el$) : el = _el$;
    insert(_el$, label);
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["mouseup"]);

const _1cgcray = (root) => render(() => createComponent(Keybinds, {
  placeholder: "Unbound",
  get children() {
    return [createComponent(Keybind, {
      action: "forward",
      value: "W"
    }), createComponent(Keybind, {
      action: "backward",
      value: "S"
    }), createComponent(Keybind, {
      action: "left",
      value: "A"
    }), createComponent(Keybind, {
      action: "right",
      value: "D"
    }), createComponent(Keybind, {
      action: "jump"
    })];
  }
}), root);

export { _1cgcray as default };
