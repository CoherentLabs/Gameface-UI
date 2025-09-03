import Segment from "@components/Basic/Segment/Segment"
import { For } from "solid-js";
import style from './CustomSegment.module.scss';
import { emitChange } from "../../../views/menu/util";

type CustomSegmentProps<V extends readonly string[]> = {
  values: V;
  default: V[number];
  'custom-class'?: string;
  onChange?: (v: V[number]) => void;
  ref?: any;
};

export function CustomSegment<V extends readonly string[]>(props: CustomSegmentProps<V>) {
    const handleChange = (val: V[number]) => {
        emitChange()
        props.onChange?.(val);
    };

    return (
        <Segment ref={props.ref} onChange={handleChange} class={`${style.segment} ${props["custom-class"] ?? null}`} >
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