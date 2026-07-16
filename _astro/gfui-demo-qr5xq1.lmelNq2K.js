import { a as createSignal, b as createMemo, k as createEffect, o as onMount, g as getNextElement, i as insert, p as createRenderEffect, q as className, s as style, t as template, u as use, H as spread, A as runHydrationEvents, z as delegateEvents, C as useContext, c as createComponent, v as getNextMarker, d as createUniqueId, F as For, D as createContext, r as render } from './web.e96V-LtU.js';
import { c as createTokenComponent, u as useToken, a as useTokens } from './tokenComponents.hFDI9VqW.js';
import { w as waitForFrames, n as navigationActions, b as baseComponent } from './BaseComponent.BmESB2kC.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';
import '@solid-primitives/jsx-tokenizer';
import 'coherent-gameface-interaction-manager';
import './store.CBj67zxW.js';

const accordion = "_accordion_evg5q_1";
const panel = "_panel_evg5q_9";
const disabled = "_disabled_evg5q_16";
const heading = "_heading_evg5q_25";
const icon = "_icon_evg5q_39";
const body = "_body_evg5q_49";
const content = "_content_evg5q_54";
const styles = {
	accordion: accordion,
	panel: panel,
	disabled: disabled,
	heading: heading,
	"heading-content": "_heading-content_evg5q_32",
	icon: icon,
	"icon-expanded": "_icon-expanded_evg5q_45",
	body: body,
	content: content
};

