import { Portal } from 'solid-js/web';
import GridTile from '@components/Layout/GridTile/GridTile';
import Grid from '@components/Layout/Grid/Grid';
import { createSignal, For, JSX, ParentComponent } from 'solid-js';
import Flex from '@components/Layout/Flex/Flex';

const INTERVALS = 20;

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

const useToast = (): [ParentComponent, (options: ToastOptions) => void] => {
    
    const grid: Record<Position, ReturnType<typeof createSignal<any[]>>> = Object.fromEntries(
        positions.map((pos) => [pos, createSignal<any[]>([])])
    ) as any;

    const [timers, setTimers] = createSignal<Record<string, any>>({});

    function createToast(options: ToastOptions) {
        const { position, body, timeout = 0 } = options;
        const id = Math.random().toString(36).substr(2, 9); // generate unique id
    
        const [_, setter] = grid[position];
    
        setter((prev) => {
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
        const [_, setter] = grid[position];

        setter((prev) => {
            const newGrid = [...prev];
            return newGrid.filter((item) => item.id !== id);
        });
    }

    const Toast: ParentComponent = () => {
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
                    style={{
                        width: '100vw',
                        height: '100vh',
                        position: 'absolute',
                        'z-index': 9999,
                        'pointer-events': 'none',
                    }}
                    cols={3}
                    rows={3}
                >
                    <For each={positions}>
                        {(pos, index) => {
                            const [getter] = grid[pos];
                            return (
                                <GridTile row={Math.floor(index() / 3) + 1} col={(index() % 3) + 1}>
                                    <Flex
                                        justify-content={flexItems(Math.floor(index() / 3))}
                                        align-items={flexItems(index() % 3)}
                                        direction={direction(Math.floor(index() / 3))}
                                        style={{ height: '100%' }}
                                    >
                                        <For each={getter()}>
                                            {(item) => {
                                                return (
                                                    <div class="toast-item" style={{ 'pointer-events': 'auto' }}>
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

    return [Toast, createToast];
};

export default useToast;
