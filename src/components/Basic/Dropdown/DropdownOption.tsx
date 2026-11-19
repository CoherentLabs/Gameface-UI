import { ParentComponent, useContext, ParentProps, onCleanup, onSettled, Show, untrack } from 'solid-js';
import { CommonDropdownSlotProps, DropdownContext } from './Dropdown';
import { createTokenComponent } from '@components/utils/tokenComponents';
import { navigationActions } from '@components/BaseComponent/BaseComponent';
import style from './Dropdown.module.scss';

export interface OptionTokenProps extends CommonDropdownSlotProps {
    value: string;
    selected?: boolean
    'class-selected'?: string;
    'class-disabled'?: string;
    disabled?: boolean;
}

export const Option = createTokenComponent<OptionTokenProps>();

export const DropdownOption: ParentComponent<{ option: ParentProps<OptionTokenProps> }> = (props) => {
    const dropdown = useContext(DropdownContext);
    let element: HTMLDivElement | undefined

    const onClickOption = (option: ParentProps<OptionTokenProps>) => {
        dropdown?.selectOption(option.value);
        if (!dropdown?.multiple()) dropdown?.toggle(false);
    }

    // Resolved here, not in onSettled: markup children create reactive nodes, which onSettled forbids.
    const label = untrack(() => props.option.children);

    onSettled(() => {
        untrack(() => dropdown?.registerOption(props.option.value, label, element!, props.option.selected));
    })

    onCleanup(() => {
        untrack(() => dropdown?.unregisterOption(props.option.value));
    })

    const optionClasses = (option: ParentProps<OptionTokenProps>) => {
        const isSelected = dropdown?.isSelected(option.value);
        return [
            style['dropdown-option'],
            option.class,
            isSelected && style['dropdown-option-selected'],
            isSelected && option['class-selected'],
            option.disabled && style['dropdown-option-disabled'],
            option.disabled && option['class-disabled'],
        ];
    }

    return <div
        // Plain attribute (was `attr:disabled`, which is a compile error on native elements in Solid 2).
        //@ts-ignore
        disabled={props.option.disabled || undefined}
        onClick={() => onClickOption(props.option)}
        onMouseOver={(e: MouseEvent) => (e.currentTarget as HTMLElement).focus()}
        class={optionClasses(props.option)}
        style={{...props.option.style}}
        ref={[
            (node: HTMLDivElement) => { element = node; },
            navigationActions({'select': () => {
                dropdown?.selectOption(props.option.value)
                if (!dropdown?.multiple()) dropdown?.handleNavigationClose();
            }}),
        ]}
    >
        <Show when={props.option.children}>
            {props.option.children}
        </Show>
        <Show when={!props.option.children}>
            {' '}
        </Show>
    </div>
};
