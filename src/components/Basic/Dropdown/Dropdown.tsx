import {
    Accessor,
    createContext,
    createMemo,
    createSignal,
    JSX,
    ParentComponent,
} from 'solid-js';

import style from './Dropdown.module.css';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { DropdownOptions, Option } from './DropdownOptions';

export const DropdownContext = createContext<DropdownContextValue>();

type setSelectedMethod = (selected: string) => void;
type setOpenMethod = (isOpen: false) => void;

interface DropdownContextValue {
    selected: Accessor<string>;
    setSelected: setSelectedMethod;
    open: Accessor<boolean>;
    setOpen: setOpenMethod;
}

interface DropdownProps { } //add multiple for T2

interface DropdownTriggerProps {
    style?: JSX.CSSProperties;
    class?: string;
}
const Trigger = createTokenComponent<DropdownTriggerProps>();
const Icon = createTokenComponent<DropdownTriggerProps>();

const Dropdown: ParentComponent<DropdownProps> = (props) => {
    const [selected, setSelected] = createSignal('Apple');
    const [open, setOpen] = createSignal(false);

    const TriggerToken = useToken(Trigger, props.children);
    const IconToken = useToken(Icon, props.children);

    const triggerStyles = createMemo(() => {
        const token = TriggerToken?.();
        return token && token.style ? { ...token.style } : {};
    });

    return (
        <DropdownContext.Provider value={{ selected, setSelected, open, setOpen }}>
            <div class={style.dropdown}>
                <div onClick={() => setOpen((prev) => !prev)} class={style['dropdown-box'] + ` ${TriggerToken?.()?.class}`} style={triggerStyles()}>
                    <div class={style['dropdown-selected']}>{selected()}</div>
                    <div class={style['dropdown-icon']}>
                        {IconToken?.()?.children || (
                            <svg
                                width="80%"
                                height="80%"
                                viewBox="0 0 213 308"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6 104.5L108.5 6L157.75 55.25L207 104.5"
                                    stroke="#666666"
                                    stroke-width="25"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M207 203.5L104.5 302L55.25 252.75L5.99999 203.5"
                                    stroke="#666666"
                                    stroke-width="25"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <DropdownOptions parentChildren={props.children}></DropdownOptions>
            </div>
        </DropdownContext.Provider>
    );
};

export default Object.assign(Dropdown, { Trigger, Icon, Option });
