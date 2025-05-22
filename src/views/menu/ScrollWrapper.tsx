import Scroll from "@components/Layout/Scroll/Scroll";
import { Accessor, Show } from "solid-js";

const ScrollWrapper = ({ show }: { show: Accessor<boolean> }) => {
    const a = 1;
    console.log(a)
    return <>
        {show() &&
            <Scroll.Bar style={{ background: 'red' }}>
                <Show when={show()}>
                    <Scroll.Handle style={{ background: 'blue' }} />
                </Show>
            </Scroll.Bar>
        }
    </>

}

export default ScrollWrapper;