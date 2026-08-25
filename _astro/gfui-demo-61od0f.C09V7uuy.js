import { G as useContext, b as createMemo, j as createEffect, k as on, g as getNextElement, i as insert, n as createRenderEffect, p as className, s as style, C as setStyleProperty, t as template, c as createComponent, v as getNextMarker, w as Show, y as memo, a as createSignal, o as onMount, l as onCleanup, E as createContext, u as use, F as For, r as render } from './web.DoGxwvvO.js';
import { u as useToken, c as createTokenComponent, a as useTokens } from './tokenComponents.C6MElWh1.js';
import { A as Absolute } from './Absolute.BPxQK_Ps.js';
import { c as clamp } from './clamp.BBPiOs3-.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.DmBIQgSj.js';
import { B as BackgroundImage } from './BackgroundImage.CyYNtSoL.js';
import './LayoutBase.V5Pt4GTE.js';
import './store.BChLrIuc.js';

const Weapon1 = {"src":"/_astro/weapon1.BR3b8pxN.png","width":407,"height":259,"format":"png"};

const Weapon2 = {"src":"/_astro/weapon2.BRLe_QJH.png","width":768,"height":271,"format":"png"};

const Weapon3 = {"src":"/_astro/weapon.DRk5OkGT.png","width":954,"height":278,"format":"png"};

const Weapon4 = {"src":"/_astro/weapon4.CUkVZTl9.png","width":442,"height":243,"format":"png"};

const Weapon5 = {"src":"/_astro/weapon5.Cih0lC3A.png","width":487,"height":302,"format":"png"};

const Weapon6 = {"src":"/_astro/weapon6.9adn2VXq.png","width":693,"height":261,"format":"png"};

const Center = {"src":"/_astro/GameMessage_AchievmentIcon.DWlvsBho.png","width":144,"height":141,"format":"png"};

const menu = "_menu_1el7y_1";
const styles = {
	menu: menu,
	"menu-open": "_menu-open_1el7y_15",
	"menu-content": "_menu-content_1el7y_18",
	"menu-indicator": "_menu-indicator_1el7y_28",
	"menu-indicator-wrapper": "_menu-indicator-wrapper_1el7y_34",
	"menu-indicator-icon": "_menu-indicator-icon_1el7y_42",
	"menu-item-wrapper": "_menu-item-wrapper_1el7y_50",
	"menu-item-content": "_menu-item-content_1el7y_58",
	"menu-item-selector": "_menu-item-selector_1el7y_62",
	"menu-item-selected": "_menu-item-selected_1el7y_70"
};

