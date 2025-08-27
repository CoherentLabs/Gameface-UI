import Dropdown from "@components/Basic/Dropdown/Dropdown"
import style from '../MenuItem/MenuItem.module.scss';
import { For } from "solid-js";
import { emitChange } from "../../../views/menu/util";

interface CustomDropdownProps {
    values: { value: string, label: string }[],
    default: string,
}

const CustomDropdown = (props: CustomDropdownProps) => {
    const test = () => {
        console.log('hey droppy')
        emitChange()
    }
    return (
        <Dropdown onChange={test} class={style.dropdown}>
            <Dropdown.Options class={style["dropdown-options"]}>
                <For each={props.values}>
                {(opt) => (
                    <Dropdown.Option class={style['dropdown-option']} value={opt.value} selected={opt.value === props.default}>
                    {opt.label}
                    </Dropdown.Option>
                )}
                </For>
            </Dropdown.Options>

            <Dropdown.Icon class={style['dropdown-icon']} />
            <Dropdown.Trigger class={style["dropdown-trigger"]} />
            <Dropdown.Track  class={style['dropdown-scroll-bar']} />
            <Dropdown.Handle class={style['dropdown-scroll-handle']} />
        </Dropdown>
    )
}

export default CustomDropdown