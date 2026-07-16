import { b as createMemo, g as getNextElement, n as createRenderEffect, p as className, s as style, t as template, q as delegateEvents, B as addEventListener, w as runHydrationEvents, c as createComponent, i as insert, z as Show, u as use } from './web.DT9QqbDn.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.D7hEHUQ6.js';
import { c as clamp } from './clamp.BBPiOs3-.js';

const slider = "_slider_l4egf_1";
const track = "_track_l4egf_17";
const fill = "_fill_l4egf_26";
const handle = "_handle_l4egf_37";
const thumb = "_thumb_l4egf_54";
const grid = "_grid_l4egf_66";
const styles = {
	slider: slider,
	"with-thumb": "_with-thumb_l4egf_9",
	"with-grid": "_with-grid_l4egf_13",
	track: track,
	fill: fill,
	handle: handle,
	"handle-active": "_handle-active_l4egf_50",
	thumb: thumb,
	grid: grid,
	"grid-pol": "_grid-pol_l4egf_74",
	"grid-pol-container": "_grid-pol-container_l4egf_78",
	"grid-pol-small": "_grid-pol-small_l4egf_86",
	"grid-pol-value": "_grid-pol-value_l4egf_90"
};

var _tmpl$$3 = /* @__PURE__ */ template(`<div>`);
const Fill = createTokenComponent();
const SliderFill = (props) => {
  const FillToken = useToken(Fill, props.parentChildren);
  const fillClasses = createMemo(() => {
    const classes = [styles.fill];
    if (FillToken?.()?.class) classes.push(FillToken?.()?.class);
    return classes.join(" ");
  });
  const fillStyle = createMemo(() => {
    const position = {
      width: `${props.percent()}%`
    };
    return {
      ...FillToken()?.style,
      ...position
    };
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$3);
    createRenderEffect((_p$) => {
      var _v$ = fillClasses(), _v$2 = fillStyle();
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

var _tmpl$$2 = /* @__PURE__ */ template(`<div>`);
const Handle = createTokenComponent();
const SliderHandle = (props) => {
  const HandleToken = useToken(Handle, props.parentChildren);
  const handleClasses = createMemo(() => {
    const classes = [styles.handle];
    if (HandleToken?.()?.class) classes.push(HandleToken?.()?.class);
    if (props.active?.()) {
      classes.push(HandleToken?.()?.classActive || styles["handle-active"]);
    }
    return classes.join(" ");
  });
  const handleStyle = createMemo(() => {
    const zIndex = props.dragged?.() ? 20 : 10;
    const offSet = `${props.percent()}%`;
    return {
      ...HandleToken()?.style,
      left: offSet,
      "z-index": zIndex,
      ...props.active?.() && HandleToken()?.styleActive
    };
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$$2);
    addEventListener(_el$, "mousedown", props.handleMouseDown, true);
    createRenderEffect((_p$) => {
      var _v$ = handleClasses(), _v$2 = handleStyle();
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

var _tmpl$$1 = /* @__PURE__ */ template(`<div>`);
const Thumb = createTokenComponent();
const SliderThumb = (props) => {
  const ThumbToken = useToken(Thumb, props.parentChildren);
  const thumbClasses = createMemo(() => {
    const classes = [styles.thumb];
    if (ThumbToken?.()?.class) classes.push(ThumbToken?.()?.class);
    return classes.join(" ");
  });
  const thumbStyle = createMemo(() => {
    const position = {
      left: `${props.percent()}%`
    };
    return {
      ...ThumbToken()?.style,
      ...position
    };
  });
  return createComponent(Show, {
    get when() {
      return ThumbToken();
    },
    get children() {
      var _el$ = getNextElement(_tmpl$$1);
      insert(_el$, () => props.value());
      createRenderEffect((_p$) => {
        var _v$ = thumbClasses(), _v$2 = thumbStyle();
        _v$ !== _p$.e && className(_el$, _p$.e = _v$);
        _p$.t = style(_el$, _v$2, _p$.t);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$;
    }
  });
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const Track = createTokenComponent();
const SliderTrack = (props) => {
  const TrackToken = useToken(Track, props.parentChildren);
  const trackClasses = createMemo(() => {
    const classes = [styles.track];
    if (TrackToken?.()?.class) classes.push(TrackToken?.()?.class);
    return classes.join(" ");
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    addEventListener(_el$, "mousedown", props.handleClick, true);
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, () => props.children);
    createRenderEffect((_p$) => {
      var _v$ = trackClasses(), _v$2 = TrackToken?.()?.style;
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

const calculatePercent = (value, min, max) => {
  return (value - min) / (max - min) * 100;
};
const snapToStepAndNormalize = (value, step, min, max) => {
  const snapped = Math.round(value / step) * step;
  return clamp(Number(snapped.toFixed(5)), min, max);
};
const getTrackGeometry = (track, clientX) => {
  const { left, width } = track.getBoundingClientRect();
  return { start: clientX, trackStart: left, pixelRange: width };
};

const stopImmediatePropagation = (e) => {
  e.stopImmediatePropagation();
  e.cancelBubble = true;
};

export { Fill as F, Handle as H, SliderHandle as S, Track as T, Thumb as a, snapToStepAndNormalize as b, SliderFill as c, SliderThumb as d, SliderTrack as e, stopImmediatePropagation as f, getTrackGeometry as g, calculatePercent as h, styles as s };
