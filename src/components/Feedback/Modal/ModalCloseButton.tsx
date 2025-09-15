import { JSX, ParentComponent, Show, createMemo, useContext } from "solid-js";
import styles from './Modal.module.scss';
import { ModalContext } from "./Modal";

interface ModalCloseButtonProps {
    style?: JSX.CSSProperties,
    class?: string,
}

const ModalCloseButton: ParentComponent<ModalCloseButtonProps> = (props) => {
    const modalContext = useContext(ModalContext);

    if (!modalContext) {
        console.error('Modal.CloseButton must be used inside a Modal component');
        return null;
    }

    const modalCloseButtonClasses = createMemo(() => {
        const classes = [styles['modal-close-button']];
        if (props.class) classes.push(props.class as string);
        return classes.join(' ');
    });

    return (
        <div onClick={modalContext?.close} class={modalCloseButtonClasses()} style={props.style}>
            {props.children}
        </div>
    )
}

export default ModalCloseButton;