import { BaseComponentRef, ComponentProps } from "@components/types/ComponentProps";
import { Accessor, createMemo, DEV, onMount, ParentComponent } from "solid-js";
import { createContext, createSignal } from "solid-js";
import styles from './Segment.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { SegmentButtons } from "./SegmentButtons";
import { Button } from "./SegmentButton";
import SegmentIndicator, { Indicator } from "./SegmentIndicator";

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
}

interface SegmentContextValue {
    selected: Accessor<string>,
    selectOption: selectOptionMethod,
    registerOption: (value: string, element: HTMLDivElement, selected?: boolean) => void
    unregisterOption: (value: string) => void
}

interface SegmentProps extends ComponentProps {
    disabled?: boolean;
    'class-disabled'?: string;
    onChange?: (selected: string) => void;
}

const Segment: ParentComponent<SegmentProps> = (props) => {
    const [selected, setSelected] = createSignal('');
    const [indicator, setIndicator] = createSignal<SegmentIndicatorData>({
        width: 0,
        left: 0,
        showTransition: false,
    });
    
    const options = new Map<string, HTMLDivElement>();
    let element!: HTMLDivElement;

    const registerOption = (value: string, element: HTMLDivElement, selected?: boolean) => {
        options.set(value, element);
        if (selected) selectOption(value);
    };

    const unregisterOption = (value: string) => options.delete(value);

    const selectOption = (newOption: string) => {
        if (props.disabled) return;

        if (!options.has(newOption)) {
            if (DEV) console.warn(`Cannot select "${newOption}" as it is not a valid option in the segment.`);
            return;
        }

        const oldOption = selected();

        if (oldOption !== '') {
            const oldLeft   = options.get(oldOption)!.offsetLeft;
            const oldWidth  = options.get(oldOption)!.offsetWidth;

            setIndicator({
                showTransition: false,
                left: oldLeft,
                width: oldWidth
            });
        }

        const newLeft  = options.get(newOption)!.offsetLeft;
        const newWidth = options.get(newOption)!.offsetWidth;

        setSelected(newOption);

        setTimeout(() => {
            setIndicator({
                showTransition: true,
                left: newLeft,
                width: newWidth
            });
        }, 50);

        props.onChange?.(newOption);
    }

    const segmentClasses = createMemo(() => {
        const classes = [styles.Segment];

        if (props.disabled) {
            if (props['class-disabled']) classes.push(`${styles.Disabled} ${props['class-disabled']}`);
            else classes.push(styles.Disabled);
        }

        return classes.join(' ');
    });

    props.componentClasses = () => segmentClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            selected,
            selectOption,
            element,
        });
    });

    return (
        <SegmentContext.Provider value={{ selected, selectOption, registerOption, unregisterOption }}>
            <div class={styles['Segment-Wrapper']}>
                <div ref={element}
                    class={className()}
                    style={inlineStyles()}
                    use:forwardEvents={props}
                    use:forwardAttrs={props}>
                    <SegmentButtons parentChildren={props.children} />
                    <SegmentIndicator data={indicator} parentChildren={props.children} />
                </div>
            </div>
        </SegmentContext.Provider>
    );
}

export default Object.assign(Segment, { Button, Indicator });
