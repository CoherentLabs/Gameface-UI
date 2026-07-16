import { C as useContext, b as createMemo, o as onMount, n as onCleanup, g as getNextElement, u as use, i as insert, p as createRenderEffect, s as style, q as className, t as template, z as delegateEvents, y as addEventListener, A as runHydrationEvents, c as createComponent, v as getNextMarker, w as Show, a as createSignal, k as createEffect, l as on, m as mergeProps, D as createContext } from './web.ibFHgs_k.js';
import { L as LayoutBase } from './LayoutBase.DEk-c953.js';
import { c as clamp } from './clamp.BBPiOs3-.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.CSsomKQw.js';
import { u as useNavigation } from './BaseComponent.DEyWe7lF.js';

const scroll = "_scroll_207nm_1";
const handle = "_handle_207nm_25";
const styles = {
	scroll: scroll,
	"scroll-bar": "_scroll-bar_207nm_6",
	"content-wrapper": "_content-wrapper_207nm_17",
	"content-wrapper-overflow": "_content-wrapper-overflow_207nm_21",
	handle: handle
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div><div>`);
const Content = createTokenComponent();
const ScrollContent = (props) => {
  let resizeObserver;
  let contentRef;
  const scrollContext = useContext(ScrollContext);
  const ContentToken = useToken(Content, props.parentChildren);
  const contentStyles = createMemo(() => {
    const token = ContentToken();
    if (token && token.style) return {
      ...token.style
    };
    return {};
  });
  const contentClasses = createMemo(() => {
    const classes = [styles["content-wrapper"]];
    if (scrollContext?.overflow()) classes.push(styles["content-wrapper-overflow"]);
    if (ContentToken()?.class) classes.push(ContentToken()?.class);
    return classes.join(" ");
  });
  onMount(() => {
    resizeObserver = new ResizeObserver(scrollContext.updateMeasurements);
    if (contentRef) resizeObserver.observe(contentRef);
  });
  const initContentRef = (el) => {
    const token = ContentToken();
    token?.ref && token.ref(el);
    props.ref(el);
  };
  onCleanup(() => {
    if (resizeObserver) resizeObserver.disconnect();
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$3), _el$2 = _el$.firstChild;
    use(initContentRef, _el$);
    var _ref$ = contentRef;
    typeof _ref$ === "function" ? use(_ref$, _el$2) : contentRef = _el$2;
    insert(_el$2, () => ContentToken()?.children);
    createRenderEffect((_p$) => {
      var _v$ = contentStyles(), _v$2 = contentClasses();
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

var _tmpl$$2 = /* @__PURE__ */ template(`<div>`);
const Handle = createTokenComponent();
const ScrollHandle = (props) => {
  const scrollContext = useContext(ScrollContext);
  const HandleToken = useToken(Handle, props.parentChildren);
  const handleStyles = createMemo(() => {
    const styles2 = {
      height: `${scrollContext?.handleHeight()}px`,
      top: `${scrollContext?.handleTop()}px`
    };
    const token = HandleToken();
    if (token && token.style) return {
      ...styles2,
      ...token.style
    };
    return styles2;
  });
  const scrollHandleClasses = createMemo(() => {
    if (HandleToken()?.class) return styles.handle + " " + HandleToken()?.class;
    return styles.handle;
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2);
    addEventListener(_el$, "mousedown", scrollContext?.onHandleMouseDown, true);
    insert(_el$, () => HandleToken()?.children);
    createRenderEffect((_p$) => {
      var _v$ = scrollHandleClasses(), _v$2 = handleStyles();
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
delegateEvents(["mousedown"]);

var _tmpl$$1 = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const Bar = createTokenComponent();
const ScrollBar = (props) => {
  const scrollContext = useContext(ScrollContext);
  const BarToken = useToken(Bar, props.parentChildren);
  const scrollBarStyles = createMemo(() => {
    const token = BarToken();
    if (token && token.style) return {
      ...token.style
    };
  });
  const scrollBarClasses = createMemo(() => {
    if (BarToken()?.class) return styles["scroll-bar"] + " " + BarToken()?.class;
    return styles["scroll-bar"];
  });
  return createComponent(Show, {
    get when() {
      return scrollContext?.overflow();
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
      addEventListener(_el$, "mouseup", scrollContext.stopScrollingToMouse, true);
      addEventListener(_el$, "mousedown", scrollContext.scrollToMouseHandler, true);
      insert(_el$, () => BarToken()?.children, _el$3, _co$);
      insert(_el$, createComponent(ScrollHandle, {
        get parentChildren() {
          return BarToken()?.children;
        }
      }), _el$5, _co$2);
      createRenderEffect((_p$) => {
        var _v$ = scrollBarClasses(), _v$2 = scrollBarStyles();
        _v$ !== _p$.e && className(_el$, _p$.e = _v$);
        _p$.t = style(_el$, _v$2, _p$.t);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      runHydrationEvents();
      return _el$;
    }
  });
};
delegateEvents(["mousedown", "mouseup"]);

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const ScrollContext = createContext();
const Scroll = (props) => {
  const [overflow, setOverflow] = createSignal(false);
  const [handleHeight, setHandleHeight] = createSignal(0);
  const [handleTop, setHandleTop] = createSignal(0);
  let containerRef, contentWrapperRef;
  let maxScroll, maxHandleMovement;
  let startY = 0, startScrollTop = 0, prevScrollTop = 0;
  let scrollStep = 100;
  let scrollToMouseInterval;
  let scrollToMouseTimeout;
  const nav = useNavigation();
  function updateMeasurements() {
    const containerHeight = containerRef.clientHeight;
    const contentHeight = contentWrapperRef.scrollHeight;
    if (contentHeight > containerHeight) {
      setOverflow(true);
      const ratio = containerHeight / contentHeight;
      const newHandleHeight = containerHeight * ratio;
      setHandleHeight(newHandleHeight);
      maxScroll = contentHeight - containerHeight;
      maxHandleMovement = containerHeight - newHandleHeight;
      scrollStep = Math.max(scrollStep, Math.floor(maxScroll / 20));
      updateHandlePosition();
    } else {
      setOverflow(false);
      setHandleHeight(0);
      setHandleTop(0);
    }
  }
  function getScrollDirection() {
    if (maxScroll === contentWrapperRef.scrollTop) return "down";
    return prevScrollTop < contentWrapperRef.scrollTop ? "down" : "up";
  }
  function handleOnScroll() {
    if (!props.onScroll) return;
    const eventData = {
      scrollDirection: getScrollDirection()
    };
    prevScrollTop = contentWrapperRef.scrollTop;
    props.onScroll(eventData);
  }
  function onHandleMouseDown(e) {
    startY = e.clientY;
    startScrollTop = contentWrapperRef.scrollTop;
    window.addEventListener("mousemove", onHandleMouseMove);
    window.addEventListener("mouseup", onHandleMouseUp);
  }
  function onHandleMouseMove(e) {
    const deltaY = e.clientY - startY;
    if (deltaY === 0) return;
    const scrollDelta = deltaY / maxHandleMovement * maxScroll;
    contentWrapperRef.scrollTop = startScrollTop + scrollDelta;
    updateHandlePosition();
  }
  function onHandleMouseUp() {
    window.removeEventListener("mousemove", onHandleMouseMove);
    window.removeEventListener("mouseup", onHandleMouseUp);
  }
  function updateHandlePosition() {
    const newHandleTop = maxScroll > 0 ? contentWrapperRef.scrollTop / maxScroll * maxHandleMovement : 0;
    setHandleTop(clamp(newHandleTop, 0, maxHandleMovement));
  }
  function scrollToElement(element) {
    if (!overflow()) return;
    if (typeof element === "string") {
      element = contentWrapperRef.querySelector(element);
    }
    if (element instanceof HTMLElement) {
      contentWrapperRef.scrollTop = element.offsetTop;
      updateHandlePosition();
    }
  }
  function canScroll(direction) {
    const maxScrollTop = direction === 0 ? 0 : maxScroll;
    if (contentWrapperRef.scrollTop === maxScrollTop || !overflow()) return false;
    return true;
  }
  function scrollWith(value, direction = 0) {
    if (!canScroll(direction)) return;
    contentWrapperRef.scrollTop += value;
    updateHandlePosition();
  }
  function scrollTo(value, direction = 0) {
    if (!canScroll(direction)) return;
    contentWrapperRef.scrollTop = value;
    updateHandlePosition();
  }
  function scrollUp() {
    scrollWith(-100);
  }
  function scrollDown() {
    scrollWith(100, 1);
  }
  function begin() {
    scrollTo(0);
  }
  function end() {
    scrollTo(maxScroll, 1);
  }
  function scrollIntoView(element) {
    if (!overflow()) return;
    if (typeof element === "string") {
      element = contentWrapperRef.querySelector(element);
    }
    if (!element) return;
    const contentTop = contentWrapperRef.scrollTop;
    const contentHeight = contentWrapperRef.clientHeight;
    const contentBottom = contentTop + contentHeight;
    const elTop = element.offsetTop;
    const elHeight = element.offsetHeight;
    const elBottom = elTop + elHeight;
    if (elTop >= contentTop && elBottom <= contentBottom) {
      return;
    }
    if (elTop < contentTop) {
      scrollTo(elTop, 0);
    } else if (elBottom > contentBottom) {
      const newScrollTop = elBottom - contentHeight;
      scrollTo(newScrollTop, 1);
    }
  }
  const scrollObjectRef = {
    scrollToElement,
    scrollIntoView,
    scrollUp,
    scrollDown,
    begin,
    end
  };
  const scrollToMousePositionWithStep = (clickPosition) => {
    const handleCenter = handleTop() + handleHeight() / 2;
    const hasReachedHandle = Math.abs(clickPosition - handleCenter) < handleHeight() / 2;
    if (hasReachedHandle) return true;
    if (clickPosition < handleCenter) {
      contentWrapperRef.scrollTop -= scrollStep;
    } else {
      contentWrapperRef.scrollTop += scrollStep;
    }
    updateHandlePosition();
  };
  const scrollToMouseHandler = (event) => {
    if (event.target !== event.currentTarget) return;
    const barRect = containerRef.getBoundingClientRect();
    const clickPosition = event.clientY - barRect.top;
    scrollToMousePositionWithStep(clickPosition);
    scrollToMouseTimeout = setTimeout(() => {
      scrollToMouseInterval = setInterval(() => {
        const hasScrolledToMouse = scrollToMousePositionWithStep(clickPosition);
        if (hasScrolledToMouse) stopScrollingToMouse();
      }, 20);
    }, 200);
  };
  const stopScrollingToMouse = () => {
    if (scrollToMouseTimeout) clearTimeout(scrollToMouseTimeout);
    if (scrollToMouseInterval) clearInterval(scrollToMouseInterval);
  };
  createEffect(on(handleTop, handleOnScroll, {
    defer: true
  }));
  const handleFocusIn = (e) => {
    if (props.focusin) return props.focusin(e);
    if (nav) scrollIntoView(e.target);
  };
  const defaultActions = {
    "pan": (_, [x, y]) => {
      const value = Math.round(y * 100);
      if (Math.abs(value) < 10) return;
      const direction = value < 0 ? 0 : 1;
      scrollWith(value, direction);
    }
  };
  props.onAction = mergeProps(defaultActions, props.onAction);
  onMount(() => {
    contentWrapperRef.addEventListener("scroll", updateHandlePosition);
    contentWrapperRef.addEventListener("property-scroll", updateHandlePosition);
    if (nav) nav.resumeAction("pan");
  });
  onCleanup(() => {
    if (contentWrapperRef) contentWrapperRef.removeEventListener("scroll", updateHandlePosition);
    stopScrollingToMouse();
    if (nav) nav.pauseAction("pan");
  });
  return createComponent(ScrollContext.Provider, {
    value: {
      scrollToMouseHandler,
      stopScrollingToMouse,
      updateMeasurements,
      onHandleMouseDown,
      handleHeight,
      handleTop,
      overflow
    },
    get children() {
      return createComponent(LayoutBase, mergeProps({
        focusin: handleFocusIn
      }, props, {
        refObject: scrollObjectRef,
        get children() {
          var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
          var _ref$ = containerRef;
          typeof _ref$ === "function" ? use(_ref$, _el$) : containerRef = _el$;
          insert(_el$, createComponent(ScrollContent, {
            ref(r$) {
              var _ref$2 = contentWrapperRef;
              typeof _ref$2 === "function" ? _ref$2(r$) : contentWrapperRef = r$;
            },
            get parentChildren() {
              return props.children;
            }
          }), _el$3, _co$);
          insert(_el$, createComponent(ScrollBar, {
            get parentChildren() {
              return props.children;
            }
          }), _el$5, _co$2);
          createRenderEffect(() => className(_el$, styles.scroll));
          return _el$;
        }
      }));
    }
  });
};
const Scroll$1 = Object.assign(Scroll, {
  Content,
  Bar,
  Handle
});

export { Scroll$1 as S };
