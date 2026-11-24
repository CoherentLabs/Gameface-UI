import { createMemo, ParentComponent, Show, useContext } from 'solid-js';
import style from './Dropdown.module.scss';
import { createTokenComponent, tokenAttrs, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';
import DropdownIcon from './DropdownIcon.svg?component-solid';
import InlineTextBlock from '../InlineTextBlock/InlineTextBlock';
import { CommonDropdownSlotProps, DropdownContext } from './Dropdown';
import { TokenComponentProps } from '@components/types/ComponentProps';

export const Trigger = createTokenComponent();
export const Placeholder = createTokenComponent<CommonDropdownSlotProps>();
export const Icon = createTokenComponent<CommonDropdownSlotProps>();

export const DropdownTrigger: ParentComponent<TokenComponentProps> = (props) => {
    const dropdown = useContext(DropdownContext);
    const TriggerToken = useToken(Trigger, props.parentChildren);
    const PlaceholderToken = useToken(Placeholder, props.parentChildren);
    const IconToken = useToken(Icon, props.parentChildren);

    const triggerStyles = createMemo(() => {
        const token = TriggerToken?.();
        return token && token.style ? { ...token.style } : {};
    });

    const placeholderStyles = createMemo(() => {
        const token = PlaceholderToken?.();
        return token && token.style ? { ...token.style } : {};
    });

    const IconStyles = createMemo(() => {
        const token = IconToken?.();
        return token && token.style ? { ...token.style } : {};
    });

    return (
        <div onClick={() => dropdown?.toggle(!dropdown.open())} class={style['dropdown-trigger'] + ` ${TriggerToken?.()?.class || ''}`} style={triggerStyles()} use:forwardAttrs={TriggerToken()}>
            <div class={style['dropdown-trigger-selected']}>
                <Show when={dropdown?.selected()}>
                    {dropdown?.options.get(dropdown?.selected())?.label}
                </Show>
                <Show when={!dropdown?.selected()}>
                    <InlineTextBlock {...tokenAttrs(PlaceholderToken())} class={style['dropdown-placeholder'] + ` ${PlaceholderToken?.()?.class || ''}`} style={placeholderStyles()}>
                        <Show when={PlaceholderToken?.()}>
                            {PlaceholderToken?.()?.children || 'Select an option'}
                        </Show>
                        <Show when={!PlaceholderToken?.()}>
                            {' '}
                        </Show>
                    </InlineTextBlock>
                </Show>
            </div>
            <div class={style['dropdown-icon'] + ` ${IconToken?.()?.class || ''}`} style={IconStyles()} use:forwardAttrs={IconToken()}>
                <Show when={IconToken?.()}>
                    {IconToken?.()?.children || <DropdownIcon />}
                </Show>
            </div>
        </div>
    );
};
