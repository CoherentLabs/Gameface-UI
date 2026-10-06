import DropdownBase, { DropdownRef } from "@components/Basic/Dropdown/Dropdown";
import { Component, createEffect, createSignal, For, on, Show } from "solid-js";
import { countries } from "../store/playersStore";
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage";
import Flex from "@components/Layout/Flex/Flex";
import styles from "./Dropdown.module.scss";
import FLAG_SRC from "../utils/flagImages";

interface DropdownProps {
    value: string[],
    onChange: (selected: string[]) => void,
}

const Dropdown: Component<DropdownProps> = (props) => {
    let dropdownRef!: DropdownRef;

    return (
        <div class={styles.wrapper}>
            <DropdownBase
                ref={dropdownRef}
                value={props.value}
                multiple
                class={styles.dropdown}
                onChange={(values) => props.onChange(values as string[])}
            >
                <DropdownBase.Placeholder class={styles['dropdown-placeholder']}>
                    {props.value.length ? `${props.value.length} selected` : 'Any'}
                </DropdownBase.Placeholder>
                <DropdownBase.Trigger class={styles['dropdown-trigger']} />
                <DropdownBase.Icon class={styles['dropdown-icon']} />
                <DropdownBase.Track class={styles['dropdown-scrollbar']} />
                <DropdownBase.Handle class={styles['dropdown-handle']} />
                <DropdownBase.Options class={styles['dropdown-options']}>
                    <For each={countries()}>{(country) => (
                        <DropdownBase.Option
                            class={styles['dropdown-option']}
                            class-selected={styles['dropdown-option-selected']}
                            value={country.code}
                        >
                            <div class={styles['dropdown-option-content']}>
                                <div>{country.name}</div>

                                {/* PLACEHOLDER */}
                                <Flex
                                    justify-content="center"
                                    align-items="center"
                                    class={styles['dropdown-option-content-image']}
                                    style={{ 'background-color': 'gray', 'color': 'white', 'text-align': 'center' }}
                                    >{country.code}</Flex>

                                {/* ORIGINAL */}
                                {/* <BackgroundImage
                                    class={styles['dropdown-option-content-image']}
                                    src={FLAG_SRC[country.code]} /> */}
                            </div>
                        </DropdownBase.Option>
                    )}</For>
                </DropdownBase.Options>
            </DropdownBase>

            <Show when={props.value.length} fallback={<div style={{position: 'absolute'}} />}>
                <div class={styles.chips}>
                    <For each={props.value}>{(value) => (
                        <div class={styles.chip}>
                            {/* PLACEHOLDER */}
                            <Flex
                                justify-content="center"
                                align-items="center"
                                class={styles['chip-image']}
                                style={{ 'background-color': 'gray', 'color': 'white', 'text-align': 'center' }}
                                >{value}</Flex>

                            {/* ORIGINAL */}
                            {/* <BackgroundImage
                                class={styles['chip-image']}
                                src={FLAG_SRC[value]} /> */}
                            <div
                                class={styles['chip-remove']}
                                onClick={() => dropdownRef.deselectOption(value)}
                            >
                                x
                            </div>
                        </div>
                    )}</For>
                </div>
            </Show>
        </div>
    );
};

export default Dropdown;
