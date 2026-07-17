import { g as getNextElement, u as use, E as setAttribute, t as template, f as createMemo, j as createEffect, k as on, b as batch, o as onMount, c as createComponent, D as createContext, y as delegateEvents, C as useContext, a as createSignal, i as insert, A as runHydrationEvents, r as render } from './web.bikURqO-.js';
import { c as createStore, u as unwrap } from './store.C9Zlw18N.js';
import { _ as __vite_glob_0_79 } from './round-star.DgGHujc5.js';
import { b as baseComponent, m as mappings, u as useNavigation, n as navigationActions, g as gamepad } from './BaseComponent.C3DpOC_C.js';
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

const circle = {"src":"/_astro/circle.DCilCbz_.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: circle
}, Symbol.toStringTag, { value: 'Module' }));

const cross = {"src":"/_astro/cross.nKvb2zFH.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: cross
}, Symbol.toStringTag, { value: 'Module' }));

const dpad$2 = {"src":"/_astro/dpad.CUUVZ112.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpad$2
}, Symbol.toStringTag, { value: 'Module' }));

const dpadDown$2 = {"src":"/_astro/dpadDown.CvJcMphv.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadDown$2
}, Symbol.toStringTag, { value: 'Module' }));

const dpadLeft$2 = {"src":"/_astro/dpadLeft.BwSRwHBY.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadLeft$2
}, Symbol.toStringTag, { value: 'Module' }));

const dpadRight$2 = {"src":"/_astro/dpadRight.vwFb0Tbm.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadRight$2
}, Symbol.toStringTag, { value: 'Module' }));

const dpadUp$2 = {"src":"/_astro/dpadUp.CZRNbfIu.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadUp$2
}, Symbol.toStringTag, { value: 'Module' }));

const l1 = {"src":"/_astro/l1.hYHKlbbZ.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: l1
}, Symbol.toStringTag, { value: 'Module' }));

const l2 = {"src":"/_astro/l2.y2Mf3qkO.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: l2
}, Symbol.toStringTag, { value: 'Module' }));

const leftStick$2 = {"src":"/_astro/leftStick.Boc4jN1F.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: leftStick$2
}, Symbol.toStringTag, { value: 'Module' }));

const leftStickPress$1 = {"src":"/_astro/leftStickClick.Ds2IkD9Z.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: leftStickPress$1
}, Symbol.toStringTag, { value: 'Module' }));

const microphone = {"src":"/_astro/microphone.DewPqQOl.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: microphone
}, Symbol.toStringTag, { value: 'Module' }));

const options = {"src":"/_astro/options.fUenBSm3.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: options
}, Symbol.toStringTag, { value: 'Module' }));

const optionsAlt = {"src":"/_astro/optionsAlt.D7G-2Tb-.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: optionsAlt
}, Symbol.toStringTag, { value: 'Module' }));

const r1 = {"src":"/_astro/r1.mx2O3z4q.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: r1
}, Symbol.toStringTag, { value: 'Module' }));

const r2 = {"src":"/_astro/r2.CtCzwHRc.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: r2
}, Symbol.toStringTag, { value: 'Module' }));

const rightStick$2 = {"src":"/_astro/rightStick.H1EufGXy.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rightStick$2
}, Symbol.toStringTag, { value: 'Module' }));

const rightStickClick$1 = {"src":"/_astro/rightStickClick.ufK33Pbj.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rightStickClick$1
}, Symbol.toStringTag, { value: 'Module' }));

const share$1 = {"src":"/_astro/share.BBodbAQR.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: share$1
}, Symbol.toStringTag, { value: 'Module' }));

const shareAlt = {"src":"/_astro/shareAlt.cBFrlmqT.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: shareAlt
}, Symbol.toStringTag, { value: 'Module' }));

const square$1 = {"src":"/_astro/square.MF_dhaoW.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: square$1
}, Symbol.toStringTag, { value: 'Module' }));

const touchPad = {"src":"/_astro/touchPad.CTGHu4BO.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_21 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: touchPad
}, Symbol.toStringTag, { value: 'Module' }));

