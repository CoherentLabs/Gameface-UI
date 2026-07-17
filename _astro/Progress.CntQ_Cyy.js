import { j as createEffect, f as createMemo, g as getNextElement, u as use, n as createRenderEffect, p as className, s as style, t as template, q as getNextMarker, i as insert, c as createComponent, E as setAttribute, v as Show } from './web.bikURqO-.js';
import { c as createTokenComponent, u as useToken } from './tokenComponents.ChN_WbXL.js';
import { b as baseComponent } from './BaseComponent.C3DpOC_C.js';
import { c as clamp } from './clamp.BBPiOs3-.js';

const bar = "_bar_1ekfu_1";
const circle = "_circle_1ekfu_12";
const styles = {
	bar: bar,
	"bar-fill": "_bar-fill_1ekfu_6",
	circle: circle,
	"circle-svg": "_circle-svg_1ekfu_17",
	"circle-outline": "_circle-outline_1ekfu_22",
	"circle-fill": "_circle-fill_1ekfu_25",
	"circle-text": "_circle-text_1ekfu_33"
};

var _tmpl$$1 = /* @__PURE__ */ template(`<div><div>`);
const Fill$1 = createTokenComponent();
const ProgressBar = (props) => {
  const fillToken = useToken(Fill$1, props.children);
  let fillElement;
  createEffect(() => {
    if (fillElement) fillElement.style.width = `${clampProgress(props.progress)}%`;
  });
  const fillClasses = createMemo(() => {
    const classes = [styles["bar-fill"]];
    classes.push(fillToken()?.class || "");
    return classes.join(" ");
  });
  props.componentClasses = styles.bar;
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild;
    use(baseComponent, _el$, () => props);
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    var _ref$2 = fillElement;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : fillElement = _el$2;
    createRenderEffect((_p$) => {
      var _v$ = fillClasses(), _v$2 = fillToken()?.style;
      _v$ !== _p$.e && className(_el$2, _p$.e = _v$);
      _p$.t = style(_el$2, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
};
const ProgressBar$1 = Object.assign(ProgressBar, {
  Fill: Fill$1
});

var _tmpl$ = /* @__PURE__ */ template(`<div>`), _tmpl$2 = /* @__PURE__ */ template(`<div><svg viewBox="0 0 120 120"><path d="M60 6 a54 54 0 1 1 0 108 a54 54 0 1 1 0 -108"></path><path d="M60 6 a54 54 0 1 1 0 108 a54 54 0 1 1 0 -108"pathLength=100 stroke-dasharray=100></path></svg><!$><!/>`);
const Fill = createTokenComponent();
const Text = createTokenComponent();
const Outline = createTokenComponent();
const ProgressCircle = (props) => {
  const fillToken = useToken(Fill, props.children);
  const outlineToken = useToken(Outline, props.children);
  const textToken = useToken(Text, props.children);
  const outlineClasses = createMemo(() => {
    const classes = [styles["circle-outline"]];
    classes.push(outlineToken()?.class || "");
    return classes.join(" ");
  });
  const fillClasses = createMemo(() => {
    const classes = [styles["circle-fill"]];
    classes.push(fillToken()?.class || "");
    return classes.join(" ");
  });
  const textClasses = createMemo(() => {
    const classes = [styles["circle-text"]];
    classes.push(textToken()?.class || "");
    return classes.join(" ");
  });
  props.componentClasses = () => styles.circle;
  return (() => {
    var _el$ = getNextElement(_tmpl$2), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$6 = _el$2.nextSibling, [_el$7, _co$] = getNextMarker(_el$6.nextSibling);
    use(baseComponent, _el$, () => props);
    var _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, createComponent(Show, {
      get when() {
        return textToken();
      },
      get children() {
        var _el$5 = getNextElement(_tmpl$);
        insert(_el$5, () => textToken()?.children);
        createRenderEffect((_p$) => {
          var _v$ = textClasses(), _v$2 = textToken()?.style;
          _v$ !== _p$.e && className(_el$5, _p$.e = _v$);
          _p$.t = style(_el$5, _v$2, _p$.t);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$5;
      }
    }), _el$7, _co$);
    createRenderEffect((_p$) => {
      var _v$3 = styles["circle-svg"], _v$4 = outlineClasses(), _v$5 = outlineToken()?.style, _v$6 = fillClasses(), _v$7 = fillToken()?.style, _v$8 = fillToken()?.shape === "round" ? "round" : "square", _v$9 = clampProgress(100 - props.progress);
      _v$3 !== _p$.e && setAttribute(_el$2, "class", _p$.e = _v$3);
      _v$4 !== _p$.t && setAttribute(_el$3, "class", _p$.t = _v$4);
      _p$.a = style(_el$3, _v$5, _p$.a);
      _v$6 !== _p$.o && setAttribute(_el$4, "class", _p$.o = _v$6);
      _p$.i = style(_el$4, _v$7, _p$.i);
      _v$8 !== _p$.n && setAttribute(_el$4, "stroke-linecap", _p$.n = _v$8);
      _v$9 !== _p$.s && setAttribute(_el$4, "stroke-dashoffset", _p$.s = _v$9);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0
    });
    return _el$;
  })();
};
const ProgressCircle$1 = Object.assign(ProgressCircle, {
  Fill,
  Outline,
  Text
});

const clampProgress = (progress) => clamp(progress, 0, 100);
const Progress = () => [];
const Progress$1 = Object.assign(Progress, {
  Bar: ProgressBar$1,
  Circle: ProgressCircle$1
});

export { Progress$1 as P };
