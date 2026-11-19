import { createMemo, createSignal, omit, onSettled, ParentComponent, Show } from "solid-js";
import type { JSX } from "@solidjs/web";
import styles from './Tooltip.module.scss';
import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { getSafePosition } from "@components/utils/getSafePosition";
import { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import exposeRef from "@components/utils/exposeRef";

export interface TooltipRef extends BaseComponentRef {
    show: () => void,
    hide: () => void
}

interface TooltipOptions<T extends Record<string, any> = { message: string }> extends Pick<ComponentProps, 'onAction'> {
    content?: (props: T) => JSX.Element
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
    action?: 'hover' | 'click' | 'focus' | 'none'
}

const DEFAULT_TIP_POSITION = 'bottom';
const createTooltip = <T extends Record<string, any> = { message: string }>(options: TooltipOptions<T> = {}): ParentComponent<T & { style?: JSX.CSSProperties, class?: JSX.ClassValue, ref?: TooltipRef}> => {
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
        const contentProps = omit(props, 'style', 'class', 'ref');

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

        onSettled(() => {
            toggleEventListeners(true);
            return () => toggleEventListeners(false);
        });

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
            const position = currentPosition || DEFAULT_TIP_POSITION;
            const safePosition = getSafePosition(rect); 

            return safePosition || position;
        }

        const tooltipPosition = createMemo((prev) => {
            if (!visible()) return prev || DEFAULT_TIP_POSITION;

            if (options.position === 'auto') {
                return calculateAutoPosition(prev as string);
            }

            return options.position || DEFAULT_TIP_POSITION;
        });

        return (
            <div
                class={[styles['tooltip-wrapper'], props.class]}
                style={props.style}
                ref={exposeRef<Omit<TooltipRef, 'element'>>(props, { show: showTooltip, hide: hideTooltip })}>
                <Show when={options.action !== 'none'} fallback={props.children}>
                    <div
                        ref={[
                            (el: HTMLDivElement) => { tooltipChildrenRef = el; },
                            navigationActions(mergeNavigationActions(options as ComponentProps, {
                                'back': () => visible() && hideTooltip()
                            })),
                        ]}>
                        {props.children}
                    </div>
                </Show>
                <div ref={tooltipRef} class={[styles['tooltip'], visible() && styles['tooltip-visible'], styles[`tooltip-${tooltipPosition()}`]]}>
                    {options.content?.(contentProps as T)}
                </div>
            </div>
        );
    }
}

export default createTooltip;