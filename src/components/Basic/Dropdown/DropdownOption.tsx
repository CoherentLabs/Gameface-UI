import { ParentComponent, useContext, ParentProps, onCleanup, onMount, Show } from 'solid-js';
import { CommonDropdownSlotProps, DropdownContext } from './Dropdown';
import { createTokenComponent } from '@components/utils/tokenComponents';
import useBaseComponent from '@components/BaseComponent/BaseComponent';
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
        dropdown?.toggle(false);
    }

    onMount(() => {
        dropdown?.registerOption(props.option.value, props.option.children, element!, props.option.selected);
    })

    onCleanup(() => {
        dropdown?.unregisterOption(props.option.value);
    })

    const optionClasses = (option: ParentProps<OptionTokenProps>) => {
        const classes = [style['dropdown-option']];

        if (option.class) classes.push(option.class);
        if (option.value === dropdown?.selected()) {
            classes.push(style['dropdown-option-selected']);
            if (option['class-selected']) classes.push(option['class-selected']);
        }
        if (option.disabled) {
            classes.push(style['dropdown-option-disabled']);
            if (option['class-disabled']) classes.push(option['class-disabled']);
        }

        return classes.join(' ');
    }

    const { navigationActions } = useBaseComponent(props);

    return <div
        ref={element}
        //@ts-ignore
        attr:disabled={props.option.disabled || undefined}
        onclick={() => onClickOption(props.option)}
        onMouseOver={(e: MouseEvent) => (e.currentTarget as HTMLElement).focus()}
        class={optionClasses(props.option)}
        style={{...props.option.style, color: "initial"}}
        use:navigationActions={{'select': () => {
            dropdown?.selectOption(props.option.value)
            dropdown?.handleNavigationClose();
        }}}
    >
        <Show when={props.option.children}>
            {props.option.children}
        </Show>
        <Show when={!props.option.children}>
            {' '}
        </Show>
    </div>
};