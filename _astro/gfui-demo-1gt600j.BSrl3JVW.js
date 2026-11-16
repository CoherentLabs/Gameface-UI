import { r as render, c as createComponent, b as createSignal } from './web.DSByG9TV.js';
import { C as Chart } from './Chart.BWv6KIkJ.js';
import './tokenComponents.CcMO5ptL.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
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
