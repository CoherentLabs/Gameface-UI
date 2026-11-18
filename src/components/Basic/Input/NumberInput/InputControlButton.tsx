import { ParentComponent } from "solid-js";
import ArrowDownIcon from './arrow-down.svg?component-solid'
import ArrowUpIcon from './arrow-up.svg?component-solid'
import sharedStyles from '../shared/TextInput.module.scss';
import styles from './NumberInput.module.scss';

interface InputControlButtonProps {
    token: () => any,
    click: () => void,
    orientation: 'up' | 'down',
    position: 'before' | 'after',
}

const InputControlButton: ParentComponent<InputControlButtonProps> = (props) => {
    const InputControlButtonClasses = () => [
        styles.button,
        props.token()?.position === 'before' ? sharedStyles.before : sharedStyles.after,
        props.token()?.class,
    ];

    return (
        <div 
            class={InputControlButtonClasses()} 
            style={props.token()?.style} 
            onClick={() => props.click()}>
            {props.token()?.children || (props.orientation === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon /> )}
        </div>
    )
}

export default InputControlButton