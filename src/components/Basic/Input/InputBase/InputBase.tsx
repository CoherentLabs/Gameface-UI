import { Accessor, Component, createMemo, Show } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { useToken } from "@components/utils/tokenComponents";
import { Input, Placeholder } from "../shared/tokens";
import styles from './InputBase.module.css';

interface InputComponentProps extends TokenComponentProps {
    value: Accessor<string | number>,
    handleChange: (e: InputEvent) => void,
    type: 'text' | 'password' | 'number',
    ref: HTMLInputElement;
    hasBefore: boolean,
    hasAfter: boolean,
}

export const InputBase: Component<InputComponentProps> = (props) => {
    const InputToken = useToken(Input, props.parentChildren);
    const PlaceholderToken = useToken(Placeholder, props.parentChildren);

    const InputClasses = createMemo(() => {
        const classes = [styles.Input];

        if (props.hasBefore) classes.push(styles.hasBefore)
        if (props.hasAfter) classes.push(styles.hasAfter)
                
        classes.push(InputToken()?.class ?? '');
        return classes.join(' ');
    });

    return (
        <div class={styles.InputElementWrapper}>
            <input 
                type={props.type}
                ref={props.ref}
                class={InputClasses()}
                style={InputToken()?.style}
                onInput={props.handleChange}
                value={props.value()} />
            <Show when={PlaceholderToken() && props.value() === ''}>
                <div class={`${styles.Placeholder} ${PlaceholderToken()?.class ?? ''}`} style={PlaceholderToken()?.style}>
                    {PlaceholderToken()?.children || ""}
                </div>
            </Show>
        </div>
    )
}
