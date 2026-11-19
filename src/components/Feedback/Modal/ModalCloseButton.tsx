import { ParentComponent, useContext } from "solid-js";
import type { JSX } from "@solidjs/web";
import styles from './Modal.module.scss';
import { ModalContext } from "./Modal";

interface ModalCloseButtonProps {
    style?: JSX.CSSProperties,
    class?: JSX.ClassValue,
}

const ModalCloseButton: ParentComponent<ModalCloseButtonProps> = (props) => {
    const modalContext = useContext(ModalContext);

    if (!modalContext) {
        console.error('Modal.CloseButton must be used inside a Modal component');
        return null;
    }

    return (
        <div onClick={modalContext.close} class={[styles['modal-close-button'], props.class]} style={props.style}>
            {props.children}
        </div>
    )
}

export default ModalCloseButton;