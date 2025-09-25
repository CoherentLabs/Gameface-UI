import { createMemo, ParentComponent } from "solid-js";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { clampProgress, ProgressProps } from "./Progress";
import styles from './Progress.module.scss';

const Fill = createTokenComponent<TokenBase>();
const ProgressBar: ParentComponent<ProgressProps> = (props) => {
    const fillToken = useToken(Fill, props.children)
    
    const fillClasses = createMemo(() => {
        const classes = [styles['bar-fill']];
        classes.push(fillToken()?.class || "");

        return classes.join(' ');
    });

    const fillStyles = createMemo(() => {
        const tokenStyles = fillToken()?.style;
        return {
            ...tokenStyles,
            width: `${clampProgress(props.progress)}%`
        }
    })

    props.componentClasses = () => styles.bar;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return (
        <div
            ref={props.ref as HTMLDivElement}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}>
            <div 
                class={fillClasses()} 
                style={fillStyles()} />
        </div>
    )
}

export default Object.assign(ProgressBar, { Fill })