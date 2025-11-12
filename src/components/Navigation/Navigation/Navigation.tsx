import { Accessor, batch, createContext, createSignal, onCleanup, onMount, ParentComponent } from "solid-js"
// @ts-ignore
import { actions, keyboard, gamepad } from 'coherent-gameface-interaction-manager';
import NavigationArea from "./NavigationArea";
import eventBus from "@components/tools/EventBus";
import { ComponentProps } from "@components/types/ComponentProps";
import { createStore } from "solid-js/store";

type ActionCfg = { key?: string; button?: string; callback?: (...args: any[]) => void };
type ActionMap = Record<string, ActionCfg>;

const DEFAULT_ACTIONS: ActionMap = {
    'move-left': { key: 'ARROW_LEFT', button: 'pad-left' },
    'move-right': { key: 'ARROW_RIGHT', button: 'pad-right' },
    'move-up': { key: 'ARROW_UP', button: 'pad-up' },
    'move-down': { key: 'ARROW_DOWN', button: 'pad-down' },
    'select': { key: 'Enter', button: 'face-button-down' },
    'back': { key: 'ESC', button: 'face-button-right' },
} as const;

export interface NavigationRef {
    addAction: (name: string, config: ActionCfg) => void,
    removeAction: (name: string) => void,
    scope: Accessor<string>
}

export const NavigationContext = createContext();
interface NavigationProps extends ComponentProps {
    gamepad?: boolean,
    keyboard?: boolean,
    actions?: ActionMap,
    scope?: string,
}

const Navigation: ParentComponent<NavigationProps> = (props) => {
    const [config, setConfig] = createStore({
        gamepad: props.gamepad ?? true,
        keyboard: props.keyboard ?? true,
        actions: {...DEFAULT_ACTIONS, ...props.actions},
        scope: props.scope ?? "",
    })

    const contextOjb = {
        test: true
    }

    const addAction = (name: string, config: ActionCfg) => {
        const {key, button, callback} = config;

        setConfig('actions', {name: config});
        
        actions.register(name, () => {
            eventBus.emit(name);
            callback?.();
        })

        if (key) {    
            keyboard.on({
                keys: [key],
                callback: name,
                type: ['lift'],
            })
        }

        if (button) {
            gamepad.on({
                actions: [button],
                callback: name,
            });
        }
    }

    const removeAction = (name: string) => {
        const actionToRemove = config.actions[name];
        if (!actionToRemove) {
            return console.warn('Trying to remove a non existing action!')
        }

        const {key, button} = actionToRemove;
        actions.remove(name)
        if (config.keyboard) keyboard.off([key])
        if (config.gamepad) gamepad.off([button])

        setConfig('actions', (prev) => {
            const { [name]: _, ...rest } = prev;
            return rest;
        })
    }

    const initActions = () => {
        for (const action in config.actions) {
            const {key, button, callback} = config.actions[action];
            
            // INIT DEFAULT & USER ACTIONS
            actions.register(action, () => {
                eventBus.emit(action);
                callback && callback();
            })
            // INIT KEYBOARD
            if (config.keyboard && key) {
                keyboard.on({
                    keys: [key],
                    callback: action,
                    type: ['lift'],
                })
            }
            // INIT GAMEPAD
            if (config.gamepad && button) {
                gamepad.on({
                    actions: [button],
                    callback: action,
                });
            }
        }
    }

    const cleanActions = () => {
        for (const action in config.actions) {
            const {key, button} = config.actions[action];
            actions.remove(action)
            if (config.keyboard && key) keyboard.off([key])
            if (config.gamepad && button) gamepad.off([button])
        }
    }
    
    onMount(() => {
        initActions()
        if (!props.ref) return;

        (props.ref as unknown as (ref: NavigationRef) => void)({
            addAction,
            removeAction,
            scope: () => config.scope
        });
    })

    onCleanup(() => {
        cleanActions()
    })

    return (
        <NavigationContext.Provider value={contextOjb}>
            {props.children}
        </NavigationContext.Provider>
    )
}

export default Object.assign(Navigation, { Area: NavigationArea });