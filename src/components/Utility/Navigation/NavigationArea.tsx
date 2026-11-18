import { children, createEffect, onCleanup, onSettled, ParentComponent, untrack } from "solid-js"
import { useNavigation } from "./Navigation";
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import type { NavigationEdgeHandler } from 'coherent-gameface-interaction-manager';

interface NavigationAreaProps {
    name: string,
    selector?: string,
    focused?: boolean,
    onEdge?: NavigationEdgeHandler
}

const NavigationArea: ParentComponent<NavigationAreaProps> = (props) => {
    const nav = useNavigation();
    if (!nav) throw new Error('useNavigation must be used within Navigation');
    const cachedChildren = children(() => props.children);
    // Intentional one-time read (Solid 2 warns on untracked top-level reads).
    const navigatableElements = untrack(() => props.selector ? [`.${props.selector}`] : cachedChildren());

    const refresh = () => {
        if (!spatialNavigation.enabled) return;
        // Rebuild only - unregisterArea would also drop the area's edge handler
        spatialNavigation.remove(props.name);
        init(false);
    }

    const init = (focus: boolean) => {
        nav.registerArea(props.name, navigatableElements as HTMLElement[], focus);
    }

    const deinit = () => {
        nav.unregisterArea(props.name);
    };
    
    // Refresh whenever children change
    createEffect(() => cachedChildren(), () => { refresh(); }, { defer: true })

    onSettled(() => {
        const shouldFocus = props.focused || props.name === nav.getScope();
        init(shouldFocus);
        if (props.onEdge) nav.setEdgeHandler(props.name, props.onEdge);
    })

    onCleanup(() => deinit())

    return (
        <>{cachedChildren()}</>
    )
}

export default NavigationArea;