import { ActionMap, DefaultActions } from "./types";

export const DEFAULT_ACTIONS: ActionMap = {
    'move-left': {
        key: {binds: ['ARROW_LEFT'], type: ['press', 'hold']},
        button: {binds: ['pad-left'], type: 'hold'},
        global: true
    },
    'move-right': {
        key: {binds: ['ARROW_RIGHT'], type: ['press', 'hold']},
        button: {binds: ['pad-right'], type: 'hold'},
        global: true
    },
    'move-up': {
        key: {binds: ['ARROW_UP'], type: ['press', 'hold']},
        button: {binds: ['pad-up'], type: 'hold'},
        global: true
    },
    'move-down': {
        key: {binds: ['ARROW_DOWN'], type: ['press', 'hold']},
        button: {binds: ['pad-down'], type: 'hold'},
        global: true
    },
    'select': {
        key: {binds: ['ENTER'], type: ['press']},
        button: {binds: ['face-button-down'], type: 'press'},
        global: true
    },
    'back': {
        key: {binds: ['ESC'], type: ['press']},
        button: {binds: ['face-button-right'], type: 'press'},
        global: true
    },
    'pan': {
        button: {binds: ['right.joystick'], type: 'hold'},
        global: true,
        paused: true,
    },
};

export const DEFAULT_ACTION_NAMES = new Set(
    Object.keys(DEFAULT_ACTIONS) as DefaultActions[]
);
