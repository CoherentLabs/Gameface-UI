import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createSignal, ParentComponent, Show, createContext, createMemo, For, DEV } from "solid-js";
import { JSX } from "@solidjs/web";
import styles from './Stepper.module.scss';
import { Control, StepperControl } from "./StepperControl";
import { Item, StepperItem } from "./StepperItem";
import { createTokenComponent, useToken, useTokens } from '@components/utils/tokenComponents';
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";
import exposeRef from "@components/utils/exposeRef";

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

// `null` default: the parts read it optionally (pattern 1.3.o).
export const StepperContext = createContext<StepperContextProps | null>(null);

interface ItemsTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
}
const Items = createTokenComponent<ItemsTokenProps>();

const Stepper: ParentComponent<StepperProps> = (props) => {
    const StepperItemsToken = useToken(Items, () => props.children);
    const StepperItems = useTokens(Item, () => StepperItemsToken?.()?.children);

    const [selected, setSelected] = createSignal('');
    const [selectedIndex, setSelectedIndex] = createSignal(-1);
    const options: string[] = [];

    // Solid 2 stages signal writes: the 1.x code called onChange(selected())
    // right after setSelected(), which would now pass the previous value. The
    // logic reads these always-current plain copies instead.
    let curIndex = -1;
    let curValue = '';
    const select = (index: number) => {
        curIndex = index;
        curValue = options[index];
        setSelectedIndex(index);
        setSelected(curValue);
    };

    const registerOption = (value: string, selected?: boolean) => {
        if (options.indexOf(value) !== -1) {
            if (DEV) console.warn(`Unable to register "${value}" stepper option because it has been already registered. The stepper option value should be unique. Please use another value for this option.`)
            return;
        }
        options.push(value);
        if (selected || options.length === 1) select(options.length - 1);
    }

    const unregisterOption = (value: string) => {
        const index = options.indexOf(value);
        if (index !== -1) options.splice(index, 1);
        if (curIndex === index) select(index - 1);
    }

    // A user/ref change: reported at the write, once per change (selecting the current option is skipped).
    const change = (index: number) => {
        if (index === curIndex) return;
        select(index);
        props.onChange?.(curValue);
    }

    const changeSelected = (direction: 'next' | 'prev') => {
        if (props.disabled) return;

        if (!props.loop) {
            if (direction === 'next' && curIndex === options.length - 1) return;
            if (direction === 'prev' && curIndex === 0) return;
        }

        if (direction === 'next') {
            change((curIndex + 1) % options.length);
        } else if (direction === 'prev') {
            change((curIndex - 1 + options.length) % options.length);
        }
    }

    const setOption = (value: string) => {
        if (props.disabled) return;

        const index = options.indexOf(value);
        if (index !== -1) {
            change(index);
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

    const controlsBefore = createMemo(() => props["controls-position"] === 'before');
    const controlsAfter = createMemo(() => props["controls-position"] === 'after');

    const defaultActions = {
        'move-left': () => { changeSelected('prev'); },
        'move-right': () => { changeSelected('next'); },
    }

    return (
        <StepperContext value={{ selected, registerOption, unregisterOption, changeSelected }}>
            <div
                class={[styles.stepper, props.disabled && styles.disabled, props.disabled && props['class-disabled'], props.class]}
                style={props.style}
                ref={[
                    exposeRef<Omit<StepperRef, 'element'>>(props, { selected, setOption, options }),
                    baseComponent(props),
                    navigationActions(mergeNavigationActions(props, defaultActions)),
                ]}
            >
                <Show when={!props["controls-position"] || controlsBefore()}>
                    <StepperControl direction='prev' visible={showPrevControl()} parentChildren={props.children} />
                </Show>
                <Show when={controlsBefore()}>
                    <StepperControl direction='next' visible={showNextControl()} parentChildren={props.children} />
                </Show>

                <div class={[styles['stepper-items'], StepperItemsToken?.()?.class]} style={StepperItemsToken?.()?.style}>
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
        </StepperContext>
    )
}

export default Object.assign(Stepper, { Items, Item, Control });
