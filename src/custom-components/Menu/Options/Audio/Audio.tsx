import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { createSignal, For, onMount, ParentComponent} from "solid-js";
import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment";
import ExtraContent from "@custom-components/Menu/SidePanel/ExtraContent";
import CustomList from "@custom-components/Menu/CustomList/CustomList";
import { keybindPresetContent } from "@custom-components/Menu/SidePanel/keybindsPanelContent";
import KeyBind from "@custom-components/Menu/KeyBind/KeyBind";
import eventBus from "@components/Utility/EventBus";
import { SegmentRef } from "@components/Basic/Segment/Segment";
import Dropdown from "@components/Basic/Dropdown/Dropdown";
import Checkbox from "@components/Basic/Checkbox/Checkbox";
import NumberInput from "@components/Basic/Input/NumberInput/NumberInput";
import CustomSlider from "@custom-components/Menu/CustomSlider/CustomSlider";
import CustomNumberInput from "@custom-components/Menu/CustomNumberInput/CustomNumberInput";
import CustomDropdown from "@custom-components/Menu/CustomDropdown/CustomDropdown";

const Audio: ParentComponent = () => {
    return (
        <>
            {/* Levels */}
            <MenuItem id="masterVolume" name="Master Volume">
                <CustomSlider min={0} max={100} step={1} value={100} />
            </MenuItem>

            <MenuItem id="musicVolume" name="Music Volume">
                <CustomSlider min={0} max={100} step={1} value={60} />
            </MenuItem>

            <MenuItem id="sfxVolume" name="SFX Volume">
                <CustomSlider min={0} max={100} step={1} value={80} />
            </MenuItem>

            <MenuItem id="voiceChatVolume" name="Voice Chat Volume">
                <CustomSlider min={0} max={100} step={1} value={70} />
            </MenuItem>

            <MenuItem id="muteAll" name="Mute All">
                <Checkbox>
                    <Checkbox.Label>On</Checkbox.Label>
                </Checkbox>
            </MenuItem>

            <MenuItem id="voiceChatDelay" name="Voice Chat Delay (ms)">
                <CustomNumberInput min={0} max={500} value={0} />
            </MenuItem>

            {/* Devices / languages */}
            <MenuItem id="outputDevice" name="Output Device">
                <CustomDropdown
                    values={[
                        { value: "system", label: "System Default" },
                        { value: "speakers-realtek", label: "Speakers (Realtek)" },
                        { value: "headset-usb", label: "Headset (USB)" },
                        { value: "headphones-bt", label: "Headphones (Bluetooth)" },
                        { value: "virtual-cable", label: "VB-Audio Virtual Cable" },
                    ]}
                    default="system"
                />
            </MenuItem>

            <MenuItem id="audioLanguage" name="Audio Language">
                 <CustomDropdown
                    values={[
                        { value: "system", label: "System Default" },
                        { value: "en", label: "English" },
                        { value: "de", label: "Deutsch" },
                        { value: "es", label: "Español" },
                        { value: "fr", label: "Français" },
                    ]}
                    default="system"
                />
            </MenuItem>
        </>
    );

}

export default Audio