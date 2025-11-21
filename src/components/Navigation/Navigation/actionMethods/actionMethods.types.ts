import { ActionName, ActionCfg, ActionMap } from '../types';

/**
 * Interface defining all action-related navigation methods
 */
export interface ActionMethods {
    /**
     * Adds a new Navigation action and registers it with the interaction manager
     * @param name - The name of the action
     * @param config - The action configuration object with the following properties:
     *   - `key?`: Keyboard binding `{binds: string[], type?: ('press' | 'hold' | 'lift')[]}`
     *   - `button?`: Gamepad binding `{binds: string[], type?: ('press' | 'hold')}`
     *   - `callback?`: Function to execute when action is triggered
     *   - `global?`: Whether to emit action globally via event bus
     */
    addAction: (name: ActionName, config: ActionCfg) => void;

    /**
     * Removes a registered Navigation action and unregisters it from the interaction manager
     * @param name - The name of the action to remove
     */
    removeAction: (name: ActionName) => void;

    /**
     * Updates an existing action's configuration. Default actions can be updated as well.
     * @param name - The name of the action to update
     * @param config - The new action configuration object with the following properties:
     *   - `key?`: Keyboard binding `{binds: string[], type?: ('press' | 'hold' | 'lift')[]}`
     *   - `button?`: Gamepad binding `{binds: string[], type?: ('press' | 'hold')}`
     *   - `callback?`: Function to execute when action is triggered
     *   - `global?`: Whether to emit action globally via event bus
     */
    updateAction: (name: ActionName, config: ActionCfg) => void;

    /**
     * Executes a registered action by name
     * @param name - The name of the action to execute
     */
    executeAction: (name: ActionName) => void;

    /**
     * Registers an action with the interaction manager (keyboard/gamepad bindings)
     * @param actionName - The name of the action to register
     */
    registerAction: (actionName: ActionName) => void;

    /**
     * Unregisters an action and removes keyboard/gamepad bindings
     * @param actionName - The name of the action to unregister
     */
    unregisterAction: (actionName: ActionName) => void;

    /**
     * Gets the current navigation scope
     * @returns The current scope identifier (typically the name of the active navigation area)
     */
    getScope: () => string;

    /**
     * Gets a specific action configuration by name
     * @param name - The action name to retrieve
     * @returns The action configuration if it exists, undefined otherwise
     */
    getAction: (name: ActionName) => ActionCfg | undefined;

    /**
     * Gets all currently registered actions
     * @returns Record of all action names and their configurations
     */
    getActions: () => ActionMap;
}
