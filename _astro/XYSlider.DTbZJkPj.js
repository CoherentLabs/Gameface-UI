import { C as useContext, b as createMemo, g as getNextElement, n as createRenderEffect, p as className, s as style, t as template, i as insert, c as createComponent, z as Show, q as delegateEvents, a as createSignal, j as createEffect, k as on, o as onMount, l as onCleanup, y as getNextMarker, u as use, w as runHydrationEvents, D as createContext } from './web.DT9QqbDn.js';
import { c as clamp } from './clamp.BBPiOs3-.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.D7hEHUQ6.js';
import { u as useNavigation, n as navigationActions, b as baseComponent } from './BaseComponent.dZiros1M.js';
import { m as mergeNavigationActions } from './mergeNavigationActions.C3r_vRJZ.js';

const XYSlider$2 = "_XYSlider_j790d_1";
const background = "_background_j790d_9";
const handle = "_handle_j790d_15";
const transition = "_transition_j790d_26";
const styles = {
	XYSlider: XYSlider$2,
	background: background,
	handle: handle,
	transition: transition
};

var _tmpl$$2 = /* @__PURE__ */ template(`<div>`);
const Handle = createTokenComponent();
const XYSliderHandle = (props) => {
  const sliderContext = useContext(XYSliderContext);
  const HandleToken = useToken(Handle, props.parentChildren);
  const handleClasses = createMemo(() => {
    const classes = [styles.handle];
    if (HandleToken?.()?.class) classes.push(HandleToken?.()?.class);
    if (sliderContext?.hasTransition()) classes.push(styles.transition);
    return classes.join(" ");
  });
  const handleStyle = createMemo(() => {
    const position = {
      left: `${sliderContext?.position().x}%`,
      top: `${sliderContext?.position().y}%`
    };
    return {
      ...HandleToken()?.style,
      ...position
    };
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2);
    createRenderEffect((_p$) => {
      var _v$ = handleClasses(), _v$2 = handleStyle();
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

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const Background = createTokenComponent();
const XYSliderBackground = (props) => {
  const BackgroundToken = useToken(Background, props.parentChildren);
  const backgroundClasses = createMemo(() => {
    const classes = [styles.background];
    if (BackgroundToken?.()?.class) classes.push(BackgroundToken?.()?.class);
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$1);
    insert(_el$, createComponent(Show, {
      get when() {
        return BackgroundToken();
      },
      get children() {
        return BackgroundToken()?.children;
      }
    }));
    createRenderEffect((_p$) => {
      var _v$ = backgroundClasses(), _v$2 = BackgroundToken()?.style;
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

var _tmpl$ = /* @__PURE__ */ template(`<div><!$><!/><!$><!/>`);
const XYSliderContext = createContext();
const XYSlider = (props) => {
  let draggableArea;
  const rect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  };
  const minX = () => props.minX ?? 0;
  const maxX = () => props.maxX ?? 100;
  const minY = () => props.minY ?? 0;
  const maxY = () => props.maxY ?? 100;
  const step = () => props.step ?? 1;
  const maxBoost = createMemo(() => Math.max(maxX(), minX()) / 10);
  const accelRate = createMemo(() => maxBoost() / 10);
  let speedBoost = {
    x: 0,
    y: 0
  };
  const nav = useNavigation();
  const [position, setPosition] = createSignal({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = createSignal(false);
  const [hasTransition, setHasTransition] = createSignal(true);
  const calculatePercentPosition = (pos) => ({
    x: (pos.x - minX()) / (maxX() - minX()) * 100,
    y: (pos.y - minY()) / (maxY() - minY()) * 100
  });
  createEffect(on(() => [props.value?.x, props.value?.y, minX(), maxX(), minY(), maxY()], () => {
    const x = clamp(props.value?.x ?? (minX() + maxX()) / 2, minX(), maxX());
    const y = clamp(props.value?.y ?? (minY() + maxY()) / 2, minY(), maxY());
    setPosition(calculatePercentPosition({
      x,
      y
    }));
    props.onChange?.({
      x,
      y
    });
  }, {
    defer: true
  }));
  const calculatePositionFromMouse = (e) => {
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);
    const mappedX = minX() + x / rect.width * (maxX() - minX());
    const mappedY = minY() + y / rect.height * (maxY() - minY());
    return {
      x: mappedX,
      y: mappedY
    };
  };
  const handleDrag = (e) => {
    const newPosition = calculatePositionFromMouse(e);
    setPosition(calculatePercentPosition(newPosition));
    props.onChange?.(newPosition);
  };
  const handleMouseMove = (e) => {
    handleDrag(e);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHasTransition(false);
    const {
      left,
      top,
      width,
      height
    } = draggableArea.getBoundingClientRect();
    Object.assign(rect, {
      left,
      top,
      width,
      height
    });
    setIsDragging(true);
    handleDrag(e);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  props.componentClasses = () => styles["XYSlider"];
  props.componentStyles = () => {
    return {
      cursor: isDragging() ? "pointer" : "auto"
    };
  };
  const changeValue = (newValue) => {
    const x = clamp(newValue.x, minX(), maxX());
    const y = clamp(newValue.y, minY(), maxY());
    setPosition(calculatePercentPosition({
      x,
      y
    }));
    props.onChange?.({
      x,
      y
    });
  };
  onMount(() => {
    if (nav) nav.resumeAction("pan");
    if (!props.ref || !draggableArea) return;
    props.ref({
      value: position,
      element: draggableArea,
      changeValue
    });
  });
  onCleanup(() => {
    if (nav) nav.pauseAction("pan");
    handleMouseUp();
  });
  const defaultActions = {
    "pan": (_, axes) => {
      const [inputX, inputY] = axes;
      if (Math.abs(inputX) < 0.1 && Math.abs(inputY) < 0.1) {
        speedBoost = {
          x: 0,
          y: 0
        };
        return;
      }
      const currentPosPercent = position();
      const baseStep = step();
      const rangeX = maxX() - minX();
      const rangeY = maxY() - minY();
      const currentRawX = minX() + currentPosPercent.x / 100 * rangeX;
      const currentRawY = minY() + currentPosPercent.y / 100 * rangeY;
      if (inputX !== 0) speedBoost.x = Math.min(speedBoost.x + accelRate(), maxBoost());
      if (inputY !== 0) speedBoost.y = Math.min(speedBoost.y + accelRate(), maxBoost());
      const deltaX = inputX * baseStep * (1 + speedBoost.x);
      const deltaY = inputY * baseStep * (1 + speedBoost.y);
      if (!hasTransition()) setHasTransition(true);
      changeValue({
        x: currentRawX + deltaX,
        y: currentRawY + deltaY
      });
    }
  };
  return createComponent(XYSliderContext.Provider, {
    value: {
      position,
      hasTransition
    },
    get children() {
      var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, [_el$3, _co$] = getNextMarker(_el$2.nextSibling), _el$4 = _el$3.nextSibling, [_el$5, _co$2] = getNextMarker(_el$4.nextSibling);
      _el$.$$mousedown = handleMouseDown;
      use(navigationActions, _el$, () => mergeNavigationActions(props, defaultActions));
      use(baseComponent, _el$, () => props);
      var _ref$ = draggableArea;
      typeof _ref$ === "function" ? use(_ref$, _el$) : draggableArea = _el$;
      insert(_el$, createComponent(XYSliderBackground, {
        get parentChildren() {
          return props.children;
        }
      }), _el$3, _co$);
      insert(_el$, createComponent(XYSliderHandle, {
        get parentChildren() {
          return props.children;
        }
      }), _el$5, _co$2);
      runHydrationEvents();
      return _el$;
    }
  });
};
const XYSlider$1 = Object.assign(XYSlider, {
  Handle,
  Background
});
delegateEvents(["mousedown"]);

export { XYSlider$1 as X };
