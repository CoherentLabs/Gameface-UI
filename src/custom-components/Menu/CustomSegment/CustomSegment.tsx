import Segment from "@components/Basic/Segment/Segment"
import { For } from "solid-js";
import style from './CustomSegment.module.scss';

interface CustomSegmentProps {
    values: string[],
    default: string,
    'custom-class'?: string,
    onChange?: (selected: string) => void, 
}

const CustomSegment = (props: CustomSegmentProps) => {
    return (
        <Segment onChange={props.onChange} class={`${style.segment} ${props["custom-class"] ?? null}`} >
            <For each={props.values}>
                {(v) => <Segment.Button 
                    class={style['segment-button']}
                    class-selected={style['segment-button-selected']}
                    selected={v === props.default} 
                    value={v}>{v}</Segment.Button>}
            </For>
            <Segment.Indicator class={style['segment-indicator']} />
        </Segment>
    )
}

export default CustomSegment;