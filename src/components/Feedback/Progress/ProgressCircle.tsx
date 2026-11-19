import { ParentComponent, ParentProps, Show } from "solid-js";
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { clampProgress, ProgressProps } from "./Progress";
import styles from './Progress.module.scss';
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

interface FillTokenProps extends TokenBase { shape?: 'square' | 'round', }
interface TextTokenProps extends TokenBase, ParentProps { }

const Fill = createTokenComponent<FillTokenProps>();
const Text = createTokenComponent<TextTokenProps>();
const Outline = createTokenComponent<TokenBase>();

const PATH_DATA = "M60 6 a54 54 0 1 1 0 108 a54 54 0 1 1 0 -108";
const ProgressCircle: ParentComponent<ProgressProps> = (props) => {
    const fillToken = useToken(Fill, () => props.children)
    const outlineToken = useToken(Outline, () => props.children)
    const textToken = useToken(Text, () => props.children)

    return (
        <div
            class={[styles.circle, props.class]}
            style={props.style}
            ref={[exposeRef(props), baseComponent(props)]}
        >
            <svg class={styles['circle-svg']} viewBox="0 0 120 120">
                <path d={PATH_DATA} class={[styles['circle-outline'], outlineToken()?.class]} style={outlineToken()?.style} />
                <path
                    d={PATH_DATA}
                    class={[styles['circle-fill'], fillToken()?.class]}
                    style={fillToken()?.style}
                    pathLength="100"
                    stroke-dasharray="100"
                    stroke-linecap={fillToken()?.shape === "round" ? 'round' : 'square'}
                    stroke-dashoffset={clampProgress(100 - props.progress)}
                />
            </svg>
            <Show when={textToken()}>
                <div class={[styles['circle-text'], textToken()?.class]} style={textToken()?.style}>
                    {textToken()?.children}
                </div>
            </Show>
        </div>
    )
}

export default Object.assign(ProgressCircle, { Fill, Outline, Text })