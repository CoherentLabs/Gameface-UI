import { r as render, c as createComponent, b as createSignal } from './web.DSByG9TV.js';
import { C as Chart } from './Chart.BWv6KIkJ.js';
import './tokenComponents.CcMO5ptL.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
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
