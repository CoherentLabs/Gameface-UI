import { children, onCleanup, onMount, ParentComponent, useContext } from "solid-js"
// @ts-ignore
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import { NavigationContext } from "./Navigation";
import { waitForFrames } from "@components/utils/waitForFrames";

interface NavigationAreaProps {
    name: string,
    selector?: string,
}

const NavigationArea: ParentComponent<NavigationAreaProps> = (props) => {
    const context = useContext(NavigationContext);
    const cachedChildren = children(() => props.children);

    onMount(() => {
        if (!context) {
            console.warn('No context bro');
            return null
        }

        // should we make Spatial Navigation work with element refs and not query them?
        // if no selector provided, work with direct children (use classname property ig..?)
        // const navigatableArea = { area: props.name, elements: [`.${props.selector}`] };
        waitForFrames(() => {
            if (!spatialNavigation.enabled) {
                spatialNavigation.init([
                    { area: props.name, elements: [`.${props.selector}`] },
                ]);
                
            } else {
                spatialNavigation.add([{ area: props.name, elements: [`.${props.selector}`] }]);
            }

            spatialNavigation.focusFirst(props.name);
        })
    })

    onCleanup(() => {
        console.log('maham se bratlee')
        spatialNavigation.remove(props.name)
    })

    return (
        <>{cachedChildren()}</>
    )
}

export default NavigationArea;