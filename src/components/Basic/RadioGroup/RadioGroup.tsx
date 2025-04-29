import { BaseComponentRef, ComponentBaseProps, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, children, JSX, onMount, ParentComponent, Setter } from "solid-js";
import { createContext, createSignal } from "solid-js";
import styles from './RadioGroup.module.css';
import { BaseComponent } from "@components/BaseComponent/BaseComponent";

export const RadioGroupContext = createContext<RadioGroupContextValue>();

type changeOptionMethod = (newOption: string) => void;

export interface RadioGroupRef extends BaseComponentRef {
    changeOption: changeOptionMethod;
}

interface RadioGroupContextValue {
    selected: Accessor<string>,
    changeOption: changeOptionMethod,
}

interface RadioGroupProps extends ComponentProps {
    disabled?: boolean;
    onChange?: (selected: string) => void;
}

const RadioGroup: ParentComponent<RadioGroupProps> = (props) => {
    const [selected, setSelected] = createSignal('');
    let element!: HTMLDivElement;

    props.componentClasses = `${styles.RadioGroup} ${props.disabled ? styles.Disabled : ''}`

    const changeOption = (newOption: string) => {
        if (props.disabled) return;

        setSelected(newOption);
        props.onChange?.(newOption);
    }

    // Lets make an util function
    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            changeOption,
            element,
        });
    });

    return (
        <RadioGroupContext.Provider value={{ selected, changeOption }}>
            <div ref={element}
                {...BaseComponent(props).attributes}
                {...BaseComponent(props).eventHandlers} 
                class={BaseComponent(props).className}
                style={BaseComponent(props).style}>
                {props.children}
            </div>
        </RadioGroupContext.Provider>
    );
}

export default RadioGroup