import { Input, Placeholder } from "../shared/tokens";
import { Show, createMemo, ParentComponent, createSignal } from "solid-js";
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import { InputBase } from "../InputBase/InputBase";
import { TextInputProps, TextInputRef } from "../shared/types";
import InputControlButton from "./InputControlButton";
import InputWrapper from "../InputBase/InputWrapper";
import styles from './NumberInput.module.scss';

type valueType = number | string;
export interface NumberInputRef extends Omit<TextInputRef, "value" | "changeValue"> {
    value: valueType,
    changeValue: (newValue: number) => void,
    increaseValue: () => void,
    decreaseValue: () => void,
}
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

    const inputRef = { current: undefined as HTMLInputElement | undefined };

    const transformValue = (value: string) => {
        const isNegative = value.length && value[0] === '-';
        const newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        return isNegative ? '-' + newValue : newValue;
    }
 
    const handleChange = (e: InputEvent) => {
        if (!e.target ) return;

        const input = e.target as HTMLInputElement;
        const inputValue = transformValue(input.value);

        if (props.readonly) {
            input.value = value() as any as string;
            return
        }
        
        if (inputValue === '') return clear()

        const parsed = Number(inputValue);
        const { newValue, hasClamped } = clampValue(parsed);

        props.onChange?.(newValue)
        setValue(newValue)
        //@ts-ignore
        input.value = hasClamped ? newValue : inputValue;
    }

    const changeValue = (value: number) => {
        if (isNaN(value)) {
            return console.error(`${value} is not a valid value! Please provide a number.`)
        }

        const {newValue} = clampValue(value);
        applyValue(newValue);
    }

    const clear = () => applyValue('');

    const increaseValue = () => {
        if (props.readonly || !inputRef.current) {
            if (inputRef.current) inputRef.current.value = value() as any as string;
            return
        }

        const currValue = Number(inputRef.current.value);
        const step = props.step || 1;
        const { newValue } = clampValue(currValue + step);

        applyValue(newValue);
    }

    const decreaseValue = () => {
        if (props.readonly || !inputRef.current) {
            if (inputRef.current) inputRef.current.value = value() as any as string;
            return
        }

        const currValue = Number(inputRef.current.value);
        const step = props.step || 1;
        const { newValue } = clampValue(currValue - step);

        applyValue(newValue);
    }

    const applyValue = (newValue: number | string) => {
        if (!inputRef.current) return;
        inputRef.current.value = newValue as any as string;
        props.onChange?.(newValue);
        setValue(newValue)
    }

    function clampValue(value: number) {
        let newValue = value, hasClamped = false;

        if (props.max !== undefined && props.max < value) {
                newValue = props.max;
                hasClamped = true;
        }

        if (props.min !== undefined && props.min > value) {
                newValue = props.min;
                hasClamped = true;
        }

        return { newValue, hasClamped };
    }

    const increaseBtnPosition = createMemo(() => IncreaseControlToken()?.position ?? 'after');
    const decreaseBtnPosition = createMemo(() => DecreaseControlToken()?.position ?? 'after');
    const showIncreaseBefore = createMemo(() => !!IncreaseControlToken() && increaseBtnPosition() === 'before');
    const showIncreaseAfter  = createMemo(() => !!IncreaseControlToken() && increaseBtnPosition() === 'after');
    const showDecreaseBefore = createMemo(() => !!DecreaseControlToken() && decreaseBtnPosition() === 'before');
    const showDecreaseAfter  = createMemo(() => !!DecreaseControlToken() && decreaseBtnPosition() === 'after');

    const refObject = {
        value,
        changeValue,
        increaseValue,
        decreaseValue,
        clear
    }
    
    return (
        <InputWrapper 
            props={props} 
            inputRef={inputRef}
            refObject={refObject}>

            <Show when={showIncreaseBefore() || showDecreaseBefore()}>
                <div class={styles['button-container']}>
                    <Show when={showIncreaseBefore()}>
                        <InputControlButton orientation="up" click={increaseValue} token={IncreaseControlToken} position="before"/>
                    </Show>
                    <Show when={showDecreaseBefore()}>
                        <InputControlButton orientation="down" click={decreaseValue} token={DecreaseControlToken} position="before"/>
                    </Show>
                </div>
            </Show>

            <InputBase 
                type={'number'}
                value={value}
                ref={(el) => inputRef.current = el}
                handleChange={handleChange} 
                parentChildren={props.children}
                hasBefore={showIncreaseBefore() || showDecreaseBefore()}
                hasAfter={showIncreaseAfter() || showDecreaseAfter()}
            />

            <Show when={showIncreaseAfter() || showDecreaseAfter()}>
                <div class={styles['button-container']}>
                    <Show when={showIncreaseAfter()}>
                        <InputControlButton orientation="up" click={increaseValue} token={IncreaseControlToken} position="after"/>
                    </Show>
                    <Show when={showDecreaseAfter()}>
                        <InputControlButton orientation="down" click={decreaseValue} token={DecreaseControlToken} position="after"/>
                    </Show>
                </div>
            </Show>

        </InputWrapper>
    )
}

export default Object.assign(NumberInput, { IncreaseControl, DecreaseControl, Input, Placeholder });