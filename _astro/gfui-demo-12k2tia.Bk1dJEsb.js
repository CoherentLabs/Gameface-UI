import { C as useContext, b as createMemo, c as createComponent, g as getNextElement, i as insert, p as createRenderEffect, s as style, q as className, w as Show, x as memo, t as template, D as createContext, a as createSignal, m as mergeProps, F as For, o as onMount, r as render } from './web.ibFHgs_k.js';
import { c as createTokenComponent, u as useToken, a as useTokens } from './tokenComponents.CSsomKQw.js';
import { L as LayoutBase } from './LayoutBase.DEk-c953.js';
import { s as starIcon } from './round-star.DgGHujc5.js';
import '@solid-primitives/jsx-tokenizer';
import './BaseComponent.DEyWe7lF.js';
import 'coherent-gameface-interaction-manager';
import './store.DBjQIIM3.js';

const list = "_list_12j8k_1";
const icon = "_icon_12j8k_16";
const styles = {
	list: list,
	"list-item": "_list-item_12j8k_4",
	"list-item-nested": "_list-item-nested_12j8k_10",
	icon: icon,
	"icon-disc": "_icon-disc_12j8k_23",
	"icon-circle": "_icon-circle_12j8k_23",
	"icon-square": "_icon-square_12j8k_23",
	"icon-number": "_icon-number_12j8k_37",
	"icon-custom": "_icon-custom_12j8k_41",
	"icon-none": "_icon-none_12j8k_46"
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const Icon = createTokenComponent();
const ListIcon = (props) => {
  const IconToken = useToken(Icon, props.parentChildren);
  const listContext = useContext(ListContext);
  const IconClasses = createMemo(() => {
    const classes = [styles.icon];
    classes.push(listContext?.bulletBgUrl() ? styles[`icon-custom`] : styles[`icon-${listContext?.bulletType()}`]);
    classes.push(listContext?.bulletClass() ?? "");
    classes.push(IconToken()?.class ?? "");
    return classes.join(" ");
  });
  const IconStyle = createMemo(() => {
    const base = IconToken()?.style ?? {};
    const url = typeof listContext?.bulletBgUrl() === "string" ? listContext?.bulletBgUrl() : listContext?.bulletBgUrl()?.src;
    if (!url || IconToken()?.children) return base;
    return {
      ...base,
      "background-image": `url("${url}")`
    };
  });
  return [createComponent(Show, {
    get when() {
      return IconToken()?.children;
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$1);
      insert(_el$, () => IconToken()?.children);
      createRenderEffect((_p$) => {
        var _v$ = IconStyle(), _v$2 = `${IconToken()?.class ?? ""} ${styles.icon} ${listContext?.bulletClass() ?? ""}`;
        _p$.e = style(_el$, _v$, _p$.e);
        _v$2 !== _p$.t && className(_el$, _p$.t = _v$2);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$;
    }
  }), createComponent(Show, {
    get when() {
      return !IconToken()?.children;
    },
    get children() {
      var _el$2 = getNextElement(_tmpl$$1);
      insert(_el$2, (() => {
        var _c$ = memo(() => !!listContext?.isOrdered());
        return () => _c$() && props.index + 1 + ".";
      })());
      createRenderEffect((_p$) => {
        var _v$3 = IconStyle(), _v$4 = IconClasses();
        _p$.e = style(_el$2, _v$3, _p$.e);
        _v$4 !== _p$.t && className(_el$2, _p$.t = _v$4);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$2;
    }
  })];
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const NestedListContext = createContext();
const Item = createTokenComponent();
const ListItem = (props) => {
  const [nestedList, setNestedList] = createSignal();
  const mountNested = (list) => setNestedList(list);
  const ItemHeader = () => [createComponent(ListIcon, {
    get parentChildren() {
      return props.item.children;
    },
    get isNested() {
      return nestedList() ? true : false;
    },
    get index() {
      return props.index;
    }
  }), memo(() => props.item.children)];
  return createComponent(NestedListContext.Provider, {
    value: {
      mountNested,
      nestedList
    },
    get children() {
      return createComponent(LayoutBase, mergeProps({
        get componentClasses() {
          return `${styles["list-item"]} ${nestedList() ? styles["list-item-nested"] : ""} ${props.item.class ?? ""}`;
        },
        get style() {
          return props.item.style;
        }
      }, () => props.item, {
        get children() {
          return createComponent(Show, {
            get when() {
              return nestedList();
            },
            get fallback() {
              return createComponent(ItemHeader, {});
            },
            get children() {
              return [(() => {
                var _el$ = getNextElement(_tmpl$);
                insert(_el$, createComponent(ItemHeader, {}));
                createRenderEffect(() => className(_el$, styles["list-item"]));
                return _el$;
              })(), memo(() => nestedList())];
            }
          });
        }
      }));
    }
  });
};

const PREDEFINED_TYPES = ["disc", "circle", "square", "number", "none"];
const isPredefined = (t) => PREDEFINED_TYPES.includes(t);
const ListContext = createContext();
const List = (props) => {
  const itemTokens = useTokens(Item, props.children);
  const nestedContext = useContext(NestedListContext);
  const isOrdered = createMemo(() => props.type === "ordered" || props["bullet-type"] === "number");
  const bulletType = createMemo(() => {
    const type = props["bullet-type"];
    const listIsOrdered = isOrdered();
    if (!type && !listIsOrdered) return "disc";
    else if (!type || listIsOrdered) return "number";
    if (isPredefined(type)) return type;
    return type;
  });
  const bulletBgUrl = createMemo(() => !isPredefined(bulletType()) ? props["bullet-type"] : void 0);
  const bulletClass = createMemo(() => props["bullet-class"] ?? "");
  const contextValue = {
    type: props.type || "unordered",
    isOrdered,
    bulletType,
    bulletBgUrl,
    bulletClass
  };
  const vnode = createComponent(ListContext.Provider, {
    value: contextValue,
    get children() {
      return createComponent(LayoutBase, mergeProps({
        get componentClasses() {
          return `${styles.list}`;
        }
      }, props, {
        get children() {
          return createComponent(For, {
            get each() {
              return itemTokens();
            },
            children: (item, index) => createComponent(ListItem, {
              item,
              get parentChildren() {
                return props.children;
              },
              get index() {
                return index();
              }
            })
          });
        }
      }));
    }
  });
  if (nestedContext) {
    onMount(() => nestedContext.mountNested(vnode));
    return null;
  }
  return vnode;
};
const List$1 = Object.assign(List, {
  Item,
  Icon
});

const App = () => {
  return createComponent(List$1, {
    "bullet-type": "disc",
    get children() {
      return [createComponent(List$1.Item, {
        children: "Step one"
      }), createComponent(List$1.Item, {
        get children() {
          return ["Step two", createComponent(List$1, {
            "bullet-type": starIcon,
            get children() {
              return [createComponent(List$1.Item, {
                children: "Step 2.1"
              }), createComponent(List$1.Item, {
                children: "Step 2.2"
              })];
            }
          })];
        }
      }), createComponent(List$1.Item, {
        get children() {
          return ["Special step", createComponent(List$1.Icon, {
            "class": "custom-icon"
          })];
        }
      })];
    }
  });
};
const _12k2tia = (root) => render(() => createComponent(App, {}), root);

export { _12k2tia as default };
