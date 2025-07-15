import { Accessor, Component, createMemo, Show } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { useToken } from "@components/utils/tokenComponents";
import { Input, Placeholder } from "./tokens";
import InlineTextBlock from "@components/Basic/InlineTextBlock/InlineTextBlock";
import styles from './InputBase.module.css';

interface InputComponentProps extends TokenComponentProps {
    value: Accessor<string | number>,
    handleChange: (e: InputEvent) => void,
    type: 'text' | 'password',
    ref: HTMLInputElement;
    hasBefore: boolean,
    hasAfter: boolean,
}

export const InputBase: Component<InputComponentProps> = (props) => {
    const InputToken = useToken(Input, props.parentChildren);
    const PlaceholderToken = useToken(Placeholder, props.parentChildren);

    const InputClasses = createMemo(() => {
        const classes = [styles.Input];

        if (InputToken()?.class) classes.push(InputToken()?.class ?? '');

        if (props.hasBefore) classes.push(styles.hasBefore)
        if (props.hasAfter) classes.push(styles.hasAfter)

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
            <Show when={PlaceholderToken() && !props.value()}>
                <div class={`${styles.Placeholder} ${PlaceholderToken()?.class}`} style={PlaceholderToken()?.style}>
                    {PlaceholderToken()?.children || ""}
                </div>
            </Show>
        </div>
    )
}
