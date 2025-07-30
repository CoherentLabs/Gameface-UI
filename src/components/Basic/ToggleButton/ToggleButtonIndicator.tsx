import { createMemo, JSX, ParentComponent, useContext } from "solid-js";
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
    const IndicatorToken = useToken(Indicator, props.parentChildren);

    const indicatorClasses = createMemo(() => {
        const classes = [styles.indicator];

        if (IndicatorToken()?.class) classes.push(IndicatorToken()?.class ?? '');

        if (toggleButtonContext?.checked()) {
             classes.push(styles['indicator-checked']);
        }

        return classes.join(' ');
    });

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
