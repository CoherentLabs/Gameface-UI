import { z as delegateEvents, C as useContext, b as createMemo, g as getNextElement, i as insert, c as createComponent, w as Show, p as createRenderEffect, s as style, q as className, A as runHydrationEvents, t as template, H as spread, v as getNextMarker, a as createSignal, o as onMount, u as use, F as For, D as createContext } from './web.e96V-LtU.js';
import { u as useToken, c as createTokenComponent } from './tokenComponents.hFDI9VqW.js';
import { n as navigationActions, b as baseComponent } from './BaseComponent.BmESB2kC.js';

const pagination = "_pagination_2dhc3_1";
const last = "_last_2dhc3_18";
const selected = "_selected_2dhc3_30";
const control = "_control_2dhc3_35";
const hidden = "_hidden_2dhc3_43";
const prev = "_prev_2dhc3_51";
const next = "_next_2dhc3_54";
const arrow = "_arrow_2dhc3_61";
const rotate = "_rotate_2dhc3_70";
const styles = {
	pagination: pagination,
	"dot-item": "_dot-item_2dhc3_8",
	last: last,
	"has-numbers": "_has-numbers_2dhc3_21",
	selected: selected,
	control: control,
	hidden: hidden,
	prev: prev,
	next: next,
	arrow: arrow,
	rotate: rotate
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div>`);
const PaginationItem = (props) => {
  const pagination = useContext(PaginationContext);
  const itemToken = useToken(Item, props.parentChildren);
  const isSelected = createMemo(() => pagination?.current() === props.index);
  const paginationItemClasses = createMemo(() => {
    const classes = [styles["dot-item"]];
    if (props.hasNumbers) classes.push(styles["has-numbers"]);
    if (props.index === props.max) classes.push(styles.last);
    if (isSelected()) {
      if (itemToken()?.["selected-class"]) {
        classes.push(itemToken()?.["selected-class"] ?? "");
      } else {
        classes.push(styles.selected);
      }
    }
    if (itemToken()?.class) classes.push(itemToken()?.class ?? "");
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$3);
    _el$.$$click = () => pagination.changePage(props.index);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.hasNumbers;
      },
      get children() {
        return props.index;
      }
    }));
    createRenderEffect((_p$) => {
      var _v$ = itemToken()?.style, _v$2 = paginationItemClasses();
      _p$.e = style(_el$, _v$, _p$.e);
      _v$2 !== _p$.t && className(_el$, _p$.t = _v$2);
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

var _tmpl$$2 = /*#__PURE__*/template(`<svg width=100% height=100% viewBox="0 0 89 171"fill=none xmlns=http://www.w3.org/2000/svg><path d="M83.8 165.4L5 83.4L44.4 44L83.8 4.60002"stroke=none stroke-width=20 stroke-linecap=round stroke-linejoin=round>`);
const Arrow = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$2);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`), _tmpl$2 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
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
      return createComponent(Arrow, {
        get ["class"]() {
          return styles.arrow;
        }
      });
    }
  })];
};
const PaginationControl = (props) => {
  const pagination = useContext(PaginationContext);
  const ControlToken = useToken(Control, props.parentChildren);
  const handleClick = () => {
    return props.direction === "next" ? pagination?.nextPage() : pagination?.previousPage();
  };
  const controlContainerClasses = createMemo(() => {
    const classes = [styles.control];
    classes.push(styles[props.direction]);
    if (ControlToken()?.class) classes.push(ControlToken()?.class ?? "");
    if (!props.visible) {
      if (ControlToken?.()?.["hidden-class"]) {
        classes.push(ControlToken?.()?.["hidden-class"] ?? "");
      } else {
        classes.push(styles.hidden);
      }
    }
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$3 = _el$.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling);
    _el$.$$click = handleClick;
    insert(_el$, createComponent(Show, {
      get when() {
        return props.direction === "prev";
      },
      get children() {
        return createComponent(ControlComponent, {
          ControlToken
        });
      }
    }), _el$4, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return props.direction === "next";
      },
      get children() {
        var _el$2 = getNextElement(_tmpl$$1);
        insert(_el$2, createComponent(ControlComponent, {
          ControlToken
        }));
        createRenderEffect(() => className(_el$2, styles.rotate));
        return _el$2;
      }
    }), _el$6, _co$2);
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

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/><!$><!/>`);
const PaginationContext = createContext();
const Item = createTokenComponent();
const Pagination = (props) => {
  const items = createMemo(() => Array.from({
    length: props.pageSize
  }, (_, i) => i + 1));
  const [index, setIndex] = createSignal(props.pageIndex);
  const length = createMemo(() => items().length);
  let element;
  const changePage = (index2) => {
    if (index2 <= 0 || index2 > length()) {
      return console.error("Invalid index");
    }
    changeIndex(index2);
  };
  const nextPage = () => {
    const current = index();
    const isLastIndex = current === length();
    if (isLastIndex && !props.loop) return;
    changeIndex(isLastIndex ? 1 : current + 1);
  };
  const previousPage = () => {
    const current = index();
    const isFirstIndex = current === 1;
    if (isFirstIndex && !props.loop) return;
    changeIndex(isFirstIndex ? length() : current - 1);
  };
  const changeIndex = (newIndex) => {
    setIndex(newIndex);
    props.onChange?.(newIndex);
  };
  const showLeftArrow = createMemo(() => {
    if (props.loop) return true;
    return index() !== 1;
  });
  const showRightArrow = createMemo(() => {
    if (props.loop) return true;
    return index() !== length();
  });
  props.componentClasses = styles.pagination;
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      element,
      pageIndex: index,
      pageSize: length,
      changeIndex,
      nextPage,
      previousPage
    });
  });
  return createComponent(PaginationContext.Provider, {
    value: {
      current: index,
      changePage,
      nextPage,
      previousPage
    },
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$3] = getNextMarker(_el$6.nextSibling);
      use(navigationActions, _el$, () => ({
        anchor: props.anchor,
        ...props.onAction
      }));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(PaginationControl, {
        direction: "prev",
        get parentChildren() {
          return props.children;
        },
        get visible() {
          return showLeftArrow();
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(For, {
        get each() {
          return items();
        },
        children: (i) => createComponent(PaginationItem, {
          get hasNumbers() {
            return props.hasNumbers || false;
          },
          index: i,
          get max() {
            return length();
          },
          get parentChildren() {
            return props.children;
          }
        })
      }), _el$5, _co$2);
      insert(_el$, createComponent(PaginationControl, {
        direction: "next",
        get parentChildren() {
          return props.children;
        },
        get visible() {
          return showRightArrow();
        }
      }), _el$7, _co$3);
      return _el$;
    }
  });
};
const Pagination$1 = Object.assign(Pagination, {
  Item,
  Control
});

export { Control as C, Item as I, Pagination$1 as P };
