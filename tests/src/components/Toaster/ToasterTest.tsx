import { createSignal, onMount, onCleanup } from 'solid-js';
import useToast, { useToastItem } from '@components/Feedback/Toast/toast';
import './ToastTest.css';

import classes from '../../../shared/toast-selectors.json';

// Keep in sync with tests/specs/toast.spec.js
/** Position with a max count, for the max count tests */
const MAX_POSITION = 'bottom-left';
const MAX_COUNT = 2;
/** Cap on the hide wait, for the hide timeout test */
const HIDE_TIMEOUT = 1500;

interface ToastEventDetail {
    position?:
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
        | 'top-center'
        | 'bottom-center'
        | 'middle-left'
        | 'middle-right'
        | 'middle-center';
    text?: string;
    timeout?: number;
    /** ms the toast's hide hook takes; -1 = never resolves */
    hideDelay?: number;
    /** Hide with a CSS animation started by `.toast-leaving` */
    cssExit?: boolean;
    /** Adds a button that counts its clicks */
    withAction?: boolean;
}

/** Registers a hide hook on its toast, like a hide animation would */
const HideHook = (props: { delay: number }) => {
    const toast = useToastItem();
    toast?.onHide(() => props.delay < 0
        ? new Promise<void>(() => {})
        : new Promise<void>((resolve) => setTimeout(resolve, props.delay)));
    return null;
};

const ToasterTest = () => {
    const [Toaster, createToast] = useToast({ max: { [MAX_POSITION]: MAX_COUNT }, hideTimeout: HIDE_TIMEOUT });
    // Kept outside the toast, so it can still be read after the toast is removed
    const [actionClicks, setActionClicks] = createSignal(0);

    const setupToast = (event: Event) => {
        const { detail } = event as CustomEvent<ToastEventDetail>;
        if (detail.withAction) setActionClicks(0);
        createToast({
            position: detail.position || 'top-right',
            body: (close, progress) => {
                return (
                    <div class={`${classes.toast}${detail.cssExit ? ` ${classes.toastCssExit}` : ''}`}>
                        <div class={classes.toastText}>{detail.text || 'Default Toast'}</div>
                        {close(<button class={classes.toastCloseButton}>X</button>)}
                        {detail.withAction && (
                            <button
                                class={classes.toastActionButton}
                                onClick={() => setActionClicks(actionClicks() + 1)}
                            >
                                Action
                            </button>
                        )}
                        {detail.hideDelay !== undefined && <HideHook delay={detail.hideDelay} />}
                        <div
                            class={classes.toastProgress}
                            data-progress={progress()}
                            style={{
                                width: `${progress() * 100}%`,
                                'background-color': 'red',
                                height: '4px',
                                'margin-top': '8px',
                            }}
                        ></div>
                    </div>
                );
            },
            timeout: detail.timeout ?? 3000,
        });
    };

    onMount(() => {
        document.addEventListener('create-toast', setupToast as EventListener);
    });

    onCleanup(() => {
        document.removeEventListener('create-toast', setupToast as EventListener);
    });

    return (
        <>
            <div class={classes.toastActionClicks} data-clicks={actionClicks()} />
            <Toaster />
        </>
    );
};

export default ToasterTest;
