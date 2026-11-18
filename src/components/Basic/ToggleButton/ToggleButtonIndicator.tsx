import { createMemo, ParentComponent, useContext } from "solid-js";
import { JSX } from "@solidjs/web";
import styles from './ToggleButton.module.scss';

import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { ToggleButtonContext } from "./ToggleButton";

interface IndicatorTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Indicator = createTokenComponent<IndicatorTokenProps>();

export const ToggleButtonIndicator: ParentComponent<TokenComponentProps> = (props) => {
    const toggleButtonContext = useContext(ToggleButtonContext);
    const IndicatorToken = useToken(Indicator, () => props.parentChildren);

    const indicatorClasses = () => [
        styles.indicator,
        IndicatorToken()?.class,
        toggleButtonContext?.checked() && styles['indicator-checked'],
    ];

    const indcatorStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {};
        Object.assign(styles, IndicatorToken()?.style || {});

        return styles;
    });

    return (
        <div
            class={indicatorClasses()}
            style={indcatorStyles()}>
            {IndicatorToken()?.children}
        </div>
    )
}
