import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { createSignal, For, onMount, ParentComponent} from "solid-js";
import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment";
import ExtraContent from "@custom-components/Menu/SidePanel/ExtraContent";
import CustomList from "@custom-components/Menu/CustomList/CustomList";
import { keybindPresetContent } from "@custom-components/Menu/SidePanel/keybindsPanelContent";
import KeyBind from "@custom-components/Menu/KeyBind/KeyBind";
import eventBus from "@components/tools/EventBus";
import { SegmentRef } from "@components/Basic/Segment/Segment";
import { PRESETS, ROWS } from "./keybindPresets";

const OPTIONS = ['PC', 'Tactical', 'Left-Handed', 'Custom'] as const;

const KeyBinds: ParentComponent = () => {
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

            <For each={ROWS}>
                {(row) => (
                    <MenuItem id={row.id} name={row.name}>
                        <KeyBind id={row.id} default={preset()[row.id]} />
                    </MenuItem>
                )}
            </For>
        </>
    )
}

export default KeyBinds