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
    let hasRegistered = false;

    const refresh = () => {
        if (!context!._navigationEnabled()) return;
        deinit();
        init(false);
    }

    const init = (focus: boolean) => {
        context!.registerArea(props.name, navigatableElements as HTMLElement[], focus);
    }

    const deinit = () => {
        context!.unregisterArea(props.name);
    };
    
    // Refresh whenever children change
    createEffect(on(cachedChildren, refresh, { defer: true }))
    createEffect(on(context!._navigationEnabled, (v) => {
        if (v && hasRegistered) init(false);
        hasRegistered = true;
    }, { defer: true }))

    onMount(() => {
        if (!context) {
            console.warn('No context bro');
            return null
        }

        const shouldFocus = props.focused || props.name === context.getScope();
        init(shouldFocus);
    })

    onCleanup(() => deinit())

    return (
        <>{cachedChildren()}</>
    )
}

export default NavigationArea;