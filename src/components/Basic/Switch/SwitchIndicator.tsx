import { createMemo, JSX, ParentComponent, useContext } from "solid-js";
import styles from './Switch.module.css';

import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { SwitchContext } from "./Switch";

interface IndicatorTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Indicator = createTokenComponent<IndicatorTokenProps>();

export const SwitchIndicator: ParentComponent<TokenComponentProps> = (props) => {
    const switchContext = useContext(SwitchContext);
    const IndicatorToken = useToken(Indicator, props.parentChildren);

    const indicatorClasses = createMemo(() => {
        const classes = [styles.Indicator];

        if (IndicatorToken()?.class) classes.push(IndicatorToken()?.class ?? '');

        if (switchContext?.checked()) {
             classes.push(styles.IndicatorChecked);
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