const triangle = {"src":"/_astro/triangle.D12MO93J.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_22 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: triangle
}, Symbol.toStringTag, { value: 'Module' }));

const a$1 = {"src":"/_astro/a.CXA1L10e.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_23 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: a$1
}, Symbol.toStringTag, { value: 'Module' }));

const b$1 = {"src":"/_astro/b.C93yZfCb.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_24 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: b$1
}, Symbol.toStringTag, { value: 'Module' }));

const down = {"src":"/_astro/down.9NtvCvTM.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_25 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: down
}, Symbol.toStringTag, { value: 'Module' }));

const dpad$1 = {"src":"/_astro/dpad.C76fsFGy.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_26 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpad$1
}, Symbol.toStringTag, { value: 'Module' }));

const dpadDown$1 = {"src":"/_astro/dpadDown.DdVVEkOQ.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_27 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadDown$1
}, Symbol.toStringTag, { value: 'Module' }));

const dpadLeft$1 = {"src":"/_astro/dpadLeft.DZ4TY65C.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_28 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadLeft$1
}, Symbol.toStringTag, { value: 'Module' }));

const dpadRight$1 = {"src":"/_astro/dpadRight.BKX24Gj6.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_29 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadRight$1
}, Symbol.toStringTag, { value: 'Module' }));

const dpadUp$1 = {"src":"/_astro/dpadUp.CEir7p1r.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_30 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadUp$1
}, Symbol.toStringTag, { value: 'Module' }));

const home = {"src":"/_astro/home.hqPE7aVY.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_31 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: home
}, Symbol.toStringTag, { value: 'Module' }));

const lb$1 = {"src":"/_astro/lb.KA1Y6Hqo.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_32 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: lb$1
}, Symbol.toStringTag, { value: 'Module' }));

const left = {"src":"/_astro/left.COo73po6.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_33 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: left
}, Symbol.toStringTag, { value: 'Module' }));

const leftStick$1 = {"src":"/_astro/leftStick.CWpl1pz1.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_34 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: leftStick$1
}, Symbol.toStringTag, { value: 'Module' }));

const leftStickClick = {"src":"/_astro/leftStickClick.Ds2IkD9Z.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_35 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: leftStickClick
}, Symbol.toStringTag, { value: 'Module' }));

const lt$1 = {"src":"/_astro/lt.fbMC-sxD.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_36 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: lt$1
}, Symbol.toStringTag, { value: 'Module' }));

const minus = {"src":"/_astro/minus.CFSH50UB.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_37 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: minus
}, Symbol.toStringTag, { value: 'Module' }));

const plus = {"src":"/_astro/plus.ta8C-2-L.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_38 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: plus
}, Symbol.toStringTag, { value: 'Module' }));

const rb$1 = {"src":"/_astro/rb.DoQpKvuO.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_39 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rb$1
}, Symbol.toStringTag, { value: 'Module' }));

const right = {"src":"/_astro/right.CCUlIjP2.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_40 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: right
}, Symbol.toStringTag, { value: 'Module' }));

const rightStick$1 = {"src":"/_astro/rightStick.gfkviJsF.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_41 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rightStick$1
}, Symbol.toStringTag, { value: 'Module' }));

const rightStickClick = {"src":"/_astro/rightStickClick.ufK33Pbj.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_42 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rightStickClick
}, Symbol.toStringTag, { value: 'Module' }));

const rt$1 = {"src":"/_astro/rt.EQp1Of4I.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_43 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rt$1
}, Symbol.toStringTag, { value: 'Module' }));

const square = {"src":"/_astro/square.Car1w5Iu.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_44 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: square
}, Symbol.toStringTag, { value: 'Module' }));

const up = {"src":"/_astro/up.CaAibHPx.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_45 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: up
}, Symbol.toStringTag, { value: 'Module' }));

const x$1 = {"src":"/_astro/x.CYHIHyIs.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_46 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: x$1
}, Symbol.toStringTag, { value: 'Module' }));

