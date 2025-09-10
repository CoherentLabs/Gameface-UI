import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { createSignal, For, onMount, ParentComponent} from "solid-js";
import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment";
import ExtraContent from "@custom-components/Menu/SidePanel/ExtraContent";
import CustomList from "@custom-components/Menu/CustomList/CustomList";
import { keybindPresetContent } from "@custom-components/Menu/SidePanel/keybindsPanelContent";
import eventBus from "@components/tools/EventBus";
import { SegmentRef } from "@components/Basic/Segment/Segment";
import { PRESETS, ROWS } from "./keybindPresets";
import Keybinds from "@components/Basic/Keybinds/Keybinds";
import KeyBind from "@components/Basic/Keybinds/Keybind";

const OPTIONS = ['PC', 'Tactical', 'Left-Handed', 'Custom'] as const;

const KeyBindsTab: ParentComponent = () => {
    const [preset, setPreset] = createSignal(PRESETS.PC);
    let segmentRef!: SegmentRef;

    onMount(() => {
        eventBus.on('button-changed', (data: {id: string, value: string}) => {
            segmentRef.selectOption("Custom");
            
            (PRESETS.Custom as any)[data.id] = data.value;
            setPreset({ ...PRESETS.Custom });
        })
    })

    return (
        <>
            <MenuItem id="keybindPreset" name="Keybind Preset">
                <CustomSegment
                    ref={segmentRef}
                    onChange={(v) => setPreset(PRESETS[v])}
                    values={OPTIONS}
                    default="PC"
                />
                <ExtraContent id="keybindPreset">
                    <CustomList values={keybindPresetContent} />
                </ExtraContent>
            </MenuItem>

            <Keybinds 
                onChange={(action, key) => eventBus.emit('button-changed', {id: action, value: key})}
                conflictPolicy="replace-existing"
                placeholder="Unbound">
                <For each={ROWS}>
                    {(row) => (
                        <MenuItem id={row.id} name={row.name}>
                            <KeyBind action={row.id} value={preset()[row.id]} />
                        </MenuItem>
                    )}
                </For>
            </Keybinds>
        </>
    )
}

export default KeyBindsTab