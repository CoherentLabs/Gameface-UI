import { y as delegateEvents, C as useContext, o as onMount, l as onCleanup, g as getNextElement, q as getNextMarker, u as use, i as insert, c as createComponent, v as Show, n as createRenderEffect, E as setAttribute, p as className, s as style$1, A as runHydrationEvents, t as template, f as createMemo, F as For, m as mergeProps, H as spread, a as createSignal, j as createEffect, k as on, z as createUniqueId, D as createContext } from './web.bikURqO-.js';
import { c as createTokenComponent, u as useToken, a as useTokens } from './tokenComponents.ChN_WbXL.js';
import { n as navigationActions, u as useNavigation, w as waitForFrames, b as baseComponent } from './BaseComponent.C3DpOC_C.js';
import { I as InlineTextBlock } from './InlineTextBlock.COktGIaO.js';
import { g as getScrollableParent } from './getScrollableParent.C3YActer.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import { S as Scroll } from './Scroll.BiLXXrar.js';

const dropdown = "_dropdown_1mgi2_1";
const style = {
	dropdown: dropdown,
	"dropdown-disabled": "_dropdown-disabled_1mgi2_4",
	"dropdown-option": "_dropdown-option_1mgi2_8",
	"dropdown-option-selected": "_dropdown-option-selected_1mgi2_18",
	"dropdown-option-disabled": "_dropdown-option-disabled_1mgi2_22",
	"dropdown-options": "_dropdown-options_1mgi2_27",
	"dropdown-options-visible": "_dropdown-options-visible_1mgi2_40",
	"dropdown-options-visible-inverted": "_dropdown-options-visible-inverted_1mgi2_40",
	"dropdown-trigger": "_dropdown-trigger_1mgi2_51",
	"dropdown-trigger-selected": "_dropdown-trigger-selected_1mgi2_64",
	"dropdown-placeholder": "_dropdown-placeholder_1mgi2_70",
	"dropdown-icon": "_dropdown-icon_1mgi2_78"
};

