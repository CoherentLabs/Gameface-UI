import { r as render, c as createComponent, b as createSignal } from './web.fJ3rGgJk.js';
import { C as Chart } from './Chart.CAD3UY1Q.js';
import './tokenComponents.JX_18n2r.js';
import './BaseComponent.6jspVmqg.js';
import './store.BS9ej-Rw.js';
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
