import { Accessor, children, createSignal, JSX, onMount, ParentComponent, ParentProps } from "solid-js";
import { BaseComponentRef, ComponentProps } from "../../types/ComponentProps";
import { BaseComponent } from "../../BaseComponent/BaseComponent";

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
    onBeforeStateChange?: (currentState?: string, nextState?: string, currentStateElement?: JSX.Element) => void
    onStateChanged?: (currentState?: string, prevState?: string, currentStateElement?: JSX.Element) => void
    ref?: StateComponentRef
}

const State: ParentComponent<StateProps> = (props) => {
    let fallbackElement: JSX.Element;
    let element: HTMLDivElement;
    const states: StatesMap = {};
    const { eventHandlers, ...rest } = BaseComponent(props);
    const [currentState, setCurrentState] = createSignal('');
    let resolved = children(() => props.children).toArray();

    for (let i = 0; i < resolved.length; i++) {
        const child = resolved[i] as unknown as MatchProps;
        if (child.name === '') {
            fallbackElement = <div>{child.children}</div>;
            continue;
        }
        states[child.name] = <div>{child.children}</div>;
    }

    const changeState = (value: string | ((prevState: string) => string)) => {
        const currentStateValue = currentState();
        const currentStateElement = states[currentStateValue] as Node || fallbackElement;
        const nextStateValue = typeof value === 'function' ? value(currentStateValue) : value;
        if (currentStateValue === nextStateValue) return;

        if (props.onBeforeStateChange) {
            props.onBeforeStateChange(currentStateValue, nextStateValue, currentStateElement);
        }

        const nextStateElement = states[nextStateValue] as Node || fallbackElement;
        if (!nextStateElement) return;
        if (currentStateElement && element.children.length) element.removeChild(currentStateElement);
        element.appendChild(nextStateElement);

        setCurrentState(value);

        if (props.onStateChanged) {
            props.onStateChanged(nextStateValue, currentStateValue, nextStateElement);
        }
    }

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            changeState,
            currentState,
            states,
            element,
        });

        changeState(props.default!);
    });

    return <div ref={element!} {...eventHandlers} {...rest}></div>
}

export default State;