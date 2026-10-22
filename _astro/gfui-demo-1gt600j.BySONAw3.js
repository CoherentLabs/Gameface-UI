import { r as render, c as createComponent, b as createSignal } from './web.PcCDJqbu.js';
import { C as Chart } from './Chart.B0B4fhju.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
import './getSafePosition.RgHcJ5HV.js';

const App = () => {
  const [load] = createSignal([{
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
    }]
  }]);
  return createComponent(Chart.Area, {
    get data() {
      return load();
    },
    interactive: true,
    get children() {
      return [createComponent(Chart.YAxis, {}), createComponent(Chart.XAxis, {}), createComponent(Chart.Legend, {
        position: "bottom"
      })];
    }
  });
};
const _1gt600j = (root) => render(() => createComponent(App, {}), root);

export { _1gt600j as default };
