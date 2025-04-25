import {
    createContext,
    useContext,
    ParentComponent,
    ParentProps,
    children,
} from 'solid-js';

type SlotContextType<SlotMap extends Record<string, any>> = { [K in keyof SlotMap]?: SlotMap[K] };

export function createSlot<T extends ParentProps>(): ParentComponent<T> {
    return (props) => <></>
}

export const createSlots = <SlotMap extends Record<string, any>>(
    slotComponents: { [K in keyof SlotMap]: ParentComponent<SlotMap[K]> }
) => {
    let wrapperComponentName: string;

    const ctx = createContext<SlotContextType<SlotMap>>();

    const useSlots = () => {
        const context = useContext(ctx);
        if (!context) throw new Error("Slots can be accessed only inside a component wrapped with 'withSlots' HOC.");
        return context;
    };

    const createSlot = <K extends keyof SlotMap>(key: K): ((props: SlotMap[K]) => { slotName: string, props: SlotMap[K] }) => {
        const componentName = `${wrapperComponentName}.${key as string}`;
        const slotComponent = {
            [componentName]: (props: SlotMap[K]) => {
                return { slotName: key as string, props };
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
            const resolvedChildren = children(() => {
                const children = (Array.isArray(props.children) ? props.children : [props.children])
                return children.flat().filter((el: any) => {
                    if (typeof el === 'object' && el !== null && 'slotName' in el && 'props' in el) {
                        slots[el.slotName as keyof SlotMap] = el.props as SlotMap[keyof SlotMap];
                        return false;
                    }
                    return true;
                })
            });

            return (
                <ctx.Provider value={slots}>
                    {component({ ...props, children: resolvedChildren as unknown as Element })}
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
