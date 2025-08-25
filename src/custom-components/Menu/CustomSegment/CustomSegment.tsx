import Segment from "@components/Basic/Segment/Segment"
import { For } from "solid-js";
import style from './CustomSegment.module.scss';

type CustomSegmentProps<V extends readonly string[]> = {
  values: V;
  default: V[number];
  'custom-class'?: string;
  onChange?: (v: V[number]) => void;
  ref?: any;
};

export function CustomSegment<V extends readonly string[]>(props: CustomSegmentProps<V>) {
    return (
        <Segment ref={props.ref} onChange={props.onChange} class={`${style.segment} ${props["custom-class"] ?? null}`} >
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