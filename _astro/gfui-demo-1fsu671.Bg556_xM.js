import { r as render, c as createComponent, b as createSignal, o as onMount } from './web.PcCDJqbu.js';
import { P as Progress } from './Progress.Dz_AdABO.js';
import './tokenComponents.TNOn7o7y.js';
import './BaseComponent.BcUYgHqW.js';
import './store.BnPMRy2B.js';
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
  return createComponent(Progress.Bar, {
    get progress() {
      return progress();
    }
  });
};
const _1fsu671 = (root) => render(() => createComponent(App, {}), root);

export { _1fsu671 as default };
