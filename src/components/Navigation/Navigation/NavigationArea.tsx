import { children, createEffect, on, onCleanup, onMount, ParentComponent, useContext } from "solid-js"
import { NavigationContext } from "./Navigation";

interface NavigationAreaProps {
    name: string,
    selector?: string,
    focused?: boolean,
}

const NavigationArea: ParentComponent<NavigationAreaProps> = (props) => {
    const context = useContext(NavigationContext);
    const cachedChildren = children(() => props.children);
    const navigatableElements = props.selector ? [`.${props.selector}`] : cachedChildren();

    const refresh = () => {
        context!.unregisterArea(props.name);
        context!.registerArea(props.name, navigatableElements as HTMLElement[], false);
    }

    // Refresh whenever children change
    createEffect(on(cachedChildren, refresh, { defer: true }))

    onMount(() => {
        if (!context) {
            console.warn('No context bro');
            return null
        }

        context!.registerArea(props.name, navigatableElements as HTMLElement[], props.focused ?? false);
    })

    onCleanup(() => {
        context!.unregisterArea(props.name);
    })

    return (
        <>{cachedChildren()}</>
    )
}

export default NavigationArea;