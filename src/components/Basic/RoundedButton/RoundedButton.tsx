import { ParentComponent } from "solid-js";
import styles from './RoundedButton.module.scss';
import Button, { ButtonProps } from "../Button/Button";

const RoundedButton: ParentComponent<ButtonProps> = (props) => {
    return <Button {...props} class={[styles['rounded-button'], props.class]}></Button>
}

export default RoundedButton;
