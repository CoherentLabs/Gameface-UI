import { JSX, ParentComponent, useContext } from "solid-js";
import styles from './Checkbox.module.scss';

import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { CheckboxContext } from "./Checkbox";

interface IndicatorTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Indicator = createTokenComponent<IndicatorTokenProps>();

export const CheckboxIndicator: ParentComponent<TokenComponentProps> = (props) => {
    const checkboxContext = useContext(CheckboxContext);
    const IndicatorToken = useToken(Indicator, props.parentChildren);

    return (
        <div
            class={`${styles.indicator} ${checkboxContext?.checked() ? styles.checked : ''} ${IndicatorToken()?.class || ''}`}
            style={IndicatorToken()?.style || {}}>
            {IndicatorToken()?.children}
        </div>
    )
}
