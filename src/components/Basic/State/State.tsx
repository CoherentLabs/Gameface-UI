import { Accessor, children, createSignal, onSettled, ParentComponent, ParentProps, untrack } from "solid-js";
import { JSX } from "@solidjs/web";
import { BaseComponentRef, ComponentProps } from "../../types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

interface MatchProps extends ParentProps {
    name: string;
    children?: JSX.Element
}

export const Match: ParentComponent<MatchProps> = (props): any => {
    return props;
}

interface StatesMap {
    [key: string]: JSX.Element | Node
}

export interface StateComponentRef extends BaseComponentRef {
    changeState: (value: string | ((prevState: string) => string)) => void,
    currentState: Accessor<string>,
    states: StatesMap,
}

interface StateProps extends ComponentProps {
    default?: string
    name?: string
    onBeforeStateChange?: (currentState?: string, nextState?: string, currentStateElement?: JSX.Element) => void
    onStateChanged?: (currentState?: string, prevState?: string, currentStateElement?: JSX.Element) => void
    ref?: StateComponentRef
}

interface States {
    [key: string]: {
        changeState: ChangeStateMethodType,
        currentState: Accessor<string>
    }
}

type ChangeStateMethodType = (value: string | ((prevState: string) => string)) => void;
export const states: States = {};

const State: ParentComponent<StateProps> = (props) => {
    let fallbackElement: JSX.Element;
    let element: HTMLDivElement | undefined;
    const statesMap: StatesMap = {};
    const [currentState, setCurrentState] = createSignal('');
    // Always-current plain copy: Solid 2 stages signal writes, so currentState() still returns the old state
    // until they are applied. Two changes in one tick must each see the previous one.
    let current = '';
    // The <Match> children are read once at creation, as in 1.x.
    const resolved = untrack(() => children(() => props.children).toArray());

    for (let i = 0; i < resolved.length; i++) {
        const child = resolved[i] as unknown as MatchProps;
        if (child.name === '') {
            fallbackElement = <div>{child.children}</div>;
            continue;
        }
        statesMap[child.name] = <div>{child.children}</div>;
    }

    const changeState: ChangeStateMethodType = (value) => {
        const currentStateValue = current;
        const currentStateElement = statesMap[currentStateValue] as Node || fallbackElement;
        const nextStateValue = typeof value === 'function' ? value(currentStateValue) : value;
        if (currentStateValue === nextStateValue) return;

        if (props.onBeforeStateChange) {
            props.onBeforeStateChange(currentStateValue, nextStateValue, currentStateElement);
        }

        const nextStateElement = statesMap[nextStateValue] as Node || fallbackElement;
        if (!nextStateElement || !element) return;
        if (currentStateElement && element.children.length) element.removeChild(currentStateElement);
        element.appendChild(nextStateElement);

        current = nextStateValue;
        // The resolved name, not `value`: a function would be re-run by the setter against the staged state.
        setCurrentState(nextStateValue);

        if (props.onStateChanged) {
            props.onStateChanged(nextStateValue, currentStateValue, nextStateElement);
        }
    }

    const name = untrack(() => props.name);
    if (name) states[name] = { changeState, currentState };

    // Show the default state once mounted (a signal write: allowed in onSettled).
    onSettled(() => {
        untrack(() => {
            if (props.default) changeState(props.default);
        });
    });

    return <div
        class={props.class}
        style={props.style}
        ref={[
            (node: HTMLDivElement) => { element = node; },
            exposeRef(props, { changeState, currentState, states }),
            baseComponent(props),
        ]}
     />
}

export default State;