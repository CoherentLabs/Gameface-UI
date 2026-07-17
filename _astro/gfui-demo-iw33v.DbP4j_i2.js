import { f as createMemo, g as getNextElement, i as insert, n as createRenderEffect, s as style, p as className, t as template, C as useContext, c as createComponent, F as For, a as createSignal, j as createEffect, k as on, o as onMount, q as getNextMarker, u as use, x as addEventListener, D as createContext, r as render } from './web.bikURqO-.js';
import { s as styles, T as Track, a as Thumb, H as Handle, F as Fill, d as SliderTrack, S as SliderHandle, b as SliderFill, c as SliderThumb, g as getTrackGeometry, f as stopImmediatePropagation } from './stopPropagation.Cp0QT7CI.js';
import { c as clamp } from './clamp.BBPiOs3-.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.ChN_WbXL.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.C3DpOC_C.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import './store.C9Zlw18N.js';

var _tmpl$$2 = /* @__PURE__ */ template(`<div><div></div><div>`);
const Pol = createTokenComponent();
const TextSliderPol = (props) => {
  const polClasses = createMemo(() => {
    const classes = [styles["grid-pol-container"]];
    if (props.class) classes.push(props.class);
    return classes.join(" ");
  });
  const polValueClasses = createMemo(() => {
    const classes = [styles["grid-pol-value"]];
    if (props["text-class"]) classes.push(props["text-class"]);
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    insert(_el$3, () => props.value);
    createRenderEffect((_p$) => {
      var _v$ = props.style, _v$2 = polClasses(), _v$3 = styles["grid-pol"], _v$4 = props["text-style"], _v$5 = polValueClasses();
      _p$.e = style(_el$, _v$, _p$.e);
      _v$2 !== _p$.t && className(_el$, _p$.t = _v$2);
      _v$3 !== _p$.a && className(_el$2, _p$.a = _v$3);
      _p$.o = style(_el$3, _v$4, _p$.o);
      _v$5 !== _p$.i && className(_el$3, _p$.i = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })();
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const TextSliderGrid = (props) => {
  const sliderContext = useContext(TextSliderContext);
  const PolToken = useToken(Pol, props.parentChildren);
  return (() => {
    var _el$ = getNextElement(_tmpl$$1);
    insert(_el$, createComponent(For, {
      get each() {
        return sliderContext?.values();
      },
      children: (pol) => createComponent(TextSliderPol, {
        get ["class"]() {
          return PolToken()?.class;
        },
        get style() {
          return PolToken()?.style;
        },
        get ["text-class"]() {
          return PolToken()?.["text-class"];
        },
        get ["text-style"]() {
          return PolToken()?.["text-style"];
        },
        value: pol
      })
    }));
    createRenderEffect(() => className(_el$, styles.grid));
    return _el$;
  })();
};

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const TextSliderContext = createContext();
const TextSlider = (props) => {
  const values = () => props.values || [];
  const [value, setValue] = createSignal(props.value || values()[0] || "");
  const [navEngaged, setNavEngaged] = createSignal(false);
  const getValuePercent = (value2) => {
    const valueIndex = values().indexOf(value2);
    if (valueIndex === -1) return 0;
    return valueIndex / (values().length - 1) * 100;
  };
  const findValueInPercent = (percent2) => {
    const index = Math.round(percent2 / 100 * (values().length - 1));
    return values()[index] || "";
  };
  const percent = () => getValuePercent(value());
  let element;
  let trackElement;
  let sliding = false;
  let startValue;
  let geometry;
  const ThumbSlot = useToken(Thumb, props.children);
  createEffect(on(value, (v) => props.onChange?.(v), {
    defer: true
  }));
  createEffect(on(() => props.value, (v) => {
    if (v !== void 0) changeValue(v);
  }, {
    defer: true
  }));
  const handleTrackClick = (e) => {
    geometry = getTrackGeometry(trackElement, e.clientX);
    const delta = geometry.start - geometry.trackStart;
    const result = Math.round(clamp(Math.round(delta / geometry.pixelRange * 100), 0, 100));
    const newValue = findValueInPercent(result);
    setValue(newValue);
  };
  const handleMouseDown = (e) => {
    stopImmediatePropagation(e);
    sliding = true;
    geometry = getTrackGeometry(trackElement, e.clientX);
    startValue = getValuePercent(value());
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!sliding) return;
    const result = Math.round(calculateResult(e));
    const newValue = findValueInPercent(result);
    setValue(newValue);
  };
  const handleMouseUp = (e) => {
    if (!sliding) return;
    sliding = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
  const calculateResult = (e) => {
    const delta = e.clientX - geometry.start;
    const deltaValue = delta / geometry.pixelRange * 100;
    const newValue = startValue + deltaValue;
    return clamp(Math.round(newValue), 0, 100);
  };
  const SliderClasses = createMemo(() => {
    const classes = [styles.slider, styles["with-grid"]];
    if (ThumbSlot()) classes.push(styles["with-thumb"]);
    return classes.join(" ");
  });
  const changeValue = (newValue) => {
    if (!values().includes(newValue)) {
      console.warn(`Value "${newValue}" is not in the list of allowed values.`);
      return;
    }
    setValue(newValue);
  };
  const stepValue = (direction) => {
    const currValues = values();
    const currentIndex = currValues.indexOf(value());
    const newIndex = clamp(currentIndex + direction, 0, currValues.length - 1);
    changeValue(currValues[newIndex]);
  };
  props.componentClasses = () => SliderClasses();
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      value,
      values,
      element,
      changeValue,
      stepValue
    });
  });
  const defaultActions = {
    "move-left": () => stepValue(-1),
    "move-right": () => stepValue(1)
  };
  return createComponent(TextSliderContext.Provider, {
    value: {
      values
    },
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
      use(navigationActions, _el$, () => mergeNavigationActions(props, defaultActions));
      use(baseComponent, _el$, () => props);
      addEventListener(_el$, "focusout", () => setNavEngaged(false));
      addEventListener(_el$, "focusin", () => setNavEngaged(true));
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(SliderTrack, {
        handleClick: handleTrackClick,
        ref(r$) {
          var _ref$2 = trackElement;
          typeof _ref$2 === "function" ? _ref$2(r$) : trackElement = r$;
        },
        get parentChildren() {
          return props.children;
        },
        get children() {
          return [createComponent(SliderHandle, {
            percent,
            handleMouseDown,
            get parentChildren() {
              return props.children;
            },
            active: navEngaged
          }), createComponent(SliderFill, {
            percent,
            get parentChildren() {
              return props.children;
            }
          }), createComponent(SliderThumb, {
            value,
            percent,
            get parentChildren() {
              return props.children;
            }
          })];
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(TextSliderGrid, {
        get parentChildren() {
          return props.children;
        }
      }), _el$5, _co$2);
      return _el$;
    }
  });
};
const TextSlider$1 = Object.assign(TextSlider, {
  Pol,
  Fill,
  Handle,
  Thumb,
  Track
});

const iw33v = (root) => render(() => createComponent(TextSlider$1, {
  values: ["Easy", "Medium", "Hard"]
}), root);

export { iw33v as default };
