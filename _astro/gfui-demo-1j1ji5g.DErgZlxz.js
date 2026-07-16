import { g as getNextElement, H as spread, w as runHydrationEvents, t as template, q as delegateEvents, C as useContext, b as createMemo, y as getNextMarker, i as insert, c as createComponent, z as Show, n as createRenderEffect, p as className, s as style, o as onMount, l as onCleanup, a as createSignal, u as use, F as For, D as createContext, r as render } from './web.DT9QqbDn.js';
import { c as createTokenComponent, u as useToken, a as useTokens } from './tokenComponents.D7hEHUQ6.js';
import { T as Transform } from './Transform.DiqFkcvK.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.dZiros1M.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import './LayoutBase.DvNSSl3m.js';
import './store.CXp9XCH2.js';

const stepper = "_stepper_1t7i6_1";
const disabled = "_disabled_1t7i6_52";
const styles = {
	stepper: stepper,
	"stepper-control": "_stepper-control_1t7i6_8",
	"stepper-control-hidden": "_stepper-control-hidden_1t7i6_18",
	"stepper-arrow": "_stepper-arrow_1t7i6_29",
	"stepper-items": "_stepper-items_1t7i6_37",
	"stepper-item": "_stepper-item_1t7i6_37",
	disabled: disabled
};

var _tmpl$$3 = /*#__PURE__*/template(`<svg width=89 height=171 viewBox="0 0 89 171"fill=none xmlns=http://www.w3.org/2000/svg><path d="M83.8 165.4L5 83.4L44.4 44L83.8 4.60002"stroke=var(--sl-color-gray-3) stroke-width=20 stroke-linecap=round stroke-linejoin=round>`);
const StepperArrow = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$3);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

