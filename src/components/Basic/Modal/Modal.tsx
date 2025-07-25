import { ParentComponent, Show, createContext, createMemo, createSignal, onMount } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import useBaseComponent from "../../BaseComponent/BaseComponent";
import { Portal } from "solid-js/web"
import styles from './Modal.module.css';
import ModalWindow, { Window } from "./ModalWindow";
import ModalCloseButton from "./ModalCloseButton";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";

export interface ModalProps extends ComponentProps {
    open?: boolean;
}

interface ModalContextProps {
    close: () => void;
}

export const ModalContext = createContext<ModalContextProps>();

export interface ModalRef {
    element: HTMLDivElement;
    close: () => void;
    open: () => void;
}

export const Overlay = createTokenComponent<TokenBase>();

const Modal: ParentComponent<ModalProps> = (props) => {
    let element!: HTMLDivElement;
    const OverlayToken = useToken(Overlay, props.children);

    const [isOpen, setIsOpen] = createSignal(props.open);

    const modalClasses = createMemo(() => {
        const classes = [styles['modal']];

        if (isOpen()) {
            classes.push(styles['modal-open']);
        }

        return classes.join(' ');
    });

    const modalOverlayClasses = createMemo(() => {
        const classes = [styles['modal-overlay']];

        if (OverlayToken?.()?.class) classes.push(OverlayToken?.()?.class as string);

        return classes.join(' ');
    });

    props.componentClasses = () => modalClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const open = () => {
        setIsOpen(true);
    }

    const close = () => {
        setIsOpen(false);
    }

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            element,
            close,
            open
        });
    });

    return (
        <ModalContext.Provider value={{ close }}>
            <Portal>
                <div
                    ref={element}
                    class={className()}
                    style={inlineStyles()}
                    use:forwardEvents={props}
                    use:forwardAttrs={props}>
                    <Show when={isOpen()}>
                        <Show when={OverlayToken?.()}>
                            <div onClick={close} class={modalOverlayClasses()} style={OverlayToken?.()?.style}></div>
                        </Show>
                        <ModalWindow parentChildren={props.children}></ModalWindow>
                    </Show>
                </div>
            </Portal>
        </ModalContext.Provider>
    )
}

export default Object.assign(Modal, { Window, Overlay, Close: ModalCloseButton });