var _tmpl$$4 = /* @__PURE__ */ template(`<div><div>`);
const Body = createTokenComponent();
const AccordionBody = (props) => {
  const BodyToken = useToken(Body, props.parentChildren);
  const [height, setHeight] = createSignal(0);
  let element;
  const bodyStyles = createMemo(() => {
    return {
      height: props.isExpanded() ? `${height()}px` : "0px"
    };
  });
  const handleExpand = () => {
    if (props.isExpanded()) setHeight(element.scrollHeight);
  };
  createEffect(() => {
    handleExpand();
  });
  onMount(() => {
    waitForFrames(() => {
      handleExpand();
    }, 3);
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$4), _el$2 = _el$.firstChild;
    var _ref$ = element;
    typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
    insert(_el$2, () => BodyToken()?.children);
    createRenderEffect((_p$) => {
      var _v$ = `${styles.body}`, _v$2 = bodyStyles(), _v$3 = `${styles.content} ${BodyToken()?.class || ""}`, _v$4 = BodyToken()?.style;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
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
  })();
};

var _tmpl$$3 = /*#__PURE__*/template(`<svg width=100% height=100% viewBox="0 0 32 18"fill=none xmlns=http://www.w3.org/2000/svg><path d="M29 3L15.7413 15L9.37065 9L3 3"stroke=var(--sl-color-gray-3) stroke-width=5 stroke-linecap=round stroke-linejoin=round>`);
const AccordionIcon = (props = {}) => (() => {
  var _el$ = getNextElement(_tmpl$$3);
  spread(_el$, props, true, true);
  runHydrationEvents();
  return _el$;
})();

var _tmpl$$2 = /* @__PURE__ */ template(`<div><div></div><div>`);
const Heading = createTokenComponent();
const Icon = createTokenComponent();
const AccordionHeading = (props) => {
  const HeadingToken = useToken(Heading, props.parentChildren);
  const IconToken = useToken(Icon, HeadingToken?.()?.children);
  const accordion = useContext(AccordionContext);
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    use(navigationActions, _el$, () => mergeNavigationActions(HeadingToken(), {
      "select": () => accordion?.toggle(props.id)
    }));
    _el$.$$click = () => accordion?.toggle(props.id);
    insert(_el$2, () => HeadingToken()?.children);
    insert(_el$3, () => IconToken?.()?.children || createComponent(AccordionIcon, {}));
    createRenderEffect((_p$) => {
      var _v$ = `${styles.heading} ${HeadingToken()?.class || ""}`, _v$2 = HeadingToken()?.style, _v$3 = `${styles["heading-content"]}`, _v$4 = `${styles.icon} ${IconToken?.()?.class || ""} ${props.isExpanded() ? styles["icon-expanded"] : ""}`, _v$5 = IconToken?.()?.style;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      _v$3 !== _p$.a && className(_el$2, _p$.a = _v$3);
      _v$4 !== _p$.o && className(_el$3, _p$.o = _v$4);
      _p$.i = style(_el$3, _v$5, _p$.i);
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

var _tmpl$$1 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const Panel = createTokenComponent();
const AccordionPanel = (props) => {
  const accordion = useContext(AccordionContext);
  const isExpanded = createMemo(() => accordion.expandedPanels().includes(props.id));
  const panelClasses = createMemo(() => {
    const classes = [styles.panel];
    classes.push(props.panel.class ?? "");
    if (props.panel.disabled) {
      classes.push(styles.disabled);
      classes.push(props.panel["class-disabled"] ?? "");
    }
    if (isExpanded()) classes.push(props.panel["class-expanded"] ?? "");
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
    insert(_el$, createComponent(AccordionHeading, {
      get id() {
        return props.id;
      },
      isExpanded,
      get parentChildren() {
        return props.panel.children;
      }
    }), _el$3, _co$);
    insert(_el$, createComponent(AccordionBody, {
      isExpanded,
      get parentChildren() {
        return props.panel.children;
      }
    }), _el$5, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = panelClasses(), _v$2 = props.panel?.style;
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

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
function initPanels(panelData, multiple = false) {
  const arr = [];
  for (const {
    panel,
    id
  } of panelData) {
    if (!panel.expanded) continue;
    if (multiple) {
      arr.push(id);
    } else {
      return [id];
    }
  }
  return arr;
}
const AccordionContext = createContext();
const Accordion = (props) => {
  let element;
  const PanelTokens = useTokens(Panel, props.children);
  const panelData = createMemo(() => PanelTokens()?.map((panel) => ({
    id: panel.title ?? createUniqueId(),
    panel
  })));
  const [expandedPanels, setExpandedPanels] = createSignal(initPanels(panelData(), props.multiple));
  const toggle = (id) => {
    setExpandedPanels((prev) => {
      if (!props.multiple) {
        return prev[0] === id ? [] : [id];
      }
      return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
    });
    props.onChange?.(id);
  };
  const expandAll = () => {
    if (!props.multiple) return console.error("Accordion must be multiple to execute this method");
    const data = panelData();
    if (!data || data.length === 0) {
      return console.error("No panels to expand!");
    }
    setExpandedPanels(props.multiple ? data.map((d) => d.id) : [data[0].id]);
  };
  const collapseAll = () => {
    const data = panelData();
    if (!data || data.length === 0) {
      return console.error("No panels to collapse!");
    }
    setExpandedPanels([]);
  };
  const expand = (title) => {
    const data = panelData();
    if (!data || data.length === 0) {
      return console.error("No panels to expand!");
    }
    if (!data.find((panel) => panel.id === title)) {
      return console.error(`There is no panel with title: ${title}`);
    }
    toggle(title);
  };
  const collapse = (title) => {
    const data = panelData();
    if (!data || data.length === 0) {
      return console.error("No panels to collapse!");
    }
    if (!data.find((panel) => panel.id === title)) {
      return console.error(`There is no panel with title: ${title}`);
    }
    setExpandedPanels((prev) => {
      if (!props.multiple) return [];
      return prev.filter((id) => id !== title);
    });
    props.onChange?.(title);
  };
  const accordionClasses = createMemo(() => {
    const classes = [styles.accordion];
    if (props.disabled) {
      classes.push(styles.disabled);
      classes.push(props["class-disabled"] ?? "");
    }
    return classes.join(" ");
  });
  props.componentClasses = () => accordionClasses();
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      element,
      expand,
      collapse,
      expandAll,
      collapseAll
    });
  });
  return createComponent(AccordionContext.Provider, {
    value: {
      expandedPanels,
      toggle
    },
    get children() {
      var _el$ = getNextElement(_tmpl$);
      use(baseComponent, _el$, () => props);
      var _ref$ = element;
      typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
      insert(_el$, createComponent(For, {
        get each() {
          return panelData();
        },
        children: (data) => createComponent(AccordionPanel, {
          get id() {
            return data.id;
          },
          get panel() {
            return data.panel;
          }
        })
      }));
      return _el$;
    }
  });
};
const Accordion$1 = Object.assign(Accordion, {
  Panel,
  Body,
  Heading,
  Icon
});

const qr5xq1 = (root) => render(() => createComponent(Accordion$1, {
  get children() {
    return [createComponent(Accordion$1.Panel, {
      get children() {
        return [createComponent(Accordion$1.Heading, {
          children: "Heading 1"
        }), createComponent(Accordion$1.Body, {
          children: "Accordion content"
        })];
      }
    }), createComponent(Accordion$1.Panel, {
      get children() {
        return [createComponent(Accordion$1.Heading, {
          children: "Heading 2"
        }), createComponent(Accordion$1.Body, {
          children: "Accordion content"
        })];
      }
    })];
  }
}), root);

export { qr5xq1 as default };
