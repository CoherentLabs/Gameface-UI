import { r as render, c as createComponent, b as createSignal, o as onMount } from './web.DSByG9TV.js';
import { P as Progress } from './Progress.CV4y5SZh.js';
import './tokenComponents.CcMO5ptL.js';
import './BaseComponent.u9Ar6trR.js';
import './store.D5_yYWQG.js';
import './clamp.BBPiOs3-.js';

const App = () => {
  const [progress, setProgress] = createSignal(0);
  const simulateProgress = (to) => {
    let interval = setInterval(() => setProgress((prev) => {
      if (prev >= to) {
        clearInterval(interval);
        return prev;
      }
      return prev + 1;
    }), 100);
  };
  onMount(() => {
    simulateProgress(100);
  });
  return createComponent(Progress.Circle, {
    get progress() {
      return progress();
    },
    get children() {
      return createComponent(Progress.Circle.Text, {
        get children() {
          return `${progress()}%`;
        }
      });
    }
  });
};
const _1yjird1 = (root) => render(() => createComponent(App, {}), root);

export { _1yjird1 as default };