const y$1 = {"src":"/_astro/y.CHkLHiFJ.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_47 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: y$1
}, Symbol.toStringTag, { value: 'Module' }));

const a = {"src":"/_astro/a.DYLBUbVy.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_48 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: a
}, Symbol.toStringTag, { value: 'Module' }));

const b = {"src":"/_astro/b.DwqHlreE.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_49 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: b
}, Symbol.toStringTag, { value: 'Module' }));

const dpad = {"src":"/_astro/dpad.DmtJVela.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_50 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpad
}, Symbol.toStringTag, { value: 'Module' }));

const dpadDown = {"src":"/_astro/dpadDown.CVaEj5fH.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_51 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadDown
}, Symbol.toStringTag, { value: 'Module' }));

const dpadLeft = {"src":"/_astro/dpadLeft.Yl2C1rZv.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_52 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadLeft
}, Symbol.toStringTag, { value: 'Module' }));

const dpadRight = {"src":"/_astro/dpadRight.C5-shMFx.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_53 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadRight
}, Symbol.toStringTag, { value: 'Module' }));

const dpadUp = {"src":"/_astro/dpadUp.BRRRdjqa.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_54 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: dpadUp
}, Symbol.toStringTag, { value: 'Module' }));

const lb = {"src":"/_astro/lb.B2UFywma.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_55 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: lb
}, Symbol.toStringTag, { value: 'Module' }));

const leftStick = {"src":"/_astro/leftStick.Cji4AZEG.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_56 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: leftStick
}, Symbol.toStringTag, { value: 'Module' }));

const leftStickPress = {"src":"/_astro/leftStickPress.CwshK6F5.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_57 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: leftStickPress
}, Symbol.toStringTag, { value: 'Module' }));

const lt = {"src":"/_astro/lt.BhyEz2ML.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_58 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: lt
}, Symbol.toStringTag, { value: 'Module' }));

const menu = {"src":"/_astro/menu.IqYS6T-c.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_59 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: menu
}, Symbol.toStringTag, { value: 'Module' }));

const rb = {"src":"/_astro/rb.D4ijde6-.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_60 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rb
}, Symbol.toStringTag, { value: 'Module' }));

const rightStick = {"src":"/_astro/rightStick.Bs9FE3IW.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_61 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rightStick
}, Symbol.toStringTag, { value: 'Module' }));

const rightStickPress = {"src":"/_astro/rightStickPress.CZM8aD-F.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_62 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rightStickPress
}, Symbol.toStringTag, { value: 'Module' }));

const rt = {"src":"/_astro/rt.RHCpR3zd.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_63 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: rt
}, Symbol.toStringTag, { value: 'Module' }));

const share = {"src":"/_astro/share.CvlbHTwJ.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_64 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: share
}, Symbol.toStringTag, { value: 'Module' }));

const view = {"src":"/_astro/view.X_ySsNKZ.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_65 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: view
}, Symbol.toStringTag, { value: 'Module' }));

const x = {"src":"/_astro/x.ndVFZ-Rv.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_66 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: x
}, Symbol.toStringTag, { value: 'Module' }));

const y = {"src":"/_astro/y.C3m8mUAl.png","width":100,"height":100,"format":"png"};

const __vite_glob_0_67 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: y
}, Symbol.toStringTag, { value: 'Module' }));

const crosshair = {"src":"/_astro/crosshair.Cr_NYPlk.png","width":84,"height":84,"format":"png"};

const __vite_glob_0_68 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: crosshair
}, Symbol.toStringTag, { value: 'Module' }));

const grenade = {"src":"/_astro/grenade.BGId8Kb_.png","width":126,"height":93,"format":"png"};

const __vite_glob_0_69 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: grenade
}, Symbol.toStringTag, { value: 'Module' }));

const placeholder = {"src":"/_astro/placeholder.C4CRrfJr.png","width":259,"height":260,"format":"png"};

const __vite_glob_0_70 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: placeholder
}, Symbol.toStringTag, { value: 'Module' }));

const weapon = {"src":"/_astro/weapon.DRk5OkGT.png","width":954,"height":278,"format":"png"};

