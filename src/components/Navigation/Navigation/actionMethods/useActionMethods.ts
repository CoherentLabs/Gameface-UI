// @ts-ignore
import { actions, keyboard, gamepad } from 'coherent-gameface-interaction-manager';
import { SetStoreFunction } from 'solid-js/store';
import { ActionName, ActionCfg, DefaultActions, NavigationConfigType } from '../types';
import { DEFAULT_ACTION_NAMES } from '../defaults';
import eventBus from '@components/tools/EventBus';
import { ActionMethods } from './actionMethods.types';

export default function createActionMethods(
    config: NavigationConfigType,
    setConfig: SetStoreFunction<NavigationConfigType>
): ActionMethods {
    const registerAction = (actionName: ActionName) => {
        const {key, button, callback, global} = config.actions[actionName]!;

        const shouldEmitGlobally = DEFAULT_ACTION_NAMES.has(actionName as DefaultActions) || global;

        actions.register(actionName, () => {
            callback && callback(config.scope);
            if (shouldEmitGlobally) eventBus.emit(actionName, config.scope);
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
                actions: button.binds,
                callback: actionName,
                type: button.type
            });
        }
    }

    const unregisterAction = (actionName: ActionName) => {
        const {key, button} = config.actions[actionName]!;

        if (config.keyboard && key) keyboard.off(key.binds, actionName)
        if (config.gamepad && button) gamepad.off(button.binds, actionName)
        actions.remove(actionName)
    }

    const addAction = (name: ActionName, data: ActionCfg) => {
        if (config.actions[name]) {
            return console.warn(`Action ${name} is already registered! If you wish to update it's data use updateAction() instead.`)
        }
        setConfig('actions', name, data);
        registerAction(name);
    }

    const removeAction = (name: ActionName) => {
        if (!config.actions[name]) {
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
        if (!config.actions[name]) {
            return console.warn('Trying to update a non existing action!')
        }

        unregisterAction(name)
        setConfig('actions', name, data);
        registerAction(name);
    }

    const executeAction = (name: ActionName) => {
        if (!config.actions[name]) {
            return console.warn('Trying to execute a non existing action!')
        }

        actions.execute(name);
    }

    const getScope = () => config.scope;

    return {
        addAction,
        removeAction,
        updateAction,
        executeAction,
        registerAction,
        unregisterAction,
        getScope
    };
}
