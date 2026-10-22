import { c as createComponent, r as render, o as onMount, a as onCleanup } from './web.PcCDJqbu.js';
import { T as Trackers, u as updateTrackers } from './Trackers.MWUrQqAh.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './gamefaceVersion.ACI438bm.js';

const App = () => {
  let frame;
  const tick = () => {
    updateTrackers("minimap", [{
      id: "blip-1",
      x: Math.random() * 180,
      y: Math.random() * 180
    }, {
      id: "blip-2",
      x: Math.random() * 180,
      y: Math.random() * 180
    }]);
    frame = requestAnimationFrame(tick);
  };
  onMount(() => {
    frame = requestAnimationFrame(tick);
  });
  onCleanup(() => cancelAnimationFrame(frame));
  return createComponent(Trackers, {
    id: "minimap",
    style: {
      width: "200px",
      height: "200px"
    },
    get children() {
      return [createComponent(Trackers.Item, {
        id: "blip-1",
        style: {
          width: "10px",
          height: "10px",
          background: "red"
        }
      }), createComponent(Trackers.Item, {
        id: "blip-2",
        style: {
          width: "10px",
          height: "10px",
          background: "lime"
        }
      })];
    }
  });
};
createComponent(App, {});
const _15xgu7g = (root) => render(() => createComponent(App, {}), root);

export { _15xgu7g as default };
