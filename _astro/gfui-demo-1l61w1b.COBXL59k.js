import { r as render, c as createComponent, b as createSignal } from './web.DSByG9TV.js';
import { C as Chart } from './Chart.BWv6KIkJ.js';
import './tokenComponents.CcMO5ptL.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
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
    }]
  }, {
    label: "Enemy",
    points: [{
      type: "strength",
      value: 7
    }, {
      type: "agility",
      value: 18
    }, {
      type: "stamina",
      value: 11
    }]
  }]);
  return createComponent(Chart.Line, {
    get data() {
      return stats();
    },
    interactive: true,
    get children() {
      return [createComponent(Chart.Line.Point, {
        show: "always"
      }), createComponent(Chart.YAxis, {}), createComponent(Chart.XAxis, {}), createComponent(Chart.Grid, {
        horizontal: true
      }), createComponent(Chart.Legend, {
        position: "bottom"
      })];
    }
  });
};
const _1l61w1b = (root) => render(() => createComponent(App, {}), root);

export { _1l61w1b as default };
