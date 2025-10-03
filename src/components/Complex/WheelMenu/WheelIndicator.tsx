import { createMemo, JSX, ParentComponent, Show, useContext } from "solid-js";
import { TokenComponentProps } from "@components/types/ComponentProps";
import { Icon, Indicator, WheelMenuContext } from "./WheelMenu";
import { useToken } from "@components/utils/tokenComponents";
import Absolute from "@components/Layout/Absolute/Absolute";
import styles from './WheelMenu.module.scss';

const WheelIndicator: ParentComponent<TokenComponentProps> = (props) => {
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
            {/* Wrapper around the center that rotates with the mouse */}
            <div class={styles['wheel-indicator-wrapper']} style={{transform: `rotate(${context.rotation()}deg)`}}>
                {/* The indicator */}
                <div class={IndicatorClasses()} style={IndicatorStyles()}></div>
                {/* The icon inside the indicator */}
                <Show when={IconToken()}>
                    {IconToken()?.children ? (
                        // Wrapped in Absolute to center the icon inside the indicator
                        <Absolute
                            class={IconToken()?.class ?? ""}
                            style={IconToken()?.style}
                        >
                            {IconToken()?.children}
                        </Absolute>
                    ) : (
                        // No children, just render default Icon.
                        <div
                            class={`${IconToken()?.class ?? ""} ${styles['wheel-indicator-icon']}`}
                            style={IconToken()?.style}
                        />
                    )}
                </Show>
            </div>
        </Show>
    )
}

export default WheelIndicator;