import { ParentComponent, JSX, createMemo, useContext, createEffect, For, Show } from 'solid-js';
import { DropdownContext } from './Dropdown';

import style from './DropdownOptions.module.css';
import { createTokenComponent, useTokens } from '@components/utils/tokenComponents';
import { TokenComponentProps } from '@components/types/ComponentProps';

interface OptionTokenProps {
    value: string;
    style?: JSX.CSSProperties;
    class?: string;
    classSelected?: string;
    classDisabled?: string;
    selected?: boolean;
    disabled?: boolean;
}

export const Option = createTokenComponent<OptionTokenProps>();

export const DropdownOptions: ParentComponent<TokenComponentProps> = (props) => {
    const dropdown = useContext(DropdownContext);
    const options = useTokens(Option, props.parentChildren);

    // const selectedClass = createMemo((test) => {
    //     if (props.selected || props.value === dropdown?.selected()) {
    //         return style['dropdown-option-selected'];
    //     }
    //     return '';
    // });

    const onClickOption = (option: OptionTokenProps) => {
        dropdown?.setSelected(option.value);
        dropdown?.setOpen(false);
    }

    return (
        <Show when={dropdown?.open()}>
            <div class={`${style['dropdown-options']}`}>
                <For each={options()}>
                    {(option) => {
                        return <div
                            onclick={() => onClickOption(option)}
                            class={`${style['dropdown-option']}
                ${option.value === dropdown?.selected() ? style['dropdown-option-selected'] : ''}
                ${option.class || ''}
                ${option.classSelected || ''} ${option.classDisabled || ''}`}
                            style={option.style}
                        >
                            {option.children}
                        </div>
                    }}
                </For>
            </div>
        </Show >
    );
};
