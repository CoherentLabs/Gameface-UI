import { ParentComponent } from "solid-js";
import styles from './RoundedButton.module.css';
import Button, { ButtonProps } from "../Button/Button";

const RoundedButton: ParentComponent<ButtonProps> = (props) => {
    props.class = props.class ? `${styles.RoundedButton} ${props.class}` : styles.RoundedButton;

    return <Button {...props}></Button>
}

export default RoundedButton;