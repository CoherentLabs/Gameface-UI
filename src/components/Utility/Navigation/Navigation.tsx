import { createContext, onCleanup, onSettled, ParentComponent, untrack, useContext } from "solid-js"
import { gamepad } from 'coherent-gameface-interaction-manager';
import type { NavigationEdgeHandler } from 'coherent-gameface-interaction-manager';
import NavigationArea from "./NavigationArea";
import { ActionMap } from "./types";
import { createNavigationState } from "./navigationState";
import { DEFAULT_ACTIONS } from "./defaults";
import createAreaMethods from "./areaMethods/useAreaMethods";
import createActionMethods from "./actionMethods/useActionMethods";
import { AreaMethods } from "./areaMethods/areaMethods.types";
import { ActionMethods } from "./actionMethods/actionMethods.types";
import { spatialNavigation } from 'coherent-gameface-interaction-manager';

type ExcludedActionMethods = 'registerAction' | 'unregisterAction'
type ExcludedAreaMethods = 'isEnabled'
interface NavigationContextType extends Omit<AreaMethods, ExcludedAreaMethods>, Omit<ActionMethods, ExcludedActionMethods> {}
export interface NavigationRef extends NavigationContextType {}

// Solid 2: useContext throws when there is no provider and no default, so
// `null` is the explicit "no Navigation above" value (components work without it).
export const NavigationContext = createContext<NavigationContextType | null>(null);
export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (context) return context
}

interface NavigationProps {
    gamepad?: boolean,
    keyboard?: boolean,
    actions?: ActionMap,
    scope?: string,
    pollingInterval?: number,
    ref?: NavigationRef | ((nav: NavigationRef) => void),
    overlap?: number,
}

const Navigation: ParentComponent<NavigationProps> = (props) => {
    // Initial values only (as in 1.x): an intentional one-time read of props.
    const state = createNavigationState(untrack(() => ({
        gamepad: props.gamepad ?? true,
        keyboard: props.keyboard ?? true,
        actions: {...DEFAULT_ACTIONS, ...props.actions},
        scope: props.scope ?? "",
    })));
    const { config, getActions } = state;
    const areas = new Set<string>();
    const navigationEdgeHandlers = new Map<string, NavigationEdgeHandler>();

    // Create action methods and extract internal-only methods
    const { registerAction, unregisterAction, ...publicActionMethods } = createActionMethods(state);

    // Create area methods and extract internal-only methods
    const areaMethods = createAreaMethods(areas, state.setScope, navigationEdgeHandlers);

    // Compose public API
    const navigationAPI = {
        ...publicActionMethods,
        ...areaMethods,
    }

    const initActions = () => {
        for (const action in getActions()) {
            registerAction(action)
        }
    }

    const deInitActions = () => {
        for (const action in getActions()) {
            unregisterAction(action)
        }
    }
    
    onSettled(() => {
        spatialNavigation.onNavigationEdge = (e) => navigationEdgeHandlers.get(e.area)?.(e);

        if (config.gamepad) {
            gamepad.enabled = true;
            gamepad.pollingInterval = props.pollingInterval ?? 200;
        }
        initActions()

        if (!props.ref) return;
        (props.ref as unknown as (ref: NavigationRef) => void)(navigationAPI);
    })

    onCleanup(() => {
        deInitActions()
        spatialNavigation.deinit();
    })

    return (
        <NavigationContext value={navigationAPI}>
            {props.children}
        </NavigationContext>
    )
}

export default Object.assign(Navigation, { Area: NavigationArea });