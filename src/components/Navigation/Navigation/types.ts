type ActionType = 'press' | 'hold' | 'lift';

export type ActionCfg = {
    key?: {binds: string[], type?: ActionType[]}; // replace with key map
    button?: {binds: string[], type?: Exclude<ActionType, 'lift'>} // replace with button map
    callback: (scope?: string, ...args: any[]) => void
    global?: boolean
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
    scope: string
}