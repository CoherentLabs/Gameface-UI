// src/playground/PositionTester.tsx
import Tab from "@components/Layout/Tab/Tab";
import { createSignal, createMemo, onMount, onCleanup, For, ParentComponent } from "solid-js";
import selectors from "../../../shared/position-selectors.json";

interface PositionTesterProps {
  location: string;
  baseClass: string;
  Component: ParentComponent<any>;
}

const PositionTest: ParentComponent<PositionTesterProps> = (props) => {
  const [test, setTest] = createSignal("red");
  const [position, setPosition] = createSignal({ top: 0, left: 0 });

  const reset = () => {
    setTest("red");
    setPosition({ top: 0, left: 0 });
  };

  const scenarios = [
        { label: "Change position", action: () => {
            setPosition({
                top: 100,
                left: 100,
            })
        } },
    ];

  const isReactive = createMemo(() => test() === "blue");
  const reactiveClass = createMemo(() => (isReactive() ? "reactive" : ""));
  const reactiveStyle = createMemo(() => (isReactive() ? { "background-color": "blue" } : {}));

  onMount(() => document.addEventListener("reset", reset));
  onCleanup(() => document.removeEventListener("reset", reset));

  return (
    <Tab location={props.location}>
      <For each={scenarios}>
        {(sc, i) => (
          <button
            class={`${selectors.scenarioBtn} scenario-${i()}`}
            onClick={sc.action}
          >
            {sc.label}
          </button>
        )}
      </For>

      <props.Component
        style={reactiveStyle()}
        click={() => setTest("blue")}
        top={`${position().top}px`}
        left={`${position().left}px`}
        class={`${selectors[props.baseClass as keyof typeof selectors]} ${reactiveClass()}`}
      >
        {props.baseClass}
      </props.Component>
    </Tab>
  );
};

export default PositionTest;