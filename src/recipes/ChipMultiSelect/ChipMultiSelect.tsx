import { Component, createEffect, createSignal, For, on, Show } from "solid-js";
import { countries } from "./utils/countriesList";
import styles from "./ChipMultiSelect.module.scss";
import Dropdown, { DropdownRef } from "@components/Basic/Dropdown/Dropdown";
import Flex from "@components/Layout/Flex/Flex";
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage";
import FLAG_SRC from "./utils/imageMap";

interface DropdownProps {
    value: string[],
    onChange: (selected: string[]) => void,
}

const ChipMultiSelect: Component<DropdownProps> = (props) => {
    let dropdownRef!: DropdownRef;

    return (
        <div class={styles.wrapper}>
            <Dropdown
                ref={dropdownRef}
                value={props.value}
                multiple
                class={styles.dropdown}
                onChange={(values) => props.onChange(values as string[])}
            >
                <Dropdown.Placeholder class={styles['dropdown-placeholder']}>
                    {props.value.length ? `${props.value.length} selected` : 'Any'}
                </Dropdown.Placeholder>
                <Dropdown.Trigger class={styles['dropdown-trigger']} />
                <Dropdown.Icon class={styles['dropdown-icon']} />
                <Dropdown.Track class={styles['dropdown-scrollbar']} />
                <Dropdown.Handle class={styles['dropdown-handle']} />
                <Dropdown.Options class={styles['dropdown-options']}>
                    <For each={countries}>{(country) => (
                        <Dropdown.Option
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
                        </Dropdown.Option>
                    )}</For>
                </Dropdown.Options>
            </Dropdown>

            <Show when={props.value.length} fallback={<div style={{position: 'absolute'}} />}>
                <div class={styles.chips}>
                    <For each={props.value}>{(value) => (
                        <div class={styles.chip}>
                            {/* PLACEHOLDER */}
                            <Flex
                                justify-content="center"
                                align-items="center"
                                class={styles['dropdown-option-content-image']}
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

export default ChipMultiSelect;
