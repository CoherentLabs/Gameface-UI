import { Input, Placeholder } from "../shared/tokens";
import { onMount, Show, createMemo, ParentComponent, createSignal } from "solid-js";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import { InputBase } from "../InputBase/InputBase";
import baseStyles from '../InputBase/InputBase.module.css';
import styles from './NumberInput.module.css';
import { TextInputProps } from "../shared/types";
import InputControlButton from "./InputControlButton";


type valueType = number | string;

interface NumberInputProps extends Omit<TextInputProps, 'max-symbols' | 'value' | 'onChange'> {
    value?: valueType
    min?: number,
    max?: number,
    step?: number,
    onChange?: (value: valueType) => void;
}

interface InputControlTokenProps extends TokenBase {
    position?: 'before' | 'after'
}

export const IncreaseControl = createTokenComponent<InputControlTokenProps>();
export const DecreaseControl = createTokenComponent<InputControlTokenProps>();

const NumberInput: ParentComponent<NumberInputProps> = (props) => {
    const [value, setValue] = createSignal<valueType>(props.value ?? '');
    const IncreaseControlToken = useToken(IncreaseControl, props.children);
    const DecreaseControlToken = useToken(DecreaseControl, props.children);

    let element!: HTMLDivElement;
    let inputElement!: HTMLInputElement;

    const transformValue = (value: string) => {
        const isNegative = value.length && value[0] === '-';
        const newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        return isNegative ? '-' + newValue : newValue;
    }
 
    const handleChange = (e: InputEvent) => {
        if (props.readonly || !e.target ) return;

        const input = e.target as HTMLInputElement;
        const newValue = transformValue(input.value);

        if (newValue === '') return clear()

        if (newValue === '-' || newValue.endsWith('.')) {
            input.value = newValue;
            setValue(newValue)
            return;
        }

        let numberValue = Number(newValue);
        // if not clamped to min/max, we show the original string input to preserve trailing 0s
        let hasClamped = false;  

        if (props.max !== undefined && props.max < numberValue) {
             numberValue = props.max;
             hasClamped = true;
            }

        if (props.min !== undefined && props.min > numberValue) {
            numberValue = props.min;
            hasClamped = true;
        }

        props.onChange?.(numberValue)
        setValue(numberValue)
        //@ts-ignore
        input.value = hasClamped ? numberValue : newValue;
    }

    const changeValue = (newValue: number) => {
        if (isNaN(newValue)) {
            return console.error(`${newValue} is not a valid value! Please provide a number.`)
        }

        if (props.max !== undefined && props.max < newValue) newValue = props.max;
        if (props.min !== undefined && props.min > newValue) newValue = props.min;

        applyValue(newValue);
    }

    const clear = () => applyValue('');

    const increaseValue = () => {
        const currValue = Number(inputElement.value);
        const step = props.step || 1;
        let newValue;

        if (props.max) {
            newValue = Math.min(currValue + step, props.max);
        } else {
            newValue = currValue + step;
        }

        applyValue(newValue);
    }

    const decreaseValue = () => {
        const currValue = Number(inputElement.value);
        const step = props.step || 1;
        let newValue;

        if (props.min) {
            newValue = Math.max(currValue - step, props.min);
        } else {
            newValue = currValue - step;
        }

        applyValue(newValue);
    }

    const applyValue = (newValue: number | string) => {
        inputElement.value = newValue as any as string;
        props.onChange?.(newValue);
        setValue(newValue)
    }

    const hasBefore = () => IncreaseControlToken()?.position === 'before' || DecreaseControlToken()?.position === 'before';
    const hasAfter = () => IncreaseControlToken()?.position === 'after' || DecreaseControlToken()?.position === 'after';
    
    const numberInputClasses = createMemo(() => {
        const classes = [baseStyles.InputWrapper];
        
        if (props.disabled) {
            classes.push(baseStyles.Disabled);
            
            if (props['class-disabled']) classes.push(`${props['class-disabled']}`);
        }
        
        return classes.join(' ');
    });
    
    props.componentClasses = () => numberInputClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);
    
    onMount(() => {
        if (!props.ref || !element) return;
        
        (props.ref as unknown as (ref: any) => void)({
            element,
            input: inputElement,
            value,
            changeValue,
            clear
        });
    });
    
    return (
        <div 
            ref={element!}
            class={className()} 
            style={inlineStyles()} 
            use:forwardEvents={props}
            use:forwardAttrs={props}>

            <Show when={hasBefore()}>
                <div class={styles.ButtonContainer}>
                    <InputControlButton orientation="up" click={increaseValue} token={IncreaseControlToken} position="before"/>
                    <InputControlButton orientation="down" click={decreaseValue} token={DecreaseControlToken} position="before"/>
                </div>
            </Show>

            <InputBase 
                type={'number'}
                value={value}
                ref={inputElement!}
                handleChange={handleChange} 
                parentChildren={props.children}
                hasBefore={hasBefore()}
                hasAfter={hasAfter()}
                />

            <Show when={hasAfter()}>
                <div class={styles.ButtonContainer}>
                    <InputControlButton orientation="up" click={increaseValue} token={IncreaseControlToken} position="after"/>
                    <InputControlButton orientation="down" click={decreaseValue} token={DecreaseControlToken} position="after"/>
                </div>
            </Show>

        </div>
    )
}

export default Object.assign(NumberInput, { IncreaseControl, DecreaseControl, Input, Placeholder });