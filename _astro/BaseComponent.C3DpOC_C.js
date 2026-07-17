import { I as children, j as createEffect, o as onMount, w as memo, k as on, l as onCleanup, c as createComponent, C as useContext, D as createContext } from './web.bikURqO-.js';
import { c as createStore } from './store.C9Zlw18N.js';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const _IM2 = class _IM2 {
  constructor() {
    this.actions = [];
    this.keyboardFunctions = [];
    this.gamepadFunctions = [];
  }
  /**
   * Initialize global object
   */
  init() {
    if (!window._IM) window._IM = new _IM2();
  }
  /**
   * Get keyboard functions matching the given keys
   */
  getKeys(keys) {
    return _IM.keyboardFunctions.filter((keyFunction) => keyFunction.keys.every((key) => keys.includes(key)));
  }
  /**
   * Get the index of a keyboard function matching the given keys
   */
  getKeysIndex(keys) {
    return _IM.keyboardFunctions.findIndex((keyFunction) => keyFunction.keys.every((key) => keys.includes(key)));
  }
  /**
   * Get a gamepad function matching the given button actions and type
   */
  getGamepadAction({ actions: actions2, type }) {
    return _IM.gamepadFunctions.find((gpFunc) => {
      return gpFunc.actions.every((action) => actions2.includes(action)) && gpFunc.type === type && gpFunc.actions.length === actions2.length;
    });
  }
  /**
   * Get all gamepad functions matching the given button actions
   */
  getGamepadActions(actions2, exactMatch = true) {
    return _IM.gamepadFunctions.filter(
      (gpFunc) => gpFunc.actions.every((action) => actions2.includes(action)) && (exactMatch ? gpFunc.actions.length === actions2.length : true)
    );
  }
  /**
   * Get the index of a gamepad function matching the given button actions
   */
  getGamepadActionIndex(actions2) {
    return _IM.gamepadFunctions.findIndex((gpFunc) => gpFunc.actions.every((action) => actions2.includes(action)));
  }
  /**
   * Get an action by name
   * @param {string} action - Action to search for
   */
  getAction(action) {
    return _IM.actions.find((actionObj) => actionObj.name === action);
  }
  /**
   * Get the index of an action by name
   */
  getActionIndex(action) {
    return _IM.actions.findIndex((actionObj) => actionObj.name === action);
  }
  /**
   * Checks if a callback already exists in a registered function entry
   */
  hasDuplicateCallback(functionEntry, callback) {
    return functionEntry.callbacks.some((cb) => cb === callback);
  }
  /**
   * Adds a callback to an existing function entry if it's not a duplicate
   * @param {KeyboardFunction | GamepadFunction} functionEntry - The function entry to add the callback to
   * @param {Function | string} callback - The callback to add
   * @param {Object} errorContext - Context information for error messages
   * @param {string} errorContext.identifier - String identifying the keys/actions (e.g., "Keys: [A, B]")
   * @param {string} errorContext.type - The type of action (press, hold, lift)
   */
  addCallbackToEntry(functionEntry, callback, errorContext) {
    if (this.hasDuplicateCallback(functionEntry, callback)) {
      const callbackType = typeof callback === "string" ? "action" : "function";
      const callbackName = typeof callback === "string" ? callback : "(anonymous function)";
      return console.error(
        `Duplicate callback detected!
${errorContext.identifier}
Type: '${errorContext.type}'
Callback: ${callbackName}
This ${callbackType} is already registered for this combination and type. To update it, first remove with the .off() method.`
      );
    }
    return functionEntry.callbacks.push(callback);
  }
  /**
   * Removes a keyboard function entry from the registry
   */
  removeKeyboardFunction(functionEntry) {
    const index = _IM.keyboardFunctions.indexOf(functionEntry);
    if (index !== -1) _IM.keyboardFunctions.splice(index, 1);
  }
  /**
   * Removes a gamepad function entry from the registry
   */
  removeGamepadFunction(functionEntry) {
    const index = _IM.gamepadFunctions.indexOf(functionEntry);
    if (index !== -1) _IM.gamepadFunctions.splice(index, 1);
  }
};
__name(_IM2, "IM");
let IM = _IM2;
const IM$1 = new IM();
const mappings$1 = {
  ALT: 18,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ARROW_UP: 38,
  BACKSPACE: 8,
  CAPS_LOCK: 20,
  CTRL: 17,
  DELETE: 46,
  END: 35,
  ENTER: 13,
  ESC: 27,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  HOME: 36,
  INSERT: 45,
  NUM_LOCK: 144,
  NUMPAD_ENTER: 13,
  NUMPAD_DASH: 109,
  NUMPAD_STAR: 106,
  NUMPAD_DOT: 110,
  NUMPAD_FORWARD_SLASH: 111,
  NUMPAD_PLUS: 107,
  NUMPAD_0: 96,
  NUMPAD_1: 97,
  NUMPAD_2: 98,
  NUMPAD_3: 99,
  NUMPAD_4: 100,
  NUMPAD_5: 101,
  NUMPAD_6: 102,
  NUMPAD_7: 103,
  NUMPAD_8: 104,
  NUMPAD_9: 105,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PAUSE: 19,
  PRINT_SCRN: 44,
  SCROLL_LOCK: 145,
  SHIFT: 16,
  SPACEBAR: 32,
  TAB: 9,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  0: 48,
  QUOTE: 222,
  DASH: 189,
  COMMA: 188,
  DOT: 190,
  FORWARD_SLASH: 191,
  SEMI_COLON: 186,
  SQUARE_BRACKET_LEFT: 219,
  SQUARE_BRACKET_RIGHT: 221,
  BACKWARD_SLASH: 220,
  BACKTICK: 192,
  EQUAL: 187,
  SYSTEM: 91
};
const mappingsKeys = Object.keys(mappings$1);
const _Actions = class _Actions {
  /**
   * Register an action
   */
  register(action, callback) {
    if (IM$1.getAction(action)) return console.error(`The following action "${action}" is already registered!`);
    _IM.actions.push({ name: action, callback });
  }
  /**
   * Remove a registered action
   */
  remove(action) {
    const actionIndex = IM$1.getActionIndex(action);
    if (actionIndex === -1) return console.error(`${action} is not a registered action!`);
    _IM.actions.splice(actionIndex, 1);
  }
  /**
   * Trigger an action
   */
  execute(action, value) {
    const actionObject = IM$1.getAction(action);
    if (!actionObject) return console.error(`${action} is not a registered action!`);
    actionObject.callback(value);
  }
};
__name(_Actions, "Actions");
let Actions = _Actions;
const actions = new Actions();
const _Keyboard = class _Keyboard {
  constructor() {
    this.eventListenerAttached = false;
    this.keysPressed = /* @__PURE__ */ new Set();
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    if (!window.KEYS) window.KEYS = mappings$1;
  }
  /**
   * Registers keyboard event listeners
   * @param options - Configuration object
   * @param options.keys - Array of keys (e.g., ['A', 'SHIFT']) or key codes
   * @param options.callback - Function or action name to execute
   * @param options.type - Event type(s): 'press', 'hold', or 'lift' (can be single or array)
   */
  on(options) {
    const keys = this.normalizeKeys(options.keys);
    const incorrectKeys = keys.filter((key) => !mappings$1[key]);
    if (incorrectKeys.length > 0) return console.error(`The following keys [${incorrectKeys.join(", ")}] you have entered are incorrect! `);
    if (!this.eventListenerAttached) {
      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("keyup", this.onKeyUp);
      this.eventListenerAttached = true;
    }
    const types = !options.type ? ["press"] : Array.isArray(options.type) ? options.type : [options.type];
    types.forEach((type) => {
      const registeredKeys = IM$1.getKeys(keys);
      const existingEntry = registeredKeys.find((key) => key.type === type);
      if (existingEntry) {
        return IM$1.addCallbackToEntry(existingEntry, options.callback, {
          identifier: `Keys: [${keys.join(", ")}]`,
          type
        });
      }
      if (type === "lift" && keys.length > 1) return console.error("You can only have a single key trigger an action on lift");
      _IM.keyboardFunctions.push({
        keys,
        type,
        callbacks: [options.callback]
      });
    });
  }
  /**
   * Removes either a key combination or a callback from the provided key combination
   * @param keys - Key combination you want to remove (e.g., ['A', 'SHIFT'])
   * @param callback - Optional specific callback or action to remove
   */
  off(keys, callback) {
    keys = this.normalizeKeys(keys);
    const keyCombinations = IM$1.getKeys(keys);
    if (keyCombinations.length === 0) return console.error("You are trying to remove a non-existent key combination!");
    if (callback) {
      const combinationsWithCallback = keyCombinations.filter((combination) => combination.callbacks.includes(callback));
      if (combinationsWithCallback.length === 0) {
        return console.error("You are trying to remove a non-existent callback from this key combination!");
      }
      combinationsWithCallback.forEach((combination) => {
        const cbIndex = combination.callbacks.indexOf(callback);
        combination.callbacks.splice(cbIndex, 1);
        if (combination.callbacks.length === 0) {
          IM$1.removeKeyboardFunction(combination);
        }
      });
    } else {
      keyCombinations.forEach((combination) => {
        IM$1.removeKeyboardFunction(combination);
      });
    }
    if (_IM.keyboardFunctions.length === 0) {
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("keyup", this.onKeyUp);
      this.eventListenerAttached = false;
    }
  }
  /**
   * Handles when key is pressed
   */
  onKeyDown(event) {
    const keyPressed = this.keyCodeToString(event.keyCode);
    if (!keyPressed) return;
    this.keysPressed.add(keyPressed);
    const registeredKeys = IM$1.getKeys([...this.keysPressed]);
    if (registeredKeys.length === 0) return;
    registeredKeys.forEach((key) => {
      if (key.type === "press" && event.repeat) return;
      if (key.type !== "press" && key.type !== "hold") return;
      if (key.type === "hold" && !event.repeat) return;
      this.executeCallbacks(event, key);
    });
  }
  /**
   * Handles when key is released
   */
  onKeyUp(event) {
    const keyPressed = this.keyCodeToString(event.keyCode);
    if (!keyPressed) return;
    this.keysPressed.delete(keyPressed);
    const registeredKeys = IM$1.getKeys([keyPressed]);
    if (registeredKeys.length === 0) return;
    registeredKeys.forEach((key) => {
      if (key.type === "lift" && key.keys.indexOf(keyPressed) !== -1) this.executeCallbacks(event, key);
    });
  }
  /**
   * Convert keyCode to string representing key
   */
  keyCodeToString(code) {
    return mappingsKeys.find((key) => mappings$1[key] === code);
  }
  /**
   * Removes duplicates and converts KeyCodes to valid KeyName strings
   */
  normalizeKeys(keys) {
    const normalizedKeys = keys.map((key) => {
      if (typeof key === "number") {
        const name = this.keyCodeToString(key);
        if (!name) throw new Error(`Invalid KeyCode: ${key}`);
        return name;
      }
      return key.toUpperCase();
    });
    return [...new Set(normalizedKeys)];
  }
  /**
   * Executes the registered callbacks. Has to be invoked from the onKeyDown and onKeyUp functions
   * @param {KeyboardEvent} event
   * @param {Object} registeredKeys
   * @param {string[]} registeredKeys.keys - Array of keys you want to use, allows only combination of modifier and regular keys
   * @param {(function | string)[]} registeredKeys.callbacks - Functions or actions to be executed on the key combination
   * @param {('press'|'hold'|'lift')} registeredKeys.type - Type of key action you want to use.
   */
  executeCallbacks(event, registeredKeys) {
    registeredKeys.callbacks.forEach((callback) => {
      if (typeof callback === "string") return actions.execute(callback, event);
      callback(event);
    });
  }
};
__name(_Keyboard, "Keyboard");
let Keyboard = _Keyboard;
const keyboard = new Keyboard();
const mappings = {
  FACE_BUTTON_DOWN: 0,
  FACE_BUTTON_RIGHT: 1,
  FACE_BUTTON_LEFT: 2,
  FACE_BUTTON_TOP: 3,
  LEFT_SHOULDER: 4,
  RIGHT_SHOULDER: 5,
  LEFT_SHOULDER_BOTTOM: 6,
  RIGHT_SHOULDER_BOTTOM: 7,
  SELECT: 8,
  START: 9,
  LEFT_ANALOGUE_STICK: 10,
  RIGHT_ANALOGUE_STICK: 11,
  PAD_UP: 12,
  PAD_DOWN: 13,
  PAD_LEFT: 14,
  PAD_RIGHT: 15,
  CENTER_BUTTON: 16,
  aliases: {
    "face-button-down": "FACE_BUTTON_DOWN",
    "face-button-left": "FACE_BUTTON_LEFT",
    "face-button-right": "FACE_BUTTON_RIGHT",
    "face-button-top": "FACE_BUTTON_TOP",
    "left-shoulder": "LEFT_SHOULDER",
    "right-shoulder": "RIGHT_SHOULDER",
    "left-shoulder-bottom": "LEFT_SHOULDER_BOTTOM",
    "right-shoulder-bottom": "RIGHT_SHOULDER_BOTTOM",
    select: "SELECT",
    start: "START",
    "left-analogue-stick": "LEFT_ANALOGUE_STICK",
    "right-analogue-stick": "RIGHT_ANALOGUE_STICK",
    "pad-up": "PAD_UP",
    "pad-down": "PAD_DOWN",
    "pad-left": "PAD_LEFT",
    "pad-right": "PAD_RIGHT",
    "center-button": "CENTER_BUTTON",
    "playstation.x": "FACE_BUTTON_DOWN",
    "playstation.square": "FACE_BUTTON_LEFT",
    "playstation.circle": "FACE_BUTTON_RIGHT",
    "playstation.triangle": "FACE_BUTTON_TOP",
    "playstation.l1": "LEFT_SHOULDER",
    "playstation.r1": "RIGHT_SHOULDER",
    "playstation.l2": "LEFT_SHOULDER_BOTTOM",
    "playstation.r2": "RIGHT_SHOULDER_BOTTOM",
    "playstation.share": "SELECT",
    "playstation.options": "START",
    "playstation.l3": "LEFT_ANALOGUE_STICK",
    "playstation.r3": "RIGHT_ANALOGUE_STICK",
    "playstation.d-pad-up": "PAD_UP",
    "playstation.d-pad-down": "PAD_DOWN",
    "playstation.d-pad-left": "PAD_LEFT",
    "playstation.d-pad-right": "PAD_RIGHT",
    "playstation.center": "CENTER_BUTTON",
    "xbox.a": "FACE_BUTTON_DOWN",
    "xbox.x": "FACE_BUTTON_LEFT",
    "xbox.b": "FACE_BUTTON_RIGHT",
    "xbox.y": "FACE_BUTTON_TOP",
    "xbox.lb": "LEFT_SHOULDER",
    "xbox.rb": "RIGHT_SHOULDER",
    "xbox.lt": "LEFT_SHOULDER_BOTTOM",
    "xbox.rt": "RIGHT_SHOULDER_BOTTOM",
    "xbox.view": "SELECT",
    "xbox.menu": "START",
    "xbox.left-thumbstick": "LEFT_ANALOGUE_STICK",
    "xbox.right-thumbstick": "RIGHT_ANALOGUE_STICK",
    "xbox.d-pad-up": "PAD_UP",
    "xbox.d-pad-down": "PAD_DOWN",
    "xbox.d-pad-left": "PAD_LEFT",
    "xbox.d-pad-right": "PAD_RIGHT",
    "xbox.center": "CENTER_BUTTON"
  },
  axisAliases: [
    "right.joystick",
    "left.joystick",
    "left.joystick.down",
    "left.joystick.up",
    "left.joystick.left",
    "left.joystick.right",
    "right.joystick.down",
    "right.joystick.up",
    "right.joystick.left",
    "right.joystick.right"
  ]
};
const AXIS_THRESHOLD = 0.9;
const ACTION_TYPES = ["press", "hold"];
const _Gamepad = class _Gamepad {
  constructor() {
    this._gamepadEnabled = false;
    this._pollingInterval = 200;
    this._pressedAction = null;
    this._pressedButtons = [];
    this.sanitizeAction = this.sanitizeAction.bind(this);
  }
  /**
   * Allow gamepads to be connected
   */
  set enabled(isEnabled) {
    this._gamepadEnabled = isEnabled;
    this._gamepadEnabled ? this.startPolling() : this.stopPolling();
  }
  set pollingInterval(interval) {
    this._pollingInterval = interval;
    if (this._gamepadEnabled) {
      if (this.pollingIntervalRef) this.stopPolling();
      this.startPolling();
    }
  }
  on(options) {
    const actions2 = options.actions.map(this.sanitizeAction);
    const isAxisAlias = mappings.axisAliases.some((alias) => actions2.includes(alias));
    const type = options.type && ACTION_TYPES.includes(options.type) ? options.type : "hold";
    if (type === "press" && isAxisAlias) {
      return console.error(`You can't use an axis action with a 'press' type!`);
    }
    if (actions2.length > 1 && isAxisAlias) {
      return console.error(`You can't use an axis action in a combination with a button action`);
    }
    const existingEntry = IM$1.getGamepadAction({ actions: actions2, type });
    if (existingEntry) {
      return IM$1.addCallbackToEntry(existingEntry, options.callback, {
        identifier: `Actions: [${actions2.join(", ")}]`,
        type
      });
    }
    _IM.gamepadFunctions.push({ actions: actions2, type, callbacks: [options.callback] });
  }
  /**
   * Removes either an action or a callback from the provided action
   * @param {Array} actions - Array containing the action you want to remove
   * @param {string | Function} callback - Callback or action you want to remove 
   */
  off(actions2, callback) {
    const matchingActions = IM$1.getGamepadActions(actions2.map(this.sanitizeAction));
    if (matchingActions.length === 0) {
      return console.error("You are trying to remove a non-existent action!");
    }
    if (callback) {
      const actionsWithCallback = matchingActions.filter((action) => action.callbacks.includes(callback));
      if (actionsWithCallback.length === 0) return console.error("You are trying to remove a non-existent callback from this action!");
      actionsWithCallback.forEach((action) => {
        const cbIndex = action.callbacks.indexOf(callback);
        action.callbacks.splice(cbIndex, 1);
        if (action.callbacks.length === 0) {
          IM$1.removeGamepadFunction(action);
        }
      });
    } else {
      matchingActions.forEach((action) => IM$1.removeGamepadFunction(action));
    }
  }
  /**
   * Loop that handles button presses and axis movement
   */
  startPolling() {
    this.pollingIntervalRef = setInterval(() => {
      const gamepads = navigator.getGamepads();
      if (gamepads.length === 0) return;
      gamepads.forEach((gamepad2) => {
        if (!gamepad2) return;
        this.handleButtons(gamepad2.buttons);
        this.handleJoysticks(gamepad2.axes);
      });
    }, this._pollingInterval);
  }
  stopPolling() {
    if (this.pollingIntervalRef) clearInterval(this.pollingIntervalRef);
  }
  handleButtons(buttons) {
    const pressedButtons = buttons.reduce(
      (acc, el, index) => {
        if (el.pressed) {
          acc.buttonIndexes.push(index);
          acc.buttons.push(el);
        }
        return acc;
      },
      { buttonIndexes: [], buttons: [] }
    );
    const gamepadActions = IM$1.getGamepadActions(pressedButtons.buttonIndexes, false);
    if (this._pressedAction) {
      if (!gamepadActions.includes(this._pressedAction)) {
        this.executeCallbacks(this._pressedAction, this._pressedButtons);
      }
      this._pressedAction = null;
      this._pressedButtons = [];
    }
    gamepadActions.forEach((gamepadAction) => {
      if (gamepadAction.type === "press") {
        this._pressedAction = gamepadAction;
        this._pressedButtons = pressedButtons.buttons;
        return;
      }
      this.executeCallbacks(gamepadAction, pressedButtons.buttons);
    });
  }
  /* eslint-disable max-lines-per-function */
  handleJoysticks(axes) {
    const joystickActions = this.getJoystickActions();
    joystickActions.forEach((jAction) => {
      switch (jAction.actions[0]) {
        case "left.joystick":
          return this.executeCallbacks(jAction, [axes[0], axes[1]]);
        case "right.joystick":
          return this.executeCallbacks(jAction, [axes[2], axes[3]]);
        case "left.joystick.down":
          if (axes[1] > AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[0], axes[1]]);
          break;
        case "left.joystick.up":
          if (axes[1] < -AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[0], axes[1]]);
          break;
        case "left.joystick.left":
          if (axes[0] < -AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[0], axes[1]]);
          break;
        case "left.joystick.right":
          if (axes[0] > AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[0], axes[1]]);
          break;
        case "right.joystick.down":
          if (axes[3] > AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[2], axes[3]]);
          break;
        case "right.joystick.up":
          if (axes[3] < -AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[2], axes[3]]);
          break;
        case "right.joystick.left":
          if (axes[2] < -AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[2], axes[3]]);
          break;
        case "right.joystick.right":
          if (axes[2] > AXIS_THRESHOLD) return this.executeCallbacks(jAction, [axes[2], axes[3]]);
          break;
      }
    });
  }
  /**
   * Convert button aliases to indexes or keep joystick aliases
   * @param {string | number} action - Actions to convert
   */
  sanitizeAction(action) {
    if (typeof action === "number") return action;
    const actionName = action.toLowerCase();
    if (mappings.axisAliases.includes(actionName)) return actionName;
    const key = mappings.aliases[actionName];
    if (key) return mappings[key];
    throw new Error(`You have entered a non-supported button alias: ${action}`);
  }
  /**
   * Gets all registered Joystick actions
   */
  getJoystickActions() {
    return _IM.gamepadFunctions.filter((gpFunc) => mappings.axisAliases.includes(gpFunc.actions[0]));
  }
  /**
   * Executes the callbacks from the registered action
   */
  executeCallbacks(action, value) {
    action.callbacks.forEach((callback) => {
      if (typeof callback === "string") return actions.execute(callback, value);
      callback(value);
    });
  }
};
__name(_Gamepad, "Gamepad");
let Gamepad = _Gamepad;
const gamepad = new Gamepad();
function toDeg(rad) {
  return rad * 180 / Math.PI;
}
__name(toDeg, "toDeg");
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
__name(clamp, "clamp");
function createHash() {
  return (Math.random() + 1).toString(36).substring(7);
}
__name(createHash, "createHash");
function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.hypot(a, b);
}
__name(distanceBetweenTwoPoints, "distanceBetweenTwoPoints");
function getMidPoint(x1, y1, x2, y2) {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  };
}
__name(getMidPoint, "getMidPoint");
const directions = ["down", "up", "left", "right"];
const defaultKeysState = { up: ["arrow_up"], down: ["arrow_down"], right: ["arrow_right"], left: ["arrow_left"] };
const _SpatialNavigation = class _SpatialNavigation {
  constructor() {
    this.enabled = false;
    this.areas = { default: this.createDefaultAreaState() };
    this.registeredKeys = /* @__PURE__ */ new Set();
    this.clearCurrentActiveKeys = false;
    this.overlapPercentage = 0.5;
    this.lastFocusedElement = null;
    this.paused = false;
    this.syncLastFocused = (event) => {
      const target = event.target;
      if (!this.enabled || !target) return;
      for (const areaName in this.areas) {
        const area = this.areas[areaName];
        if (area.elements.includes(target)) {
          area.lastFocusedElement = target;
          this.lastFocusedElement = target;
          break;
        }
      }
    };
  }
  /**
   * Initializes the spatial navigation
   * @param {string[]|Object[]|HTMLElement[]} navigableElements - Array of selector strings, objects with area/elements, or HTMLElement references
   * @param {string} navigableElements[].area - Name of the navigation area
   * @param {(string|HTMLElement)[]} navigableElements[].elements - Array of selector strings or HTMLElement references
   * @param {number} overlap - Overlap percentage (0-1) for determining if elements are on the same axis
   * @example
   * // Using selector strings
   * spatialNavigation.init(['.menu-item', '#header']);
   *
   * // Using HTMLElement references
   * spatialNavigation.init([element1, element2]);
   *
   * // Using object syntax with mixed selectors and HTMLElements
   * spatialNavigation.init([
   *   { area: 'menu', elements: ['.item', element1, '#button'] }
   * ]);
   */
  init(navigableElements = [], overlap) {
    if (this.enabled) return;
    this.enabled = true;
    this.add(navigableElements);
    this.activeKeys = JSON.parse(JSON.stringify(defaultKeysState));
    this.registerKeyActions();
    window.addEventListener("focusin", this.syncLastFocused);
    if (overlap && 0 <= overlap && overlap <= 1) {
      this.overlapPercentage = overlap;
    }
  }
  /**
   * Deinitialize the spatial navigation
   */
  deinit() {
    if (!this.enabled) return;
    this.enabled = false;
    this.areas = { default: this.createDefaultAreaState() };
    this.removeKeyActions();
    this.overlapPercentage = 0.5;
    this.lastFocusedElement = null;
    window.removeEventListener("focusin", this.syncLastFocused);
  }
  /**
   * Add new elements to area or new area
   * @param {string[]|Object[]|HTMLElement[]} navigableElements - Array of selector strings, objects with area/elements, or HTMLElement references
   * @param {string} navigableElements[].area - Name of the navigation area
   * @param {(string|HTMLElement)[]} navigableElements[].elements - Array of selector strings or HTMLElement references
   * @example
   * // Add selector strings to default area
   * spatialNavigation.add(['.new-item']);
   *
   * // Add HTMLElement references to default area
   * spatialNavigation.add([element1, element2]);
   *
   * // Add to named area with mixed types
   * spatialNavigation.add([
   *   { area: 'sidebar', elements: ['.link', element1] }
   * ]);
   */
  add(navigableElements) {
    if (!this.enabled) return;
    if (navigableElements.every((el) => el instanceof HTMLElement)) {
      navigableElements.forEach((element) => this.makeFocusable(element));
      this.setNavigationAreaProperties("default", navigableElements);
      return;
    }
    navigableElements.forEach((navArea) => {
      typeof navArea === "string" ? this.handleString(navArea) : this.handleObject(navArea);
    });
  }
  /**
   * Remove an area from the focusable groups
   * @param area area to be removed
   */
  remove(area = "default") {
    if (!this.enabled) return;
    if (!this.areas[area]) return console.error(`The area '${area}' you are trying to remove doesn't exist`);
    this.areas[area].elements.forEach((element) => element.removeAttribute("tabindex"));
    delete this.areas[area];
  }
  /**
   * Gets the last focused element from the specified area
   * @param area
   */
  getLastFocused(area = "default") {
    const el = this.areas[area]?.lastFocusedElement;
    if (el && !document.contains(el)) {
      this.areas[area].lastFocusedElement = void 0;
      return void 0;
    }
    return el;
  }
  /**
   * Returns the structure of the default area
   */
  createDefaultAreaState() {
    return {
      elements: [],
      lastFocusedElement: void 0
    };
  }
  /**
   * Get elements from selector and save them to the default group
   * @param navArea
   */
  handleString(navArea) {
    const domElements = [...document.querySelectorAll(navArea)];
    if (domElements.length === 0) return console.error(`${navArea} is either not a correct selector or the element is not present in the DOM.`);
    domElements.forEach(this.makeFocusable);
    this.setNavigationAreaProperties("default", domElements);
  }
  /**
   * Gets elements from object and saves them to a focusable group
   * @param {Object} navArea - Navigation area configuration
   * @param {string} navArea.area - Name of the navigation area
   * @param {(string|HTMLElement)[]} navArea.elements - Array of selector strings or HTMLElement references
   */
  handleObject(navArea) {
    const domElements = navArea.elements.reduce((acc, el) => {
      if (el instanceof HTMLElement) {
        acc.push(el);
        this.makeFocusable(el);
        return acc;
      }
      const elements = [...document.querySelectorAll(el)];
      elements.forEach(this.makeFocusable);
      acc.push(...elements);
      return acc;
    }, []);
    if (domElements.length === 0) return console.error(`${navArea.elements.join(", ")} are either not a correct selectors or the elements are not present in the DOM.`);
    if (!this.areas[navArea.area]) {
      this.areas[navArea.area] = this.createDefaultAreaState();
    }
    this.setNavigationAreaProperties(navArea.area, domElements);
  }
  /**
   * @param area - The area to set the properties for
   * @param domElements - The elements to be added to the area
   */
  setNavigationAreaProperties(area, domElements) {
    this.areas[area].elements.push(...domElements);
  }
  /**
   * Sets the tabindex of the element that needs to be focused
   * @param element
   */
  makeFocusable(element) {
    element.setAttribute("tabindex", "1");
  }
  /**
   * Returns the valid focusable elements in the navigable area
   * @param {HTMLElement} targetElement
   * @param {HTMLElement[]} elements
   */
  getFocusableGroup(targetElement, elements) {
    return elements.reduce((accumulator, element) => {
      if (element !== targetElement && !element.hasAttribute("disabled")) {
        const { x, y, height, width } = element.getBoundingClientRect();
        accumulator.push({ element, x, y, height, width });
      }
      return accumulator;
    }, []);
  }
  /**
   * Checks if the passed element is within a group and returns the rest of the elements in the group
   * @param {HTMLElement} targetElement
   * @returns {NavigationObject[]}
   */
  getCurrentArea(targetElement) {
    return Object.values(this.areas).find((area) => {
      if (area.elements.includes(targetElement)) return true;
    });
  }
  /**
   * Gets the element closest to the opposite edge of the navigation direction
   * @param {string} direction
   * @param {NavigationObject[]} elements
   * @param {Object} focusedElement
   * @param {number} focusedElement.x
   * @param {number} focusedElement.y
   */
  getClosestToEdge(direction, elements) {
    return elements.reduce((acc, el) => {
      switch (direction) {
        case "down":
          return el.y < acc.y ? el : acc;
        case "up":
          return el.y > acc.y ? el : acc;
        case "right":
          return el.x < acc.x ? el : acc;
        case "left":
          return el.x > acc.x ? el : acc;
        default:
          return acc;
      }
    });
  }
  /**
   * Moves the focus in the desired direction
   * @param {string} direction
   */
  moveFocus(direction) {
    if (!this.enabled) return;
    const activeElement = this.isActiveElementInGroup() && document.activeElement || this.lastFocusedElement;
    const currentArea = this.getCurrentArea(activeElement);
    if (!currentArea) return console.error("The active element is not in a focusable area!");
    const { elements } = currentArea;
    const focusableGroup = this.getFocusableGroup(activeElement, elements);
    const { x, y, width, height } = activeElement.getBoundingClientRect();
    const dimensions = { x, y, width, height };
    if (focusableGroup.length === 0) return;
    const currentAxisGroup = this.filterGroupByCurrentAxis(direction, focusableGroup, dimensions);
    if (!currentAxisGroup.length) return;
    let nextFocusableElement = this.findNextElement(
      direction,
      currentAxisGroup,
      dimensions.x,
      dimensions.y
    );
    if (!nextFocusableElement) {
      nextFocusableElement = this.getClosestToEdge(direction, currentAxisGroup);
    }
    if (nextFocusableElement) {
      nextFocusableElement.element.focus();
      this.lastFocusedElement = nextFocusableElement.element;
      currentArea.lastFocusedElement = this.lastFocusedElement;
    }
  }
  /** Filters the focusable group by the relevant axis by chacking for same axis overlap */
  filterGroupByCurrentAxis(direction, focusableGroup, currentElement) {
    return focusableGroup.filter((element) => {
      if (direction === "left" || direction === "right") return this.isOverlappingX(currentElement, element);
      return this.isOverlappingY(currentElement, element);
    });
  }
  /** Compares the Y coordinates of two elements and checks for overlap by the specified overlap value */
  isOverlappingX(currentElement, nextElement) {
    const lowerBoundary = Math.min(currentElement.y + currentElement.height, nextElement.y + nextElement.height);
    const topBoundary = Math.max(currentElement.y, nextElement.y);
    const verticalOverlap = Math.max(0, lowerBoundary - topBoundary);
    const minHeight = Math.min(currentElement.height, nextElement.height);
    const overlapPercentage = verticalOverlap / minHeight;
    return overlapPercentage >= this.overlapPercentage;
  }
  /** Compares the X coordinates of two elements and checks for overlap by the specified overlap value */
  isOverlappingY(currentElement, nextElement) {
    const rightBoundary = Math.min(currentElement.x + currentElement.width, nextElement.x + nextElement.width);
    const leftBoundary = Math.max(currentElement.x, nextElement.x);
    const horizontalOverlap = Math.max(0, rightBoundary - leftBoundary);
    const minWidth = Math.min(currentElement.width, nextElement.width);
    const overlapPercentage = horizontalOverlap / minWidth;
    return overlapPercentage >= this.overlapPercentage;
  }
  /** Returns the next element to focus within the group */
  findNextElement(direction, focusableGroup, x, y) {
    return focusableGroup.reduce((acc, el) => {
      const deltaX = el.x - x;
      const deltaY = el.y - y;
      const angle = toDeg(Math.atan2(deltaY, deltaX));
      if (this.getDirectionAngle(direction, angle)) {
        if (!acc) acc = el;
        const newDistance = Math.hypot(deltaX, deltaY);
        const oldDistance = Math.hypot(acc.x - x, acc.y - y);
        acc = newDistance < oldDistance ? el : acc;
      }
      return acc;
    }, null);
  }
  /**
   * Get the angle range for the direction
   */
  getDirectionAngle(direction, angle) {
    switch (direction) {
      case "down":
        return angle > 0 && angle < 180;
      case "up":
        return angle > -180 && angle < 0;
      case "left":
        return angle < -90 || angle > 90;
      case "right":
        return angle > -90 && angle < 90;
    }
  }
  /**
   * Registers actions and adds them to the keyboard and gamepad objects
  */
  registerKeyActions() {
    directions.forEach((direction) => {
      const callback = /* @__PURE__ */ __name(() => {
        if (this.paused) return;
        this.moveFocus(direction);
      }, "callback");
      actions.register(`move-focus-${direction}`, callback);
      const keys = this.activeKeys[direction];
      for (const key of keys) {
        keyboard.on({
          keys: [key],
          callback: `move-focus-${direction}`,
          type: ["press", "hold"]
        });
        this.registeredKeys.add(key);
      }
      gamepad.on({
        actions: [`playstation.d-pad-${direction}`],
        callback: `move-focus-${direction}`
      });
    });
  }
  /**
   * Resets to the original keys state
   */
  resetKeys() {
    if (!this.enabled) return;
    this.removeKeyActions();
    this.activeKeys = JSON.parse(JSON.stringify(defaultKeysState));
    this.registerKeyActions();
  }
  /**
   * Adds or override default direction keys with the specified ones
   * @param {Object} customDirections - { up: 'W', left: 'A', right: 'D', down: 'S' }
   * @param options.clearCurrentActiveKeys - If true, overrides all keys. Defaults to false.
   */
  changeKeys(customDirections, options = { clearCurrentActiveKeys: false }) {
    if (!this.enabled) return;
    const customKeysDirections = Object.keys(customDirections);
    if (customKeysDirections.length === 0) return;
    const incorrectDirections = customKeysDirections.filter((direction) => !directions.includes(direction));
    if (incorrectDirections.length > 0) return console.error(`The following directions: [${incorrectDirections.join(", ")}] you have entered are incorrect! `);
    this.clearCurrentActiveKeys = options.clearCurrentActiveKeys;
    this.removeKeyActions();
    for (const direction in this.activeKeys) {
      const newKey = customDirections[direction];
      if (typeof newKey === "string" && !this.activeKeys[direction].includes(newKey)) {
        this.activeKeys[direction].push(newKey.toUpperCase());
      }
    }
    this.registerKeyActions();
  }
  /**
   * Removes the added actions
   */
  removeKeyActions() {
    if (this.registeredKeys.size !== 0) {
      directions.forEach((direction) => {
        const actionName = `move-focus-${direction}`;
        for (const key of this.activeKeys[direction]) {
          keyboard.off([key], actionName);
        }
        actions.remove(actionName);
        gamepad.off([`playstation.d-pad-${direction}`], actionName);
        if (this.clearCurrentActiveKeys) this.activeKeys[direction] = [];
      });
      this.registeredKeys.clear();
      this.clearCurrentActiveKeys = false;
    }
  }
  /**
   * Focuses on the first element in a focusable area
   */
  focusFirst(area = "default") {
    if (!this.enabled) return;
    const navigableElements = this.areas[area].elements;
    if (!navigableElements || navigableElements.length === 0) {
      return console.error(`The area '${area}' you are trying to focus doesn't exist or the spatial navigation hasn't been initialized`);
    }
    this.lastFocusedElement = navigableElements.find((el) => !el.hasAttribute("disabled"));
    if (!this.lastFocusedElement) {
      return console.error(`The area '${area}' you are trying to focus doesn't have any focusable elements`);
    }
    this.lastFocusedElement.focus();
    this.areas[area].lastFocusedElement = this.lastFocusedElement;
  }
  /**
   * Focuses on the last element in a focusable area
   */
  focusLast(area = "default") {
    if (!this.enabled) return;
    const navigableElements = this.areas[area].elements;
    if (!navigableElements || navigableElements.length === 0) {
      return console.error(`The area '${area}' you are trying to focus doesn't exist or the spatial navigation hasn't been initialized`);
    }
    let element;
    for (let i = navigableElements.length - 1; i >= 0; i--) {
      if (!navigableElements[i].hasAttribute("disabled")) {
        element = navigableElements[i];
        break;
      }
    }
    this.lastFocusedElement = element;
    if (!this.lastFocusedElement) {
      return console.error(`The area '${area}' you are trying to focus doesn't have any focusable elements`);
    }
    this.lastFocusedElement.focus();
    this.areas[area].lastFocusedElement = this.lastFocusedElement;
  }
  /**
   * Changes focus to another area by focusing on the last focused element in that area. If no element has previously been focused, it will focus the first available element.
   */
  switchArea(area) {
    if (!this.enabled) return;
    const lastFocusedInArea = this.getLastFocused(area);
    if (!lastFocusedInArea || lastFocusedInArea.hasAttribute("disabled")) {
      return this.focusFirst(area);
    }
    lastFocusedInArea.focus();
    this.lastFocusedElement = lastFocusedInArea;
  }
  /**
  * Checks if a given element is in a focusable area
  */
  isElementInGroup(element) {
    return Object.values(this.areas).some((group) => group.elements.includes(element));
  }
  /**
   * Checks if the currently active element is in a focusable area
   */
  isActiveElementInGroup() {
    if (!document.activeElement) return false;
    return this.isElementInGroup(document.activeElement);
  }
  /**
   * Removes the focus from a focused element in a group
   */
  clearFocus() {
    if (!this.enabled) return;
    if (this.isActiveElementInGroup()) document.activeElement.blur();
  }
  /**
   * Pauses the spatial navigation functionality
   */
  pause() {
    if (!this.enabled) return;
    this.paused = true;
  }
  /**
   * Resumes the spatial navigation functionality
   */
  resume() {
    if (!this.enabled) return;
    this.paused = false;
  }
};
__name(_SpatialNavigation, "SpatialNavigation");
let SpatialNavigation = _SpatialNavigation;
const spatialNavigation = new SpatialNavigation();
const _DragBase = class _DragBase {
  constructor(options) {
    this.options = options;
    this.draggableElements = [];
    this.draggedElement = null;
    this.enabled = false;
    this.offset = { x: 0, y: 0 };
  }
  /**
   * Get the index of the dragged item in the draggableElements
   */
  get draggedItemIndex() {
    return [...this.draggableElements].indexOf(this.draggedElement);
  }
  /**
   * Gets the body scroll offset to calculate in the dragging
   */
  get bodyScrollOffset() {
    return {
      x: document.body.scrollLeft,
      y: document.body.scrollTop
    };
  }
  setPointerOffset(clientX, clientY, target) {
    const { x, y } = target.getBoundingClientRect();
    this.offset = {
      x: clientX - x,
      y: clientY - y
    };
  }
};
__name(_DragBase, "DragBase");
let DragBase = _DragBase;
function getDirection(diffX, diffY) {
  const MIN_SWIPE_OFFSET = 200;
  if (diffY < 0 && diffX > -MIN_SWIPE_OFFSET && diffX < MIN_SWIPE_OFFSET) return "top";
  if (diffY > 0 && diffX > -MIN_SWIPE_OFFSET && diffX < MIN_SWIPE_OFFSET) return "bottom";
  if (diffX < 0 && diffY > -MIN_SWIPE_OFFSET && diffY < MIN_SWIPE_OFFSET) return "left";
  if (diffX > 0 && diffY > -MIN_SWIPE_OFFSET && diffY < MIN_SWIPE_OFFSET) return "right";
  if (diffX <= -MIN_SWIPE_OFFSET && diffY <= -MIN_SWIPE_OFFSET) return "top-left";
  if (diffX >= MIN_SWIPE_OFFSET && diffY <= -MIN_SWIPE_OFFSET) return "top-right";
  if (diffX <= -MIN_SWIPE_OFFSET && diffY >= MIN_SWIPE_OFFSET) return "bottom-left";
  if (diffX >= MIN_SWIPE_OFFSET && diffY >= MIN_SWIPE_OFFSET) return "bottom-right";
}
__name(getDirection, "getDirection");
function getElement(element) {
  return element instanceof HTMLElement ? element : document.querySelector(element);
}
__name(getElement, "getElement");
const MULTIPLE_TOUCHES_MIN_NUMBER = 2;
const _TouchGestures = class _TouchGestures {
  constructor() {
    this.activeTouches = /* @__PURE__ */ new Map();
  }
  /**
   * Hold gesture - triggers after holding for specified time
   * @param {Object} options
   * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
   * @param {function} options.callback - Function to be executed on touch
   * @param {number} [options.time=1000] - Time in milliseconds for the press
   */
  hold(options) {
    if (!options) return console.error("Options not provided for hold!");
    let holdTimer;
    const element = getElement(options.element);
    if (!element) return console.error("Element not found!");
    const onHold = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.set(touches[0].identifier, touches[0]);
      holdTimer = setTimeout(() => {
        if (!options.callback) return;
        options.callback();
      }, options.time || 1e3);
    }, "onHold");
    const onHoldEnd = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.delete(touches[0].identifier);
      clearTimeout(holdTimer);
    }, "onHoldEnd");
    element.addEventListener("touchstart", onHold);
    element.addEventListener("touchend", onHoldEnd);
    return {
      /**
       * Removes the event listeners
       */
      remove() {
        element.removeEventListener("touchstart", onHold);
        element.removeEventListener("touchend", onHoldEnd);
      }
    };
  }
  /**
   * Tap gesture - single or multi-tap detection
   * @param {Object} options
   * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
   * @param {function} options.callback - Function to be executed on touch
   * @param {number} [options.tapsNumber=1] - Number of taps necessary for the callback to be executed
   * @param {number} [options.tapTime=200] - Time in milliseconds between putting down the finger and lifting it up
   * @param {number} [options.betweenTapsTime=500] - Time in milliseconds between two sequential taps
   */
  tap(options) {
    if (!options) return console.error("Options not provided for tap!");
    let tapTimer, betweenTapsTimer;
    let isTap = true;
    let tapCount = options.tapsNumber || 1;
    const element = getElement(options.element);
    if (!element) return console.error("Element not found!");
    const onTap = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.set(touches[0].identifier, touches[0]);
      clearTimeout(betweenTapsTimer);
      isTap = true;
      tapTimer = setTimeout(() => {
        isTap = false;
      }, options.tapTime || 200);
    }, "onTap");
    const onTapEnd = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.delete(touches[0].identifier);
      clearTimeout(tapTimer);
      if (!isTap) return;
      tapCount--;
      betweenTapsTimer = setTimeout(() => {
        tapCount = options.tapsNumber || 1;
        clearTimeout(betweenTapsTimer);
      }, options.betweenTapsTime || 500);
      if (tapCount !== 0 || !options.callback) return;
      options.callback();
      isTap = true;
      clearTimeout(tapTimer);
      tapCount = options.tapsNumber || 1;
    }, "onTapEnd");
    element.addEventListener("touchstart", onTap);
    element.addEventListener("touchend", onTapEnd);
    return {
      /**
       * Removes the event listeners
       */
      remove() {
        element.removeEventListener("touchstart", onTap);
        element.removeEventListener("touchend", onTapEnd);
      }
    };
  }
  /**
   * Drag gesture - tracks touch movement
   * @param {Object} options
   * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
   * @param {function} options.onDragStart - Function to be executed on drag start
   * @param {function} options.onDrag - Function to be executed on drag
   * @param {function} options.onDragEnd - Function to be executed on drag end
   */
  drag(options) {
    if (!options) return console.error("Options not provided for drag!");
    const element = getElement(options.element);
    if (!element) return console.error("Element not found!");
    const onDragStart = /* @__PURE__ */ __name(({ touches, target, currentTarget }) => {
      this.activeTouches.set(touches[0].identifier, touches[0]);
      document.addEventListener("touchmove", onDrag);
      document.addEventListener("touchend", onDragEnd);
      if (!options.onDragStart) return;
      options.onDragStart({ x: touches[0].clientX, y: touches[0].clientY, target, currentTarget });
    }, "onDragStart");
    const onDrag = /* @__PURE__ */ __name(({ touches }) => {
      if (!this.activeTouches.has(touches[0].identifier)) return;
      if (!options.onDrag) return;
      options.onDrag({ x: touches[0].clientX, y: touches[0].clientY });
    }, "onDrag");
    const onDragEnd = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.delete(touches[0].identifier);
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("touchend", onDragEnd);
      if (!options.onDragEnd) return;
      options.onDragEnd({ x: touches[0].clientX, y: touches[0].clientY });
    }, "onDragEnd");
    element.addEventListener("touchstart", onDragStart);
    return {
      /**
       * Removes the event listeners
       */
      remove() {
        element.removeEventListener("touchstart", onDragStart);
      }
    };
  }
  /**
   * Swipe gesture - detects directional swipes
   * @param {Object} options
   * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
   * @param {function} options.callback - Function to be executed on touch- Directions of the swipe
   * @param {number} options.touchNumber - Number of fingers necessary for the swipe
   */
  swipe(options) {
    if (!options) return console.error("Options not provided for swipe!");
    let swipeTimer;
    let direction;
    let distance;
    let isSwipe = true;
    const SWIPE_MIN_DISTANCE = 100;
    options.touchNumber ||= 1;
    const element = getElement(options.element);
    if (!element) return console.error("Element not found!");
    const onSwipeStart = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.set(touches[0].identifier, touches[0]);
      if (this.activeTouches.size > options.touchNumber) {
        document.removeEventListener("touchmove", onSwipe);
        document.removeEventListener("touchend", onSwipeEnd);
      }
      if (this.activeTouches.size !== options.touchNumber) return;
      swipeTimer = setTimeout(() => {
        isSwipe = false;
        clearTimeout(swipeTimer);
        swipeTimer = null;
      }, 1e3);
      document.addEventListener("touchmove", onSwipe);
      document.addEventListener("touchend", onSwipeEnd);
    }, "onSwipeStart");
    const onSwipe = /* @__PURE__ */ __name(({ touches }) => {
      if (!this.activeTouches.has(touches[0].identifier)) return;
      const startTouch = this.activeTouches.get(touches[0].identifier);
      if (!startTouch) return;
      const { clientX: startX, clientY: startY } = startTouch;
      const diffX = touches[0].clientX - startX;
      const diffY = touches[0].clientY - startY;
      direction = getDirection(diffX, diffY);
      distance = distanceBetweenTwoPoints(startX, startY, touches[0].clientX, touches[0].clientY);
    }, "onSwipe");
    const onSwipeEnd = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.delete(touches[0].identifier);
      if (this.activeTouches.size !== 0) return;
      document.removeEventListener("touchmove", onSwipe);
      document.removeEventListener("touchend", onSwipeEnd);
      if (isSwipeComplete()) {
        options.callback(direction);
      }
      clearTimeout(swipeTimer);
      isSwipe = true;
      swipeTimer = null;
    }, "onSwipeEnd");
    const isSwipeComplete = /* @__PURE__ */ __name(() => {
      return isSwipe && direction && distance && distance > SWIPE_MIN_DISTANCE;
    }, "isSwipeComplete");
    element.addEventListener("touchstart", onSwipeStart);
    return {
      /**
       * Removes the event listeners
       */
      remove() {
        element.removeEventListener("touchstart", onSwipeStart);
      }
    };
  }
  /**
   * Pinch gesture - two-finger pinch zoom
   * @param {Object} options
   * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
   * @param {function} options.callback - Function to be executed on touch
   */
  pinch(options) {
    if (!options) return console.error("Options not provided for pinch!");
    let distance;
    const PINCH_DELTA_NUMBER = 40;
    const element = getElement(options.element);
    if (!element) return console.error("Element not found!");
    const onPinchStart = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.set(touches[0].identifier, touches[0]);
      if (this.activeTouches.size < MULTIPLE_TOUCHES_MIN_NUMBER) return;
      const touch0 = this.activeTouches.get(0);
      const touch1 = this.activeTouches.get(1);
      if (!touch0 || !touch1) return;
      document.addEventListener("touchmove", onPinch);
      document.addEventListener("touchend", onPinchEnd);
      distance = distanceBetweenTwoPoints(
        touch0.clientX,
        touch0.clientY,
        touch1.clientX,
        touch1.clientY
      );
    }, "onPinchStart");
    const onPinch = /* @__PURE__ */ __name(({ touches }) => {
      if (this.activeTouches.size !== MULTIPLE_TOUCHES_MIN_NUMBER) return;
      this.activeTouches.set(touches[0].identifier, touches[0]);
      const touch1 = this.activeTouches.get(0);
      const touch2 = this.activeTouches.get(1);
      if (!touch1 || !touch2) return;
      const newDistance = distanceBetweenTwoPoints(
        touch1.clientX,
        touch1.clientY,
        touch2.clientX,
        touch2.clientY
      );
      const pinchDelta = Math.sign(newDistance - distance) * PINCH_DELTA_NUMBER;
      distance = newDistance;
      const midpoint = getMidPoint(
        touch1.clientX,
        touch1.clientY,
        touch2.clientX,
        touch2.clientY
      );
      if (options.callback) options.callback({ pinchDelta, midpoint });
    }, "onPinch");
    const onPinchEnd = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.delete(touches[0].identifier);
      if (this.activeTouches.size !== 0) return;
      document.removeEventListener("touchmove", onPinch);
      document.removeEventListener("touchend", onPinchEnd);
    }, "onPinchEnd");
    element.addEventListener("touchstart", onPinchStart);
    return {
      /**
       * Removes the event listeners
       */
      remove() {
        element.removeEventListener("touchstart", onPinchStart);
      }
    };
  }
  /**
   *
   * @param {Object} options
   * @param {HTMLElement | string} options.element - Element you want to attach the touch event to
   * @param {function} options.callback - Function to be executed on touch
   */
  rotate(options) {
    if (!options) return console.error("Options not provided for rotate!");
    let angle = 0;
    let initialAngle = 0;
    const element = getElement(options.element);
    if (!element) return console.error("Element not found!");
    const onRotate = /* @__PURE__ */ __name(({ touches }) => {
      if (this.activeTouches.size < MULTIPLE_TOUCHES_MIN_NUMBER) return;
      this.activeTouches.set(touches[0].identifier, touches[0]);
      angle = getAngle() - initialAngle;
      if (options.callback) options.callback(angle);
    }, "onRotate");
    const onRotateStart = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.set(touches[0].identifier, touches[0]);
      if (this.activeTouches.size !== MULTIPLE_TOUCHES_MIN_NUMBER) return;
      initialAngle = getAngle() - angle;
      document.addEventListener("touchmove", onRotate);
      document.addEventListener("touchend", onRotateEnd);
    }, "onRotateStart");
    const onRotateEnd = /* @__PURE__ */ __name(({ touches }) => {
      this.activeTouches.delete(touches[0].identifier);
      document.removeEventListener("touchmove", onRotate);
      document.removeEventListener("touchend", onRotateEnd);
    }, "onRotateEnd");
    element.addEventListener("touchstart", onRotateStart);
    const getAngle = /* @__PURE__ */ __name(() => {
      const fullRotation2 = 360;
      const rotationOffset2 = 90;
      const offsetY = this.activeTouches.get(0).clientY - this.activeTouches.get(1).clientY;
      const offsetX = this.activeTouches.get(0).clientX - this.activeTouches.get(1).clientX;
      return (toDeg(Math.atan2(offsetY, offsetX)) + fullRotation2 + rotationOffset2) % fullRotation2;
    }, "getAngle");
    return {
      /**
       * Removes the event listeners
       */
      remove() {
        element.removeEventListener("touchstart", onRotateStart);
      }
    };
  }
};
__name(_TouchGestures, "TouchGestures");
let TouchGestures = _TouchGestures;
const touchGestures = new TouchGestures();
const AXIS = ["x", "y"];
const _Draggable = class _Draggable extends DragBase {
  constructor(options) {
    super(options);
    this.actionName = `drag-around-${createHash()}`;
    this.restrict = { top: 0, left: 0, right: Infinity, bottom: Infinity };
    this.touchEvents = [];
    this._touchEnabled = false;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.init();
  }
  /**
   * Enables or disabled touch events
   */
  set touchEnabled(enabled) {
    if (this._touchEnabled === enabled) return;
    this._touchEnabled = enabled;
    this._touchEnabled ? this.addTouchEvents() : this.removeTouchEvents();
  }
  init() {
    if (this.enabled) return;
    this.draggableElements = document.querySelectorAll(this.options.element);
    if (this.draggableElements.length === 0) {
      return console.error(`${this.options.element} is not a valid element selector.`);
    }
    this.draggableElements.forEach((element) => element.addEventListener("mousedown", this.onMouseDown));
    this.registerDragActions();
    this.enabled = true;
  }
  /**
   * Removes the eventlisteners
   */
  deinit() {
    if (!this.enabled) return;
    this.enabled = false;
    this.draggableElements.forEach((element) => element.removeEventListener("mousedown", this.onMouseDown));
    this.removeDragActions();
  }
  /**
   * mousedown event handler
   */
  onMouseDown(event) {
    this.draggedElement = event.currentTarget;
    this.draggedElement.style.position = "absolute";
    this.elementRect = this.draggedElement.getBoundingClientRect();
    this.setRestriction();
    this.setPointerOffset(event.clientX, event.clientY, this.draggedElement);
    actions.execute(this.actionName, {
      x: event.clientX + this.bodyScrollOffset.x - this.offset.x,
      y: event.clientY + this.bodyScrollOffset.y - this.offset.y,
      index: this.draggedItemIndex
    });
    this.options.dragClass && this.draggedElement.classList.add(this.options.dragClass);
    this.options.onDragStart && this.options.onDragStart(this.draggedElement);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  /**
   * mousemove event handler
   */
  onMouseMove(event) {
    actions.execute(this.actionName, {
      x: event.clientX + this.bodyScrollOffset.x - this.offset.x,
      y: event.clientY + this.bodyScrollOffset.y - this.offset.y,
      index: this.draggedItemIndex
    });
  }
  /**
   * mouseup event handler
   */
  onMouseUp() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    this.options.onDragEnd && this.options.onDragEnd(this.draggedElement);
    this.options.dragClass && this.draggedElement.classList.remove(this.options.dragClass);
    this.draggedElement = null;
  }
  /**
   * Register dragging as an action to be able to use it externally
   */
  registerDragActions() {
    actions.register(this.actionName, ({ x, y, index }) => {
      if (!this.draggableElements[index]) return console.error(`There is no draggable element at index ${index}`);
      if (this.options.lockAxis && AXIS.includes(this.options.lockAxis)) {
        x = this.options.lockAxis === "y" ? this.elementRect.x : x;
        y = this.options.lockAxis === "x" ? this.elementRect.y : y;
      }
      this.draggableElements[index].style.left = `${clamp(x, this.restrict.left, this.restrict.right)}px`;
      this.draggableElements[index].style.top = `${clamp(y, this.restrict.top, this.restrict.bottom)}px`;
      this.options.onDragMove && this.options.onDragMove({ x, y });
    });
  }
  /**
   * Removes the registered action
   */
  removeDragActions() {
    actions.remove(this.actionName);
  }
  /**
   * Add touch gestures to drag the element
   */
  addTouchEvents() {
    this.draggableElements.forEach((element) => {
      this.touchEvents.push(
        touchGestures.drag({
          element,
          onDragStart: /* @__PURE__ */ __name((event) => {
            this.onMouseDown({ currentTarget: event.currentTarget, clientX: event.x, clientY: event.y });
          }, "onDragStart"),
          onDrag: /* @__PURE__ */ __name(({ x, y }) => {
            this.onMouseMove({ clientX: x, clientY: y });
          }, "onDrag"),
          onDragEnd: /* @__PURE__ */ __name(() => {
            this.onMouseUp();
          }, "onDragEnd")
        })
      );
    });
  }
  /**
   * Removes the touch gestures
   */
  removeTouchEvents() {
    this.touchEvents.forEach((event) => event?.remove());
    this.touchEvents = [];
  }
  /**
   * Sets the bounds if a dragged element has to be restricted
   */
  setRestriction() {
    if (!this.options.restrictTo) return;
    const restrictTo = document.querySelector(this.options.restrictTo);
    if (!restrictTo) {
      return console.error(
        `The element ${this.options.restrictTo} you trying to restrict dragging to is not a valid element`
      );
    }
    const { x, y, height, width } = restrictTo.getBoundingClientRect();
    this.restrict = {
      top: y,
      left: x,
      right: width + x - this.elementRect.width,
      bottom: height + y - this.elementRect.height
    };
  }
};
__name(_Draggable, "Draggable");
const _Dropzone = class _Dropzone extends DragBase {
  constructor(options) {
    super(options);
    this.dropzones = [];
    this.draggedOver = null;
    this.touchEvents = [];
    this._touchEnabled = false;
    this.options = options;
    const hash = createHash();
    this.actionName = `drag-and-drop-${hash}`;
    this.automaticAction = `move-to-${hash}`;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.init();
  }
  /**
   * Enables or disabled touch events
   */
  set touchEnabled(enabled) {
    if (this._touchEnabled === enabled) return;
    this._touchEnabled = enabled;
    this._touchEnabled ? this.addTouchEvents() : this.removeTouchEvents();
  }
  init() {
    if (this.enabled) return;
    this.draggableElements = document.querySelectorAll(this.options.element);
    if (this.draggableElements.length === 0) {
      return console.error(`${this.options.element} is not a valid element selector.`);
    }
    this.draggableElements.forEach((element) => element.addEventListener("mousedown", this.onMouseDown));
    this.createDropzones();
    if (this.dropzones.length === 0) return;
    this.dropzones.forEach((dropzone) => {
      dropzone.addEventListener("mouseenter", this.onMouseEnter);
      dropzone.addEventListener("mouseleave", this.onMouseLeave);
    });
    this.registerDragActions();
    this.enabled = true;
  }
  /**
   * Deinitializes the dragging
   */
  deinit() {
    if (!this.enabled) return;
    this.draggableElements.forEach((element) => element.removeEventListener("mousedown", this.onMouseDown));
    this.dropzones.forEach((dropzone) => {
      dropzone.removeEventListener("mouseenter", this.onMouseEnter);
      dropzone.removeEventListener("mouseleave", this.onMouseLeave);
    });
    this.removeActions();
    this.enabled = false;
  }
  /**
   * mousedown event handler
   */
  onMouseDown(event) {
    this.draggedElement = event.currentTarget;
    this.draggedElement.style.position = "absolute";
    this.draggedElement.style.pointerEvents = "none";
    this.setPointerOffset(event.clientX, event.clientY, this.draggedElement);
    actions.execute(this.actionName, {
      x: event.clientX + this.bodyScrollOffset.x - this.offset.x,
      y: event.clientY + this.bodyScrollOffset.y - this.offset.y,
      index: this.draggedItemIndex
    });
    this.options.dragStyle && this.draggedElement.classList.add(this.options.dragStyle);
    this.options.onDragStart && this.options.onDragStart(this.draggedElement);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  /**
   * mousemove event handler
   */
  onMouseMove(event) {
    actions.execute(this.actionName, {
      x: event.clientX + this.bodyScrollOffset.x - this.offset.x,
      y: event.clientY + this.bodyScrollOffset.y - this.offset.y,
      index: this.draggedItemIndex
    });
  }
  /**
   * mouseup event handler
   */
  onMouseUp() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    if (this.draggedElement) {
      this.draggedElement.style.position = "";
      this.draggedElement.style.pointerEvents = "";
      this.draggedElement.style.left = "";
      this.draggedElement.style.top = "";
      this.options.onDragEnd && this.options.onDragEnd(this.draggedElement);
      this.options.dragStyle && this.draggedElement.classList.remove(this.options.dragStyle);
    }
    this.draggedOver && this.handleDrop();
    this.draggedElement = null;
  }
  /**
   * Handler for the mouseenter event
   */
  onMouseEnter(event) {
    if (!this.draggedElement) return;
    this.draggedOver = event.currentTarget;
    if (this.options.dropzoneActiveClass) {
      this.draggedOver.classList.add(this.options.dropzoneActiveClass);
    }
  }
  /**
   * Handler for the mouseleave event
   */
  onMouseLeave() {
    if (!this.draggedElement) return;
    if (this.options.dropzoneActiveClass && this.draggedOver) {
      this.draggedOver.classList.remove(this.options.dropzoneActiveClass);
    }
    this.draggedOver = null;
  }
  /**
   * Register dragging as an action to be able to use it externally
   */
  registerDragActions() {
    actions.register(this.actionName, ({ x, y, index }) => {
      if (!this.draggableElements[index]) return console.error(`There is no draggable element at index ${index}`);
      this.draggableElements[index].style.left = `${x}px`;
      this.draggableElements[index].style.top = `${y}px`;
      this.options.onDragMove && this.options.onDragMove({ x, y });
    });
    actions.register(this.automaticAction, this.automaticMove.bind(this));
  }
  /**
   * Removes the registered actions
   */
  removeActions() {
    actions.remove(this.actionName);
    actions.remove(this.automaticAction);
  }
  /* eslint-disable max-lines-per-function*/
  /**
   * Adds touch events to the draggable elements
   */
  addTouchEvents() {
    this.draggableElements.forEach((element) => {
      this.touchEvents.push(
        touchGestures.drag({
          element,
          onDragStart: /* @__PURE__ */ __name((event) => {
            this.onMouseDown({ currentTarget: event.currentTarget, clientX: event.x, clientY: event.y });
          }, "onDragStart"),
          onDrag: /* @__PURE__ */ __name(({ x, y }) => {
            this.onMouseMove({ clientX: x, clientY: y });
            const elementOver = document.elementFromPoint(x, y);
            let dropzone = this.options.dropzones.reduce((acc, dropzone2) => {
              if (acc || !elementOver) return acc;
              return acc = elementOver.closest(dropzone2);
            }, null);
            if (!dropzone) {
              dropzone = this.dropzones.includes(elementOver) ? elementOver : null;
            }
            if (dropzone) {
              this.onMouseEnter({ currentTarget: dropzone });
              return;
            }
            this.onMouseLeave();
          }, "onDrag"),
          onDragEnd: /* @__PURE__ */ __name(() => {
            this.onMouseUp();
          }, "onDragEnd")
        })
      );
    });
  }
  /* eslint-enable max-lines-per-function */
  /**
   * Removes the touch gestures
   */
  removeTouchEvents() {
    this.touchEvents.forEach((event) => event?.remove());
    this.touchEvents = [];
  }
  /**
   * Automatically drags an element to a dropzone
   * @param {Object} options
   * @param {number} options.elementIndex The index of the element you want to move
   * @param {number} options.dropzoneIndex The index of the dropzone you want to move the element to
   */
  automaticMove({ elementIndex, dropzoneIndex }) {
    const { x, y } = this.dropzones[dropzoneIndex].getBoundingClientRect();
    const { x: elementX, y: elementY } = this.draggableElements[elementIndex].getBoundingClientRect();
    const direction = {
      x: Math.sign(x - elementX),
      y: Math.sign(y - elementY)
    };
    this.draggableElements[elementIndex].style.position = "absolute";
    const loop = /* @__PURE__ */ __name((newX, newY) => {
      if (newX === x && newY === y) {
        this.dropzones[dropzoneIndex].appendChild(this.draggableElements[elementIndex]);
        this.draggableElements[elementIndex].style.position = "";
        return;
      }
      newX = newX !== x ? direction.x + newX : newX;
      newY = newY !== y ? direction.y + newY : newY;
      this.draggableElements[elementIndex].style.left = `${newX}px`;
      this.draggableElements[elementIndex].style.top = `${newY}px`;
      if (newX !== x || newY !== y) requestAnimationFrame(() => loop(newX, newY));
    }, "loop");
    loop(elementX, elementY);
  }
  /**
   * Saves the dropzones
   */
  createDropzones() {
    this.dropzones = this.options.dropzones.reduce((acc, dropzone) => {
      const dropzoneElements = [...document.querySelectorAll(dropzone)];
      if (dropzoneElements.length === 0) {
        console.error(`${dropzone} is not a valid html element to be used as a dropzone`);
      }
      return acc.concat(dropzoneElements);
    }, []);
  }
  /**
   * Handler when you drop the dragged item
   */
  handleDrop() {
    let dropType = this.options.dropType;
    const eventData = {
      preventDefault: /* @__PURE__ */ __name(() => {
        dropType = "ignore";
      }, "preventDefault"),
      target: this.draggedElement,
      dropzone: this.draggedOver
    };
    if (this.options.onDrop) this.options.onDrop(eventData);
    if (dropType === "ignore" || !this.draggedOver) return;
    if (this.draggedOver.children.length === 0) dropType = "add";
    switch (dropType) {
      case "add":
        this.draggedOver.appendChild(this.draggedElement);
        break;
      case "shift":
        this.shiftElements();
        break;
      case "switch":
        this.draggedElement?.parentNode.appendChild(this.draggedOver.children[0]);
        this.draggedOver.appendChild(this.draggedElement);
        break;
    }
    this.onMouseLeave();
  }
  /**
   * Shifts the element to the nearest empty space
   */
  shiftElements() {
    const dropzoneIndex = this.dropzones.findIndex((dropzone) => dropzone === this.draggedOver);
    const dropzoneChildren = this.dropzones.map((dropzone) => {
      if (dropzone.children[0] === this.draggedElement) return [];
      return [...dropzone.children];
    });
    const closestEmptyIndex = dropzoneChildren.reduce((acc, el, index) => {
      if (el.length === 0) acc = Math.abs(dropzoneIndex - index) < Math.abs(dropzoneIndex - acc) ? index : acc;
      return acc;
    }, 1e5);
    const directionEmpty = Math.sign(dropzoneIndex - closestEmptyIndex) > 0 ? 0 : 1;
    const directionDropzone = Math.sign(dropzoneIndex - closestEmptyIndex) < 0 ? 0 : 1;
    dropzoneChildren.splice(dropzoneIndex + directionDropzone, 0, [this.draggedElement]);
    dropzoneChildren.splice(closestEmptyIndex + directionEmpty, 1);
    dropzoneChildren.forEach((children, index) => {
      children.forEach((child) => this.dropzones[index].appendChild(child));
    });
  }
};
__name(_Dropzone, "Dropzone");
const fullRotation = 360;
const rotationOffset = 90;
const _Rotate = class _Rotate {
  constructor(options) {
    this.rotatingElement = null;
    this.elementPosition = { x: 0, y: 0 };
    this.angle = 0;
    this.enabled = false;
    this.initalAngle = 0;
    this.actionName = `rotate-${createHash()}`;
    this.touchEvents = null;
    this._touchEnabled = false;
    this.options = options;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.init();
  }
  /**
   * Enables or disabled touch events
   */
  set touchEnabled(enabled) {
    if (this._touchEnabled === enabled) return;
    this._touchEnabled = enabled;
    this._touchEnabled ? this.addTouchEvents() : this.removeTouchEvents();
  }
  /**
   * Initializes the rotation
   */
  init() {
    if (this.enabled) return;
    this.rotatingElement = this.rotatingElement || document.querySelector(this.options.element);
    if (!this.rotatingElement) return console.error(`${this.options.element} is not a valid element selector`);
    this.rotatingElement.addEventListener("mousedown", this.onMouseDown);
    this.registerAction();
    this.enabled = true;
  }
  /**
   * Deinitilizes the rotation
   */
  deinit() {
    if (!this.enabled) return;
    this.rotatingElement.removeEventListener("mousedown", this.onMouseDown);
    this.removeActions();
    this.enabled = false;
  }
  /**
   * Handles the mousedown event
   */
  onMouseDown(event) {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    const { x, y, height, width } = this.rotatingElement.getBoundingClientRect();
    this.elementPosition = { x: x + width / 2, y: y + height / 2 };
    const angle = this.getAngle(event.clientX, event.clientY);
    this.initalAngle = angle - this.angle;
  }
  /**
   * Handles the mousemove event
   */
  onMouseMove(event) {
    this.angle = this.getAngle(event.clientX, event.clientY) - this.initalAngle;
    if (this.options.snapAngle) {
      this.angle = Math.floor(this.angle / this.options.snapAngle) * this.options.snapAngle;
    }
    actions.execute(this.actionName, this.angle);
  }
  /**
   * Handles the mouseup event
   */
  onMouseUp() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }
  /**
   * Registers the actions
   */
  registerAction() {
    actions.register(this.actionName, (angle) => {
      this.rotatingElement.style.transform = `rotate(${angle}deg)`;
      this.options.onRotation && this.options.onRotation(angle < 0 ? fullRotation + angle : angle);
    });
  }
  /**
   * Removes the action
   */
  removeActions() {
    actions.remove(this.actionName);
  }
  /**
   * Add rotate touch events
   */
  addTouchEvents() {
    this.touchEvents = touchGestures.drag({
      element: this.rotatingElement,
      onDragStart: /* @__PURE__ */ __name(({ x, y }) => {
        this.onMouseDown({ clientX: x, clientY: y });
      }, "onDragStart"),
      onDrag: /* @__PURE__ */ __name(({ x, y }) => {
        this.onMouseMove({ clientX: x, clientY: y });
      }, "onDrag"),
      onDragEnd: /* @__PURE__ */ __name(() => {
        this.onMouseUp();
      }, "onDragEnd")
    });
  }
  /**
   * Removes the touch events
   */
  removeTouchEvents() {
    this.touchEvents?.remove();
    this.touchEvents = null;
  }
  /**
   * Finds the angle from the mouse coordinates based on the center of the element that is rotating
   */
  getAngle(x, y) {
    const offsetX = x - this.elementPosition.x;
    const offsetY = y - this.elementPosition.y;
    return (toDeg(Math.atan2(offsetY, offsetX)) + fullRotation + rotationOffset) % fullRotation;
  }
};
__name(_Rotate, "Rotate");
const _Resize = class _Resize {
  constructor(options) {
    this.enabled = false;
    this.activeEdge = null;
    this.edges = {
      bottom: null,
      right: null,
      bottomRight: null
    };
    this.elementRect = { x: 0, y: 0 };
    this.touchEvents = null;
    this._touchEnabled = false;
    const hash = createHash();
    this.heightAction = `resize-height-${hash}`;
    this.widthAction = `resize-width-${hash}`;
    this.options = options;
    this.options.edgeWidth = options.edgeWidth ?? 5;
    this.options.heightMin = this.options.heightMin ?? 50;
    this.options.heightMax = this.options.heightMax ?? window.innerHeight;
    this.options.widthMin = this.options.widthMin ?? 50;
    this.options.widthMax = this.options.widthMax ?? window.innerWidth;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.init();
  }
  /**
   * Enables or disabled touch events
   */
  set touchEnabled(enabled) {
    if (this._touchEnabled === enabled) return;
    this._touchEnabled = enabled;
    this._touchEnabled ? this.addTouchEvents() : this.removeTouchEvents();
  }
  /**
   * Initializes the resizing
   */
  init() {
    if (this.enabled) return;
    this.resizableElement = document.querySelector(this.options.element);
    if (!this.resizableElement) return console.error(`${this.options.element} is not a correct selector`);
    this.resizableElement.addEventListener("mousedown", this.onMouseDown);
    this.addEdges();
    this.registerActions();
    this.enabled = true;
  }
  /**
   * Deinitilazes the resizing
   */
  deinit() {
    if (!this.enabled) return;
    this.resizableElement.removeEventListener("mousedown", this.onMouseDown);
    this.removeEdges();
    this.removeActions();
    this.enabled = false;
  }
  /**
   * Handles the mousedown event
   */
  onMouseDown(event) {
    this.activeEdge = this.setEdge(event.target);
    if (!this.activeEdge) return;
    const { x, y } = this.resizableElement.getBoundingClientRect();
    this.elementRect = { x, y };
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  /**
   * Handles the mousemove event
   */
  onMouseMove(event) {
    const offsetX = event.clientX - this.elementRect.x;
    const offsetY = event.clientY - this.elementRect.y;
    switch (this.activeEdge) {
      case "bottom":
        actions.execute(this.heightAction, offsetY);
        this.options.onHeightChange && this.options.onHeightChange(offsetY);
        break;
      case "right":
        actions.execute(this.widthAction, offsetX);
        this.options.onWidthChange && this.options.onWidthChange(offsetX);
        break;
      case "bottomRight":
        actions.execute(this.heightAction, offsetY);
        actions.execute(this.widthAction, offsetX);
        this.options.onWidthChange && this.options.onWidthChange(offsetX);
        this.options.onHeightChange && this.options.onHeightChange(offsetY);
        break;
    }
  }
  /**
   * Handles the mouseup event
   */
  onMouseUp() {
    this.activeEdge = null;
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }
  /**
   * Adds the touch events to fire the actions
   */
  addTouchEvents() {
    this.touchEvents = touchGestures.drag({
      element: this.resizableElement,
      onDragStart: /* @__PURE__ */ __name((event) => {
        this.onMouseDown(event);
      }, "onDragStart"),
      onDrag: /* @__PURE__ */ __name(({ x, y }) => {
        this.onMouseMove({ clientX: x, clientY: y });
      }, "onDrag"),
      onDragEnd: /* @__PURE__ */ __name(() => {
        this.onMouseUp();
      }, "onDragEnd")
    });
  }
  /**
   * Removes the touch events
   */
  removeTouchEvents() {
    this.touchEvents?.remove();
    this.touchEvents = null;
  }
  /**
   * Sets the active edge when resizing. If there is no edge it returns null
   */
  setEdge(element) {
    if (element.dataset.edge) return element.dataset.edge;
    return null;
  }
  /**
   * Checks if the element you are trying to resize has already position relative or absolute set, so it doesn't overwrite them
   */
  checkPosition() {
    const { position } = getComputedStyle(this.resizableElement);
    if (position === "absolute" || position === "relative") return;
    this.resizableElement.style.position = "relative";
  }
  /**
   * Creates the edge elements and appends them to the resizable element
   */
  addEdges() {
    this.checkPosition();
    const { width, height } = this.resizableElement.getBoundingClientRect();
    Object.entries(this.edges).forEach(([edge, element]) => {
      element = document.createElement("DIV");
      element.dataset.edge = edge;
      element.style.position = "absolute";
      switch (edge) {
        case "bottom":
          element.style.width = `${width - this.options.edgeWidth}px`;
          element.style.height = `${this.options.edgeWidth}px`;
          element.style.bottom = `-${this.options.edgeWidth}px`;
          break;
        case "bottomRight":
          element.style.width = `${this.options.edgeWidth}px`;
          element.style.height = `${this.options.edgeWidth}px`;
          element.style.bottom = `-${this.options.edgeWidth}px`;
          element.style.right = `-${this.options.edgeWidth}px`;
          break;
        case "right":
          element.style.width = `${this.options.edgeWidth}px`;
          element.style.height = `${height - this.options.edgeWidth}px`;
          element.style.right = `-${this.options.edgeWidth}px`;
          break;
      }
      this.edges[edge] = element;
      this.resizableElement.appendChild(element);
    });
  }
  /**
   * Removes the edge elements
   */
  removeEdges() {
    Object.values(this.edges).forEach((edge) => {
      this.resizableElement.removeChild(edge);
    });
  }
  /**
   * Registers actions
   */
  registerActions() {
    actions.register(this.heightAction, (height) => {
      this.resizableElement.style.height = `${clamp(height, this.options.heightMin, this.options.heightMax)}px`;
      this.edges.right.style.height = `${clamp(height, this.options.heightMin, this.options.heightMax) - this.options.edgeWidth}px`;
    });
    actions.register(this.widthAction, (width) => {
      this.resizableElement.style.width = `${clamp(width, this.options.widthMin, this.options.widthMax)}px`;
      this.edges.bottom.style.width = `${clamp(width, this.options.widthMin, this.options.widthMax) - this.options.edgeWidth}px`;
    });
  }
  /**
   * Removes the registered actions
   */
  removeActions() {
    actions.remove(this.heightAction);
    actions.remove(this.widthAction);
  }
};
__name(_Resize, "Resize");
const _Zoom = class _Zoom {
  constructor(options) {
    this.enabled = false;
    this.actionName = `pan-and-zoom-${createHash()}`;
    this.offset = { x: 0, y: 0 };
    this.transform = { x: 0, y: 0, scale: 1 };
    this.touchEvents = null;
    this._touchEnabled = false;
    this.options = options;
    this.options.maxZoom = this.options.maxZoom || Infinity;
    this.options.minZoom = this.options.minZoom || 0.1;
    this.options.zoomFactor = this.options.zoomFactor || 0.1;
    this.onWheel = this.onWheel.bind(this);
    this.init();
  }
  /**
   * Enables or disabled touch events
   */
  set touchEnabled(enabled) {
    if (this._touchEnabled === enabled) return;
    this._touchEnabled = enabled;
    this._touchEnabled ? this.addTouchEvents() : this.removeTouchEvents();
  }
  /**
   * Initialize the pan and zoom
   */
  init() {
    if (this.enabled) return;
    this.zoomableElement = document.querySelector(this.options.element);
    if (!this.zoomableElement) return console.error(`${this.options.element} is not a correct element selector`);
    this.zoomableElement.addEventListener("wheel", this.onWheel);
    this.registerActions();
    this.zoomableElement.style.transformOrigin = "top left";
    this.enabled = true;
  }
  /**
   * Deinitilize the pan and zoom
   */
  deinit() {
    if (!this.enabled) return;
    this.zoomableElement.removeEventListener("wheel", this.onWheel);
    this.removeActions();
    this.enabled = false;
  }
  /**
   * Handles the wheel event
   */
  onWheel(event) {
    event.preventDefault();
    actions.execute(this.actionName, {
      x: event.clientX,
      y: event.clientY,
      zoomDirection: Math.sign(event.deltaY)
    });
  }
  /**
   * Registers the actions for the pan and zoom
   */
  registerActions() {
    actions.register(this.actionName, ({ x, y, zoomDirection }) => {
      const offset = this.calculateOffsets(x, y);
      this.options.onZoom && this.options.onZoom();
      const scale = Number((this.transform.scale - zoomDirection * this.options.zoomFactor).toFixed(5));
      if (scale < this.options.minZoom || scale > this.options.maxZoom) return;
      const zoomPoint = {
        x: offset.x / this.transform.scale,
        y: offset.y / this.transform.scale
      };
      const transform = this.transform;
      transform.x += zoomPoint.x * (this.transform.scale - scale);
      transform.y += zoomPoint.y * (this.transform.scale - scale);
      transform.scale = scale;
      this.zoomableElement.style.transform = `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.x}, ${transform.y})`;
      this.transform = transform;
    });
  }
  /**
   * Removes the registered actions
   */
  removeActions() {
    actions.remove(this.actionName);
  }
  /**
   * Add pinch and stretch touch events
   */
  addTouchEvents() {
    this.touchEvents = touchGestures.pinch({
      element: this.zoomableElement,
      callback: /* @__PURE__ */ __name(({ pinchDelta, midpoint }) => {
        actions.execute(this.actionName, {
          x: midpoint.x,
          y: midpoint.y,
          zoomDirection: Math.sign(pinchDelta) * -1
        });
      }, "callback")
    });
  }
  /**
   * Removes the touch events
   */
  removeTouchEvents() {
    this.touchEvents?.remove();
    this.touchEvents = null;
  }
  /**
   * Calculates the mouse coordinates inside the element
   */
  calculateOffsets(x, y) {
    const elementRect = this.zoomableElement.getBoundingClientRect();
    return {
      x: x - elementRect.x,
      y: y - elementRect.y
    };
  }
};
__name(_Zoom, "Zoom");
IM$1.init();

const NavigationArea = (props) => {
  const nav = useNavigation();
  if (!nav) throw new Error("useNavigation must be used within Navigation");
  const cachedChildren = children(() => props.children);
  const navigatableElements = props.selector ? [`.${props.selector}`] : cachedChildren();
  const refresh = () => {
    if (!spatialNavigation.enabled) return;
    deinit();
    init(false);
  };
  const init = (focus) => {
    nav.registerArea(props.name, navigatableElements, focus);
  };
  const deinit = () => {
    nav.unregisterArea(props.name);
  };
  createEffect(on(cachedChildren, refresh, {
    defer: true
  }));
  onMount(() => {
    const shouldFocus = props.focused || props.name === nav.getScope();
    init(shouldFocus);
  });
  onCleanup(() => deinit());
  return memo(cachedChildren);
};

const DEFAULT_ACTIONS = {
  "move-left": {
    key: { binds: ["ARROW_LEFT"], type: ["press", "hold"] },
    button: { binds: ["pad-left"], type: "hold" },
    global: true
  },
  "move-right": {
    key: { binds: ["ARROW_RIGHT"], type: ["press", "hold"] },
    button: { binds: ["pad-right"], type: "hold" },
    global: true
  },
  "move-up": {
    key: { binds: ["ARROW_UP"], type: ["press", "hold"] },
    button: { binds: ["pad-up"], type: "hold" },
    global: true
  },
  "move-down": {
    key: { binds: ["ARROW_DOWN"], type: ["press", "hold"] },
    button: { binds: ["pad-down"], type: "hold" },
    global: true
  },
  "select": {
    key: { binds: ["ENTER"], type: ["press"] },
    button: { binds: ["face-button-down"], type: "press" },
    global: true
  },
  "back": {
    key: { binds: ["ESC"], type: ["press"] },
    button: { binds: ["face-button-right"], type: "press" },
    global: true
  },
  "pan": {
    button: { binds: ["right.joystick"], type: "hold" },
    global: true,
    paused: true
  }
};
const DEFAULT_ACTION_NAMES = new Set(
  Object.keys(DEFAULT_ACTIONS)
);

function waitForFrames(callback, frames = 3) {
  if (frames === 0) return callback();
  frames--;
  requestAnimationFrame(() => waitForFrames(callback, frames));
}

function createAreaMethods(areas, setConfig) {
  const registerArea = (area, elements, focused) => {
    waitForFrames(() => {
      spatialNavigation[spatialNavigation.enabled ? "add" : "init"]([
        { area, elements }
      ]);
      areas.add(area);
      focused && focusFirst(area);
    }, spatialNavigation.enabled ? 1 : 3);
  };
  const unregisterArea = (area) => {
    spatialNavigation.remove(area);
    areas.delete(area);
  };
  const pauseNavigation = () => {
    if (spatialNavigation.paused) {
      return console.warn("Navigation is already paused!");
    }
    spatialNavigation.pause();
  };
  const resumeNavigation = () => {
    if (!spatialNavigation.paused) {
      return console.warn("Navigation is not paused!");
    }
    spatialNavigation.resume();
  };
  const isAreaValid = (area) => {
    if (!areas.has(area)) {
      console.warn(`Area "${area}" not registered. Available areas:`, Array.from(areas));
      return false;
    }
    return true;
  };
  const focusFirst = (area) => {
    if (!isAreaValid(area)) return;
    spatialNavigation.focusFirst(area);
    setConfig("scope", area);
  };
  const focusLast = (area) => {
    if (!isAreaValid(area)) return;
    spatialNavigation.focusLast(area);
    setConfig("scope", area);
  };
  const switchArea = (area) => {
    if (!isAreaValid(area)) return;
    spatialNavigation.switchArea(area);
    setConfig("scope", area);
  };
  const clearFocus = () => spatialNavigation.clearFocus();
  const changeNavigationKeys = (keys, clearCurrent = false) => {
    spatialNavigation.changeKeys(keys, { clearCurrentActiveKeys: clearCurrent });
  };
  const resetNavigationKeys = () => spatialNavigation.resetKeys();
  return {
    registerArea,
    unregisterArea,
    focusFirst,
    focusLast,
    switchArea,
    clearFocus,
    changeNavigationKeys,
    resetNavigationKeys,
    pauseNavigation,
    resumeNavigation
  };
}

class EventBus {
  constructor() {
    this._logLevel = "warn";
    this.registeredEvents = {};
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(level) {
    this._logLevel = level;
  }
  warn(message) {
    if (this.logLevel !== "warn") return;
    console.warn(`[EventBus] ${message}`);
  }
  on(event, callback) {
    if (!this.registeredEvents[event]) {
      this.registeredEvents[event] = /* @__PURE__ */ new Set();
    }
    if (this.registeredEvents[event].has(callback)) {
      this.warn(`Registering again. Callback is already registered for the ${event} event.`);
      return;
    }
    this.registeredEvents[event].add(callback);
  }
  off(event, callback) {
    const eventSet = this.registeredEvents[event];
    if (!eventSet) {
      this.warn(`Nothing to remove. No callbacks registered for the ${event} event.`);
      return;
    }
    if (eventSet.has(callback)) eventSet.delete(callback);
    if (eventSet.size === 0) delete this.registeredEvents[event];
  }
  emit(event, ...args) {
    const eventSet = this.registeredEvents[event];
    if (!eventSet) {
      this.warn(`Emitting event with no listeners. No callbacks registered for the ${event} event.`);
      return;
    }
    eventSet.forEach((cb) => cb(...args));
  }
  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
  hasRegistered(event, callback) {
    if (!callback) return this.registeredEvents[event] !== void 0;
    return this.registeredEvents[event]?.has(callback);
  }
}
const eventBus = new EventBus();

function createActionMethods(config, setConfig) {
  const actionSubscribers = /* @__PURE__ */ new Map();
  const forcePausedActions = /* @__PURE__ */ new Set();
  const inputCaptureSnapshot = /* @__PURE__ */ new Set();
  const registerAction = (actionName) => {
    const { key, button, callback, global } = getAction(actionName);
    const shouldEmitGlobally = DEFAULT_ACTION_NAMES.has(actionName) || global;
    if (!key && !button) console.warn(`Action "${actionName}" has no key or button binding and will never be triggered by input!`);
    if (!callback && !shouldEmitGlobally) console.warn(`Action "${actionName}" has no callback or global emission and will never produce any output!`);
    actions.register(actionName, (...args) => {
      if (isPaused(actionName)) return;
      const currentScope = getScope();
      callback && callback(currentScope, ...args);
      if (shouldEmitGlobally) eventBus.emit(actionName, currentScope, ...args);
    });
    if (config.keyboard && key) {
      keyboard.on({
        keys: key.binds,
        callback: actionName,
        type: key.type || ["press"]
      });
    }
    if (config.gamepad && button) {
      gamepad.on({
        actions: button.binds,
        callback: actionName,
        type: button.type
      });
    }
  };
  const unregisterAction = (actionName) => {
    const { key, button } = getAction(actionName);
    if (config.keyboard && key) keyboard.off(key.binds, actionName);
    if (config.gamepad && button) gamepad.off(button.binds, actionName);
    actions.remove(actionName);
    actionSubscribers.delete(actionName);
    forcePausedActions.delete(actionName);
  };
  const addAction = (name, data) => {
    if (getAction(name)) {
      return console.warn(`Action ${name} is already registered! If you wish to update it's data use updateAction() instead.`);
    }
    setConfig("actions", name, data);
    registerAction(name);
  };
  const removeAction = (name) => {
    if (!getAction(name)) {
      return console.warn("Trying to remove a non existing action!");
    }
    if (DEFAULT_ACTION_NAMES.has(name)) {
      return console.warn("Can't remove a default action!");
    }
    unregisterAction(name);
    setConfig("actions", name, void 0);
  };
  const updateAction = (name, data) => {
    if (!getAction(name)) {
      return console.warn("Trying to update a non existing action!");
    }
    unregisterAction(name);
    setConfig("actions", name, data);
    registerAction(name);
  };
  const executeAction = (name) => {
    if (!getAction(name)) {
      return console.warn("Trying to execute a non existing action!");
    }
    actions.execute(name);
  };
  const getScope = () => config.scope;
  const getAction = (name) => config.actions[name];
  const getActions = () => config.actions;
  const pauseAction = (name, force = false) => {
    if (!getAction(name)) return console.warn("Action not found");
    if (force) {
      if (forcePausedActions.has(name)) {
        return;
      }
      forcePausedActions.add(name);
      setConfig("actions", name, "paused", true);
      return;
    }
    const currentCount = actionSubscribers.get(name) || 0;
    if (currentCount === 0) return;
    const newCount = currentCount - 1;
    actionSubscribers.set(name, newCount);
    if (newCount === 0) {
      if (!forcePausedActions.has(name)) {
        setConfig("actions", name, "paused", true);
      }
    }
  };
  const resumeAction = (name, force = false) => {
    const action = getAction(name);
    if (!action) return console.warn("Action not found");
    if (force) {
      if (!forcePausedActions.has(name)) return;
      forcePausedActions.delete(name);
      setConfig("actions", name, "paused", false);
      return;
    }
    const currentCount = actionSubscribers.get(name) || 0;
    const newCount = currentCount + 1;
    actionSubscribers.set(name, newCount);
    if (forcePausedActions.has(name)) {
      return;
    }
    if (newCount === 1) {
      setConfig("actions", name, "paused", false);
    }
  };
  const isPaused = (name) => {
    return getAction(name)?.paused ?? false;
  };
  const pauseInput = () => {
    const allActions = getActions();
    inputCaptureSnapshot.clear();
    for (const actionName in allActions) {
      if (!isPaused(actionName)) {
        pauseAction(actionName, true);
      } else {
        inputCaptureSnapshot.add(actionName);
      }
    }
  };
  const resumeInput = () => {
    const allActions = getActions();
    for (const actionName in allActions) {
      if (!inputCaptureSnapshot.has(actionName)) {
        resumeAction(actionName, true);
      }
    }
    inputCaptureSnapshot.clear();
  };
  return {
    addAction,
    removeAction,
    updateAction,
    executeAction,
    registerAction,
    unregisterAction,
    getScope,
    getAction,
    getActions,
    pauseAction,
    resumeAction,
    pauseInput,
    resumeInput,
    isPaused
  };
}

const NavigationContext = createContext();
const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context) return context;
};
const Navigation = (props) => {
  const [config, setConfig] = createStore({
    gamepad: props.gamepad ?? true,
    keyboard: props.keyboard ?? true,
    actions: {
      ...DEFAULT_ACTIONS,
      ...props.actions
    },
    scope: props.scope ?? ""
  });
  const areas = /* @__PURE__ */ new Set();
  const {
    registerAction,
    unregisterAction,
    ...publicActionMethods
  } = createActionMethods(config, setConfig);
  const areaMethods = createAreaMethods(areas, setConfig);
  const navigationAPI = {
    ...publicActionMethods,
    ...areaMethods
  };
  const initActions = () => {
    for (const action in config.actions) {
      registerAction(action);
    }
  };
  const deInitActions = () => {
    for (const action in config.actions) {
      unregisterAction(action);
    }
  };
  onMount(() => {
    if (config.gamepad) {
      gamepad.enabled = true;
      gamepad.pollingInterval = props.pollingInterval ?? 200;
    }
    initActions();
    if (!props.ref) return;
    props.ref(navigationAPI);
  });
  onCleanup(() => {
    deInitActions();
    spatialNavigation.deinit();
  });
  return createComponent(NavigationContext.Provider, {
    value: navigationAPI,
    get children() {
      return props.children;
    }
  });
};
Object.assign(Navigation, {
  Area: NavigationArea
});

