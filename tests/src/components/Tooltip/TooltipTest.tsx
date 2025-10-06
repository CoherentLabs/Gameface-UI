import Tab from "@components/Layout/Tab/Tab";
import { createSignal, JSX, onCleanup, onMount } from "solid-js";
import './tooltip.css';
import selectors from "../../../shared/tooltip-selectors.json";
import createTooltip from "@components/Feedback/Tooltip/tooltip";
interface TooltipEventDetail {
    customContent?: string
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
    action?: 'hover' | 'click' | 'focus'
    wrapperStyle?: JSX.CSSProperties
}
const TooltipTest = () => {
    const [Tooltip, setTooltip] = createSignal({ TipWrapper: createTooltip({ action: 'focus' }), tipMessage: 'Tooltip message', wrapperStyle: {} as JSX.CSSProperties });

    const setupTooltip = (event: Event) => {
        const { detail } = event as CustomEvent<TooltipEventDetail>;
        setTooltip({
            TipWrapper: createTooltip({
                content: detail.customContent ? (props) => <div class={selectors.tooltipMessage}>{props.message}</div> : undefined,
                position: detail.position || 'bottom',
                action: detail.action || 'hover'
            }),
            tipMessage: detail.customContent || 'Tooltip message',
            wrapperStyle: detail.wrapperStyle || {}
        })
    };

    onMount(() => document.addEventListener('create-tooltip', setupTooltip as EventListener));
    onCleanup(() => document.removeEventListener('create-tooltip', setupTooltip as EventListener));

    return (
        <Tab style={{ position: 'relative', flex: '1 0 0' }} location='tooltip'>
            {Tooltip().TipWrapper({
                children: <div tabIndex={1} class={selectors.element}>Test</div>,
                message: Tooltip().tipMessage ? Tooltip().tipMessage : 'Tooltip message',
                style: Tooltip().wrapperStyle,
                class: selectors.tooltipWrapper
            })}
        </Tab>
    )
}

export default TooltipTest;