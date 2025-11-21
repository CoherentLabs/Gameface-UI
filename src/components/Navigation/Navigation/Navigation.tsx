import { createContext, onCleanup, onMount, ParentComponent, useContext } from "solid-js"
// @ts-ignore
import { gamepad } from 'coherent-gameface-interaction-manager';
import NavigationArea from "./NavigationArea";
import eventBus from "@components/tools/EventBus";
import { createStore } from "solid-js/store";
import { ActionMap, NavigationConfigType } from "./types";
import { DEFAULT_ACTIONS } from "./defaults";
import createAreaMethods from "./areaMethods/useAreaMethods";
import createActionMethods from "./actionMethods/useActionMethods";
import { AreaMethods } from "./areaMethods/areaMethods.types";
import { ActionMethods } from "./actionMethods/actionMethods.types";

type ExcludedAPIMethods = 'registerAction' | 'unregisterAction'
interface NavigationContextType extends AreaMethods, Omit<ActionMethods, ExcludedAPIMethods> {}
export interface NavigationRef extends NavigationContextType {}

export const NavigationContext = createContext<NavigationContextType>();
export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error('useNavigation must be used within Navigation');
    return context;
}

interface NavigationProps {
    gamepad?: boolean,
    keyboard?: boolean,
    actions?: ActionMap,
    scope?: string,
    pollingInterval?: number
    ref?: NavigationContextType;
    overlap?: number
}

const Navigation: ParentComponent<NavigationProps> = (props) => {
    const [config, setConfig] = createStore<NavigationConfigType>({
        gamepad: props.gamepad ?? true,
        keyboard: props.keyboard ?? true,
        actions: {...DEFAULT_ACTIONS, ...props.actions},
        scope: props.scope ?? "",
    })
    const areas = new Set<string>();
    const { addAction, executeAction, registerAction, removeAction, unregisterAction, updateAction, getScope } = createActionMethods(config, setConfig)
    const areaMethods = createAreaMethods(areas, setConfig);

    const navigationAPI = {
        addAction,
        removeAction,
        executeAction,
        updateAction,
        getScope,
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
        eventBus.on('select', (scope: string) => console.log(scope))
        if (!props.ref) return;
        (props.ref as unknown as (ref: NavigationContextType) => void)(navigationAPI);
    })

    onCleanup(() => deInitActions())

    return (
        <NavigationContext.Provider value={navigationAPI}>
            {props.children}
        </NavigationContext.Provider>
    )
}

export default Object.assign(Navigation, { Area: NavigationArea });