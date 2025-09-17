import { onMount, onCleanup } from 'solid-js';
import useToast from '@components//Feedback/Toast/toast';
import Tab from '@components/Layout/Tab/Tab';
import './ToastTest.css';

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
}

const ToasterTest = () => {
    const [Toaster, createToast] = useToast();

    const setupToast = (event: Event) => {
        const { detail } = event as CustomEvent<ToastEventDetail>;
        createToast({
            position: detail.position || 'top-right',
            body: (close, progress) => {
                return (
                    <div class="gf-toast">
                        <div class="gf-toast-text">{detail.text || 'Default Toast'}</div>
                        {close(<button class="gf-toast-close-button">X</button>)}
                        <div
                            class="gf-toast-progress"
                            style={{
                                width: `${progress() * 5}%`,
                                'background-color': 'red',
                                height: '4px',
                                'margin-top': '8px',
                            }}
                        ></div>
                    </div>
                );
            },
            timeout: detail.timeout || 3000,
        });
    };

    onMount(() => {
        document.addEventListener('create-toast', setupToast as EventListener);
    });

    onCleanup(() => {
        document.removeEventListener('create-toast', setupToast as EventListener);
    });

    return (
        <Tab location="toaster">
            <Toaster />
        </Tab>
    );
};

export default ToasterTest;
