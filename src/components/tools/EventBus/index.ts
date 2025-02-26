type LogLevel = 'warn' | 'none';

interface EventBus {
    _logLevel: LogLevel;
    registeredEvents: Record<string, Set<Function>>;
}

type EventCallback = (...args: any[]) => any;

class EventBus {
    constructor() {
        this._logLevel = 'warn';
        this.registeredEvents = {};
    }

    get logLevel() { return this._logLevel; }

    set logLevel(level: LogLevel) {
        this._logLevel = level;
    }

    warn(message: string) {
        if (this.logLevel !== 'warn') return;

        console.warn(`[EventBus] ${message}`);
    }

    on(event: string, callback: EventCallback) {
        if (!this.registeredEvents[event]) {
            this.registeredEvents[event] = new Set();
        }

        if (this.registeredEvents[event].has(callback)) {
            this.warn(`Registering again. Callback is already registered for the ${event} event.`);
            return;
        }

        this.registeredEvents[event].add(callback);
    }

    off(event: string, callback: EventCallback) {
        const eventSet = this.registeredEvents[event];

        if (!eventSet) {
            this.warn(`Nothing to remove. No callbacks registered for the ${event} event.`);
            return;
        }

        if (eventSet.has(callback)) eventSet.delete(callback);
        if (eventSet.size === 0) delete this.registeredEvents[event];
    }

    emit(event: string, ...args: any[]) {
        const eventSet = this.registeredEvents[event];

        if (!eventSet) {
            this.warn(`Emitting event with no listeners. No callbacks registered for the ${event} event.`);
            return;
        }

        eventSet.forEach((cb) => cb(...args));
    }

    once(event: string, callback: EventCallback) {
        const onceCallback = (...args: any[]) => {
            callback(...args);
            this.off(event, onceCallback);
        };

        this.on(event, onceCallback);
    }

    hasRegistered(event: string, callback?: EventCallback) {
        if (!callback) return this.registeredEvents[event] !== undefined;

        return this.registeredEvents[event]?.has(callback);
    }
}

const eventBus = new EventBus();
export default eventBus;