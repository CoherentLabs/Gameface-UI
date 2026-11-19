import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, ParentComponent } from "solid-js";
import { createContext, createSignal } from "solid-js";
import styles from './Radio.module.scss';
import { RadioButtons } from "./RadioButtons";
import { Button, ButtonLabel } from "./RadioButton";
import { ButtonControl } from "./RadioButtonControl";
import { ButtonIndicator } from "./RadioButtonIndicator";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import exposeRef from "@components/utils/exposeRef";

// `null` default: RadioButton reads it optionally (pattern 1.3.o).
export const RadioContext = createContext<RadioContextValue | null>(null);

type changeOptionMethod = (newOption: string) => void;

export interface RadioRef extends BaseComponentRef {
    selected: Accessor<string>,
    changeOption: changeOptionMethod;
    changeSelected: (direction: 'prev' | 'next') => void,
}

interface RadioContextValue {
    selected: Accessor<string>,
    changeOption: changeOptionMethod,
    /** A button's initial `selected`: applied even when disabled, and not reported through onChange. */
    selectInitial: changeOptionMethod,
    radioOptions: string[],
}

interface RadioProps extends ComponentProps {
    disabled?: boolean;
    'class-disabled'?: string;
    onChange?: (selected: string) => void;
}

const Radio: ParentComponent<RadioProps> = (props) => {
    // A RadioButton with `selected` selects itself while it is being created,
    // so this signal accepts writes from that setup (ownedWrite).
    const [selected, setSelected] = createSignal('', { ownedWrite: true });
    const radioOptions: string[] = [];
    // Always-current plain copy (Solid 2 stages signal writes).
    let current = '';

    const selectInitial = (option: string) => {
        current = option;
        setSelected(option);
    }

    // onChange is reported at the write, once per change (re-selecting the selected option is skipped).
    const changeOption = (newOption: string) => {
        if (props.disabled || newOption === current) return;

        current = newOption;
        setSelected(newOption);
        props.onChange?.(newOption);
    }

    const changeSelected = (direction: 'prev' | 'next') => {
        const idx = radioOptions.indexOf(current);
        const targetIdx = direction === 'prev' ? idx - 1 : idx + 1;

        if (targetIdx >= 0 && targetIdx < radioOptions.length) {
             changeOption(radioOptions[targetIdx])
        }
    }

    const defaultActions = {
        "move-left": () => changeSelected('prev'), 
        'move-right': () => changeSelected('next')
    }

    return (
        <RadioContext value={{ selected, changeOption, selectInitial, radioOptions }}>
            <div
                class={[styles.radio, props.disabled && styles.disabled, props.disabled && props['class-disabled'], props.class]}
                style={props.style}
                ref={[
                    exposeRef(props, { selected, changeOption, changeSelected }),
                    baseComponent(props),
                    navigationActions(mergeNavigationActions(props, defaultActions)),
                ]}>
                <RadioButtons parentChildren={props.children} />
            </div>
        </RadioContext>
    );
}

export default Object.assign(Radio, { Button, ButtonLabel, ButtonControl, ButtonIndicator });
