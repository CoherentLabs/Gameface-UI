import { a as createSignal, B as splitProps, o as onMount, n as onCleanup, b as createMemo, g as getNextElement, v as getNextMarker, i as insert, c as createComponent, u as use, w as Show, p as createRenderEffect, q as className, s as style, t as template, r as render } from './web.e96V-LtU.js';
import { g as getSafePosition } from './getSafePosition.RgHcJ5HV.js';
import { n as navigationActions } from './BaseComponent.BmESB2kC.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';

const tooltip = "_tooltip_1jdfl_1";
const styles = {
	tooltip: tooltip,
	"tooltip-visible": "_tooltip-visible_1jdfl_7",
	"tooltip-message": "_tooltip-message_1jdfl_11",
	"tooltip-wrapper": "_tooltip-wrapper_1jdfl_18",
	"tooltip-bottom": "_tooltip-bottom_1jdfl_22",
	"tooltip-top": "_tooltip-top_1jdfl_22",
	"tooltip-left": "_tooltip-left_1jdfl_22",
	"tooltip-right": "_tooltip-right_1jdfl_22"
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`), _tmpl$2$1 = /* @__PURE__ */ template(`<div><!$><!/><div>`);
const DEFAULT_TIP_POSITION = "bottom";
const createTooltip = (options = {}) => {
  const defaultOptions = {
    content: (props) => (() => {
      var _el$ = getNextElement(_tmpl$$1);
      insert(_el$, () => props.message);
      createRenderEffect(() => className(_el$, styles["tooltip-message"]));
      return _el$;
    })(),
    position: DEFAULT_TIP_POSITION,
    action: "hover"
  };
  options = {
    ...defaultOptions,
    ...options
  };
  return (props) => {
    const [visible, setVisible] = createSignal(false);
    let tooltipChildrenRef;
    let tooltipRef;
    let wrapperRef;
    const [others, contentProps] = splitProps(props, ["style", "class", "ref"]);
    const toggleEventListeners = (on = true) => {
      const method = on ? "addEventListener" : "removeEventListener";
      if (options.action === "none") return showTooltip();
      if (!tooltipChildrenRef) return;
      if (options.action === "click") tooltipChildrenRef[method]("click", toggleTooltip);
      if (options.action === "hover") {
        tooltipChildrenRef[method]("mouseenter", showTooltip);
        tooltipChildrenRef[method]("mouseleave", hideTooltip);
      }
      if (options.action === "focus") {
        tooltipChildrenRef[method]("focusin", showTooltip);
        tooltipChildrenRef[method]("focusout", hideTooltip);
      }
    };
    onMount(() => {
      toggleEventListeners(true);
      if (!others.ref || !wrapperRef) return;
      others.ref({
        element: wrapperRef,
        show: showTooltip,
        hide: hideTooltip
      });
    });
    onCleanup(() => {
      toggleEventListeners(false);
    });
    const toggleTooltip = () => {
      if (visible()) hideTooltip();
      else showTooltip();
    };
    const showTooltip = () => {
      setVisible(true);
    };
    const hideTooltip = () => {
      setVisible(false);
    };
    const calculateAutoPosition = (currentPosition) => {
      if (!tooltipRef) return DEFAULT_TIP_POSITION;
      const rect = tooltipRef.getBoundingClientRect();
      const position = currentPosition || DEFAULT_TIP_POSITION;
      const safePosition = getSafePosition(rect);
      return safePosition || position;
    };
    const tooltipPosition = createMemo((prev) => {
      if (!visible()) return prev || DEFAULT_TIP_POSITION;
      if (options.position === "auto") {
        return calculateAutoPosition(prev);
      }
      return options.position || DEFAULT_TIP_POSITION;
    });
    const tooltipClasses = createMemo(() => {
      const classes = [styles["tooltip"]];
      if (visible()) classes.push(styles["tooltip-visible"]);
      classes.push(styles[`tooltip-${tooltipPosition()}`]);
      return classes.join(" ");
    });
    const tooltipWrapperClasses = createMemo(() => {
      const classes = [styles["tooltip-wrapper"]];
      if (others.class) classes.push(others.class);
      return classes.join(" ");
    });
    return (() => {
      var _el$2 = getNextElement(_tmpl$2$1), _el$5 = _el$2.firstChild, [_el$6, _co$] = getNextMarker(_el$5.nextSibling), _el$4 = _el$6.nextSibling;
      var _ref$ = wrapperRef;
      typeof _ref$ === "function" ? use(_ref$, _el$2) : wrapperRef = _el$2;
      insert(_el$2, createComponent(Show, {
        get when() {
          return options.action !== "none";
        },
        get fallback() {
          return props.children;
        },
        get children() {
          var _el$3 = getNextElement(_tmpl$$1);
          use(navigationActions, _el$3, () => mergeNavigationActions(options, {
            "back": () => visible() && hideTooltip()
          }));
          var _ref$2 = tooltipChildrenRef;
          typeof _ref$2 === "function" ? use(_ref$2, _el$3) : tooltipChildrenRef = _el$3;
          insert(_el$3, () => props.children);
          return _el$3;
        }
      }), _el$6, _co$);
      var _ref$3 = tooltipRef;
      typeof _ref$3 === "function" ? use(_ref$3, _el$4) : tooltipRef = _el$4;
      insert(_el$4, () => options.content?.(contentProps));
      createRenderEffect((_p$) => {
        var _v$ = tooltipWrapperClasses(), _v$2 = others.style, _v$3 = tooltipClasses();
        _v$ !== _p$.e && className(_el$2, _p$.e = _v$);
        _p$.t = style(_el$2, _v$2, _p$.t);
        _v$3 !== _p$.a && className(_el$4, _p$.a = _v$3);
        return _p$;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      });
      return _el$2;
    })();
  };
};

var _tmpl$ = /* @__PURE__ */ template(`<div style="position:relative;background-color:rgb(0, 132, 255);justify-content:center;border-radius:0.5vmax;padding:0.5vmax 1vmax;color:white;display:flex;flex-direction:column"><h2 style=margin:0></h2><span>`), _tmpl$2 = /* @__PURE__ */ template(`<div>Hover for more info`);
const CustomTooltip = (props) => {
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    insert(_el$2, () => props.title);
    insert(_el$3, () => props.message);
    return _el$;
  })();
};
const App = () => {
  const Tooltip = createTooltip({
    content: CustomTooltip,
    action: "hover",
    position: "bottom"
  });
  return createComponent(Tooltip, {
    style: {
      display: "flex",
      "justify-content": "center",
      color: "white",
      width: "100%"
    },
    title: "Tooltip title",
    message: "Tooltip text",
    get children() {
      return getNextElement(_tmpl$2);
    }
  });
};
const _1u5dtb4 = (root) => render(() => createComponent(App, {}), root);

export { _1u5dtb4 as default };
