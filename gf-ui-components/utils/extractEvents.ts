import Events from "../types/BaseComponent";

// export default function extractEvents(events: Events, excludedEvents: Set<string>) {
//     return Object.keys(events).reduce((acc, eventName) => {
//         if(excludedEvents.has(eventName)) return acc;

//         acc[`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`] = (event: Event) => {
//             const handler = events[eventName as keyof Events];
//             handler && handler(event as any);
//         };

//         return acc;
//     }, {} as Record<string, (event: Event) => void>);

// }

export default function extractEvents(events: Events, excludedEvents: Set<string>) {
    return Object.entries(events).reduce((acc, [eventName, handler]) => {
        if (!excludedEvents.has(eventName) && handler) {
            acc[`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`] = (event: Event) => {
                handler(event as any);
            };
        }
        return acc;
    }, {} as Record<string, (event: Event) => void>);
}