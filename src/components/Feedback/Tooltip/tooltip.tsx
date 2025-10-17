import { createMemo, createSignal, JSX, onCleanup, onMount, ParentComponent, Show, splitProps } from "solid-js";
import styles from './Tooltip.module.scss';
import { BaseComponentRef } from "@components/types/ComponentProps";

export interface TooltipRef extends BaseComponentRef {
    show: () => void,
    hide: () => void
}

interface TooltipOptions<T extends Record<string, any> = { message: string }> {
    content?: (props: T) => JSX.Element
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
    action?: 'hover' | 'click' | 'focus' | 'none'
}

const DEFAULT_TIP_POSITION = 'bottom';
const createTooltip = <T extends Record<string, any> = { message: string }>(options: TooltipOptions<T> = {}): ParentComponent<T & { style?: JSX.CSSProperties, class?: string, ref?: TooltipRef}> => {
    const defaultOptions: TooltipOptions<T> = {
        content: (props) => <div class={styles['tooltip-message']}>{props.message}</div>,
        position: DEFAULT_TIP_POSITION,
        action: 'hover',
    }

    options = { ...defaultOptions, ...options } as TooltipOptions<T>;

    return (props) => {
        const [visible, setVisible] = createSignal(false);
        let tooltipChildrenRef!: HTMLDivElement;
        let tooltipRef!: HTMLDivElement;
        let wrapperRef: HTMLDivElement | undefined;
        const [others, contentProps] = splitProps(props, ['style', 'class', 'ref']);

        const toggleEventListeners = (on = true) => {
            const method = on ? 'addEventListener' : 'removeEventListener';

            if (options.action === 'none') return showTooltip();

            if (!tooltipChildrenRef) return;
            if (options.action === 'click') tooltipChildrenRef[method]('click', toggleTooltip);
            if (options.action === 'hover') {
                tooltipChildrenRef[method]('mouseenter', showTooltip);
                tooltipChildrenRef[method]('mouseleave', hideTooltip);
            }
            if (options.action === 'focus') {
                tooltipChildrenRef[method]('focusin', showTooltip);
                tooltipChildrenRef[method]('focusout', hideTooltip);
            }
        }

        onMount(() => {
            toggleEventListeners(true);

            if (!others.ref || !wrapperRef) return;

            (others.ref as (ref: TooltipRef) => void)({
                element: wrapperRef,
                show: showTooltip,
                hide: hideTooltip,
            });
        });

        onCleanup(() => {
            toggleEventListeners(false);
        })

        const toggleTooltip = () => {
            if (visible()) hideTooltip();
            else showTooltip();
        }

        const showTooltip = () => {
            setVisible(true);
        }

        const hideTooltip = () => {
            setVisible(false);
        }

        const calculateAutoPosition = (currentPosition: string) => {
            if (!tooltipRef) return DEFAULT_TIP_POSITION;

            const rect = tooltipRef.getBoundingClientRect();
            const overflows = {
                top: rect.top < 0,
                left: rect.left < 0,
                bottom: rect.bottom > (window.innerHeight || document.documentElement.clientHeight),
                right: rect.right > (window.innerWidth || document.documentElement.clientWidth)
            };

            let position = currentPosition || DEFAULT_TIP_POSITION;
            if (overflows.top && !overflows.bottom) position = 'bottom';
            if (overflows.left && !overflows.right) position = 'right';
            if (overflows.right && !overflows.left) position = 'left';
            if (overflows.bottom && !overflows.top) position = 'top';

            return position;
        }

        const tooltipPosition = createMemo((prev) => {
            if (!visible()) return prev || DEFAULT_TIP_POSITION;

            if (options.position === 'auto') {
                return calculateAutoPosition(prev as string);
            }

            return options.position || DEFAULT_TIP_POSITION;
        });

        const tooltipClasses = createMemo(() => {
            const classes = [styles['tooltip']];

            if (visible()) classes.push(styles['tooltip-visible']);
            classes.push(styles[`tooltip-${tooltipPosition()}`]);
            return classes.join(' ');
        });

        const tooltipWrapperClasses = createMemo(() => {
            const classes = [styles['tooltip-wrapper']];
            if (others.class) classes.push(others.class);
            return classes.join(' ');
        });

        return (
            <div class={tooltipWrapperClasses()} style={others.style} ref={wrapperRef}>
                <Show when={options.action !== 'none'} fallback={props.children}>
                    <div ref={tooltipChildrenRef}>
                        {props.children}
                    </div>
                </Show>
                <div ref={tooltipRef} class={tooltipClasses()}>
                    {options.content?.(contentProps as T)}
                </div>
            </div>
        );
    }
}

export default createTooltip;