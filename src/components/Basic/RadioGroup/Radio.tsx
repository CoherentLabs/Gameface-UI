import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createMemo, onMount, ParentComponent } from "solid-js";
import { createContext, createSignal } from "solid-js";
import styles from './Radio.module.scss';
import { RadioButtons } from "./RadioButtons";
import { Button, ButtonLabel } from "./RadioButton";
import { ButtonControl } from "./RadioButtonControl";
import { ButtonIndicator } from "./RadioButtonIndicator";
import baseComponent from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";

export const RadioContext = createContext<RadioContextValue>();

type changeOptionMethod = (newOption: string) => void;

export interface RadioRef extends BaseComponentRef {
    selected: Accessor<string>,
    changeOption: changeOptionMethod;
    changeSelected: (direction: 'prev' | 'next') => void,
}

interface RadioContextValue {
    selected: Accessor<string>,
    changeOption: changeOptionMethod,
    radioOptions: string[],
}

interface RadioProps extends ComponentProps {
    disabled?: boolean;
    'class-disabled'?: string;
    onChange?: (selected: string) => void;
}

const Radio: ParentComponent<RadioProps> = (props) => {
    const [selected, setSelected] = createSignal('');
    const radioOptions: string[] = [];
    let element!: HTMLDivElement;

    const checkboxClasses = createMemo(() => {
        const classes = [styles.radio];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.disabled} ${props['class-disabled']}`);
            else classes.push(styles.disabled);
        }

        return classes.join(' ');
    });


    props.componentClasses = () => checkboxClasses();

    const changeOption = (newOption: string) => {
        if (props.disabled) return;

        setSelected(newOption);
        props.onChange?.(newOption);
    }

    const changeSelected = (direction: 'prev' | 'next') => {
        const idx = radioOptions.indexOf(selected());
        const targetIdx = direction === 'prev' ? idx - 1 : idx + 1;

        if (targetIdx >= 0 && targetIdx < radioOptions.length) {
             changeOption(radioOptions[targetIdx])
        }
    }

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            selected,
            changeOption,
            changeSelected,
            element,
        });
    });

    const defaultActions = {
        "move-left": () => changeSelected('prev'), 
        'move-right': () => changeSelected('next')
    }

    return (
        <RadioContext.Provider value={{ selected, changeOption, radioOptions }}>
            <div ref={element}
                use:baseComponent={props}
                use:navigationActions={mergeNavigationActions(props, defaultActions)}>
                <RadioButtons parentChildren={props.children} />
            </div>
        </RadioContext.Provider>
    );
}

export default Object.assign(Radio, { Button, ButtonLabel, ButtonControl, ButtonIndicator });