const __vite_glob_0_71 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: weapon
}, Symbol.toStringTag, { value: 'Module' }));

const bag = {"src":"/_astro/bag.CwHP8W8x.svg","width":512,"height":512,"format":"svg"};

const __vite_glob_0_72 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: bag
}, Symbol.toStringTag, { value: 'Module' }));

const boots = {"src":"/_astro/boots.DqqelQWn.svg","width":512,"height":512,"format":"svg"};

const __vite_glob_0_73 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: boots
}, Symbol.toStringTag, { value: 'Module' }));

const breastPlate = {"src":"/_astro/breastPlate.BwZT1M7z.svg","width":512,"height":512,"format":"svg"};

const __vite_glob_0_74 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: breastPlate
}, Symbol.toStringTag, { value: 'Module' }));

const helmet = {"src":"/_astro/helmet.Cu_204zx.svg","width":512,"height":512,"format":"svg"};

const __vite_glob_0_75 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: helmet
}, Symbol.toStringTag, { value: 'Module' }));

const pants = {"src":"/_astro/pants.VuPxdWXl.svg","width":512,"height":512,"format":"svg"};

const __vite_glob_0_76 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: pants
}, Symbol.toStringTag, { value: 'Module' }));

const shield = {"src":"/_astro/shield.L02FUHzS.svg","width":512,"height":512,"format":"svg"};

const __vite_glob_0_77 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: shield
}, Symbol.toStringTag, { value: 'Module' }));

const sword = {"src":"/_astro/sword.DuW02L9u.svg","width":512,"height":512,"format":"svg"};

const __vite_glob_0_78 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: sword
}, Symbol.toStringTag, { value: 'Module' }));

const icon = "_icon_p5jeh_1";
const styles = {
	icon: icon};

const fallbackImg = "/_astro/fallback.Ba9zbZf2.png";

