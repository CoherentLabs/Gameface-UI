import { Accessor, createMemo, ParentComponent, ParentProps } from "solid-js";
import { forwardAttrs } from "@components/BaseComponent/BaseComponent";
import type { InputControlTokenProps } from "./NumberInput";
import ArrowDownIcon from './arrow-down.svg?component-solid'
import ArrowUpIcon from './arrow-up.svg?component-solid'
import sharedStyles from '../shared/TextInput.module.scss';
import styles from './NumberInput.module.scss';

interface InputControlButtonProps {
    token: Accessor<ParentProps<InputControlTokenProps> | null | undefined>,
    click: () => void,
    orientation: 'up' | 'down',
    position: 'before' | 'after',
}

const InputControlButton: ParentComponent<InputControlButtonProps> = (props) => {
    const InputControlButtonClasses = createMemo(() => {
        const classes = [styles.button];

        classes.push(props.token()?.position === 'before' ? sharedStyles.before : sharedStyles.after);
        classes.push(props.token()?.class ?? '');

        return classes.join(' ');
    });

    return (
        <div 
            class={InputControlButtonClasses()} 
            style={props.token()?.style} 
            onclick={props.click}
            use:forwardAttrs={props.token()}>
            {props.token()?.children || (props.orientation === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon /> )}
        </div>
    )
}

export default InputControlButton