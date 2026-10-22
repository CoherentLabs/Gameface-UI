import { r as render, c as createComponent, b as createSignal } from './web.PcCDJqbu.js';
import { C as Chart } from './Chart.B0B4fhju.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './getSafePosition.RgHcJ5HV.js';

const App = () => {
  const [stats, setStats] = createSignal([{
    label: "Loadout",
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
    }]
  }]);
  return createComponent(Chart.Donut, {
    get data() {
      return stats();
    },
    interactive: true,
    get children() {
      return [createComponent(Chart.Labels, {
        placement: "hole"
      }), createComponent(Chart.Legend, {
        position: "bottom"
      })];
    }
  });
};
const _1u4o3hn = (root) => render(() => createComponent(App, {}), root);

export { _1u4o3hn as default };
