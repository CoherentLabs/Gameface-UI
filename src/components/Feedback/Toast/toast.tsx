import { Portal } from 'solid-js/web';
import {
    Accessor,
    createContext,
    createSignal,
    createUniqueId,
    For,
    JSX,
    onCleanup,
    ParentComponent,
    Setter,
    Signal,
    useContext,
} from 'solid-js';
import GridTile from '@components/Layout/GridTile/GridTile';
import Grid from '@components/Layout/Grid/Grid';
import Flex from '@components/Layout/Flex/Flex';
import { waitForCssExit } from '@components/utils/waitForCssExit';

import styles from './toast.module.scss';

/** How many times `progress` updates over a toast's lifetime. */
const PROGRESS_STEPS = 20;
/** Default cap for how long a toast may wait for its hide animation. */
const DEFAULT_HIDE_TIMEOUT = 1000;

const GRID_SIZE = 3; // 3x3 grid

const positions = [
    'top-left',
    'top-center',
    'top-right',
    'middle-left',
    'middle-center',
    'middle-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
] as const;

export type Position = (typeof positions)[number];
/**
 * @param close wraps an element so clicking it removes the toast
 * @param progress time left, from 1 (just shown) to 0 (timed out). Always 1 for toasts without a timeout
 * @param dismiss removes the toast
 */
export type ToastBody = (
    close: (children: JSX.Element) => JSX.Element,
    progress: Accessor<number>,
    dismiss: () => void
) => JSX.Element;

export interface ToastOptions {
    position: Position;
    body: ToastBody;
    timeout?: number; // in milliseconds, 0 means no timeout
}

export interface UseToastOptions {
    /** Most toasts shown at once per position; above it the oldest is removed. A number applies to every position. */
    max?: number | Partial<Record<Position, number>>;
    /** Longest time (ms) a toast waits for its hide animation before it is removed anyway. Default 1000 */
    hideTimeout?: number;
}

export interface ToastHandle {
    id: string;
    /** Removes the toast, after its hide animation */
    dismiss: () => void;
}

export interface ToastItemApi {
    /**
     * Registers work that has to finish before the toast is removed, e.g. a hide animation.
     * The toast is removed when every registered function has resolved, or after `hideTimeout`.
     * Returns a function that unregisters it.
     */
    onHide: (fn: () => Promise<void> | void) => () => void;
    /** True while the toast is hiding */
    leaving: Accessor<boolean>;
    progress: Accessor<number>;
    dismiss: () => void;
}

const ToastItemContext = createContext<ToastItemApi>();

/** Gives anything inside a toast's body access to its toast: hide hooks, progress, dismiss. */
export const useToastItem = () => useContext(ToastItemContext);

interface ToastItem {
    id: string;
    position: Position;
    body: ToastBody;
    progress: Accessor<number>;
    setProgress: Setter<number>;
    leaving: Accessor<boolean>;
    setLeaving: Setter<boolean>;
    hideHooks: Set<() => Promise<void> | void>;
    timerID?: ReturnType<typeof setInterval>;
    /** Stops waiting for the CSS hide animation. */
    cancelCssExit?: () => void;
    element?: HTMLDivElement;
}

