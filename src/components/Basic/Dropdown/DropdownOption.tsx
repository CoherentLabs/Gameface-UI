import { ParentComponent, useContext, ParentProps, onCleanup, onMount, Show } from 'solid-js';
import { CommonDropdownSlotProps, DropdownContext } from './Dropdown';
import style from './Dropdown.module.scss';
import { createTokenComponent } from '@components/utils/tokenComponents';
import useBaseComponent from '@components/BaseComponent/BaseComponent';

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

    const onClickOption = (option: ParentProps<OptionTokenProps>) => {
        dropdown?.selectOption(option.value);
        dropdown?.toggle(false);
    }

    onMount(() => {
        dropdown?.registerOption(props.option.value, props.option.children, props.option.selected);
    })

    onCleanup(() => {
        dropdown?.unregisterOption(props.option.value);
    })

    const optionClasses = (option: ParentProps<OptionTokenProps>) => {
        const classes = [style['dropdown-option']];

        if (option.class) classes.push(option.class);
        if (option.value === dropdown?.selected()) {
            classes.push(style['dropdown-option-selected']);
            classes.push('selected');
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
        onclick={() => onClickOption(props.option)}
        class={optionClasses(props.option)}
        style={props.option.style}
        use:navigationActions={{'select': () => {
            if (dropdown?.open()) return; // it's backawrds because this method executes when the dropdown is already toggled off
            dropdown?.selectOption(props.option.value)
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