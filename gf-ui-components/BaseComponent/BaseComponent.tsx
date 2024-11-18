import { Events } from '../types'

interface BaseComponentProps extends Events {
}

type BaseComponentType<P = BaseComponentProps> = (props: P) => {
    GFUI: {}
    log: typeof console.log,
    events: Events,
}

function assignEvents(props: BaseComponentProps) {
    const events: Events = {};
    if (!props) return events;

    for (const key in props) {
        const typedKey = key as keyof Events;

        if (props[typedKey]) {
            events[typedKey] = props[typedKey] as any;
        }
    }

    return events
}

const BaseComponent: BaseComponentType = (props) => {
    const GFUI = {}
    const log = console.log;

    return { GFUI, log, events: assignEvents(props) };
}


export default BaseComponent;