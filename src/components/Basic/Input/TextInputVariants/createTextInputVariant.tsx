import { ComponentProps } from "@components/types/ComponentProps";
import { onMount, Show, createMemo, Accessor } from "solid-js";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { useToken } from '@components/utils/tokenComponents';
import { InputBase } from "../InputBase/InputBase";
import useTextInput from "./useTextInput";
import { After, Before } from "../InputBase/tokens";
import baseStyles from '../InputBase/InputBase.module.css';
import styles from './TextInput.module.css';

export interface TextInputRef {
    element: HTMLDivElement,
    input: HTMLInputElement,
    value: Accessor<string>,
    changeValue: (newValue: string) => void,
    clear: () => void,
}

export interface TextInputProps extends ComponentProps {
    value?: string
    disabled?: boolean
    readonly?: boolean
    'max-symbols'?: number
    'class-disabled'?: string
    onChange?: (value: string) => void;
}

export function createTextInputVariant(type: 'text' | 'password') {
    return (props: TextInputProps) => {
        const BeforeToken = useToken(Before, props.children);
        const AfterToken = useToken(After, props.children);

        let element!: HTMLDivElement;
        let inputElement!: HTMLInputElement;

        const {value, handleChange, changeValue, clear } = useTextInput(props);
        
        const textInputClasses = createMemo(() => {
            const classes = [baseStyles.InputWrapper];
            
            if (props.disabled) {
                classes.push(baseStyles.Disabled);
                
                if (props['class-disabled']) classes.push(`${props['class-disabled']}`);
            }
            
            return classes.join(' ');
        });
        
        props.componentClasses = () => textInputClasses();
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
                
                <Show when={BeforeToken()}>
                    <div class={styles.Before}>
                        {BeforeToken()?.children}
                    </div>
                </Show>

                <InputBase 
                    type={type}
                    value={value}
                    ref={inputElement!}
                    handleChange={handleChange} 
                    parentChildren={props.children}
                    hasBefore={!!BeforeToken()}
                    hasAfter={!!AfterToken()}
                    />

                <Show when={AfterToken()}>
                    <div class={styles.After}>
                        {AfterToken()?.children}
                    </div>
                </Show>

            </div>
        )
    }
}
