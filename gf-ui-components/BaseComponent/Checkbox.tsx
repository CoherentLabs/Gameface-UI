import { createSign } from "crypto";
import BaseComponent from "./BaseComponent";
import { createSignal, type Component } from "solid-js";

type CheckBoxProps = {
    click?: () => void;
    mouseover?: () => void;
    mouseleave?: () => void;
};

const CheckBox: Component = (props: CheckBoxProps) => {
    // Use BaseComponent to inherit methods and properties
    
    const [checked, setChecked] = createSignal(false)

    const passedProps = {
        click: props.click || (() => {}),
        mouseover: props.mouseover || (() => {}),
        mouseleave: props.mouseleave || (() => {}),
        ...props
    }
    
    const { GFUI, log, events } = BaseComponent(passedProps);

    console.log(events)

    const click = (event: Event) => {
        events.click && events.click(event as MouseEvent);
        setChecked(!checked());
    }

    const mouseover = (event: Event) => {
        events.mouseover && events.mouseover(event as MouseEvent);
        setChecked(!checked());
    }
    const mouseleave = (event: Event) => {
        events.click && events.click(event as MouseEvent);
        setChecked(!checked());
    }

    return (
        <div onClick={click} onMouseOver={mouseover} onMouseLeave={mouseleave} style={{display: 'flex', cursor: 'pointer'}} >
            <div style={{width: '20px', height: '20px', border: '1px solid black', 'background-color': `${checked() ? 'blue' : 'white'}`} }></div>
            <div>I am a cool label</div>
        </div>
    );
};

export default CheckBox