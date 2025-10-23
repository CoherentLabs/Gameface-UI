import { createEffect, createMemo, onMount, ParentComponent } from "solid-js";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { clampProgress, ProgressProps } from "./Progress";
import styles from './Progress.module.scss';

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
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return (
        <div
            ref={props.ref as HTMLDivElement}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}>
            <div 
                ref={fillElement}
                class={fillClasses()} 
                style={fillToken()?.style} />
        </div>
    )
}

export default Object.assign(ProgressBar, { Fill })