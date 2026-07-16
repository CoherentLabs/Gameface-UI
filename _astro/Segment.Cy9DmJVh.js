import { q as delegateEvents, C as useContext, b as createMemo, o as onMount, l as onCleanup, g as getNextElement, u as use, i as insert, n as createRenderEffect, p as className, w as runHydrationEvents, t as template, c as createComponent, F as For, s as style, a as createSignal, y as getNextMarker, z as Show, D as createContext } from './web.DT9QqbDn.js';
import { c as createTokenComponent, a as useTokens, u as useToken } from './tokenComponents.D7hEHUQ6.js';
import { b as baseComponent, n as navigationActions } from './BaseComponent.dZiros1M.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';

const segment = "_segment_aztkf_1";
const disabled = "_disabled_aztkf_50";
const indicator = "_indicator_aztkf_65";
const content = "_content_aztkf_86";
const selected = "_selected_aztkf_91";
const styles = {
	segment: segment,
	"segment-button": "_segment-button_aztkf_13",
	"first-render": "_first-render_aztkf_36",
	disabled: disabled,
	indicator: indicator,
	"show-transition": "_show-transition_aztkf_75",
	content: content,
	selected: selected
};

var _tmpl$$2 = /* @__PURE__ */ template(`<div><div>`);
const Button = createTokenComponent();
const SegmentButton = (props) => {
  const segment = useContext(SegmentContext);
  let element;
  const isSelected = () => segment?.selected() === props.button.value;
  const buttonClasses = createMemo(() => {
    const classes = [styles["segment-button"]];
    if (props.button.disabled) {
      if (props.button["class-disabled"]) classes.push(`${styles.disabled} ${props.button["class-disabled"]}`);
      else classes.push(styles.disabled);
    }
    if (isSelected()) {
      classes.push(styles.selected);
      classes.push(props.button["class-selected"] ?? "");
      if (segment?.firstRender()) {
        classes.push(styles["first-render"]);
      }
    }
    return classes.join(" ");
  });
  props.button.componentClasses = () => buttonClasses();
  const handleClick = (e) => {
    if (props.button.disabled) return;
    segment?.selectOption(props.button.value);
    props.button.click?.(e);
  };
  onMount(() => {
    if (props.button.ref) props.button.ref(element);
    segment?.registerOption(props.button.value, element, props.button.selected);
  });
  onCleanup(() => {
    segment?.unregisterOption(props.button.value);
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild;
    _el$.$$click = handleClick;
    use(baseComponent, _el$, () => props.button);
    var _ref$ = element;
    typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
    insert(_el$2, () => props.button.children);
    createRenderEffect(() => className(_el$2, styles.content));
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

const SegmentButtons = (props) => {
  const ButtonsTokens = useTokens(Button, props.parentChildren);
  return createComponent(For, {
    get each() {
      return ButtonsTokens();
    },
    children: (button) => createComponent(SegmentButton, {
      button
    })
  });
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const Indicator = createTokenComponent();
const SegmentIndicator = (props) => {
  const IndicatorSlot = useToken(Indicator, props.parentChildren);
  const inlineStyles = () => ({
    transform: `translate(${props.data().left}px)`,
    width: `${props.data().width}px`,
    ...IndicatorSlot()?.style
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1);
    createRenderEffect((_p$) => {
      var _v$ = inlineStyles(), _v$2 = `${styles.indicator} ${IndicatorSlot()?.class ?? ""} ${props.data().showTransition ? styles["show-transition"] : ""}`;
      _p$.e = style(_el$, _v$, _p$.e);
      _v$2 !== _p$.t && className(_el$, _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const SegmentContext = createContext();
const Segment = (props) => {
  const [selected, setSelected] = createSignal("");
  const [firstRender, setFirstRender] = createSignal(true);
  const [indicator, setIndicator] = createSignal({
    width: 0,
    left: 0,
    showTransition: false
  });
  const options = /* @__PURE__ */ new Map();
  const orderedOptions = [];
  let element;
  let transitionTimeout;
  const registerOption = (value, element2, selected2) => {
    options.set(value, element2);
    if (!orderedOptions.includes(value)) {
      orderedOptions.push(value);
    }
    if (selected2) selectOption(value);
  };
  const unregisterOption = (value) => {
    options.delete(value);
    const idx = orderedOptions.indexOf(value);
    if (idx !== -1) orderedOptions.splice(idx, 1);
  };
  const selectOption = (newOption) => {
    if (props.disabled) return;
    if (!options.has(newOption)) {
      return;
    }
    const oldOption = selected();
    if (oldOption !== "") {
      const oldLeft = options.get(oldOption).offsetLeft;
      const oldWidth = options.get(oldOption).offsetWidth;
      setIndicator({
        showTransition: false,
        left: oldLeft,
        width: oldWidth
      });
      firstRender() && setFirstRender(false);
    }
    const newLeft = options.get(newOption).offsetLeft;
    const newWidth = options.get(newOption).offsetWidth;
    setSelected(newOption);
    transitionTimeout = setTimeout(() => {
      setIndicator({
        showTransition: true,
        left: newLeft,
        width: newWidth
      });
    }, 50);
    if (!firstRender()) props.onChange?.(newOption);
  };
  const changeSelected = (direction) => {
    const curIdx = orderedOptions.indexOf(selected());
    const targetIdx = direction === "prev" ? curIdx - 1 : curIdx + 1;
    if (targetIdx >= 0 && targetIdx < orderedOptions.length) {
      selectOption(orderedOptions[targetIdx]);
    }
  };
  const segmentClasses = createMemo(() => {
    const classes = [styles.segment];
    if (props.disabled) {
      if (props["class-disabled"]) classes.push(`${styles.disabled} ${props["class-disabled"]}`);
      else classes.push(styles.disabled);
    }
    return classes.join(" ");
  });
  props.componentClasses = () => segmentClasses();
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      selected,
      selectOption,
      changeSelected,
      element
    });
  });
  onCleanup(() => {
    window.clearTimeout(transitionTimeout);
  });
  const defaultActions = {
    "move-left": () => changeSelected("prev"),
    "move-right": () => changeSelected("next")
  };
  return createComponent(SegmentContext.Provider, {
    value: {
      selected,
      selectOption,
      registerOption,
      unregisterOption,
      firstRender
    },
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
      use(navigationActions, _el$, () => mergeNavigationActions(props, defaultActions));
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(SegmentButtons, {
        get parentChildren() {
          return props.children;
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(Show, {
        get when() {
          return !firstRender();
        },
        get children() {
          return createComponent(SegmentIndicator, {
            data: indicator,
            get parentChildren() {
              return props.children;
            }
          });
        }
      }), _el$5, _co$2);
      return _el$;
    }
  });
};
const Segment$1 = Object.assign(Segment, {
  Button,
  Indicator
});

export { Segment$1 as S };
