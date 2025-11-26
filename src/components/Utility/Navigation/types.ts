import { KeyBinding, GamepadButton } from './keybindings/keybindings.types';

type ActionType = 'press' | 'hold' | 'lift';

export type ActionCfg = {
    key?: {binds: KeyBinding[], type?: ActionType[]};
    button?: {binds: GamepadButton[], type?: Exclude<ActionType, 'lift'>}
    callback: (scope?: string, ...args: any[]) => void
    global?: boolean,
    paused?: boolean,
};

export type DefaultActions = 'move-left' | 'move-right' | 'move-up' | 'move-down' | 'select' | 'back';
export type ActionName = DefaultActions | (string & {});
export type ActionMap = {
    [K in DefaultActions]?: ActionCfg;
} & {
    [key: string]: ActionCfg;
};

export interface NavigationConfigType {
    gamepad: boolean,
    keyboard: boolean,
    actions: ActionMap,
    scope: string,
    navigationEnabled: boolean
}