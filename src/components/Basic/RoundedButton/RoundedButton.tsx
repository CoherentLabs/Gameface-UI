import { ParentComponent } from "solid-js";
import styles from './RoundedButton.module.scss';
import Button, { ButtonProps } from "../Button/Button";

const RoundedButton: ParentComponent<ButtonProps> = (props) => {
    props.class = props.class ? `${styles['rounded-button']} ${props.class}` : styles['rounded-button'];

    return <Button {...props}></Button>
}

export default RoundedButton;