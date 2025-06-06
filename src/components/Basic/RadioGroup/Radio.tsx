import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createMemo, onMount, ParentComponent } from "solid-js";
import { createContext, createSignal } from "solid-js";
import styles from './Radio.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { RadioButtons } from "./RadioButtons";
import { Button, ButtonLabel } from "./RadioButton";
import { ButtonControl } from "./RadioButtonControl";
import { ButtonIndicator } from "./RadioButtonIndicator";

export const RadioContext = createContext<RadioContextValue>();

type changeOptionMethod = (newOption: string) => void;

export interface RadioRef extends BaseComponentRef {
    selected: Accessor<string>,
    changeOption: changeOptionMethod;
}

interface RadioContextValue {
    selected: Accessor<string>,
    changeOption: changeOptionMethod,
}

interface RadioProps extends ComponentProps {
    disabled?: boolean;
    'class-disabled'?: string;
    onChange?: (selected: string) => void;
}

const Radio: ParentComponent<RadioProps> = (props) => {
    const [selected, setSelected] = createSignal('');
    let element!: HTMLDivElement;

    const checkboxClasses = createMemo(() => {
        const classes = [styles.Radio];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.Disabled} ${props['class-disabled']}`);
            else classes.push(styles.Disabled);
        }

        return classes.join(' ');
    });


    props.componentClasses = () => checkboxClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const changeOption = (newOption: string) => {
        if (props.disabled) return;

        setSelected(newOption);
        props.onChange?.(newOption);
    }

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            selected,
            changeOption,
            element,
        });
    });

    return (
        <RadioContext.Provider value={{ selected, changeOption }}>
            <div ref={element}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}>
                <RadioButtons parentChildren={props.children} />
            </div>
        </RadioContext.Provider>
    );
}

export default Object.assign(Radio, { Button, ButtonLabel, ButtonControl, ButtonIndicator });
