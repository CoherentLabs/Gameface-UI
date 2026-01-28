import { createEffect, createMemo, onMount, ParentComponent } from "solid-js";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { clampProgress, ProgressProps } from "./Progress";
import styles from './Progress.module.scss';
import baseComponent from "@components/BaseComponent/BaseComponent";

const Fill = createTokenComponent<TokenBase>();
const ProgressBar: ParentComponent<ProgressProps> = (props) => {
    const fillToken = useToken(Fill, props.children)
    let fillElement: HTMLDivElement | undefined;

    createEffect(() => {
        if (fillElement) fillElement.style.width = `${clampProgress(props.progress)}%`;
    })

    const fillClasses = createMemo(() => {
        const classes = [styles['bar-fill']];
        classes.push(fillToken()?.class || "");

        return classes.join(' ');
    });

    props.componentClasses = styles.bar;

    return (
        <div
            ref={props.ref as HTMLDivElement}
            use:baseComponent={props}
        >
            <div
                ref={fillElement}
                class={fillClasses()}
                style={fillToken()?.style} />
        </div>
    )
}

export default Object.assign(ProgressBar, { Fill })