const baseEventsSet = /* @__PURE__ */ new Set(["abort", "animationend", "blur", "click", "dblclick", "durationchange", "ended", "finish", "focus", "focusin", "focusout", "gamepadconnected", "gamepaddisconnected", "keydown", "keypress", "keyup", "load", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup", "popstate", "readystatechange", "resize", "scroll", "timeout", "touchend", "touchmove", "touchstart", "transitionend", "volumechange", "wheel"]);
function handleClasses(el, props) {
  createEffect(() => {
    const rawBase = props.componentClasses;
    const base = typeof rawBase === "function" ? rawBase() : rawBase;
    const ext = props.class;
    const finalClass = base ? ext ? base + " " + ext : base : ext || "";
    if (el.className !== finalClass) el.className = finalClass;
  });
}
function reconcileStyles(elStyle, next, prev) {
  for (const key in prev) {
    if (next[key] == null) {
      if (key.indexOf("-") > -1) {
        elStyle.removeProperty(key);
      } else {
        elStyle[key] = "";
      }
    }
  }
  for (const key in next) {
    const value = next[key];
    if (prev[key] !== value) {
      if (key.indexOf("-") > -1) {
        elStyle.setProperty(key, String(value));
      } else {
        elStyle[key] = value;
      }
    }
  }
}
function handleStyles(el, props) {
  let prevStyles = {};
  createEffect(() => {
    const styles = el.style;
    const compRaw = props.componentStyles;
    const extStyles = props.style;
    const compStyles = typeof compRaw === "function" ? compRaw() : compRaw;
    if (!compStyles && !extStyles) {
      if (Object.keys(prevStyles).length > 0) {
        el.removeAttribute("style");
        prevStyles = {};
      }
      return;
    }
    const isCompString = typeof compStyles === "string";
    const isExtString = typeof extStyles === "string";
    if (isCompString || isExtString) {
      const compStr = isCompString ? compStyles : "";
      const extStr = isExtString ? extStyles : "";
      const finalString = [compStr, extStr].filter((part) => part && String(part).trim() !== "").join(";");
      if (styles.cssText !== finalString) {
        styles.cssText = finalString;
      }
      prevStyles = {};
      return;
    }
    const nextStyles = {
      ...compStyles || {},
      ...extStyles || {}
    };
    reconcileStyles(styles, nextStyles, prevStyles);
    prevStyles = nextStyles;
  });
}
function handleAttrs(el, props) {
  let prevKeys = [];
  createEffect(() => {
    const currentKeys = [];
    for (const key in props) {
      if (!key.startsWith("attr:")) continue;
      const name = key.slice(5);
      const val = props[key];
      currentKeys.push(name);
      if (val != null) {
        const strVal = String(val);
        if (el.getAttribute(name) !== strVal) {
          el.setAttribute(name, strVal);
        }
      } else {
        el.removeAttribute(name);
      }
    }
    if (prevKeys.length > 0) {
      for (let i = 0; i < prevKeys.length; i++) {
        const oldName = prevKeys[i];
        if (!(`attr:${oldName}` in props)) {
          el.removeAttribute(oldName);
        }
      }
    }
    prevKeys = currentKeys;
  });
}
function handleEvents(el, props) {
  const listeners = [];
  for (const key in props) {
    if (baseEventsSet.has(key)) {
      const handler = props[key];
      if (typeof handler === "function") {
        el.addEventListener(key, handler);
        listeners.push([key, handler]);
      }
    }
  }
  return () => {
    for (const [eventName, fn] of listeners) {
      el.removeEventListener(eventName, fn);
    }
  };
}
function navigationActions(el, accessor) {
  const config = accessor();
  if (!config) return;
  const nav = useNavigation();
  if (!nav) return;
  const {
    anchor,
    ...actionHandlers
  } = config;
  el.setAttribute("tabindex", "0");
  let anchorElement = null;
  if (anchor) {
    if (typeof anchor === "string") {
      waitForFrames(() => anchorElement = document.querySelector(anchor));
    } else if (anchor instanceof HTMLElement) {
      anchorElement = anchor;
    }
  }
  const isFocused = () => {
    const active = document.activeElement;
    return active === el || anchorElement && active === anchorElement || el.contains(active);
  };
  const listeners = [];
  for (const [name, func] of Object.entries(actionHandlers)) {
    const action = nav.getAction(name);
    if (!action) {
      console.warn(`Action "${name}" is not registered in Navigation.`);
      continue;
    }
    if (!action.global && !DEFAULT_ACTION_NAMES.has(name)) {
      console.warn(`Action "${name}" is not global. To subscribe components to it, please make it global.`);
      continue;
    }
    const handler = (...args) => {
      if (isFocused()) func(...args);
    };
    eventBus.on(name, handler);
    listeners.push([name, handler]);
  }
  return () => {
    for (const [name, handler] of listeners) {
      eventBus.off(name, handler);
    }
  };
}
function baseComponent(el, accessor) {
  const props = accessor();
  handleClasses(el, props);
  handleStyles(el, props);
  handleAttrs(el, props);
  const cleanupEvents = handleEvents(el, props);
  onCleanup(() => cleanupEvents());
}

export { baseComponent as b, gamepad as g, mappings as m, navigationActions as n, useNavigation as u, waitForFrames as w };
