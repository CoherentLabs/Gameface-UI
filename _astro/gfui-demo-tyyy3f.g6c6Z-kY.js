import { c as createComponent, d as delegateEvents, r as render, b as createSignal, g as getNextElement, e as runHydrationEvents, t as template } from './web.PcCDJqbu.js';
import { T as Trackers } from './Trackers.MWUrQqAh.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './gamefaceVersion.ACI438bm.js';

var _tmpl$ = /* @__PURE__ */ template(`<button>Scale up`), _tmpl$2 = /* @__PURE__ */ template(`<button>Rotate`);
const App = () => {
  const [scale, setScale] = createSignal(1);
  const [rotate, setRotate] = createSignal(0);
  return [(() => {
    var _el$ = getNextElement(_tmpl$);
    _el$.$$click = () => setScale((s) => s + 0.2);
    runHydrationEvents();
    return _el$;
  })(), (() => {
    var _el$2 = getNextElement(_tmpl$2);
    _el$2.$$click = () => setRotate((r) => r + 15);
    runHydrationEvents();
    return _el$2;
  })(), createComponent(Trackers, {
    id: "minimap",
    style: {
      width: "200px",
      height: "200px"
    },
    get children() {
      return createComponent(Trackers.Item, {
        id: "blip-1",
        scale,
        rotate,
        style: {
          width: "20px",
          height: "20px",
          background: "#4fd6ff"
        }
      });
    }
  })];
};
createComponent(App, {});
const tyyy3f = (root) => render(() => createComponent(App, {}), root);
delegateEvents(["click"]);

export { tyyy3f as default };
