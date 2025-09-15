import { Portal } from 'solid-js/web';
import { createSignal, createUniqueId, For, JSX, ParentComponent, Signal } from 'solid-js';
import GridTile from '@components/Layout/GridTile/GridTile';
import Grid from '@components/Layout/Grid/Grid';
import Flex from '@components/Layout/Flex/Flex';

import styles from './toast.module.scss';

const INTERVALS = 20;

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

type Position = (typeof positions)[number];

interface ToastOptions {
    position: Position;
    body: (close: (children: JSX.Element) => JSX.Element, progress: () => number) => JSX.Element;
    timeout?: number; // in milliseconds, 0 means no timeout
}

interface ToastItem {
    id: string;
    body: (close: (children: JSX.Element) => JSX.Element, progress: () => number) => JSX.Element;
    progress: number;
}

const useToast = (): [ParentComponent, (options: ToastOptions) => void] => {
    
    const grid: Record<Position, Signal<ToastItem[]>> = Object.fromEntries(
        positions.map((pos) => [pos, createSignal<ToastItem[]>([])])
    ) as any;

    const [timers, setTimers] = createSignal<Record<string, number>>({});

    function createToast(options: ToastOptions) {
        const { position, body, timeout = 0 } = options;
        const id = createUniqueId(); // generate unique id
    
        const [_, addToast] = grid[position];

        addToast((prev) => {
            const newGrid = [
                ...prev,
                {
                    id,
                    body: (close: (children: JSX.Element) => JSX.Element, progress: () => number) =>
                        body(close, progress),
                    progress: 0,
                },
            ];
            return newGrid;
        });
    
        if (timeout > 0) {
            const timerID = setInterval(() => {
                setTimers((prev) => {
                    const next = { ...prev }; // copy
                    if (next[id] >= INTERVALS) {
                        removeItem(position, id);
                        clearInterval(timerID);
                        delete next[id];
                    } else {
                        next[id] = (next[id] ?? 0) + 1;
                    }
                    return next;
                });
            }, timeout / INTERVALS);
            setTimers((prev) => ({ ...prev, [id]: 0 }));
        }
    }

    // Remove item by index
    function removeItem(position: Position, id: string) {
        const [_, removeToast] = grid[position];

        removeToast((prev) => prev.filter((item) => item.id !== id));
    }

    const Toaster: ParentComponent = () => {
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
                                        justify-content={flexItems(Math.floor(index() / GRID_SIZE))}
                                        align-items={flexItems(index() % GRID_SIZE)}
                                        direction={direction(Math.floor(index() / GRID_SIZE))}
                                        style={{ height: '100%' }}
                                    >
                                        <For each={getter()}>
                                            {(item) => {
                                                return (
                                                    <div class={styles['toast-item']}>
                                                        {item.body(
                                                            (children: JSX.Element) => (
                                                                <Close position={pos} id={item.id}>
                                                                    {children}
                                                                </Close>
                                                            ),
                                                            () => timers()[item.id]
                                                        )}
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
        position: Position;
        id: string;
        children?: JSX.Element;
    }

    const Close: ParentComponent<CloseProps> = (props) => {
        const handleClose = () => {
            removeItem(props.position, props.id);
        };

        return <div onClick={handleClose}>{props.children}</div>;
    };

    return [Toaster, createToast];
};

export default useToast;