var _tmpl$$4 = /* @__PURE__ */ template(`<div><div></div><div><div>`);
const MenuItem = (props) => {
  const SelectorToken = useToken(Selector, props.parentChildren);
  const context = useContext(RadialMenuContext);
  if (!context) {
    console.error("RadialMenu.Item must be used inside a RadialMenu component");
    return null;
  }
  const rotation = createMemo(() => context.degreesPerSlice() * props.index());
  const isSelected = createMemo(() => context.selected() === props.index());
  const offset = createMemo(() => props.item.offset ?? "1rem");
  createEffect(on(isSelected, (selected) => {
    if (selected && context.onChange) {
      const id = props.item.id || props.index();
      context.onChange(id);
    }
  }, {
    defer: true
  }));
  const wrapperClasses = createMemo(() => {
    const classes = [styles["menu-item-wrapper"]];
    classes.push(props.item.class ?? "");
    isSelected() && classes.push(props.item["class-selected"] ?? "");
    return classes.join(" ");
  });
  const wrapperStyles = createMemo(() => {
    const styles2 = {};
    Object.assign(styles2, props.item.style);
    isSelected() && Object.assign(styles2, props.item["style-selected"] ?? {});
    return styles2;
  });
  const selectorClasses = createMemo(() => {
    const classes = [styles["menu-item-selector"]];
    classes.push(SelectorToken()?.class ?? "");
    if (isSelected()) {
      classes.push(styles["menu-item-selected"]);
      classes.push(SelectorToken()?.["class-selected"] ?? "");
    }
    return classes.join(" ");
  });
  const selectorStyles = createMemo(() => {
    const styles2 = {
      "clip-path": context.clipPathValue(),
      transform: `rotate(${rotation()}deg)`
    };
    if (props.item.style) {
      Object.assign(styles2, SelectorToken()?.style);
    }
    if (isSelected()) {
      Object.assign(styles2, SelectorToken()?.["style-selected"] ?? {});
    }
    return styles2;
  });
  return (
    // Wrapper of the item content and the clipped selector
    (() => {
      var _el$ = getNextElement(_tmpl$$4), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild;
      insert(_el$4, () => props.item.children);
      createRenderEffect((_p$) => {
        var _v$ = wrapperClasses(), _v$2 = wrapperStyles(), _v$3 = selectorClasses(), _v$4 = selectorStyles(), _v$5 = styles["menu-item-content"], _v$6 = `rotate(${rotation()}deg)`, _v$7 = offset(), _v$8 = `rotate(-${rotation()}deg)`;
        _v$ !== _p$.e && className(_el$, _p$.e = _v$);
        _p$.t = style(_el$, _v$2, _p$.t);
        _v$3 !== _p$.a && className(_el$2, _p$.a = _v$3);
        _p$.o = style(_el$2, _v$4, _p$.o);
        _v$5 !== _p$.i && className(_el$3, _p$.i = _v$5);
        _v$6 !== _p$.n && setStyleProperty(_el$3, "transform", _p$.n = _v$6);
        _v$7 !== _p$.s && setStyleProperty(_el$3, "padding-top", _p$.s = _v$7);
        _v$8 !== _p$.h && setStyleProperty(_el$4, "transform", _p$.h = _v$8);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0,
        h: void 0
      });
      return _el$;
    })()
  );
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div><div></div><!$><!/>`), _tmpl$2 = /* @__PURE__ */ template(`<div>`);
const MenuIndicator = (props) => {
  const IndicatorToken = useToken(Indicator, props.parentChildren);
  const IconToken = useToken(Icon, IndicatorToken()?.children);
  const context = useContext(RadialMenuContext);
  if (!context) {
    console.error("RadialMenu.Indicator must be used inside a RadialMenu component");
    return null;
  }
  const IndicatorClasses = createMemo(() => {
    const classes = [styles["menu-indicator"]];
    classes.push(IndicatorToken()?.class ?? "");
    return classes.join(" ");
  });
  const IndicatorStyles = createMemo(() => {
    const styles2 = {
      "clip-path": context.clipPathValue()
    };
    if (IndicatorToken()?.style) {
      Object.assign(styles2, IndicatorToken()?.style);
    }
    return styles2;
  });
  return createComponent(Show, {
    get when() {
      return IndicatorToken();
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$3), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, [_el$4, _co$] = getNextMarker(_el$3.nextSibling);
      insert(_el$, createComponent(Show, {
        get when() {
          return IconToken();
        },
        get children() {
          return memo(() => !!IconToken()?.children)() ? (
            // Wrapped in Absolute to center the icon inside the indicator
            createComponent(Absolute, {
              get ["class"]() {
                return IconToken()?.class ?? "";
              },
              get style() {
                return IconToken()?.style;
              },
              get children() {
                return IconToken()?.children;
              }
            })
          ) : (
            // No children, just render default Icon.
            (() => {
              var _el$5 = getNextElement(_tmpl$2);
              createRenderEffect((_p$) => {
                var _v$5 = `${IconToken()?.class ?? ""} ${styles["menu-indicator-icon"]}`, _v$6 = IconToken()?.style;
                _v$5 !== _p$.e && className(_el$5, _p$.e = _v$5);
                _p$.t = style(_el$5, _v$6, _p$.t);
                return _p$;
              }, {
                e: void 0,
                t: void 0
              });
              return _el$5;
            })()
          );
        }
      }), _el$4, _co$);
      createRenderEffect((_p$) => {
        var _v$ = styles["menu-indicator-wrapper"], _v$2 = `rotate(${context.rotation()}deg)`, _v$3 = IndicatorClasses(), _v$4 = IndicatorStyles();
        _v$ !== _p$.e && className(_el$, _p$.e = _v$);
        _v$2 !== _p$.t && setStyleProperty(_el$, "transform", _p$.t = _v$2);
        _v$3 !== _p$.a && className(_el$2, _p$.a = _v$3);
        _p$.o = style(_el$2, _v$4, _p$.o);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0
      });
      return _el$;
    }
  });
};

var _tmpl$$2 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const MenuCenter = (props) => {
  const contentToken = useToken(Content, props.parentChildren);
  const context = useContext(RadialMenuContext);
  if (!context) {
    console.error("RadialMenu.Content must be used inside a RadialMenu component");
    return null;
  }
  const menuCenterClasses = createMemo(() => {
    const classes = [styles["menu-content"]];
    classes.push(contentToken()?.class ?? "");
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    insert(_el$, () => contentToken()?.children, _el$3, _co$);
    insert(_el$, createComponent(MenuIndicator, {
      get parentChildren() {
        return props.parentChildren;
      }
    }), _el$5, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = menuCenterClasses(), _v$2 = contentToken()?.style;
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

function mouseToStick(e, rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const R = Math.min(rect.width, rect.height) / 2;
  const nx = clamp(dx / R, -1, 1);
  const ny = clamp(dy / R, -1, 1);
  return stickToPolar(nx, ny);
}
function angleToSlice(angleDeg, sliceInDeg) {
  return Math.floor((angleDeg + sliceInDeg / 2) % 360 / sliceInDeg);
}
function stickToPolar(x, y) {
  const rad = Math.atan2(x, -y);
  const angleDeg = (rad * 180 / Math.PI + 360) % 360;
  const mag = Math.min(1, Math.hypot(x, y));
  return { x, y, mag, angleDeg };
}

var _tmpl$$1 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const Item = createTokenComponent();
const Indicator = createTokenComponent();
const Content = createTokenComponent();
const Icon = createTokenComponent();
const Selector = createTokenComponent();
const RadialMenuContext = createContext();
const EPS = 1e-5;
const RadialMenu = (props) => {
  const ItemTokens = useTokens(Item, props.children);
  let element;
  let eventAttached = false;
  const [selected, setSelected] = createSignal(props.selected ?? 0);
  const [rotation, setRotation] = createSignal(0);
  const [isOpen, setIsOpen] = createSignal(props.opened ?? false);
  const [gap, setGap] = createSignal(props.gap ?? 0);
  const [ignoreMouseMove, setIgnoreMouseMove] = createSignal(false);
  const length = createMemo(() => ItemTokens()?.length ?? 1);
  const degreesPerSlice = createMemo(() => 360 / length());
  const clipPathValue = createMemo(() => {
    if (length() === 1) return "";
    if (length() === 2) return "polygon(0% 50%, 0% 0%, 100% 0%, 100% 50%)";
    const g = gap();
    const halfSliceDeg = degreesPerSlice() / 2;
    const halfSliceTan = Math.tan(halfSliceDeg * Math.PI / 180);
    const halfSliceProportion = halfSliceTan * 50;
    const xLeftPercent = 50 - halfSliceProportion + EPS + g;
    const xRightPercent = 50 + halfSliceProportion + EPS - g;
    return `polygon(${xLeftPercent}% 0, 50% 50%, ${xRightPercent}% 0)`;
  });
  const mouseMoveHandler = (e) => {
    if (!element || !isOpen() || ignoreMouseMove()) return;
    const rect = element.getBoundingClientRect();
    const stick = mouseToStick(e, rect);
    handleIndexSelection(stick);
  };
  const selectByVector = (x, y) => {
    if (!isOpen()) return;
    const stick = stickToPolar(x, y);
    handleIndexSelection(stick);
    debounceMouseMovement();
  };
  const selectByIndex = (index) => {
    if (index < 0 || index >= length() || !isOpen()) return;
    const degrees = index * degreesPerSlice();
    setSelected(index);
    setRotation(degrees);
    debounceMouseMovement();
  };
  const handleIndexSelection = (stick) => {
    const DEADZONE = 0.12;
    if (stick.mag < DEADZONE) return;
    const index = angleToSlice(stick.angleDeg, degreesPerSlice());
    setSelected(index);
    setRotation(stick.angleDeg);
  };
  const debounceMouseMovement = () => {
    setIgnoreMouseMove(true);
    setTimeout(() => setIgnoreMouseMove(false), 100);
  };
  const radialMenuClasses = createMemo(() => {
    const classes = [styles.menu];
    if (isOpen()) classes.push(styles["menu-open"]);
    return classes.join(" ");
  });
  createEffect(on(isOpen, (isOpened) => {
    if (isOpened) addEventListeners();
    else removeEventListeners();
  }));
  createEffect(on(length, () => {
    props.onItemChanged && props.onItemChanged();
  }, {
    defer: true
  }));
  const addEventListeners = () => {
    eventAttached = true;
    window.addEventListener("mousemove", mouseMoveHandler);
  };
  const removeEventListeners = () => {
    if (!eventAttached) return;
    eventAttached = false;
    window.removeEventListener("mousemove", mouseMoveHandler);
  };
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      element,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      opened: () => isOpen(),
      changeGap: setGap,
      selectByIndex,
      selectByVector
    });
  });
  onCleanup(() => removeEventListeners());
  props.componentClasses = () => radialMenuClasses();
  const ContextObj = {
    clipPathValue,
    degreesPerSlice,
    selected,
    rotation,
    onChange: props.onChange
  };
  return createComponent(RadialMenuContext.Provider, {
    value: ContextObj,
    get children() {
      var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
      use(navigationActions, _el$, () => ({
        anchor: props.anchor,
        ...props.onAction
      }));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(MenuCenter, {
        get parentChildren() {
          return props.children;
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(For, {
        get each() {
          return ItemTokens();
        },
        children: (token, index) => createComponent(MenuItem, {
          index,
          item: token,
          get parentChildren() {
            return props.children;
          }
        })
      }), _el$5, _co$2);
      return _el$;
    }
  });
};
const RadialMenu$1 = Object.assign(RadialMenu, {
  Item,
  Content,
  Selector,
  Indicator: Object.assign(Indicator, {
    Icon
  })
});

var _tmpl$ = /* @__PURE__ */ template(`<div style=width:5vmax;height:5vmax>`);
const _61od0f = (root) => render(() => (
  // Assets import
  createComponent(RadialMenu$1, {
    opened: true,
    get children() {
      return [createComponent(RadialMenu$1.Content, {
        style: {
          width: "50%",
          height: "50%"
        },
        get children() {
          return createComponent(BackgroundImage, {
            style: {
              width: "80%",
              height: "80%"
            },
            src: Center,
            options: {
              size: "contain",
              position: "center"
            }
          });
        }
      }), createComponent(For, {
        each: [{
          id: "shotgun",
          img: Weapon1
        }, {
          id: "pistol",
          img: Weapon2
        }, {
          id: "rifle",
          img: Weapon3
        }, {
          id: "sniper",
          img: Weapon4
        }, {
          id: "smg",
          img: Weapon5
        }, {
          id: "grenade",
          img: Weapon6
        }],
        children: (item) => createComponent(RadialMenu$1.Item, {
          get id() {
            return item.id;
          },
          get children() {
            var _el$ = getNextElement(_tmpl$);
            insert(_el$, createComponent(BackgroundImage, {
              fill: true,
              get src() {
                return item.img;
              },
              options: {
                size: "contain",
                position: "center"
              }
            }));
            return _el$;
          }
        })
      })];
    }
  })
), root);

export { _61od0f as default };
