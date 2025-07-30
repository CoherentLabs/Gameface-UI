import { ParentComponent, useContext, For, createMemo } from 'solid-js';
import { CommonDropdownSlotProps, DropdownContext } from './Dropdown';
import style from './Dropdown.module.scss';
import { createTokenComponent, useToken, useTokens } from '@components/utils/tokenComponents';
import { TokenComponentProps } from '@components/types/ComponentProps';
import Scroll from '@components/Layout/Scroll/Scroll';
import { BarTokenProps } from '@components/Layout/Scroll/ScrollBar';
import { HandleTokenProps } from '@components/Layout/Scroll/ScrollHandle';
import { DropdownOption, Option } from './DropdownOption';

export const Track = createTokenComponent<BarTokenProps>();
export const Handle = createTokenComponent<HandleTokenProps>();
export const Options = createTokenComponent<CommonDropdownSlotProps>();

export const DropdownOptions: ParentComponent<TokenComponentProps> = (props) => {
    const dropdown = useContext(DropdownContext);
    const OptionsToken = useToken(Options, props.parentChildren);
    const OptionsTokens = useTokens(Option, OptionsToken?.()?.children);
    const TrackToken = useToken(Track, props.parentChildren);
    const HandleToken = useToken(Handle, props.parentChildren);

    const optionsClasses = createMemo(() => {
        const classes = [style['dropdown-options']];

        if (OptionsToken?.()?.class) classes.push(OptionsToken?.()?.class as string);
        if (dropdown?.open()) classes.push(style['dropdown-options-visible']);

        return classes.join(' ');
    })

    return (
        <div class={optionsClasses()} style={OptionsToken?.()?.style}>
            <Scroll>
                <Scroll.Content>
                    <For each={OptionsTokens()}>
                        {(option) => <DropdownOption option={option} />}
                    </For>
                </Scroll.Content>
                <Scroll.Bar {...(TrackToken?.() || {})}>
                    <Scroll.Handle {...(HandleToken?.() || {})}></Scroll.Handle>
                </Scroll.Bar>
            </Scroll>
        </div>
    );
};