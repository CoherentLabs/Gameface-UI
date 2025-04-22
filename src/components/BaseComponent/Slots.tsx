import {
    createSignal,
    createContext,
    useContext,
    ParentComponent,
} from 'solid-js';

type SlotContextType<SlotMap extends Record<string, any>> = {
    register: <K extends keyof SlotMap>(key: K, props: SlotMap[K]) => void;
    slots: { [K in keyof SlotMap]?: SlotMap[K] };
};

export function createSlot<T>() {
    return (props: T) => <></>
}

export const createSlots = <SlotMap extends Record<string, any>>(
    slotComponents: { [K in keyof SlotMap]: ParentComponent<SlotMap[K]> }
) => {
    let wrapperComponentName: string;

    const ctx = createContext<SlotContextType<SlotMap>>();

    const useSlots = () => {
        const context = useContext(ctx);
        if (!context) throw new Error("Slot component must be used inside its parent component.");
        return context;
    };

    const createSlot = <K extends keyof SlotMap>(key: K): ParentComponent<SlotMap[K]> => {
        const componentName = `${wrapperComponentName}.${key as string}`;

        const slotComponent = {
            [componentName]: (props: SlotMap[K]) => {
                try {
                    const ctx = useSlots();
                    ctx.register(key, props);
                } catch (error) {
                    console.error(`"${componentName}" could not be used outside of "${wrapperComponentName}" component.`);
                } finally {
                    return null;
                }
            }
        }
        return slotComponent[componentName];
    }

    const withSlots = <Props extends Record<string, any>>(
        component: ParentComponent<Props>
    ): ParentComponent<Props> & typeof slotComponents => {
        wrapperComponentName = component.name.replace('[solid-refresh]', '');

        const WrappedComponent: ParentComponent<Props> = (props) => {
            const slots: Partial<{ [K in keyof SlotMap]: SlotMap[K] }> = {};
            const register = <K extends keyof SlotMap>(key: K, props: SlotMap[K]) => {
                const [signal] = createSignal(props);
                slots[key] = signal();
            };

            return (
                <ctx.Provider value={{ register, slots }}>
                    {component(props)}
                </ctx.Provider>
            );
        };

        Object.entries(slotComponents).forEach(([key, comp]) => {
            (WrappedComponent as any)[key] = createSlot(key);
        });

        return WrappedComponent as ParentComponent<Props> & typeof slotComponents;
    };

    return {
        useSlots,
        withSlots,
    };
}
