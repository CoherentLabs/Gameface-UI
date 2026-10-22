import { r as render, c as createComponent, b as createSignal } from './web.PcCDJqbu.js';
import { C as Chart } from './Chart.B0B4fhju.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './getSafePosition.RgHcJ5HV.js';

const App = () => {
  const [stats] = createSignal([{
    label: "Player",
    points: [{
      type: "strength",
      value: 13
    }, {
      type: "agility",
      value: 9
    }, {
      type: "stamina",
      value: 16
    }, {
      type: "intellect",
      value: 6
    }, {
      type: "spirit",
      value: 11
    }]
  }]);
  return createComponent(Chart.Spider, {
    get data() {
      return stats();
    },
    interactive: true,
    style: {
      height: "20rem"
    },
    get children() {
      return [createComponent(Chart.Spider.Web, {
        levels: 4,
        style: {
          stroke: "#8d8d8d"
        }
      }), createComponent(Chart.Spider.Axis, {}), createComponent(Chart.Legend, {
        position: "bottom"
      })];
    }
  });
};
const _1kjv4ze = (root) => render(() => createComponent(App, {}), root);

export { _1kjv4ze as default };
