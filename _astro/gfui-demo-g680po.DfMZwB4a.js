import { C as useContext, J as children, b as createMemo, j as createEffect, o as onMount, l as onCleanup, q as delegateEvents, g as getNextElement, u as use, i as insert, w as runHydrationEvents, t as template, a as createSignal, k as on, c as createComponent, m as mergeProps, K as Dynamic, n as createRenderEffect, p as className, y as getNextMarker, D as createContext, A as memo, P as Portal, z as Show, s as style, r as render } from './web.DT9QqbDn.js';
import { w as waitForFrames, b as baseComponent, n as navigationActions } from './BaseComponent.dZiros1M.js';
import { P as Progress } from './Progress.HzgbJ9yd.js';
import { F as Flex } from './Flex.BFF9Zi04.js';
import { g as getSafePosition } from './getSafePosition.RgHcJ5HV.js';
import { c as clamp } from './clamp.BBPiOs3-.js';
import { g as getScrollableParent } from './getScrollableParent.C3YActer.js';
import './store.CXp9XCH2.js';
import './tokenComponents.D7hEHUQ6.js';
import './LayoutBase.DvNSSl3m.js';
import './supportsGamefaceFeature.ByqsM1VI.js';

const Step = (props) => {
  const ctx = useContext(TutorialContext);
  if (!ctx) return null;
  const storedChildren = children(() => props.children);
  const isCurrent = createMemo(() => ctx.current() === props.order);
  createEffect(() => {
    if (!isCurrent()) return;
    const isInitial = ctx.initialRender();
    waitForFrames(() => {
      if (isInitial) ctx.setInitialRender(false);
      updateTargetElement();
      updateTooltipContent();
    }, !isInitial ? 0 : 3);
  });
  const updateTargetElement = () => {
    let children2 = storedChildren();
    if (Array.isArray(children2)) {
      const htmlElement = children2.find((child) => child instanceof HTMLElement);
      children2 = htmlElement?.parentElement;
    }
    if (children2 && children2 instanceof HTMLElement) {
      ctx.setTarget(children2);
    } else console.warn("[Tutorial.Step] Invalid child element detected. Each <Tutorial.Step> must wrap a valid HTML element (e.g., <div>, <button>, <section>, etc.), not text, numbers, or other non-DOM nodes.");
  };
  const updateTooltipContent = () => {
    ctx.setOutset(props.outset ?? null);
    ctx.setTooltipData({
      title: props.title || "",
      content: props.content || "",
      position: props.position || null
    });
  };
  onMount(() => ctx.setCount((prev) => prev + 1));
  onCleanup(() => ctx.setCount((prev) => prev - 1));
  return storedChildren();
};

