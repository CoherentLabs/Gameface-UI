import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount} from "solid-js";
import selectors from "../../../shared/progress-selectors.json";
import Progress from "@components/Feedback/Progress/Progress";

const INITIAL_VALUE = 10;
const ProgressTest = () => {
    const [value, setValue] = createSignal(INITIAL_VALUE);
    const [shape, setShape] = createSignal<'square' | 'round'>("square");
    const [test, setTest] = createSignal('red');

    const simulateProgress = (to: number) => {
        let interval = setInterval(() => setValue(prev => {
            if (prev >= to) {
                clearInterval(interval);
                return prev;
            }
            return prev + 10;
        }), 10);
    };

    const scenarios = [
        { label: "Load to 100%", action: () => {simulateProgress(100)}},
        { label: "Load to 50%", action: () => {simulateProgress(50)}},
        { label: "Load to 120%", action: () => {simulateProgress(120)}},
        { label: "Change styles", action: () => {setTest('blue')}},
        { label: "Set shape to round", action: () => {setShape('round')}},
    ];

    const reset = () => {
        setTest('red');
        setValue(INITIAL_VALUE);
        setShape('square');
    };

    const TestBoilerplate = () => (
        <>
            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>
        </>
    )

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <>
            <Tab location='progress-bar'>
                <TestBoilerplate />

                <Progress.Bar 
                    progress={value()}
                    style={reactiveStyle()} 
                    class={`${selectors.base} ${reactiveClass()}`}>
                    <Progress.Bar.Fill class={`${selectors.fill} ${reactiveClass()}`} style={reactiveStyle()} />
                </Progress.Bar>
            </Tab> 

            <Tab location='progress-circle'>
                <TestBoilerplate />

                <Progress.Circle 
                    progress={value()}
                    style={reactiveStyle()} 
                    class={`${selectors.base} ${reactiveClass()}`}>
                    <Progress.Circle.Fill class={`${selectors.fill} ${reactiveClass()}`} style={reactiveStyle()} shape={shape()} />
                    <Progress.Circle.Outline class={`${selectors.outline} ${reactiveClass()}`} style={reactiveStyle()} />
                    <Progress.Circle.Text class={`${selectors.text} ${reactiveClass()}`} style={reactiveStyle()}>
                        {`${value()}%`}
                    </Progress.Circle.Text>
                </Progress.Circle>
            </Tab> 
        </>
    )
}

export default ProgressTest;