const useToast = (options: UseToastOptions = {}): [ParentComponent, (options: ToastOptions) => ToastHandle] => {
    const hideTimeout = options.hideTimeout ?? DEFAULT_HIDE_TIMEOUT;

    const grid: Record<Position, Signal<ToastItem[]>> = Object.fromEntries(
        positions.map((pos) => [pos, createSignal<ToastItem[]>([])])
    ) as any;

    const maxFor = (position: Position): number | undefined => {
        const max = options.max;
        if (max === undefined) return undefined;
        return typeof max === 'number' ? max : max[position];
    };

    function createToast(toastOptions: ToastOptions): ToastHandle {
        const { position, body, timeout = 0 } = toastOptions;
        const [progress, setProgress] = createSignal(1);
        const [leaving, setLeaving] = createSignal(false);
        const item: ToastItem = {
            id: createUniqueId(),
            position,
            body,
            progress,
            setProgress,
            leaving,
            setLeaving,
            hideHooks: new Set(),
        };

        const [getItems, setItems] = grid[position];
        setItems((prev) => [...prev, item]);

        const max = maxFor(position);
        if (max !== undefined && max >= 0) {
            // Toasts already hiding don't count; the oldest visible ones go first.
            const visible = getItems().filter((other) => !other.leaving());
            for (let i = 0; i < visible.length - max; i++) hide(visible[i]);
        }

        if (timeout > 0) {
            // Progress comes from elapsed time, not from counting ticks: Gameface
            // runs timers at most once per frame, so short intervals fire less
            // often than requested and a tick count would outlast `timeout`.
            const start = performance.now();
            item.timerID = setInterval(() => {
                const left = 1 - (performance.now() - start) / timeout;
                if (left <= 0) {
                    setProgress(0);
                    hide(item);
                } else {
                    setProgress(left);
                }
            }, timeout / PROGRESS_STEPS);
        }

        return { id: item.id, dismiss: () => hide(item) };
    }

    /** Stops the toast's timer and its wait for a CSS hide animation. */
    function stopTimer(item: ToastItem) {
        if (item.timerID !== undefined) {
            clearInterval(item.timerID);
            item.timerID = undefined;
        }
        item.cancelCssExit?.();
        item.cancelCssExit = undefined;
    }

    function removeItem(item: ToastItem) {
        stopTimer(item);
        const [_, setItems] = grid[item.position];
        setItems((prev) => prev.filter((other) => other !== item));
    }

    /** Marks the toast as leaving, waits for its hide animation, then removes it. */
    function hide(item: ToastItem) {
        if (item.leaving()) return;
        stopTimer(item);
        // Started before the leaving class is applied, so no animationstart is missed.
        // Animations on the toast's body count too, not only on its wrapper.
        const cssExit = item.element ? waitForCssExit([item.element], { subtree: true }) : undefined;
        item.cancelCssExit = cssExit?.cancel;
        item.setLeaving(true);

        const waits: Promise<void>[] = [...item.hideHooks].map((fn) =>
            Promise.resolve()
                .then(fn)
                .catch((error) => console.error('Toast hide hook failed', error))
        );
        if (cssExit) waits.push(cssExit.promise);

        if (waits.length === 0) return removeItem(item);

        let removed = false;
        const remove = () => {
            if (removed) return;
            removed = true;
            clearTimeout(cap);
            removeItem(item);
        };
        const cap = setTimeout(remove, hideTimeout);
        Promise.all(waits).then(remove);
    }

    const Toaster: ParentComponent = () => {
        onCleanup(() => {
            for (const pos of positions) {
                const [getItems, setItems] = grid[pos];
                getItems().forEach(stopTimer);
                setItems([]);
            }
        });

        const flexItems = (number: number): 'start' | 'center' | 'end' => {
            switch (number) {
                case 0:
                    return 'start';
                case 1:
                    return 'center';
                case 2:
                    return 'end';
                default:
                    return 'start';
            }
        };

        const direction = (row: number) => {
            return row === 2 ? 'column-reverse' : 'column';
        };

        // The bottom row is column-reverse, where the flex start is the bottom
        // edge - so 'start' (not 'end') keeps bottom toasts at the screen's
        // bottom, with newer ones stacking upward.
        const justify = (row: number) => (row === 2 ? 'start' : flexItems(row));

        return (
            <Portal mount={document.querySelector('#root')!}>
                <Grid
                    class={styles['toast-grid']}
                    cols={GRID_SIZE}
                    rows={GRID_SIZE}
                >
                    <For each={positions}>
                        {(pos, index) => {
                            const [getter] = grid[pos];
                            return (
                                <GridTile row={Math.floor(index() / GRID_SIZE) + 1} col={(index() % GRID_SIZE) + 1}>
                                    <Flex
                                        justify-content={justify(Math.floor(index() / GRID_SIZE))}
                                        align-items={flexItems(index() % GRID_SIZE)}
                                        direction={direction(Math.floor(index() / GRID_SIZE))}
                                        style={{ height: '100%' }}
                                    >
                                        <For each={getter()}>
                                            {(item) => {
                                                const dismiss = () => hide(item);
                                                const api: ToastItemApi = {
                                                    onHide: (fn) => {
                                                        item.hideHooks.add(fn);
                                                        return () => item.hideHooks.delete(fn);
                                                    },
                                                    leaving: item.leaving,
                                                    progress: item.progress,
                                                    dismiss,
                                                };
                                                return (
                                                    <div
                                                        ref={(el) => (item.element = el)}
                                                        class={`${styles['toast-item']}${item.leaving() ? ' toast-leaving' : ''}`}
                                                        data-toast-state={item.leaving() ? 'leaving' : 'shown'}
                                                    >
                                                        <ToastItemContext.Provider value={api}>
                                                            {item.body(
                                                                (children: JSX.Element) => (
                                                                    <Close dismiss={dismiss}>{children}</Close>
                                                                ),
                                                                item.progress,
                                                                dismiss
                                                            )}
                                                        </ToastItemContext.Provider>
                                                    </div>
                                                );
                                            }}
                                        </For>
                                    </Flex>
                                </GridTile>
                            );
                        }}
                    </For>
                </Grid>
            </Portal>
        );
    };

    interface CloseProps {
        dismiss: () => void;
        children?: JSX.Element;
    }

    const Close: ParentComponent<CloseProps> = (props) => {
        return <div onClick={props.dismiss}>{props.children}</div>;
    };

    return [Toaster, createToast];
};

export default useToast;
