import { ParentComponent } from "solid-js";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { clampProgress, ProgressProps } from "./Progress";
import styles from './Progress.module.scss';
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

const Fill = createTokenComponent<TokenBase>();
const ProgressBar: ParentComponent<ProgressProps> = (props) => {
    const fillToken = useToken(Fill, () => props.children)

    return (
        <div
            class={[styles.bar, props.class]}
            style={props.style}
            ref={[exposeRef(props), baseComponent(props)]}
        >
            <div
                class={[styles['bar-fill'], fillToken()?.class]}
                // `width` last: the progress always wins over a width in the Fill's style (as in 1.x).
                style={{ ...fillToken()?.style, width: `${clampProgress(props.progress)}%` }} />
        </div>
    )
}

export default Object.assign(ProgressBar, { Fill })
