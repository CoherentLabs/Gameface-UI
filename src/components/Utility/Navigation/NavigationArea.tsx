import { children, createEffect, on, onCleanup, onMount, ParentComponent, useContext } from "solid-js"
import { NavigationContext, useNavigation } from "./Navigation";
interface NavigationAreaProps {
    name: string,
    selector?: string,
    focused?: boolean,
}

const NavigationArea: ParentComponent<NavigationAreaProps> = (props) => {
    const nav = useNavigation();
    const cachedChildren = children(() => props.children);
    const navigatableElements = props.selector ? [`.${props.selector}`] : cachedChildren();
    let hasRegistered = false;

    const refresh = () => {
        if (!nav._navigationEnabled()) return;
        deinit();
        init(false);
    }

    const init = (focus: boolean) => {
        nav.registerArea(props.name, navigatableElements as HTMLElement[], focus);
    }

    const deinit = () => {
        nav.unregisterArea(props.name);
    };
    
    // Refresh whenever children change
    createEffect(on(cachedChildren, refresh, { defer: true }))
    createEffect(on(nav!._navigationEnabled, (v) => {
        if (v && hasRegistered) init(false);
        hasRegistered = true;
    }, { defer: true }))

    onMount(() => {
        const shouldFocus = props.focused || props.name === nav.getScope();
        init(shouldFocus);
    })

    onCleanup(() => deinit())

    return (
        <>{cachedChildren()}</>
    )
}

export default NavigationArea;