var _tmpl$$1 = /* @__PURE__ */ template(`<img>`);
const iconClasses = (base, props) => {
  return `${base} ${props.fill ? styles.fill : ""}`;
};
const modules = /* #__PURE__ */ Object.assign({"../src/assets/icons/gamepad/ps5/circle.png": __vite_glob_0_0,"../src/assets/icons/gamepad/ps5/cross.png": __vite_glob_0_1,"../src/assets/icons/gamepad/ps5/dpad.png": __vite_glob_0_2,"../src/assets/icons/gamepad/ps5/dpadDown.png": __vite_glob_0_3,"../src/assets/icons/gamepad/ps5/dpadLeft.png": __vite_glob_0_4,"../src/assets/icons/gamepad/ps5/dpadRight.png": __vite_glob_0_5,"../src/assets/icons/gamepad/ps5/dpadUp.png": __vite_glob_0_6,"../src/assets/icons/gamepad/ps5/l1.png": __vite_glob_0_7,"../src/assets/icons/gamepad/ps5/l2.png": __vite_glob_0_8,"../src/assets/icons/gamepad/ps5/leftStick.png": __vite_glob_0_9,"../src/assets/icons/gamepad/ps5/leftStickPress.png": __vite_glob_0_10,"../src/assets/icons/gamepad/ps5/microphone.png": __vite_glob_0_11,"../src/assets/icons/gamepad/ps5/options.png": __vite_glob_0_12,"../src/assets/icons/gamepad/ps5/optionsAlt.png": __vite_glob_0_13,"../src/assets/icons/gamepad/ps5/r1.png": __vite_glob_0_14,"../src/assets/icons/gamepad/ps5/r2.png": __vite_glob_0_15,"../src/assets/icons/gamepad/ps5/rightStick.png": __vite_glob_0_16,"../src/assets/icons/gamepad/ps5/rightStickClick.png": __vite_glob_0_17,"../src/assets/icons/gamepad/ps5/share.png": __vite_glob_0_18,"../src/assets/icons/gamepad/ps5/shareAlt.png": __vite_glob_0_19,"../src/assets/icons/gamepad/ps5/square.png": __vite_glob_0_20,"../src/assets/icons/gamepad/ps5/touchPad.png": __vite_glob_0_21,"../src/assets/icons/gamepad/ps5/triangle.png": __vite_glob_0_22,"../src/assets/icons/gamepad/switch/a.png": __vite_glob_0_23,"../src/assets/icons/gamepad/switch/b.png": __vite_glob_0_24,"../src/assets/icons/gamepad/switch/down.png": __vite_glob_0_25,"../src/assets/icons/gamepad/switch/dpad.png": __vite_glob_0_26,"../src/assets/icons/gamepad/switch/dpadDown.png": __vite_glob_0_27,"../src/assets/icons/gamepad/switch/dpadLeft.png": __vite_glob_0_28,"../src/assets/icons/gamepad/switch/dpadRight.png": __vite_glob_0_29,"../src/assets/icons/gamepad/switch/dpadUp.png": __vite_glob_0_30,"../src/assets/icons/gamepad/switch/home.png": __vite_glob_0_31,"../src/assets/icons/gamepad/switch/lb.png": __vite_glob_0_32,"../src/assets/icons/gamepad/switch/left.png": __vite_glob_0_33,"../src/assets/icons/gamepad/switch/leftStick.png": __vite_glob_0_34,"../src/assets/icons/gamepad/switch/leftStickClick.png": __vite_glob_0_35,"../src/assets/icons/gamepad/switch/lt.png": __vite_glob_0_36,"../src/assets/icons/gamepad/switch/minus.png": __vite_glob_0_37,"../src/assets/icons/gamepad/switch/plus.png": __vite_glob_0_38,"../src/assets/icons/gamepad/switch/rb.png": __vite_glob_0_39,"../src/assets/icons/gamepad/switch/right.png": __vite_glob_0_40,"../src/assets/icons/gamepad/switch/rightStick.png": __vite_glob_0_41,"../src/assets/icons/gamepad/switch/rightStickClick.png": __vite_glob_0_42,"../src/assets/icons/gamepad/switch/rt.png": __vite_glob_0_43,"../src/assets/icons/gamepad/switch/square.png": __vite_glob_0_44,"../src/assets/icons/gamepad/switch/up.png": __vite_glob_0_45,"../src/assets/icons/gamepad/switch/x.png": __vite_glob_0_46,"../src/assets/icons/gamepad/switch/y.png": __vite_glob_0_47,"../src/assets/icons/gamepad/xbox/a.png": __vite_glob_0_48,"../src/assets/icons/gamepad/xbox/b.png": __vite_glob_0_49,"../src/assets/icons/gamepad/xbox/dpad.png": __vite_glob_0_50,"../src/assets/icons/gamepad/xbox/dpadDown.png": __vite_glob_0_51,"../src/assets/icons/gamepad/xbox/dpadLeft.png": __vite_glob_0_52,"../src/assets/icons/gamepad/xbox/dpadRight.png": __vite_glob_0_53,"../src/assets/icons/gamepad/xbox/dpadUp.png": __vite_glob_0_54,"../src/assets/icons/gamepad/xbox/lb.png": __vite_glob_0_55,"../src/assets/icons/gamepad/xbox/leftStick.png": __vite_glob_0_56,"../src/assets/icons/gamepad/xbox/leftStickPress.png": __vite_glob_0_57,"../src/assets/icons/gamepad/xbox/lt.png": __vite_glob_0_58,"../src/assets/icons/gamepad/xbox/menu.png": __vite_glob_0_59,"../src/assets/icons/gamepad/xbox/rb.png": __vite_glob_0_60,"../src/assets/icons/gamepad/xbox/rightStick.png": __vite_glob_0_61,"../src/assets/icons/gamepad/xbox/rightStickPress.png": __vite_glob_0_62,"../src/assets/icons/gamepad/xbox/rt.png": __vite_glob_0_63,"../src/assets/icons/gamepad/xbox/share.png": __vite_glob_0_64,"../src/assets/icons/gamepad/xbox/view.png": __vite_glob_0_65,"../src/assets/icons/gamepad/xbox/x.png": __vite_glob_0_66,"../src/assets/icons/gamepad/xbox/y.png": __vite_glob_0_67,"../src/assets/icons/hud/crosshair.png": __vite_glob_0_68,"../src/assets/icons/hud/grenade.png": __vite_glob_0_69,"../src/assets/icons/hud/placeholder.png": __vite_glob_0_70,"../src/assets/icons/hud/weapon.png": __vite_glob_0_71,"../src/assets/icons/inventory/bag.svg": __vite_glob_0_72,"../src/assets/icons/inventory/boots.svg": __vite_glob_0_73,"../src/assets/icons/inventory/breastPlate.svg": __vite_glob_0_74,"../src/assets/icons/inventory/helmet.svg": __vite_glob_0_75,"../src/assets/icons/inventory/pants.svg": __vite_glob_0_76,"../src/assets/icons/inventory/shield.svg": __vite_glob_0_77,"../src/assets/icons/inventory/sword.svg": __vite_glob_0_78,"../src/assets/icons/round-star.svg": __vite_glob_0_79

});
const IconComponent = (src) => {
  return (props) => {
    props.componentClasses = () => iconClasses(styles.icon, props);
    return (() => {
      var _el$ = getNextElement(_tmpl$$1);
      _el$.addEventListener("error", (e) => {
        const img = e.target;
        img.onerror = null;
        img.src = fallbackImg;
      });
      use(baseComponent, _el$, () => props);
      setAttribute(_el$, "src", src);
      return _el$;
    })();
  };
};
const buildIconTree = () => {
  const tree = {};
  for (const path in modules) {
    const module = modules[path];
    const src = module.default;
    const cleanPath = path.replace(/^.*\/assets\/icons\//, "").replace(/\.[^/.]+$/, "");
    const keys = cleanPath.split("/");
    let currentLevel = tree;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentLevel[key] = IconComponent(src);
      } else {
        currentLevel[key] = currentLevel[key] || {};
        currentLevel = currentLevel[key];
      }
    });
  }
  return tree;
};
const Icon = buildIconTree();

