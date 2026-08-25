import { b as createMemo, c as createComponent, r as render, a as createSignal, o as onMount, g as getNextElement, i as insert, t as template } from './web.DoGxwvvO.js';
import { P as Progress } from './Progress.CdrW4xvp.js';
import { F as Flex } from './Flex.C48KVvZ2.js';
import './tokenComponents.C6MElWh1.js';
import './BaseComponent.DmBIQgSj.js';
import './store.BChLrIuc.js';
import './clamp.BBPiOs3-.js';
import './LayoutBase.V5Pt4GTE.js';
import './supportsGamefaceFeature.ByqsM1VI.js';

const bar = "_bar_tkvia_1";
const success = "_success_tkvia_23";
const warning = "_warning_tkvia_27";
const error = "_error_tkvia_31";
const styles = {
	bar: bar,
	"bar-fill": "_bar-fill_tkvia_9",
	success: success,
	warning: warning,
	error: error
};

const SEGMENTS = 10;
const GAP = 1.5;
const OVERSHOOT = 0.5;
const PILL_WIDTH = (100 + GAP + OVERSHOOT) / SEGMENTS;
const clampValueToSegment = (value) => {
  const pills = Math.floor(value / (100 / SEGMENTS));
  if (pills <= 0) return 0;
  if (pills >= SEGMENTS) return 100;
  return pills * PILL_WIDTH - GAP / 2;
};
const SegmentedProgressBar = (props) => {
  const progressFillClasses = createMemo(() => {
    const base = [styles["bar-fill"]];
    const value = props.value;
    if (value >= 50) base.push(styles.success);
    else if (value >= 30) base.push(styles.warning);
    else base.push(styles.error);
    return base.join(" ");
  });
  return createComponent(Progress.Bar, {
    get ["class"]() {
      return styles.bar;
    },
    get progress() {
      return clampValueToSegment(props.value);
    },
    get children() {
      return createComponent(Progress.Bar.Fill, {
        get ["class"]() {
          return progressFillClasses();
        }
      });
    }
  });
};

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const App = () => {
  const [health, setHealth] = createSignal(10);
  const simulateProgress = (to) => {
    setInterval(() => setHealth((prev) => {
      if (prev >= to) {
        return 0;
      }
      return prev + 1;
    }), 100);
  };
  onMount(() => simulateProgress(100));
  return createComponent(Flex, {
    style: {
      width: "20rem",
      height: "5rem",
      padding: "1rem"
    },
    direction: "row",
    gap: "1rem",
    "align-items": "center",
    get children() {
      return [createComponent(SegmentedProgressBar, {
        get value() {
          return health();
        }
      }), (() => {
        var _el$ = getNextElement(_tmpl$);
        insert(_el$, () => `${health()}%`);
        return _el$;
      })()];
    }
  });
};
const _12bvgv7 = (root) => render(() => createComponent(App, {}), root);

export { _12bvgv7 as default };
