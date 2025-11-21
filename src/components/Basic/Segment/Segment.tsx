import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createMemo, DEV, onCleanup, onMount, ParentComponent, Show } from "solid-js";
import { createContext, createSignal } from "solid-js";
import styles from './Segment.module.scss';
import { SegmentButtons } from "./SegmentButtons";
import { Button } from "./SegmentButton";
import SegmentIndicator, { Indicator } from "./SegmentIndicator";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import mergeNavigationActions from "@components/utils/mergeNavigationActions";

export const SegmentContext = createContext<SegmentContextValue>();
export interface SegmentIndicatorData {
    left: number,
    width: number,
    showTransition: boolean,
}

type selectOptionMethod = (newOption: string) => void;

export interface SegmentRef extends BaseComponentRef {
    selected: Accessor<string>,
    selectOption: selectOptionMethod;
    changeSelected: (direction: 'prev' | 'next') => void,
}

interface SegmentContextValue {
    selected: Accessor<string>,
    selectOption: selectOptionMethod,
    registerOption: (value: string, element: HTMLDivElement, selected?: boolean) => void
    unregisterOption: (value: string) => void,
    firstRender: Accessor<boolean>,
}

interface SegmentProps extends ComponentProps {
    disabled?: boolean;
    'class-disabled'?: string;
    onChange?: (selected: string) => void;
}

const Segment: ParentComponent<SegmentProps> = (props) => {
    const [selected, setSelected] = createSignal('');
    const [firstRender, setFirstRender] = createSignal(true);
    const [indicator, setIndicator] = createSignal<SegmentIndicatorData>({
        width: 0,
        left: 0,
        showTransition: false,
    });

    const options = new Map<string, HTMLDivElement>();
    const orderedOptions: string[] = [];
    let element!: HTMLDivElement;
    let transitionTimeout: ReturnType<typeof setTimeout>

    const registerOption = (value: string, element: HTMLDivElement, selected?: boolean) => {
        options.set(value, element);
        
        if (!orderedOptions.includes(value)) {
            orderedOptions.push(value); 
        }

        if (selected) selectOption(value);
    };

    const unregisterOption = (value: string) => {
        options.delete(value);

        const idx = orderedOptions.indexOf(value);
        if (idx !== -1) orderedOptions.splice(idx, 1)
    };

    const selectOption = (newOption: string) => {
        if (props.disabled) return;

        if (!options.has(newOption)) {
            if (DEV) console.warn(`Cannot select "${newOption}" as it is not a valid option in the segment.`);
            return;
        }

        const oldOption = selected();

        if (oldOption !== '') {
            const oldLeft = options.get(oldOption)!.offsetLeft;
            const oldWidth = options.get(oldOption)!.offsetWidth;

            setIndicator({
                showTransition: false,
                left: oldLeft,
                width: oldWidth
            });

            firstRender() && setFirstRender(false);
        }

        const newLeft = options.get(newOption)!.offsetLeft;
        const newWidth = options.get(newOption)!.offsetWidth;

        setSelected(newOption);

        transitionTimeout = setTimeout(() => {
            setIndicator({
                showTransition: true,
                left: newLeft,
                width: newWidth
            });
        }, 50);

        if (!firstRender()) props.onChange?.(newOption);
    }

    const changeSelected = (direction: 'prev' | 'next') => {
        const curIdx = orderedOptions.indexOf(selected());
        const targetIdx = direction === 'prev' ? curIdx - 1 : curIdx + 1;

        if (targetIdx >= 0 && targetIdx < orderedOptions.length) {
            selectOption(orderedOptions[targetIdx])
        }   
    }

    const segmentClasses = createMemo(() => {
        const classes = [styles.segment];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.disabled} ${props['class-disabled']}`);
            else classes.push(styles.disabled);
        }

        return classes.join(' ');
    });

    props.componentClasses = () => segmentClasses();

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            selected,
            selectOption,
            changeSelected,
            element,
        });
    });

    onCleanup(() => {
        window.clearTimeout(transitionTimeout);
    })
    
    const defaultActions = {
        "move-left": () => changeSelected('prev'), 
        'move-right': () => changeSelected('next')
    }

    return (
        <SegmentContext.Provider value={{ selected, selectOption, registerOption, unregisterOption, firstRender }}>
            <div class={styles['segment-wrapper']}>
                <div ref={element}
                    use:baseComponent={props}
                    use:navigationActions={mergeNavigationActions(props, defaultActions)}
                >
                    <SegmentButtons parentChildren={props.children} />
                    <Show when={!firstRender()}>
                        <SegmentIndicator data={indicator} parentChildren={props.children} />
                    </Show>
                </div>
            </div>
        </SegmentContext.Provider>
    );
}

export default Object.assign(Segment, { Button, Indicator });
