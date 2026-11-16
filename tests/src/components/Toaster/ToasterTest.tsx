import { onMount, onCleanup } from 'solid-js';
import useToast, { useToastItem } from '@components/Feedback/Toast/toast';
import './ToastTest.css';

import classes from '../../../shared/toast-selectors.json';

// Keep in sync with tests/specs/toast.spec.js
/** Position with a max count, for the max count tests */
const MAX_POSITION = 'bottom-left';
const MAX_COUNT = 2;
/** Cap on the hide wait, for the hide timeout test */
const HIDE_TIMEOUT = 600;

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

    const setupToast = (event: Event) => {
        const { detail } = event as CustomEvent<ToastEventDetail>;
        createToast({
            position: detail.position || 'top-right',
            body: (close, progress) => {
                return (
                    <div class={classes.toast}>
                        <div class={classes.toastText}>{detail.text || 'Default Toast'}</div>
                        {close(<button class={classes.toastCloseButton}>X</button>)}
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

    return <Toaster />;
};

export default ToasterTest;
