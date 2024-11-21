import BaseComponent from "./BaseComponent";
import { type Component } from "solid-js";


const ButtonComponent: Component = (props) => {
    // Use BaseComponent to inherit methods and properties
    const { GFUI, log, events } = BaseComponent(props);
    const {click, mouseover} = events;

    console.log(events)

    return <button onClick={click} onMouseOver={mouseover}>Hellooo</button>;
};

export default ButtonComponent