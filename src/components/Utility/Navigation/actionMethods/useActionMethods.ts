import { actions, keyboard, gamepad } from 'coherent-gameface-interaction-manager';
import { SetStoreFunction } from 'solid-js/store';
import { ActionName, ActionCfg, DefaultActions, NavigationConfigType } from '../types';
import { DEFAULT_ACTION_NAMES } from '../defaults';
import eventBus from '@components/Utility/EventBus';
import { ActionMethods } from './actionMethods.types';

export default function createActionMethods(
    config: NavigationConfigType,
    setConfig: SetStoreFunction<NavigationConfigType>
): ActionMethods {
    // For regular pause/unpause subscribers
    const actionSubscribers = new Map<string, number>();
    // For force paused actions
    const forcePausedActions = new Set<string>();
    
    const registerAction = (actionName: ActionName) => {
        const {key, button, callback, global} = getAction(actionName)!;

        const shouldEmitGlobally = DEFAULT_ACTION_NAMES.has(actionName as DefaultActions) || global;

        actions.register(actionName, (...args: any[]) => {
            if (isPaused(actionName)) return;
            
            const currentScope = getScope();
            
            callback && callback(currentScope, ...args);
            if (shouldEmitGlobally) eventBus.emit(actionName, currentScope, ...args);
        })

        if (config.keyboard && key) {
            keyboard.on({
                keys: key.binds,
                callback: actionName,
                type: key.type || ['press'],
            })
        }

        if (config.gamepad && button) {
            gamepad.on({
                actions: button.binds as any,
                callback: actionName,
                type: button.type
            });
        }
    }

    const unregisterAction = (actionName: ActionName) => {
        const {key, button} = getAction(actionName)!;

        if (config.keyboard && key) keyboard.off(key.binds, actionName);
        if (config.gamepad && button) gamepad.off(button.binds, actionName);
        actions.remove(actionName);
        actionSubscribers.delete(actionName);
        forcePausedActions.delete(actionName);
    }

    const addAction = (name: ActionName, data: ActionCfg) => {
        if (getAction(name)) {
            return console.warn(`Action ${name} is already registered! If you wish to update it's data use updateAction() instead.`)
        }
        setConfig('actions', name, data);
        registerAction(name);
    }

    const removeAction = (name: ActionName) => {
        if (!getAction(name)) {
            return console.warn('Trying to remove a non existing action!')
        }

        if (DEFAULT_ACTION_NAMES.has(name as DefaultActions)) {
            return console.warn('Can\'t remove a default action!')
        }

        unregisterAction(name);
        setConfig('actions', (prev) => {
            const { [name]: _, ...rest } = prev;
            return rest;
        })
    }

    const updateAction = (name: ActionName, data: ActionCfg) => {
        if (!getAction(name)) {
            return console.warn('Trying to update a non existing action!')
        }

        unregisterAction(name)
        setConfig('actions', name, data);
        registerAction(name);
    }

    const executeAction = (name: ActionName) => {
        if (!getAction(name)) {
            return console.warn('Trying to execute a non existing action!')
        }

        actions.execute(name);
    }

    const getScope = () => config.scope;
    const getAction = (name: ActionName) => config.actions[name];
    const getActions = () => config.actions;

    const pauseAction = (name: ActionName, force: boolean = false) => {
        if (!getAction(name)) return console.warn('Action not found');

        if (forcePausedActions.has(name)) {
            if (import.meta.env.DEV) console.log(`Action: ${name} has already been force paused!`);
            return;
        }

        if (force) {
            forcePausedActions.add(name);
            setConfig('actions', name, 'paused', true);
            return;
        }

        const currentCount = actionSubscribers.get(name) || 0;
        if (currentCount === 0) return;

        const newCount = currentCount - 1;
        actionSubscribers.set(name, newCount);

        if (newCount === 0) {
            setConfig('actions', name, 'paused', true);
        }
    };

    const resumeAction = (name: ActionName, force: boolean = false) => {
        const action = getAction(name);
        if (!action) return console.warn('Action not found');

        // Increment subscibers even if force paused
        const currentCount = actionSubscribers.get(name) || 0;
        actionSubscribers.set(name, currentCount + 1);

        if (force) {
            forcePausedActions.delete(name);
            setConfig('actions', name, 'paused', false);
            return;
        }

        if (forcePausedActions.has(name)) {
            if (import.meta.env.DEV) {
                console.log(`Action: ${name} has been force paused! To resume it, use resumeAction(${name}, true)`);
            }
            return;
        }

        if (currentCount === 0 && action.paused) {
            setConfig('actions', name, 'paused', false);
        }
    };

    const isPaused = (name: ActionName) => {
        return getAction(name)?.paused ?? false;
    };

    return {
        addAction,
        removeAction,
        updateAction,
        executeAction,
        registerAction,
        unregisterAction,
        getScope,
        getAction,
        getActions,
        pauseAction,
        resumeAction,
        isPaused,
    };
}