var _tmpl$$4 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const Option = createTokenComponent();
const DropdownOption = (props) => {
  const dropdown = useContext(DropdownContext);
  let element;
  const onClickOption = (option) => {
    dropdown?.selectOption(option.value);
    if (!dropdown?.multiple()) dropdown?.toggle(false);
  };
  onMount(() => {
    dropdown?.registerOption(props.option.value, props.option.children, element, props.option.selected);
  });
  onCleanup(() => {
    dropdown?.unregisterOption(props.option.value);
  });
  const optionClasses = (option) => {
    const classes = [style["dropdown-option"]];
    if (option.class) classes.push(option.class);
    if (dropdown?.isSelected(option.value)) {
      classes.push(style["dropdown-option-selected"]);
      if (option["class-selected"]) classes.push(option["class-selected"]);
    }
    if (option.disabled) {
      classes.push(style["dropdown-option-disabled"]);
      if (option["class-disabled"]) classes.push(option["class-disabled"]);
    }
    return classes.join(" ");
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$$4), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    use(navigationActions, _el$, () => ({
      "select": () => {
        dropdown?.selectOption(props.option.value);
        if (!dropdown?.multiple()) dropdown?.handleNavigationClose();
      }
    }));
    _el$.$$mouseover = (e) => e.currentTarget.focus();
    _el$.$$click = () => onClickOption(props.option);
    var _ref$ = element;
    typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
    insert(_el$, createComponent(Show, {
      get when() {
        return props.option.children;
      },
      get children() {
        return props.option.children;
      }
    }), _el$3, _co$);
    insert(_el$, createComponent(Show, {
      get when() {
        return !props.option.children;
      },
      children: " "
    }), _el$5, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = props.option.disabled || void 0, _v$2 = optionClasses(props.option), _v$3 = {
        ...props.option.style
      };
      _v$ !== _p$.e && setAttribute(_el$, "disabled", _p$.e = _v$);
      _v$2 !== _p$.t && className(_el$, _p$.t = _v$2);
      _p$.a = style$1(_el$, _v$3, _p$.a);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click", "mouseover"]);

var _tmpl$$3 = /* @__PURE__ */ template(`<div>`);
const Track = createTokenComponent();
const Handle = createTokenComponent();
const Options = createTokenComponent();
const DropdownOptions = (props) => {
  const dropdown = useContext(DropdownContext);
  const OptionsToken = useToken(Options, props.parentChildren);
  const OptionsTokens = useTokens(Option, OptionsToken?.()?.children);
  const TrackToken = useToken(Track, props.parentChildren);
  const HandleToken = useToken(Handle, props.parentChildren);
  const optionsClasses = createMemo(() => {
    const classes = [style["dropdown-options"]];
    if (OptionsToken?.()?.class) classes.push(OptionsToken?.()?.class);
    if (dropdown?.open()) {
      if (dropdown.isInverted()) {
        classes.push(style["dropdown-options-visible-inverted"]);
        classes.push(OptionsToken()?.["inverted-class"] ?? "");
      } else {
        classes.push(style["dropdown-options-visible"]);
      }
    }
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$3);
    insert(_el$, createComponent(Scroll, {
      get children() {
        return [createComponent(Scroll.Content, {
          get children() {
            return createComponent(For, {
              get each() {
                return OptionsTokens();
              },
              children: (option) => createComponent(DropdownOption, {
                option
              })
            });
          }
        }), createComponent(Scroll.Bar, mergeProps(() => TrackToken?.() || {}, {
          get children() {
            return createComponent(Scroll.Handle, mergeProps(() => HandleToken?.() || {}));
          }
        }))];
      }
    }));
    createRenderEffect((_p$) => {
      var _v$ = optionsClasses(), _v$2 = OptionsToken?.()?.style;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style$1(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

var _tmpl$$2 = /*#__PURE__*/template(`<svg width=80% height=80% viewBox="0 0 213 308"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 104.5L108.5 6L157.75 55.25L207 104.5"stroke=var(--sl-color-gray-3) stroke-width=25 stroke-linecap=round stroke-linejoin=round></path><path d="M207 203.5L104.5 302L55.25 252.75L5.99999 203.5"stroke=var(--sl-color-gray-3) stroke-width=25 stroke-linecap=round stroke-linejoin=round>`);
const DropdownIcon = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$2);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

var _tmpl$$1 = /* @__PURE__ */ template(`<div><div><!$><!/><!$><!/></div><div>`);
const Trigger = createTokenComponent();
const Placeholder = createTokenComponent();
const Icon = createTokenComponent();
const DropdownTrigger = (props) => {
  const dropdown = useContext(DropdownContext);
  const TriggerToken = useToken(Trigger, props.parentChildren);
  const PlaceholderToken = useToken(Placeholder, props.parentChildren);
  const IconToken = useToken(Icon, props.parentChildren);
  const triggerStyles = createMemo(() => {
    const token = TriggerToken?.();
    return token && token.style ? {
      ...token.style
    } : {};
  });
  const placeholderStyles = createMemo(() => {
    const token = PlaceholderToken?.();
    return token && token.style ? {
      ...token.style
    } : {};
  });
  const IconStyles = createMemo(() => {
    const token = IconToken?.();
    return token && token.style ? {
      ...token.style
    } : {};
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, [_el$4, _co$] = getNextMarker(_el$3.nextSibling), _el$5 = _el$4.nextSibling, [_el$6, _co$2] = getNextMarker(_el$5.nextSibling), _el$7 = _el$2.nextSibling;
    _el$.$$click = () => dropdown?.toggle(!dropdown.open());
    insert(_el$2, createComponent(Show, {
      get when() {
        return dropdown?.selected();
      },
      get children() {
        return dropdown?.options.get(dropdown?.selected())?.label;
      }
    }), _el$4, _co$);
    insert(_el$2, createComponent(Show, {
      get when() {
        return !dropdown?.selected();
      },
      get children() {
        return createComponent(InlineTextBlock, {
          get ["class"]() {
            return style["dropdown-placeholder"] + ` ${PlaceholderToken?.()?.class || ""}`;
          },
          get style() {
            return placeholderStyles();
          },
          get children() {
            return [createComponent(Show, {
              get when() {
                return PlaceholderToken?.();
              },
              get children() {
                return PlaceholderToken?.()?.children || "Select an option";
              }
            }), createComponent(Show, {
              get when() {
                return !PlaceholderToken?.();
              },
              children: " "
            })];
          }
        });
      }
    }), _el$6, _co$2);
    insert(_el$7, createComponent(Show, {
      get when() {
        return IconToken?.();
      },
      get children() {
        return IconToken?.()?.children || createComponent(DropdownIcon, {});
      }
    }));
    createRenderEffect((_p$) => {
      var _v$ = style["dropdown-trigger"] + ` ${TriggerToken?.()?.class || ""}`, _v$2 = triggerStyles(), _v$3 = style["dropdown-trigger-selected"], _v$4 = style["dropdown-icon"] + ` ${IconToken?.()?.class || ""}`, _v$5 = IconStyles();
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style$1(_el$, _v$2, _p$.t);
      _v$3 !== _p$.a && className(_el$2, _p$.a = _v$3);
      _v$4 !== _p$.o && className(_el$7, _p$.o = _v$4);
      _p$.i = style$1(_el$7, _v$5, _p$.i);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const DropdownContext = createContext();
const Dropdown = (props) => {
  let element;
  const [selected, setSelected] = createSignal("");
  const [selectedValues, setSelectedValues] = createSignal([]);
  const [open, setOpen] = createSignal(false);
  const [isInverted, setIsInverted] = createSignal(false);
  const [ready, setReady] = createSignal(false);
  const nav = useNavigation();
  let previousNavScope;
  const areaID = nav && `dropdown-area-${createUniqueId()}`;
  const options = /* @__PURE__ */ new Map();
  createEffect(on(() => props.multiple ? selectedValues() : selected(), (next) => {
    if (ready()) props.onChange?.(next);
  }, {
    defer: true
  }));
  const applyValue = (next) => {
    if (next === void 0) return;
    if (props.multiple) {
      if (!Array.isArray(next)) {
        return;
      }
      setSelectedValues((prev) => {
        if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
        return next.filter((v) => options.has(v));
      });
      return;
    }
    const value = next;
    setSelected(options.has(value) ? value : "");
  };
  createEffect(on(() => props.value, applyValue, {
    defer: true
  }));
  const registerOption = (value, label, element2, selected2) => {
    options.set(value, {
      label,
      element: element2
    });
    if (props.value !== void 0) return;
    if (selected2) selectOption(value);
  };
  const unregisterOption = (value) => options.delete(value);
  const selectOption = (value) => {
    if (!options.has(value)) {
      return;
    }
    if (props.multiple) {
      setSelectedValues((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
      return;
    }
    setSelected(value);
  };
  const deselectOption = (value) => {
    if (props.multiple) {
      setSelectedValues((prev) => prev.filter((v) => v !== value));
      return;
    }
    if (selected() === value) {
      setSelected("");
    }
  };
  const deselectAll = () => {
    if (props.multiple) {
      if (selectedValues().length === 0) return;
      setSelectedValues([]);
      return;
    }
    if (selected() === "") return;
    setSelected("");
  };
  const isSelected = (value) => props.multiple ? selectedValues().includes(value) : selected() === value;
  const multiple = () => !!props.multiple;
  const dropdownClasses = createMemo(() => {
    const classes = [style.dropdown];
    if (props.disabled) {
      classes.push(style["dropdown-disabled"]);
      if (props["class-disabled"]) classes.push(`${props["class-disabled"]}`);
    }
    return classes.join(" ");
  });
  const toggle = (isOpened) => {
    if (props.disabled) return;
    if (isOpened) {
      document.addEventListener("click", closeDropdown);
      initOptionsArea();
      setOpen(true);
      return;
    }
    setOpen(false);
    document.removeEventListener("click", closeDropdown);
    deinitOptionsArea();
  };
  const closeDropdown = (e) => {
    if (!element.contains(e.target)) {
      setOpen(false);
      if (areaID) nav?.switchArea(previousNavScope);
      document.removeEventListener("click", closeDropdown);
    }
  };
  props.componentClasses = () => dropdownClasses();
  function handlePosition() {
    const clipParent = getScrollableParent(element);
    const clipRect = !clipParent ? {
      top: 0,
      height: window.innerHeight
    } : clipParent.getBoundingClientRect();
    const dropdownRect = element.getBoundingClientRect();
    const optionsEl = element.children[1];
    const allowedHeight = clipRect.top + clipRect.height;
    const totalHeight = dropdownRect.top + optionsEl.offsetHeight;
    if (totalHeight > allowedHeight) setIsInverted(true);
  }
  const initOptionsArea = () => {
    if (!nav || !areaID) return;
    setTimeout(() => nav.registerArea(areaID, [...options.values()].map((o) => o.element), true));
  };
  const deinitOptionsArea = () => {
    if (!nav || !areaID) return;
    nav.unregisterArea(areaID);
  };
  const handleNavigationOpen = () => {
    if (!open()) {
      toggle(true);
      previousNavScope = nav?.getScope();
    }
  };
  const handleNavigationClose = () => {
    if (!open()) return;
    toggle(false);
    nav?.switchArea(previousNavScope);
  };
  onMount(() => {
    waitForFrames(() => {
      handlePosition();
    });
    queueMicrotask(() => {
      applyValue(props.value);
      setReady(true);
    });
    if (!props.ref || !element) return;
    props.ref({
      selected,
      selectedValues,
      selectOption,
      deselectOption,
      deselectAll,
      toggle,
      element
    });
  });
  const DropdownContextValue = {
    selected,
    selectedValues,
    isSelected,
    multiple,
    selectOption,
    open,
    toggle,
    registerOption,
    unregisterOption,
    handleNavigationClose,
    options,
    isInverted
  };
  const defaultActions = {
    "select": handleNavigationOpen,
    "back": handleNavigationClose
  };
  return createComponent(DropdownContext.Provider, {
    value: DropdownContextValue,
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
      use(navigationActions, _el$, () => mergeNavigationActions(props, defaultActions));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(DropdownTrigger, {
        get parentChildren() {
          return props.children;
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(DropdownOptions, {
        get parentChildren() {
          return props.children;
        }
      }), _el$5, _co$2);
      return _el$;
    }
  });
};
const Dropdown$1 = Object.assign(Dropdown, {
  Trigger,
  Icon,
  Options,
  Option,
  Track,
  Handle,
  Placeholder
});

export { Dropdown$1 as D };
