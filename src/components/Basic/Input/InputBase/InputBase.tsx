import { Accessor, Component, createMemo, Show } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { useToken } from "@components/utils/tokenComponents";
import { Input, Placeholder } from "../shared/tokens";
import styles from './InputBase.module.scss';

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
        const classes = [styles.input];

        if (props.hasBefore) classes.push(styles['has-before'])
        if (props.hasAfter) classes.push(styles['has-after'])
                
        classes.push(InputToken()?.class ?? '');
        return classes.join(' ');
    });

    return (
        <div class={styles['input-element-wrapper']}>
            <input 
                type={props.type}
                ref={props.ref}
                class={InputClasses()}
                style={InputToken()?.style}
                onInput={props.handleChange}
                ondblclick={(e) => e.currentTarget.select()}
                value={props.value()} />
            <Show when={PlaceholderToken() && props.value() === ''}>
                <div class={`${styles.placeholder} ${PlaceholderToken()?.class ?? ''}`} style={PlaceholderToken()?.style}>
                    {PlaceholderToken()?.children || ""}
                </div>
            </Show>
        </div>
    )
}