var _tmpl$$2 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const Control = createTokenComponent();
const ControlComponent = ({
  ControlToken
}) => {
  return [createComponent(Show, {
    get when() {
      return ControlToken()?.children;
    },
    get children() {
      return ControlToken()?.children;
    }
  }), createComponent(Show, {
    get when() {
      return !ControlToken()?.children;
    },
    get children() {
      return createComponent(StepperArrow, {
        get ["class"]() {
          return styles["stepper-arrow"];
        }
      });
    }
  })];
};
const StepperControl = (props) => {
  const stepperContext = useContext(StepperContext);
  const ControlToken = useToken(Control, props.parentChildren);
  const controlContainerClasses = createMemo(() => {
    const classes = [styles["stepper-control"]];
    if (ControlToken()?.class) classes.push(ControlToken()?.class ?? "");
    if (!props.visible) {
      if (ControlToken?.()?.["hidden-class"]) {
        classes.push(ControlToken?.()?.["hidden-class"] ?? "");
      } else {
        classes.push(styles["stepper-control-hidden"]);
      }
    }
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    _el$.$$click = () => stepperContext?.changeSelected(props.direction);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.direction === "prev";
      },
      get children() {
        return createComponent(ControlComponent, {
          ControlToken
        });
      }
    }), _el$3, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.direction === "next";
      },
      get children() {
        return createComponent(Transform, {
          rotate: {
            y: 180
          },
          get children() {
            return createComponent(ControlComponent, {
              ControlToken
            });
          }
        });
      }
    }), _el$5, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = controlContainerClasses(), _v$2 = ControlToken()?.style || {};
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

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const Item = createTokenComponent();
const StepperItem = (props) => {
  const stepperContext = useContext(StepperContext);
  onMount(() => {
    stepperContext?.registerOption(props.item.value, props.item.selected);
  });
  onCleanup(() => {
    stepperContext?.unregisterOption(props.item.value);
  });
  return createComponent(Show, {
    get when() {
      return stepperContext?.selected() === props.item.value;
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$1);
      insert(_el$, () => props.item.children);
      createRenderEffect((_p$) => {
        var _v$ = `${styles["stepper-item"]} ${props.item.class || ""}`, _v$2 = props.item.style || {};
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

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/><div></div><!$><!/><!$><!/>`);
const StepperContext = createContext();
const Items = createTokenComponent();
const Stepper = (props) => {
  let element;
  const StepperItemsToken = useToken(Items, props.children);
  const StepperItems = useTokens(Item, StepperItemsToken?.()?.children);
  const [selected, setSelected] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(-1);
  const options = [];
  const registerOption = (value, selected2) => {
    if (options.indexOf(value) !== -1) {
      return;
    }
    options.push(value);
    if (selected2 || options.length === 1) {
      setSelected(value);
      setSelectedIndex(options.length - 1);
    }
  };
  const unregisterOption = (value) => {
    const index = options.indexOf(value);
    if (index !== -1) options.splice(index, 1);
    if (selectedIndex() === index) {
      setSelectedIndex(index - 1);
      setSelected(options[index - 1]);
    }
  };
  const stepperClasses = createMemo(() => {
    const classes = [styles.stepper];
    if (props.disabled) {
      if (props["class-disabled"]) classes.push(`${styles.disabled} ${props["class-disabled"]}`);
      else classes.push(styles.disabled);
    }
    return classes.join(" ");
  });
  const changeSelected = (direction) => {
    if (props.disabled) return;
    if (!props.loop) {
      if (direction === "next" && selectedIndex() === options.length - 1) return;
      if (direction === "prev" && selectedIndex() === 0) return;
    }
    if (direction === "next") {
      const nextIndex = (selectedIndex() + 1) % options.length;
      setSelectedIndex(nextIndex);
      setSelected(options[nextIndex]);
    } else if (direction === "prev") {
      const prevIndex = (selectedIndex() - 1 + options.length) % options.length;
      setSelectedIndex(prevIndex);
      setSelected(options[prevIndex]);
    }
    props.onChange?.(selected());
  };
  props.componentClasses = () => stepperClasses();
  const setOption = (value) => {
    if (props.disabled) return;
    const index = options.indexOf(value);
    if (index !== -1) {
      setSelectedIndex(index);
      setSelected(options[index]);
      props.onChange?.(selected());
      return;
    }
  };
  const showNextControl = createMemo(() => {
    if (props.loop) return true;
    if (selectedIndex() === options.length - 1) return false;
    return true;
  });
  const showPrevControl = createMemo(() => {
    if (props.loop) return true;
    if (selectedIndex() === 0) return false;
    return true;
  });
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      selected,
      setOption,
      options,
      element
    });
  });
  const controlsBefore = createMemo(() => props["controls-position"] === "before");
  const controlsAfter = createMemo(() => props["controls-position"] === "after");
  const defaultActions = {
    "move-left": () => changeSelected("prev"),
    "move-right": () => changeSelected("next")
  };
  return createComponent(StepperContext.Provider, {
    value: {
      selected,
      registerOption,
      unregisterOption,
      changeSelected
    },
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$3 = _el$.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling), _el$2 = _el$6.nextSibling, _el$7 = _el$2.nextSibling, [_el$8, _co$3] = getNextMarker(_el$7.nextSibling), _el$9 = _el$8.nextSibling, [_el$0, _co$4] = getNextMarker(_el$9.nextSibling);
      use(navigationActions, _el$, () => mergeNavigationActions(props, defaultActions));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(Show, {
        get when() {
          return !props["controls-position"] || controlsBefore();
        },
        get children() {
          return createComponent(StepperControl, {
            direction: "prev",
            get visible() {
              return showPrevControl();
            },
            get parentChildren() {
              return props.children;
            }
          });
        }
      }), _el$4, _co$);
      insert(_el$, createComponent(Show, {
        get when() {
          return controlsBefore();
        },
        get children() {
          return createComponent(StepperControl, {
            direction: "next",
            get visible() {
              return showNextControl();
            },
            get parentChildren() {
              return props.children;
            }
          });
        }
      }), _el$6, _co$2);
      insert(_el$2, createComponent(For, {
        get each() {
          return StepperItems();
        },
        children: (item) => createComponent(StepperItem, {
          item
        })
      }));
      insert(_el$, createComponent(Show, {
        get when() {
          return controlsAfter();
        },
        get children() {
          return createComponent(StepperControl, {
            direction: "prev",
            get visible() {
              return showPrevControl();
            },
            get parentChildren() {
              return props.children;
            }
          });
        }
      }), _el$8, _co$3);
      insert(_el$, createComponent(Show, {
        get when() {
          return !props["controls-position"] || controlsAfter();
        },
        get children() {
          return createComponent(StepperControl, {
            direction: "next",
            get visible() {
              return showNextControl();
            },
            get parentChildren() {
              return props.children;
            }
          });
        }
      }), _el$0, _co$4);
      createRenderEffect((_p$) => {
        var _v$ = styles["stepper-items"] + " " + (StepperItemsToken?.()?.class || ""), _v$2 = StepperItemsToken?.()?.style;
        _v$ !== _p$.e && className(_el$2, _p$.e = _v$);
        _p$.t = style(_el$2, _v$2, _p$.t);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$;
    }
  });
};
const Stepper$1 = Object.assign(Stepper, {
  Items,
  Item,
  Control
});

const _1j1ji5g = (root) => render(() => createComponent(Stepper$1, {
  get children() {
    return createComponent(Stepper$1.Items, {
      get children() {
        return [createComponent(Stepper$1.Item, {
          selected: true,
          value: "red",
          children: "red"
        }), createComponent(Stepper$1.Item, {
          value: "green",
          children: "green"
        }), createComponent(Stepper$1.Item, {
          value: "blue",
          children: "blue"
        })];
      }
    });
  }
}), root);

export { _1j1ji5g as default };
