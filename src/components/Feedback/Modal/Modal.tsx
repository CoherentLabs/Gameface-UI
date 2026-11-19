import { ParentComponent, Show, createContext, createSignal, untrack } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import { Portal } from "@solidjs/web"
import styles from './Modal.module.scss';
import ModalWindow, { Window } from "./ModalWindow";
import ModalCloseButton from "./ModalCloseButton";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

export interface ModalProps extends ComponentProps {
    open?: boolean;
    onOpen?: () => void,
    onClose?: () => void,
}

interface ModalContextProps {
    close: () => void;
}

// `null` default: Modal.Close reads it optionally (pattern 1.3.o).
export const ModalContext = createContext<ModalContextProps | null>(null);

export interface ModalRef {
    element: HTMLDivElement;
    close: () => void;
    open: () => void;
    isOpen: () => boolean;
}

export const Overlay = createTokenComponent<TokenBase>();

const Modal: ParentComponent<ModalProps> = (props) => {
    const OverlayToken = useToken(Overlay, () => props.children);

    // Initial value only, as in 1.x.
    const [isOpen, setIsOpen] = createSignal(untrack(() => props.open ?? false));

    const stealMouseEvents = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const open = () => {
        setIsOpen(true);
        
        window.addEventListener('mousedown', stealMouseEvents, true);
        window.addEventListener('mousemove', stealMouseEvents, true);
        window.addEventListener('mouseup', stealMouseEvents, true);
        props.onOpen?.();
    }

    const close = () => {
        setIsOpen(false);
        window.removeEventListener('mousedown', stealMouseEvents, true);
        window.removeEventListener('mousemove', stealMouseEvents, true);
        window.removeEventListener('mouseup', stealMouseEvents, true);
        props.onClose?.();
    }

    return (
        <ModalContext value={{ close }}>
            <Portal>
                <div
                    class={[styles['modal'], isOpen() && styles['modal-open'], props.class]}
                    style={props.style}
                    ref={[
                        exposeRef<Omit<ModalRef, 'element'>>(props, { close, open, isOpen }),
                        baseComponent(props),
                        navigationActions({ anchor: props.anchor, ...props.onAction }),
                    ]}>
                    <Show when={isOpen()}>
                        <Show when={OverlayToken()}>
                            <div
                                onMouseDown={stealMouseEvents}
                                onMouseMove={stealMouseEvents}
                                onMouseUp={stealMouseEvents}
                                onClick={close}
                                class={[styles['modal-overlay'], OverlayToken()?.class]}
                                style={OverlayToken()?.style}></div>
                        </Show>
                        <ModalWindow parentChildren={props.children}></ModalWindow>
                    </Show>
                </div>
            </Portal>
        </ModalContext>
    )
}

export default Object.assign(Modal, { Window, Overlay, Close: ModalCloseButton });