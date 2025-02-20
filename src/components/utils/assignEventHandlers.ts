import Events from "../types/BaseComponent";

export default function assignEventHandlers(events: Events) {
    return Object.entries(events).reduce((acc, [eventName, handler]) => {
        if (handler) {
            acc[`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`] = (event: Event) => {
                handler(event as any);
            };
        }
        return acc;
    }, {} as Record<string, (event: Event) => void>);
}