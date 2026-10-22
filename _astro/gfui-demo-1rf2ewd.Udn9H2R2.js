import { d as delegateEvents, r as render, g as getNextElement, e as runHydrationEvents, i as insert, c as createComponent, t as template } from './web.PcCDJqbu.js';
import { u as updateTrackers, T as Trackers } from './Trackers.MWUrQqAh.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './gamefaceVersion.ACI438bm.js';

var _tmpl$ = /* @__PURE__ */ template(`<button style="background:#4fd6ff;color:#000;padding:0.5rem 1rem;border:none;borderRadius:4px;cursor:pointer">Click to change position`), _tmpl$2 = /* @__PURE__ */ template(`<div style=position:relative;width:200px;height:200px;background:#222>`);
const _1rf2ewd = (root) => render(() => [(() => {
  var _el$ = getNextElement(_tmpl$);
  _el$.$$click = () => updateTrackers("minimap", {
    id: "blip-1",
    x: Math.random() * 180,
    y: Math.random() * 180
  });
  runHydrationEvents();
  return _el$;
})(), (() => {
  var _el$2 = getNextElement(_tmpl$2);
  insert(_el$2, createComponent(Trackers, {
    id: "minimap",
    get children() {
      return createComponent(Trackers.Item, {
        id: "blip-1",
        style: {
          width: "12px",
          height: "12px",
          "border-radius": "50%",
          background: "#4fd6ff"
        }
      });
    }
  }));
  return _el$2;
})()], root);
delegateEvents(["click"]);

export { _1rf2ewd as default };
