import { ParentComponent, Show, createContext, createMemo, createSignal, onMount } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import { Portal } from "solid-js/web"
import styles from './Modal.module.scss';
import ModalWindow, { Window } from "./ModalWindow";
import ModalCloseButton from "./ModalCloseButton";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";

export interface ModalProps extends ComponentProps {
    open?: boolean;
    onOpen?: () => void,
    onClose?: () => void,
}

interface ModalContextProps {
    close: () => void;
}

export const ModalContext = createContext<ModalContextProps>();

export interface ModalRef {
    element: HTMLDivElement;
    close: () => void;
    open: () => void;
    isOpen: () => boolean;
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

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            element,
            close,
            open,
            isOpen
        });
    });

    return (
        <ModalContext.Provider value={{ close }}>
            <Portal>
                <div
                    ref={element}
                    use:baseComponent={props}
                    use:navigationActions={{anchor: props.anchor, ...props.onAction }}>
                    <Show when={isOpen()}>
                        {OverlayToken?.() && (
                            <div 
                                onMouseDown={stealMouseEvents}
                                onMouseMove={stealMouseEvents}
                                onMouseUp={stealMouseEvents}
                                onClick={close} 
                                class={modalOverlayClasses()} 
                                style={OverlayToken?.()?.style}></div>
                        )}
                        <ModalWindow parentChildren={props.children}></ModalWindow>
                    </Show>
                </div>
            </Portal>
        </ModalContext.Provider>
    )
}

export default Object.assign(Modal, { Window, Overlay, Close: ModalCloseButton });