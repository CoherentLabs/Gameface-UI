// src/playground/PositionTester.tsx
import Tab from "@components/Layout/Tab/Tab";
import Transform from "@components/Layout/Transform/Transform";
import { createSignal, createMemo, onMount, onCleanup, For } from "solid-js";
import './transform.css'

const TransformTest = () => {
  const [test, setTest] = createSignal("red");
  const [rotate, setRotate] = createSignal(15);
  const [matrix, setMatrix] = createSignal<any>(null);
  const [origin, setOrigin] = createSignal<any>('top left');

  const reset = () => {
    setTest("red");
    setRotate(15);
    setMatrix(null);
    setOrigin('top left');
  };

  const scenarios = [
        { label: "Rotate component", action: () => setRotate(45)},
        { label: "Apply matrix transform", action: () => setMatrix({ scale: {x: 2} })},
        { label: "Change origin", action: () => setOrigin('top right') },
    ];

  const isReactive = createMemo(() => test() === "blue");
  const reactiveClass = createMemo(() => (isReactive() ? "reactive" : ""));
  const reactiveStyle = createMemo(() => (isReactive() ? { "background-color": "blue" } : {}));

  onMount(() => document.addEventListener("reset", reset));
  onCleanup(() => document.removeEventListener("reset", reset));

  return (
    <Tab location="transform">
      <For each={scenarios}>
        {(sc, i) => (
          <button
            class={`scenario-btn scenario-${i()}`}
            onClick={sc.action}
          >
            {sc.label}
          </button>
        )}
      </For>

      <Transform
        rotate={{ z: rotate() }}
        matrix={matrix()}
        origin={origin()}
        style={reactiveStyle()}
        click={() => setTest("blue")}
        class={`transform ${reactiveClass()}`}
      >
        Transform
      </Transform>
    </Tab>
  );
};

export default TransformTest;