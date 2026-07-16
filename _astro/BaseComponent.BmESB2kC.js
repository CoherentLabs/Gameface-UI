import { I as children, k as createEffect, o as onMount, x as memo, l as on, n as onCleanup, c as createComponent, C as useContext, D as createContext } from './web.e96V-LtU.js';
import { spatialNavigation, actions, keyboard, gamepad } from 'coherent-gameface-interaction-manager';
import { c as createStore } from './store.CBj67zxW.js';

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

export { baseComponent as b, navigationActions as n, useNavigation as u, waitForFrames as w };
