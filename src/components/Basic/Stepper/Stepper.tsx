import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, onMount, ParentComponent, Show, createContext, createMemo, For, DEV, JSX } from "solid-js";
import styles from './Stepper.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { Control, StepperControl } from "./StepperControl";
import { Item, StepperItem } from "./StepperItem";
import { createTokenComponent, useToken, useTokens } from '@components/utils/tokenComponents';
import Flex from "@components/Layout/Flex/Flex";

export interface StepperRef {
    selected?: Accessor<string>
    setOption: (value: string) => void,
    options: string[],
    element: HTMLDivElement,
}

interface StepperProps extends ComponentProps {
    disabled?: boolean
    'class-disabled'?: string
    'controls-position'?: 'before' | 'after'
    loop?: boolean
    onChange?: (value: string) => void;
}

interface StepperContextProps {
    selected: Accessor<string>,
    registerOption: (value: string, selected?: boolean) => void
    unregisterOption: (value: string) => void
    changeSelected: (direction: "next" | "prev") => void
}

export const StepperContext = createContext<StepperContextProps>();

interface ItemsTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
}
const Items = createTokenComponent<ItemsTokenProps>();

const Stepper: ParentComponent<StepperProps> = (props) => {
    let element!: HTMLDivElement;
    const StepperItemsToken = useToken(Items, props.children);
    const StepperItems = useTokens(Item, StepperItemsToken?.()?.children);

    const [selected, setSelected] = createSignal('');
    const [selectedIndex, setSelectedIndex] = createSignal(-1);
    const options: string[] = [];

    const registerOption = (value: string, selected?: boolean) => {
        if (options.indexOf(value) !== -1) {
            if (DEV) console.warn(`Unable to register "${value}" stepper option because it has been already registered. The stepper option value should be unique. Please use another value for this option.`)
            return;
        }
        options.push(value);
        if (selected || options.length === 1) {
            setSelected(value);
            setSelectedIndex(options.length - 1);
        }
    }

    const unregisterOption = (value: string) => {
        const index = options.indexOf(value);
        if (index !== -1) options.splice(index, 1);
        if (selectedIndex() === index) {
            setSelectedIndex(index - 1);
            setSelected(options[index - 1]);
        }
    }

    const stepperClasses = createMemo(() => {
        const classes = [styles.Stepper];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.Disabled} ${props['class-disabled']}`);
            else classes.push(styles.Disabled);
        }

        return classes.join(' ');
    });

    const changeSelected = (direction: 'next' | 'prev') => {
        if (props.disabled) return;

        if (!props.loop) {
            if (direction === 'next' && selectedIndex() === options.length - 1) return;
            if (direction === 'prev' && selectedIndex() === 0) return;
        }

        if (direction === 'next') {
            const nextIndex = (selectedIndex() + 1) % options.length;
            setSelectedIndex(nextIndex);
            setSelected(options[nextIndex]);
        } else if (direction === 'prev') {
            const prevIndex = (selectedIndex() - 1 + options.length) % options.length;
            setSelectedIndex(prevIndex);
            setSelected(options[prevIndex]);
        }
        props.onChange?.(selected());
    }

    props.componentClasses = () => stepperClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    const setOption = (value: string) => {
        if (props.disabled) return;

        const index = options.indexOf(value);
        if (index !== -1) {
            setSelectedIndex(index);
            setSelected(options[index]);
            props.onChange?.(selected());
            return;
        }

        if (DEV) {
            console.warn(`Unable to set option "${value}" because it does not exists for the stepper.`)
        }
    }

    const showNextControl = createMemo(() => {
        if (props.loop) return true;

        if (selectedIndex() === options.length - 1) return false;

        return true;
    });

    const showPrevControl = createMemo(() => {
        if (props.loop) return true;

        if (selectedIndex() === 0) return false;

        return true;
    });

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            selected,
            setOption,
            options,
            element,
        });
    });

    const controlsBefore = createMemo(() => props["controls-position"] === 'before');
    const controlsAfter = createMemo(() => props["controls-position"] === 'after');

    return (
        <StepperContext.Provider value={{ selected, registerOption, unregisterOption, changeSelected }}>
            <div
                ref={element!}
                class={className()}
                style={inlineStyles()}
                use:forwardEvents={props}
                use:forwardAttrs={props}
            >
                <Show when={!props["controls-position"] || controlsBefore()}>
                    <StepperControl direction='prev' visible={showPrevControl()} parentChildren={props.children} />
                </Show>
                <Show when={controlsBefore()}>
                    <StepperControl direction='next' visible={showNextControl()} parentChildren={props.children} />
                </Show>

                <div class={styles.StepperItems + ' ' + (StepperItemsToken?.()?.class || '')} style={StepperItemsToken?.()?.style}>
                    <For each={StepperItems()}>
                        {(item) => <StepperItem item={item} />}
                    </For>
                </div>

                <Show when={controlsAfter()}>
                    <StepperControl direction='prev' visible={showPrevControl()} parentChildren={props.children} />
                </Show>
                <Show when={!props["controls-position"] || controlsAfter()}>
                    <StepperControl direction='next' visible={showNextControl()} parentChildren={props.children} />
                </Show>
            </div>
        </StepperContext.Provider >
    )
}

export default Object.assign(Stepper, { Items, Item, Control });