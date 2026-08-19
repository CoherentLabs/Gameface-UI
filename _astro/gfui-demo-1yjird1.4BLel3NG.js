import { r as render, c as createComponent, a as createSignal, o as onMount } from './web.Dte3IpIp.js';
import { P as Progress } from './Progress.B4B8V7xf.js';
import './tokenComponents.Vg66oOOL.js';
import './BaseComponent.C5rMUBcY.js';
import './store.-dvm-_QW.js';
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
