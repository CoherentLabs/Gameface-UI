import { ActionMap, DefaultActions } from "./types";

export const DEFAULT_ACTIONS: ActionMap = {
    'move-left': {
        key: {binds: ['ARROW_LEFT'], type: ['press']},
        button: {binds: ['pad-left'], type: 'press'},
        callback: undefined as any,
        global: true
    },
    'move-right': {
        key: {binds: ['ARROW_RIGHT'], type: ['press']},
        button: {binds: ['pad-right'], type: 'press'},
        callback: undefined as any,
        global: true
    },
    'move-up': {
        key: {binds: ['ARROW_UP'], type: ['press']},
        button: {binds: ['pad-up'], type: 'press'},
        callback: undefined as any,
        global: true
    },
    'move-down': {
        key: {binds: ['ARROW_DOWN'], type: ['press']},
        button: {binds: ['pad-down'], type: 'press'},
        callback: undefined as any,
        global: true
    },
    'select': {
        key: {binds: ['ENTER'], type: ['press']},
        button: {binds: ['face-button-down'], type: 'press'},
        callback: undefined as any,
        global: true
    },
    'back': {
        key: {binds: ['ESC'], type: ['press']},
        button: {binds: ['face-button-right'], type: 'press'},
        callback: undefined as any,
        global: true
    },
};

export const DEFAULT_ACTION_NAMES = new Set(
    Object.keys(DEFAULT_ACTIONS) as DefaultActions[]
);