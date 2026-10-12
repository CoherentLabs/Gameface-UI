import { r as render, c as createComponent, b as createSignal } from './web.PcCDJqbu.js';
import { C as Chart } from './Chart.DKUl-mzJ.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.Irprgzr9.js';
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
  return createComponent(Chart.Pie, {
    get data() {
      return stats();
    },
    style: {
      height: "20rem"
    },
    get children() {
      return [createComponent(Chart.Labels, {
        placement: "outside"
      }), createComponent(Chart.Legend, {
        position: "bottom"
      })];
    }
  });
};
const _1ifkbh3 = (root) => render(() => createComponent(App, {}), root);

export { _1ifkbh3 as default };
