import { o as onMount, a as onCleanup, g as getNextElement, u as use, i as insert, c as createComponent, t as template, F as For, A as useContext, n as createEffect, B as createContext } from './web.Ztxum33j.js';
import { c as createTokenComponent, a as useTokens } from './tokenComponents.BJf1S0ca.js';
import { b as baseComponent } from './BaseComponent.GQpAABre.js';
import { v as verIsAtLeast } from './gamefaceVersion.ACI438bm.js';

const trackers = "_trackers_evdyy_1";
const styles = {
	trackers: trackers,
	"trackers-item": "_trackers-item_evdyy_5"};

function hasEngine() {
  return typeof window.engine !== "undefined" && typeof window.engine.on === "function";
}

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
if (!hasEngine() && !verIsAtLeast(3, 1, 2) && false) ;
const Item = createTokenComponent();
const registry = /* @__PURE__ */ new Map();
function eventNameFor(trackersId) {
  return `trackers:${trackersId}`;
}
function dispatch(trackersId, payload) {
  const entry = registry.get(trackersId);
  if (!entry) {
    return;
  }
  entry.handleEvent(payload);
}
function updateTrackers(trackersId, updates) {
  dispatch(trackersId, updates);
}
const styleMapCache = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const hiddenCache = /* @__PURE__ */ new WeakMap();
function writeTransform(el, x, y) {
  let transform = transformCache.get(el);
  if (!transform) {
    transform = CSSStyleValue.parse("transform", "translate(0px, 0px)");
    transformCache.set(el, transform);
  }
  const translate = transform[0];
  let changed = false;
  if (x !== void 0 && translate.x.value !== x) {
    translate.x.value = x;
    changed = true;
  }
  if (y !== void 0 && translate.y.value !== y) {
    translate.y.value = y;
    changed = true;
  }
  if (changed) {
    let styleMap = styleMapCache.get(el);
    if (!styleMap) {
      styleMap = el.attributeStyleMap;
      styleMapCache.set(el, styleMap);
    }
    styleMap.set("transform", transform);
  }
}
const TrackersContext = createContext();
function resolveScaleOrRotate(value) {
  return typeof value === "function" ? value() : value;
}
const TrackersItem = (props) => {
  const ctx = useContext(TrackersContext);
  let el;
  props.token.componentClasses = styles["trackers-item"];
  onMount(() => {
    if (props.token.scale !== void 0 || props.token.rotate !== void 0) {
      let parseStr = "translate(0px, 0px)";
      let scaleIndex = -1;
      let rotateIndex = -1;
      if (props.token.scale !== void 0) {
        scaleIndex = 1;
        parseStr += " scale(1)";
      }
      if (props.token.rotate !== void 0) {
        rotateIndex = scaleIndex !== -1 ? 2 : 1;
        parseStr += " rotate(0deg)";
      }
      const transform = CSSStyleValue.parse("transform", parseStr);
      transformCache.set(el, transform);
      createEffect(() => {
        let changed = false;
        if (scaleIndex !== -1) {
          const s = resolveScaleOrRotate(props.token.scale);
          const comp = transform[scaleIndex];
          if (comp.x.value !== s) {
            comp.x.value = s;
            comp.y.value = s;
            changed = true;
          }
        }
        if (rotateIndex !== -1) {
          const r = resolveScaleOrRotate(props.token.rotate);
          const comp = transform[rotateIndex];
          if (comp.angle.value !== r) {
            comp.angle.value = r;
            changed = true;
          }
        }
        if (changed) {
          let styleMap = styleMapCache.get(el);
          if (!styleMap) {
            styleMap = el.attributeStyleMap;
            styleMapCache.set(el, styleMap);
          }
          styleMap.set("transform", transform);
        }
      });
    }
    ctx?.registerItem(props.token.id, el);
  });
  onCleanup(() => ctx?.unregisterItem(props.token.id));
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    use(baseComponent, _el$, () => props.token);
    var _ref$ = el;
    typeof _ref$ === "function" ? use(_ref$, _el$) : el = _el$;
    insert(_el$, () => props.token.children);
    return _el$;
  })();
};
const Trackers = (props) => {
  const itemTokens = useTokens(Item, props.children);
  const wrapperRefs = /* @__PURE__ */ new Map();
  const registerItem = (id, el) => wrapperRefs.set(id, el);
  const unregisterItem = (id) => wrapperRefs.delete(id);
  function updateTracker(data) {
    const el = wrapperRefs.get(data.id);
    if (!el) return;
    const hide = !!data.hide;
    if (hiddenCache.get(el) !== hide) {
      el.style.display = hide ? "none" : "";
      hiddenCache.set(el, hide);
    }
    if (hide) return;
    writeTransform(el, data.x, data.y);
  }
  function handleEvent(payload) {
    if (Array.isArray(payload)) {
      for (let i = 0; i < payload.length; i++) updateTracker(payload[i]);
    } else {
      updateTracker(payload);
    }
  }
  const event = eventNameFor(props.id);
  onMount(() => {
    const previous = registry.get(props.id);
    if (previous) {
      if (hasEngine()) window.engine.off(event, previous.handleEvent);
    }
    registry.set(props.id, {
      event,
      handleEvent
    });
    if (hasEngine()) window.engine.on(event, handleEvent);
  });
  onCleanup(() => {
    if (registry.get(props.id)?.handleEvent === handleEvent) registry.delete(props.id);
    if (hasEngine()) {
      window.engine.off(event, handleEvent);
    }
  });
  props.componentClasses = styles.trackers;
  return (() => {
    var _el$2 = getNextElement(_tmpl$);
    use(baseComponent, _el$2, () => props);
    insert(_el$2, createComponent(TrackersContext.Provider, {
      value: {
        registerItem,
        unregisterItem
      },
      get children() {
        return createComponent(For, {
          get each() {
            return itemTokens() ?? [];
          },
          children: (token) => createComponent(TrackersItem, {
            token
          })
        });
      }
    }));
    return _el$2;
  })();
};
const Trackers$1 = Object.assign(Trackers, {
  Item
});

export { Trackers$1 as T, updateTrackers as u };
