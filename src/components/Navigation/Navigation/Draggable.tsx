import { children, onMount, ParentComponent, useContext } from "solid-js"
// @ts-ignore
import { draggable } from 'coherent-gameface-interaction-manager';
import { NavigationContext } from "./Navigation";
import { waitForFrames } from "@components/utils/waitForFrames";

interface NavigationAreaProps {

}

const Draggable: ParentComponent<NavigationAreaProps> = (props) => {
    const context = useContext(NavigationContext);
    const cachedChildren = children(() => props.children);

    onMount(() => {
        if (!context) {
            console.warn('No context bro');
            return null
        }
        console.log(cachedChildren())
        waitForFrames(() => {
            const children = cachedChildren();
            if (children && children instanceof HTMLElement) {
                new draggable({ element: `.${children.className}` });
            }
        })
    })

    return (
        <>{cachedChildren()}</>
    )
}

export default Draggable;