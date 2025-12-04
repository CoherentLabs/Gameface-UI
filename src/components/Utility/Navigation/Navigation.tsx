import { Accessor, createContext, onCleanup, onMount, ParentComponent, useContext } from "solid-js"
// @ts-ignore
import { gamepad } from 'coherent-gameface-interaction-manager';
import NavigationArea from "./NavigationArea";
import eventBus from "@components/Utility/EventBus";
import { createStore } from "solid-js/store";
import { ActionMap, NavigationConfigType } from "./types";
import { DEFAULT_ACTIONS } from "./defaults";
import createAreaMethods from "./areaMethods/useAreaMethods";
import createActionMethods from "./actionMethods/useActionMethods";
import { AreaMethods } from "./areaMethods/areaMethods.types";
import { ActionMethods } from "./actionMethods/actionMethods.types";
//@ts-ignore
import { spatialNavigation } from 'coherent-gameface-interaction-manager';

type ExcludedActionMethods = 'registerAction' | 'unregisterAction'
type ExcludedAreaMethods = 'isEnabled'
interface NavigationContextType extends Omit<AreaMethods, ExcludedAreaMethods>, Omit<ActionMethods, ExcludedActionMethods> {}
export interface NavigationRef extends NavigationContextType {}

export const NavigationContext = createContext<NavigationContextType>();
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
    ref?: NavigationRef,
    overlap?: number,
}

const Navigation: ParentComponent<NavigationProps> = (props) => {
    const [config, setConfig] = createStore<NavigationConfigType>({
        gamepad: props.gamepad ?? true,
        keyboard: props.keyboard ?? true,
        actions: {...DEFAULT_ACTIONS, ...props.actions},
        scope: props.scope ?? "",
    })
    const areas = new Set<string>();

    // Create action methods and extract internal-only methods
    const { registerAction, unregisterAction, ...publicActionMethods } = createActionMethods(config, setConfig);

    // Create area methods and extract internal-only methods
    const areaMethods = createAreaMethods(areas, setConfig);

    // Compose public API
    const navigationAPI = {
        ...publicActionMethods,
        ...areaMethods,
    }

    const initActions = () => {
        for (const action in config.actions) {
            registerAction(action)
        }
    }

    const deInitActions = () => {
        for (const action in config.actions) {
            unregisterAction(action)
        }
    }
    
    onMount(() => {
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
        <NavigationContext.Provider value={navigationAPI}>
            {props.children}
        </NavigationContext.Provider>
    )
}

export default Object.assign(Navigation, { Area: NavigationArea });