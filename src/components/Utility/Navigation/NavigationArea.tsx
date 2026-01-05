import { children, createEffect, on, onCleanup, onMount, ParentComponent } from "solid-js"
import { useNavigation } from "./Navigation";
//@ts-ignore
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
interface NavigationAreaProps {
    name: string,
    selector?: string,
    focused?: boolean,
}

const NavigationArea: ParentComponent<NavigationAreaProps> = (props) => {
    const nav = useNavigation();
    if (!nav) throw new Error('useNavigation must be used within Navigation');
    const cachedChildren = children(() => props.children);
    const navigatableElements = props.selector ? [`.${props.selector}`] : cachedChildren();

    const refresh = () => {
        if (!spatialNavigation.enabled) return;
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