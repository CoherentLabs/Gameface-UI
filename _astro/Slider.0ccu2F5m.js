import { b as createMemo, g as getNextElement, v as getNextMarker, i as insert, c as createComponent, p as createRenderEffect, s as style, q as className, w as Show, t as template, F as For, x as memo, a as createSignal, k as createEffect, l as on, o as onMount, n as onCleanup, u as use, y as addEventListener } from './web.e96V-LtU.js';
import { s as styles, T as Track, a as Thumb, H as Handle, F as Fill, b as snapToStepAndNormalize, S as SliderHandle, c as SliderFill, d as SliderThumb, e as SliderTrack, g as getTrackGeometry, f as stopImmediatePropagation, h as calculatePercent } from './stopPropagation.CarT97-u.js';
import { c as clamp } from './clamp.BBPiOs3-.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.hFDI9VqW.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.BmESB2kC.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';

var _tmpl$$2 = /* @__PURE__ */ template(`<div>`), _tmpl$2 = /* @__PURE__ */ template(`<div><div></div><!$><!/>`);
const SliderPol = (props) => {
  const polClasses = createMemo(() => {
    const classes = [styles["grid-pol-container"]];
    if (props.size === "small") classes.push(styles["grid-pol-small"]);
    if (props["pol-class"]) classes.push(props["pol-class"]);
    return classes.join(" ");
  });
  const polValueClasses = createMemo(() => {
    const classes = [styles["grid-pol-value"]];
    if (props["pol-value-class"]) classes.push(props["pol-value-class"]);
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$2 = _el$.firstChild, _el$4 = _el$2.nextSibling, [_el$5, _co$] = getNextMarker(_el$4.nextSibling);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.size === "normal";
      },
      get children() {
        var _el$3 = getNextElement(_tmpl$$2);
        insert(_el$3, () => props.value);
        createRenderEffect((_p$) => {
          var _v$ = props["pol-value-style"], _v$2 = polValueClasses();
          _p$.e = style(_el$3, _v$, _p$.e);
          _v$2 !== _p$.t && className(_el$3, _p$.t = _v$2);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$3;
      }
    }), _el$5, _co$);
    createRenderEffect((_p$) => {
      var _v$3 = props["pol-style"], _v$4 = polClasses(), _v$5 = styles["grid-pol"];
      _p$.e = style(_el$, _v$3, _p$.e);
      _v$4 !== _p$.t && className(_el$, _p$.t = _v$4);
      _v$5 !== _p$.a && className(_el$2, _p$.a = _v$5);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
function fitsOneDecimal(v) {
  return v === parseFloat(v.toFixed(1));
}
const Grid = createTokenComponent();
const SliderGrid = (props) => {
  const GridToken = useToken(Grid, props.parentChildren);
  const polsCount = GridToken()?.pols || 5;
  const createPolsArray = () => {
    let minValue = props.min, maxValue = props.max;
    return Array.from({
      length: polsCount
    }, (_, index) => {
      if (index === 0) return minValue;
      if (index === polsCount - 1) return maxValue;
      const step = (props.max - props.min) / (polsCount - 1);
      let nextValue = step * index;
      if (!fitsOneDecimal(nextValue)) {
        nextValue = parseFloat(nextValue.toFixed(1));
      }
      return props.min + nextValue;
    });
  };
  const polsArr = createPolsArray();
  const gridClasses = createMemo(() => {
    const classes = [styles.grid];
    if (GridToken?.()?.class) classes.push(GridToken?.()?.class);
    return classes.join(" ");
  });
  return createComponent(Show, {
    get when() {
      return GridToken();
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$1);
      insert(_el$, createComponent(For, {
        each: polsArr,
        children: (pol, index) => [createComponent(SliderPol, {
          size: "normal",
          get ["pol-class"]() {
            return GridToken()?.["pol-class"];
          },
          get ["pol-style"]() {
            return GridToken()?.["pol-style"];
          },
          get ["pol-value-class"]() {
            return GridToken()?.["pol-value-class"];
          },
          get ["pol-value-style"]() {
            return GridToken()?.["pol-value-style"];
          },
          value: pol
        }), createComponent(Show, {
          get when() {
            return memo(() => !!GridToken()?.["pols-without-text"])() && index() < polsCount - 1;
          },
          get children() {
            return createComponent(For, {
              get each() {
                return Array.from({
                  length: GridToken()?.["pols-without-text"] || 5
                });
              },
              children: () => createComponent(SliderPol, {
                size: "small",
                get ["pol-class"]() {
                  return GridToken()?.["pol-class"];
                },
                get ["pol-style"]() {
                  return GridToken()?.["pol-style"];
                }
              })
            });
          }
        })]
      }));
      createRenderEffect((_p$) => {
        var _v$ = gridClasses(), _v$2 = GridToken?.()?.style;
        _v$ !== _p$.e && className(_el$, _p$.e = _v$);
        _p$.t = style(_el$, _v$2, _p$.t);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$;
    }
  });
};

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const Slider = (props) => {
  const min = () => props.min ?? 0;
  const max = () => props.max ?? 100;
  const step = () => props.step ?? 1;
  const [value, setValue] = createSignal(clamp(props.value ?? 50, min(), max()));
  const [navEngaged, setNavEngaged] = createSignal(false);
  const percent = () => calculatePercent(value(), min(), max());
  let element;
  let trackElement;
  let sliding = false;
  let commitTimeout;
  let startValue;
  let geometry;
  const ThumbSlot = useToken(Thumb, props.children);
  const GridSlot = useToken(Grid, props.children);
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
    const valueRange = max() - min();
    const delta = geometry.start - geometry.trackStart;
    const newValue = min() + delta / geometry.pixelRange * valueRange;
    const result = snapValue(newValue);
    setValue(result);
    handleMouseDown(e);
  };
  const handleMouseDown = (e) => {
    stopImmediatePropagation(e);
    sliding = true;
    geometry = getTrackGeometry(trackElement, e.clientX);
    startValue = value();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!sliding) return;
    const result = calculateResult(e);
    setValue(result);
  };
  const handleMouseUp = () => {
    if (!sliding) return;
    sliding = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    props.onChangeEnd?.(value());
  };
  const calculateResult = (e) => {
    const delta = e.clientX - geometry.start;
    const valueRange = max() - min();
    const deltaValue = delta / geometry.pixelRange * valueRange;
    const newValue = startValue + deltaValue;
    return snapValue(newValue);
  };
  const snapValue = (value2) => snapToStepAndNormalize(value2, step(), min(), max());
  const SliderClasses = createMemo(() => {
    const classes = [styles.slider];
    if (ThumbSlot()) classes.push(styles["with-thumb"]);
    if (GridSlot()) classes.push(styles["with-grid"]);
    return classes.join(" ");
  });
  const changeValue = (newValue) => {
    setValue(snapValue(newValue));
  };
  const stepValue = (direction) => {
    changeValue(value() + step() * direction);
  };
  const scheduleCommit = () => {
    if (!props.onChangeEnd) return;
    if (commitTimeout) clearTimeout(commitTimeout);
    commitTimeout = setTimeout(() => {
      commitTimeout = void 0;
      props.onChangeEnd?.(value());
    }, 250);
  };
  props.componentClasses = () => SliderClasses();
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      value,
      element,
      changeValue,
      stepValue
    });
  });
  onCleanup(() => {
    handleMouseUp();
    if (commitTimeout) clearTimeout(commitTimeout);
  });
  const defaultActions = {
    "move-left": () => {
      stepValue(-1);
      scheduleCommit();
    },
    "move-right": () => {
      stepValue(1);
      scheduleCommit();
    }
  };
  return (() => {
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
    insert(_el$, createComponent(SliderGrid, {
      get min() {
        return min();
      },
      get max() {
        return max();
      },
      get parentChildren() {
        return props.children;
      }
    }), _el$5, _co$2);
    return _el$;
  })();
};
const Slider$1 = Object.assign(Slider, {
  Grid,
  Fill,
  Handle,
  Thumb,
  Track
});

export { Slider$1 as S };
