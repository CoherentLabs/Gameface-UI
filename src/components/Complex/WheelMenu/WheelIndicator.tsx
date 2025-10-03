import { createMemo, JSX, ParentComponent, Show, useContext } from "solid-js";
import { TokenComponentProps } from "@components/types/ComponentProps";
import styles from './WheelMenu.module.scss';
import { Icon, Indicator, WheelMenuContext } from "./WheelMenu";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import Absolute from "@components/Layout/Absolute/Absolute";

interface WheelIndicatorProps extends TokenComponentProps {
}
const WheelIndicator: ParentComponent<WheelIndicatorProps> = (props) => {
    const IndicatorToken = useToken(Indicator, props.parentChildren);
    const IconToken = useToken(Icon, IndicatorToken()?.children);
    
    const context = useContext(WheelMenuContext);
    if (!context) {
        console.error('Wheel.Indicator must be used inside a WheelMenu component');
        return null;
    }

    const IndicatorClasses = createMemo(() => {
        const classes = [styles['wheel-indicator']];
        classes.push(IndicatorToken()?.class ?? "");

        return classes.join(' ');
    })

    const IndicatorStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {
            "clip-path": context.clipPathValue(),
        };

        if (IndicatorToken()?.style) {
            Object.assign(styles, IndicatorToken()?.style);
        }

        return styles;
    });

    return (
        <Show when={IndicatorToken()}>
            <div class={styles['wheel-indicator-wrapper']} style={{transform: `rotate(${context.rotation()}deg)`}}>
                <div class={IndicatorClasses()} style={IndicatorStyles()}></div>
                <Show when={IconToken()}>
                    {IconToken()?.children ? 
                    <Absolute class={IconToken()?.class ?? ""} style={IconToken()?.style}>{IconToken()?.children}</Absolute> :
                    <div class={`${IconToken()?.class ?? ""} ${styles['wheel-indicator-icon']}`} style={IconToken()?.style}></div>}
                </Show>
            </div>
        </Show>
    )
}

export default WheelIndicator;