import { r as render, c as createComponent, a as createSignal, o as onMount } from './web.BVcuNnQ8.js';
import { P as Progress } from './Progress.BUoK2xM7.js';
import './tokenComponents.sshVCBVx.js';
import './BaseComponent.DPzDIAqq.js';
import './store.BQv4smX3.js';
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
