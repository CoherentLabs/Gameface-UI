import { createMemo, ParentComponent, ParentProps, Show } from "solid-js";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { clampProgress, ProgressProps } from "./Progress";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import styles from './Progress.module.scss';

interface FillTokenProps extends TokenBase { shape?: 'square' | 'round', }
interface TextTokenProps extends TokenBase, ParentProps {}

const Fill = createTokenComponent<FillTokenProps>();
const Text = createTokenComponent<TextTokenProps>();
const Outline = createTokenComponent<TokenBase>();

const PATH_DATA = "M60 6 a54 54 0 1 1 0 108 a54 54 0 1 1 0 -108";
const ProgressCircle: ParentComponent<ProgressProps> = (props) => {
    const fillToken = useToken(Fill, props.children)
    const outlineToken = useToken(Outline, props.children)
    const textToken = useToken(Text, props.children)
    
    const outlineClasses = createMemo(() => {
        const classes = [styles['circle-outline']];
        classes.push(outlineToken()?.class || "");

        return classes.join(' ');
    });

    const fillClasses = createMemo(() => {
        const classes = [styles['circle-fill']];
        classes.push(fillToken()?.class || "");

        return classes.join(' ');
    });

    const textClasses = createMemo(() => {
        const classes = [styles['circle-text']];
        classes.push(textToken()?.class || "");

        return classes.join(' ');
    });

    props.componentClasses = () => styles.circle;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return (
        <div 
            ref={props.ref as HTMLDivElement}
            class={className()} 
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}>
            <svg class={styles['circle-svg']} viewBox="0 0 120 120">
                <path d={PATH_DATA} class={outlineClasses()} style={outlineToken()?.style} />
                <path
                    d={PATH_DATA}
                    class={fillClasses()}
                    style={fillToken()?.style}
                    pathLength="100"
                    stroke-dasharray="100"
                    stroke-linecap={fillToken()?.shape === "round" ? 'round' : 'square'}
                    stroke-dashoffset={clampProgress(100 - props.progress)}
                />
            </svg>
            <Show when={textToken()}>
                <div class={textClasses()} style={textToken()?.style}>
                    {textToken()?.children}
                </div>
            </Show>
        </div>
    )
}

export default Object.assign(ProgressCircle, { Fill, Outline, Text })