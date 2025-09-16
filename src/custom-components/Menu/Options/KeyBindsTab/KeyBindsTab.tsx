import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { For, ParentComponent} from "solid-js";
import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment";
import ExtraContent from "@custom-components/Menu/SidePanel/ExtraContent";
import CustomList from "@custom-components/Menu/CustomList/CustomList";
import { keybindPresetContent } from "@custom-components/Menu/SidePanel/keybindsPanelContent";
import { SegmentRef } from "@components/Basic/Segment/Segment";
import { PRESETS, ROWS } from "./keybindPresets";
import Keybinds, { KeybindsRef } from "@components/Basic/Keybinds/Keybinds";
import Keybind from "@components/Basic/Keybinds/Keybind";

const OPTIONS = ['PC', 'Tactical', 'Left-Handed', 'Custom'] as const;

const KeyBindsTab: ParentComponent = () => {
    let segmentRef!: SegmentRef;
    let keybindsRef!: KeybindsRef;

    const handleKeybindChange = () => {
        if (segmentRef.selected() !== "Custom") segmentRef.selectOption("Custom");
    } 

    return (
        <>
            <MenuItem id="keybindPreset" name="Keybind Preset">
                <CustomSegment
                    ref={segmentRef}
                    onChange={(v) => {
                        if (v === "Custom") return;  
                        keybindsRef.mapBindings(PRESETS[v]);
                    }}
                    values={OPTIONS}
                    default="PC"
                />
                <ExtraContent id="keybindPreset">
                    <CustomList values={keybindPresetContent} />
                </ExtraContent>
            </MenuItem>

            <Keybinds
                onChange={handleKeybindChange}
                ref={keybindsRef}
                conflictPolicy="replace-existing"
                placeholder="Unbound"
                defaults={PRESETS.PC}>
                <For each={ROWS}>
                    {(row) => (
                        <MenuItem id={row.id} name={row.name}>
                            <Keybind action={row.id} />
                        </MenuItem>
                    )}
                </For>
            </Keybinds>
        </>
    )
}

export default KeyBindsTab