const tutorial = "_tutorial_byq9w_1";
const overlay = "_overlay_byq9w_18";
const tooltip = "_tooltip_byq9w_29";
const styles = {
	tutorial: tutorial,
	"tutorial-visible": "_tutorial-visible_byq9w_13",
	overlay: overlay,
	tooltip: tooltip,
	"tooltip-reference": "_tooltip-reference_byq9w_39",
	"tooltip-wrapper": "_tooltip-wrapper_byq9w_45",
	"tooltip-visible": "_tooltip-visible_byq9w_49",
	"tooltip-bottom": "_tooltip-bottom_byq9w_52",
	"tooltip-top": "_tooltip-top_byq9w_57",
	"tooltip-left": "_tooltip-left_byq9w_62",
	"tooltip-right": "_tooltip-right_byq9w_67",
	"tooltip-heading": "_tooltip-heading_byq9w_72",
	"tooltip-content": "_tooltip-content_byq9w_76",
	"tooltip-control": "_tooltip-control_byq9w_79",
	"tooltip-control-first": "_tooltip-control-first_byq9w_86",
	"tooltip-progress": "_tooltip-progress_byq9w_92"
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div>`);
const Controls = (props) => {
  const ctx = useContext(TutorialContext);
  if (!ctx) return;
  const clickHanlder = (e) => {
    const isNext = props.direction === "next";
    props.click?.(e);
    if (isNext) {
      return ctx.progress() === 100 ? ctx.exit() : ctx.nextStep();
    }
    return ctx.previousStep();
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$$3);
    _el$.$$click = clickHanlder;
    use(baseComponent, _el$, () => props);
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, () => props.children);
    runHydrationEvents();
    return _el$;
  })();
};
delegateEvents(["click"]);

var _tmpl$$2 = /* @__PURE__ */ template(`<div><h2></h2><span></span><!$><!/><!$><!/>`), _tmpl$2$1 = /* @__PURE__ */ template(`<div>`);
const DefaultTooltip = (props) => {
  return (() => {
    var _el$ = getNextElement(_tmpl$$2), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.nextSibling, [_el$5, _co$] = getNextMarker(_el$4.nextSibling), _el$6 = _el$5.nextSibling, [_el$7, _co$2] = getNextMarker(_el$6.nextSibling);
    insert(_el$2, () => props.title);
    insert(_el$3, () => props.content);
    insert(_el$, createComponent(Progress.Bar, {
      get ["class"]() {
        return styles["tooltip-progress"];
      },
      get progress() {
        return props.progress();
      }
    }), _el$5, _co$);
    insert(_el$, createComponent(Flex, {
      get children() {
        return [createComponent(props.Prev, {
          get ["class"]() {
            return `${styles["tooltip-control"]} ${styles["tooltip-control-first"]}`;
          },
          children: "Prev"
        }), createComponent(props.Next, {
          get ["class"]() {
            return styles["tooltip-control"];
          },
          get children() {
            return props.progress() === 100 ? "Done" : "Next";
          }
        })];
      }
    }), _el$7, _co$2);
    createRenderEffect((_p$) => {
      var _v$ = styles.tooltip, _v$2 = styles["tooltip-heading"], _v$3 = styles["tooltip-content"];
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && className(_el$2, _p$.t = _v$2);
      _v$3 !== _p$.a && className(_el$3, _p$.a = _v$3);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
};
const Next = (p) => createComponent(Controls, mergeProps(p, {
  direction: "next"
}));
const Prev = (p) => createComponent(Controls, mergeProps(p, {
  direction: "prev"
}));
const DEFAULT_POSITION = "bottom";
const TutorialTooltip = (props) => {
  const ctx = useContext(TutorialContext);
  if (!ctx) return;
  const [visible, setVisible] = createSignal(false);
  let elementRef;
  let visibleTO;
  const providedTooltipProps = () => {
    const data = props.tooltipData();
    return {
      title: data.title,
      content: data.content,
      step: ctx.current,
      Next,
      Prev,
      progress: props.progress
    };
  };
  createEffect(on(ctx.current, (current) => {
    setVisible(false);
    if (visibleTO) clearTimeout(visibleTO);
    visibleTO = setTimeout(() => {
      if (current === 0) return;
      setVisible(true);
    }, 500);
  }, {
    defer: true
  }));
  const position = createMemo((prev) => {
    const currentPosition = prev || DEFAULT_POSITION;
    if (!visible() || !elementRef) return currentPosition;
    const provided = props.tooltipData().position;
    if (provided) return provided;
    const rect = elementRef.getBoundingClientRect();
    const suggested = getSafePosition(rect);
    return suggested || currentPosition;
  });
  const tooltipClasses = createMemo(() => {
    const classes = [styles["tooltip-wrapper"]];
    if (visible()) classes.push(styles["tooltip-visible"]);
    classes.push(styles[`tooltip-${position()}`]);
    return classes.join(" ");
  });
  const ComponentToRender = () => props.userTooltip ?? DefaultTooltip;
  return (() => {
    var _el$8 = getNextElement(_tmpl$2$1);
    var _ref$ = elementRef;
    typeof _ref$ === "function" ? use(_ref$, _el$8) : elementRef = _el$8;
    insert(_el$8, createComponent(Dynamic, mergeProps({
      get component() {
        return ComponentToRender();
      }
    }, () => providedTooltipProps())));
    createRenderEffect(() => className(_el$8, tooltipClasses()));
    return _el$8;
  })();
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const TutorialContext = createContext();
function Tutorial(props) {
  let element;
  const initialOutset = props.outset ?? 0;
  const [currentStep, setCurrentStep] = createSignal(0);
  const [outset, setOutset] = createSignal(initialOutset);
  const [pausedAt, setPausedAt] = createSignal(null);
  const [initialRender, setInitialRender] = createSignal(true);
  const [targetElement, setTargetElement] = createSignal(null);
  const [highlightRect, setHighlightRect] = createSignal(null);
  const [tutorialStyles, setTutorialStyles] = createSignal({});
  const [tooltipData, setTooltipData] = createSignal({});
  const [count, setCount] = createSignal(0);
  const tour = (from) => {
    if (currentStep() !== 0) {
      return console.warn("Trying to start a new tour while another one is already in progress.");
    }
    setCurrentStep(changeStep(from || 1));
    props.onStart?.();
  };
  const exit = () => {
    setCurrentStep(0);
    setTargetElement(null);
    setPausedAt(null);
    props.onEnd?.();
  };
  const pause = () => {
    const current = currentStep();
    if (current === 0) {
      return console.warn("First start the tutorial in order to pause it.");
    }
    setCurrentStep(0);
    setTargetElement(null);
    setPausedAt(current);
  };
  const resume = (next = false) => {
    const resumeStep = pausedAt();
    if (!resumeStep) {
      return console.warn("No paused tutorial to resume.");
    }
    if (resumeStep >= count()) {
      console.warn("Paused step is beyond the last step. Resetting.");
      setPausedAt(null);
      return;
    }
    setPausedAt(null);
    setCurrentStep(changeStep(next ? resumeStep + 1 : resumeStep));
  };
  const constraintStep = (step) => clamp(step, 1, count());
  const changeStep = (step) => setCurrentStep(constraintStep(step));
  const nextStep = () => {
    setCurrentStep((prev) => constraintStep(prev + 1));
  };
  const previousStep = () => {
    setCurrentStep((prev) => constraintStep(prev - 1));
  };
  const progress = createMemo(() => {
    const steps = count();
    if (steps <= 0) return 0;
    return Number((currentStep() / steps * 100).toFixed(2));
  });
  createEffect(() => {
    const target = targetElement();
    if (!target) return;
    const elementHasLoaded = target.offsetHeight && target.offsetWidth;
    waitForFrames(() => {
      const rect = target.getBoundingClientRect();
      let finalTop = rect.top;
      let finalHeight = rect.height;
      let scrollableParent = getScrollableParent(target);
      if (scrollableParent) {
        const parentRect = scrollableParent.getBoundingClientRect();
        let newScrollTop = scrollableParent.scrollTop;
        let dispatchScroll = true;
        if (rect.height > parentRect.height) {
          finalHeight = parentRect.height;
          dispatchScroll = false;
        } else if (rect.bottom > parentRect.height) {
          newScrollTop = scrollableParent.scrollHeight - target.offsetTop;
          const scrollDelta = newScrollTop - scrollableParent.scrollTop;
          finalTop = rect.top - scrollDelta;
        } else if (scrollableParent.scrollTop > rect.bottom) {
          newScrollTop = rect.top;
          finalTop = parentRect.top + rect.top;
        }
        scrollableParent.scrollTop = newScrollTop;
        if (dispatchScroll) scrollableParent.dispatchEvent(new CustomEvent("property-scroll"));
      }
      const rectOutset = outset() ?? initialOutset;
      setHighlightRect({
        top: finalTop - rectOutset,
        left: rect.left - rectOutset,
        width: rect.width + rectOutset * 2,
        height: finalHeight + rectOutset * 2
      });
      setTutorialStyles(() => {
        const {
          left,
          top,
          width,
          height
        } = highlightRect();
        return {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`
        };
      });
      props.onChange?.(currentStep());
    }, !elementHasLoaded ? 3 : 0);
  });
  const tutorialClasses = createMemo(() => {
    const classes = [styles.tutorial];
    targetElement() && classes.push(styles["tutorial-visible"]);
    return classes.join(" ");
  });
  props.componentClasses = tutorialClasses;
  props.componentStyles = tutorialStyles;
  onMount(() => {
    if (!props.ref || !element) return;
    props.ref({
      element,
      progress,
      current: currentStep,
      target: targetElement,
      tour,
      exit,
      pause,
      resume,
      next: nextStep,
      previous: previousStep,
      changeStep
    });
  });
  const ctxObject = {
    current: currentStep,
    setTarget: setTargetElement,
    setCount,
    nextStep,
    previousStep,
    setTooltipData,
    initialRender,
    setInitialRender,
    setOutset,
    exit,
    progress
  };
  return createComponent(TutorialContext.Provider, {
    value: ctxObject,
    get children() {
      return [memo(() => props.children), createComponent(Portal, {
        get children() {
          return [(() => {
            var _el$ = getNextElement(_tmpl$$1);
            use(navigationActions, _el$, () => ({
              anchor: props.anchor,
              ...props.onAction
            }));
            use(baseComponent, _el$, () => props);
            var _ref$ = element;
            typeof _ref$ === "function" ? use(_ref$, _el$) : element = _el$;
            return _el$;
          })(), createComponent(Show, {
            get when() {
              return targetElement();
            },
            get children() {
              var _el$2 = getNextElement(_tmpl$$1);
              createRenderEffect(() => className(_el$2, styles.overlay));
              return _el$2;
            }
          }), (() => {
            var _el$3 = getNextElement(_tmpl$$1);
            insert(_el$3, createComponent(TutorialTooltip, {
              get userTooltip() {
                return props.tooltip;
              },
              tooltipData,
              progress
            }));
            createRenderEffect((_p$) => {
              var _v$ = styles["tooltip-reference"], _v$2 = tutorialStyles();
              _v$ !== _p$.e && className(_el$3, _p$.e = _v$);
              _p$.t = style(_el$3, _v$2, _p$.t);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$3;
          })()];
        }
      })];
    }
  });
}
const Tutorial$1 = Object.assign(Tutorial, {
  Step
});

var _tmpl$ = /* @__PURE__ */ template(`<button style="padding:0.8rem 1.6rem;border-radius:0.4rem;border:0.1rem solid #0084ff;background-color:#0084ff26;color:#0084ff">Start tutorial?`), _tmpl$2 = /* @__PURE__ */ template(`<button style="padding:0.8rem 1.6rem;border-radius:0.4rem;border:0.1rem solid #3ecf8e;background-color:#3ecf8e26;color:#3ecf8e">Play`), _tmpl$3 = /* @__PURE__ */ template(`<button style="padding:0.8rem 1.6rem;border-radius:0.4rem;border:0.1rem solid #f2a541;background-color:#f2a54126;color:#f2a541">Settings`);
const App = () => {
  let ref;
  return createComponent(Flex, {
    direction: "column",
    gap: "2rem",
    align: "start",
    get children() {
      return [(() => {
        var _el$ = getNextElement(_tmpl$);
        _el$.$$click = () => ref.tour();
        runHydrationEvents();
        return _el$;
      })(), createComponent(Tutorial$1, {
        ref(r$) {
          var _ref$ = ref;
          typeof _ref$ === "function" ? _ref$(r$) : ref = r$;
        },
        outset: 5,
        get children() {
          return createComponent(Flex, {
            directon: "row",
            gap: "1rem",
            align: "center",
            get children() {
              return [createComponent(Tutorial$1.Step, {
                order: 1,
                title: "Welcome",
                content: "This is the main menu.",
                get children() {
                  return getNextElement(_tmpl$2);
                }
              }), createComponent(Tutorial$1.Step, {
                order: 2,
                title: "Settings",
                content: "Change your preferences here.",
                position: "bottom",
                get children() {
                  return getNextElement(_tmpl$3);
                }
              })];
            }
          });
        }
      })];
    }
  });
};
const g680po = (root) => render(() => createComponent(App, {}), root);
delegateEvents(["click"]);

export { g680po as default };
