import { children, createEffect, onCleanup, onSettled, ParentComponent } from "solid-js"
import { useNavigation } from "./Navigation";
//@ts-ignore
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import { untrack } from "@solidjs/web";
interface NavigationAreaProps {
    name: string,
    selector?: string,
    focused?: boolean,
}

const NavigationArea: ParentComponent<NavigationAreaProps> = (props) => {
    const nav = useNavigation();
    if (!nav) throw new Error('useNavigation must be used within Navigation');
    const cachedChildren = children(() => props.children);
    const navigatableElements = props.selector ? [`.${props.selector}`] : untrack(() => cachedChildren());

    const refresh = (elements: HTMLElement[]) => {
        if (!spatialNavigation.enabled) return;
        deinit();
        nav.registerArea(props.name, elements, false);
    }

    const init = (focus: boolean) => {
        nav.registerArea(props.name, navigatableElements as HTMLElement[], focus);
    }

    const deinit = () => {
        nav.unregisterArea(props.name);
    };
    
    // Refresh whenever children change
    createEffect(() => cachedChildren() as HTMLElement[], refresh, { defer: true });

    onSettled(() => {
        const shouldFocus = props.focused || props.name === nav.getScope();
        init(shouldFocus);
    })

    onCleanup(() => deinit())

    return (
        <>{cachedChildren()}</>
    )
}

export default NavigationArea;