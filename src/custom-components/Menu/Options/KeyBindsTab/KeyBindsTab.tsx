import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { createEffect, For, on, ParentComponent, Show, useContext} from "solid-js";
import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment";
import ExtraContent from "@custom-components/Menu/SidePanel/ExtraContent";
import CustomList from "@custom-components/Menu/CustomList/CustomList";
import { keybindPresetContent } from "@custom-components/Menu/SidePanel/keybindsPanelContent";
import { SegmentRef } from "@components/Basic/Segment/Segment";
import { PRESETS, PRESETS_GAMEPAD, ROWS } from "./keybindPresets";
import Keybinds, { KeybindsRef } from "@components/Basic/Keybinds/Keybinds";
import Keybind from "@components/Basic/Keybinds/Keybind";
import Navigation, { useNavigation } from "@components/Utility/Navigation/Navigation";
import { MenuContext } from "../../../../views/menu/Menu";

const OPTIONS = ['Default', 'Tactical', 'Left-Handed', 'Custom'] as const;
const KeyOverrides = {
    "0": "Mouse Left",
    "2": "Mouse Right"
}

const KeyBindsTab: ParentComponent = () => {
    let segmentRef!: SegmentRef;
    let keybindsRef!: KeybindsRef;
    let menu = useContext(MenuContext);
    let nav = useNavigation();

    const handleKeybindChange = () => {
        if (segmentRef.selected() !== "Custom") segmentRef.selectOption("Custom");
    }

    createEffect(on(menu!.inputType, () => {
            if (!nav) return;
            nav.registerArea('menu', ['.menu-item'], true)
        })
    );

    return (
        <>
            <MenuItem id="keybindPreset" name="Keybind Preset">
                <CustomSegment
                    id="keybindPreset"
                    ref={segmentRef}
                    onChange={(v) => {
                        if (v === "Custom") return;
                        const preset = menu?.inputType() === 'gamepad' ? PRESETS_GAMEPAD : PRESETS
                        keybindsRef.mapBindings(preset[v]);
                    }}
                    values={OPTIONS}
                    default="Default"
                />
                <ExtraContent id="keybindPreset">
                    <CustomList values={keybindPresetContent} />
                </ExtraContent>
            </MenuItem>

            <Show when={menu?.inputType() === 'keyboard'}>
                <Keybinds
                    onChange={handleKeybindChange}
                    ref={keybindsRef}
                    overrides={KeyOverrides}
                    conflictPolicy="replace-existing"
                    placeholder="Unbound"
                    defaults={PRESETS.Default}>
                    <For each={ROWS}>
                        {(row) => (
                            <MenuItem id={row.id} name={row.name}>
                                <Keybind anchor={`#${row.id}`} action={row.id} />
                            </MenuItem>
                        )}
                    </For>
                </Keybinds>
            </Show>

            <Show when={menu?.inputType() === 'gamepad'}>
                <Keybinds
                    onChange={handleKeybindChange}
                    ref={keybindsRef}
                    mode="gamepad"
                    conflictPolicy="replace-existing"
                    placeholder="Unbound"
                    defaults={PRESETS_GAMEPAD.Default}>
                    <For each={ROWS}>
                        {(row) => (
                            <MenuItem id={row.id} name={row.name}>
                                <Keybind anchor={`#${row.id}`} action={row.id} />
                            </MenuItem>
                        )}
                    </For>
                </Keybinds>
            </Show>
        </>
    )
}

export default KeyBindsTab