const GLYPHS = {
  // Face Buttons
  "0": Icon.gamepad.xbox.a,
  "1": Icon.gamepad.xbox.b,
  "2": Icon.gamepad.xbox.x,
  "3": Icon.gamepad.xbox.y,
  // Shoulder Buttons (Bumpers)
  "4": Icon.gamepad.xbox.lb,
  "5": Icon.gamepad.xbox.rb,
  // Triggers
  "6": Icon.gamepad.xbox.lt,
  "7": Icon.gamepad.xbox.rt,
  // Navigation / Center Buttons
  "8": Icon.gamepad.xbox.view,
  // Often used as 'Back' or 'Select'
  "9": Icon.gamepad.xbox.menu,
  // Often used as 'Start'
  // Stick Presses (L3 / R3)
  "10": Icon.gamepad.xbox.leftStickPress,
  "11": Icon.gamepad.xbox.rightStickPress,
  // D-Pad
  "12": Icon.gamepad.xbox.dpadUp,
  "13": Icon.gamepad.xbox.dpadDown,
  "14": Icon.gamepad.xbox.dpadLeft,
  "15": Icon.gamepad.xbox.dpadRight,
  // Additional Button (Xbox Guide/Share)
  "16": Icon.gamepad.xbox.share,
  "right.joystick": Icon.gamepad.xbox.rightStick,
  "left.joystick": Icon.gamepad.xbox.leftStick,
  "left.joystick.down": Icon.gamepad.xbox.leftStick,
  "left.joystick.up": Icon.gamepad.xbox.leftStick,
  "left.joystick.left": Icon.gamepad.xbox.leftStick,
  "left.joystick.right": Icon.gamepad.xbox.leftStick,
  "right.joystick.down": Icon.gamepad.xbox.rightStick,
  "right.joystick.up": Icon.gamepad.xbox.rightStick,
  "right.joystick.left": Icon.gamepad.xbox.rightStick,
  "right.joystick.right": Icon.gamepad.xbox.rightStick
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
