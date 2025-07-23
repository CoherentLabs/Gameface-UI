import { createMemo, ParentComponent } from "solid-js";
import ArrowDownIcon from './arrow-down.svg?component-solid'
import ArrowUpIcon from './arrow-up.svg?component-solid'
import styles from './NumberInput.module.css';
import baseStyles from '../InputBase/InputBase.module.css';

interface InputControlButtonProps {
    token: () => any,
    click: () => void,
    orientation: 'up' | 'down',
    position: 'before' | 'after',
}

const InputControlButton: ParentComponent<InputControlButtonProps> = (props) => {
    const InputControlButtonClasses = createMemo(() => {
        const classes = [styles.Button];

        classes.push(props.token()?.position === 'before' ? baseStyles.Before : baseStyles.After);
        classes.push(props.token()?.class ?? '');

        return classes.join(' ');
    });

    return (
        <div 
            class={InputControlButtonClasses()} 
            style={props.token()?.style} 
            onclick={props.click}>
            {props.token()?.children || (props.orientation === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon /> )}
        </div>
    )
}

export default InputControlButton