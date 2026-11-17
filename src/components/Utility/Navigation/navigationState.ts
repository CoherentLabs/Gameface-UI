import { createStore } from 'solid-js';
import { ActionCfg, ActionMap, ActionName, NavigationConfigType } from './types';

export function createNavigationState(initial: NavigationConfigType) {
    const [config, setConfig] = createStore<NavigationConfigType>(initial);
    const now = { scope: initial.scope, actions: { ...initial.actions } as ActionMap };

    return {
        /** Static flags (gamepad / keyboard) - never written after creation. */
        config,

        getScope: (): string => {
            void config.scope;
            return now.scope;
        },
        setScope: (scope: string) => {
            now.scope = scope;
            setConfig((draft) => { draft.scope = scope; });
        },

        getAction: (name: ActionName): ActionCfg | undefined => {
            void config.actions[name];
            return now.actions[name];
        },
        getActions: (): ActionMap => {
            void Object.keys(config.actions);
            return now.actions;
        },
        setAction: (name: ActionName, data: ActionCfg | undefined) => {
            if (data === undefined) delete now.actions[name];
            else now.actions[name] = data;
            setConfig((draft) => {
                if (data === undefined) delete draft.actions[name];
                else draft.actions[name] = data;
            });
        },
        setPaused: (name: ActionName, paused: boolean) => {
            const action = now.actions[name];
            if (!action) return;
            now.actions[name] = { ...action, paused };
            setConfig((draft) => {
                const draftAction = draft.actions[name];
                if (draftAction) draftAction.paused = paused;
            });
        },
    };
}

export type NavigationState = ReturnType<typeof createNavigationState>;
