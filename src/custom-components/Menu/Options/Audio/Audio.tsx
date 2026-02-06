import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { ParentComponent} from "solid-js";
import CustomSlider from "@custom-components/Menu/CustomSlider/CustomSlider";
import CustomNumberInput from "@custom-components/Menu/CustomNumberInput/CustomNumberInput";
import CustomDropdown from "@custom-components/Menu/CustomDropdown/CustomDropdown";
import Navigation from "@components/Utility/Navigation/Navigation";
import CustomCheckbox from "@custom-components/Menu/CustomCheckbox/CustomCheckbox";

const Audio: ParentComponent = () => {
    return (
        <Navigation.Area name="audio" focused>
            <MenuItem id="masterVolume" name="Master Volume">
                <CustomSlider id="masterVolume" min={0} max={100} step={1} value={100} />
            </MenuItem>

            <MenuItem id="musicVolume" name="Music Volume">
                <CustomSlider id="musicVolume" min={0} max={100} step={1} value={60} />
            </MenuItem>

            <MenuItem id="sfxVolume" name="SFX Volume">
                <CustomSlider id="sfxVolume" min={0} max={100} step={1} value={80} />
            </MenuItem>

            <MenuItem id="voiceChatVolume" name="Voice Chat Volume">
                <CustomSlider id="voiceChatVolume" min={0} max={100} step={1} value={70} />
            </MenuItem>

            <MenuItem id="muteAll" name="Mute All">
                <CustomCheckbox id="muteAll" />
            </MenuItem>

            <MenuItem id="voiceChatDelay" name="Voice Chat Delay (ms)">
                <CustomNumberInput id="voiceChatDelay" min={0} max={500} value={0} />
            </MenuItem>

            <MenuItem id="outputDevice" name="Output Device">
                <CustomDropdown
                    id="outputDevice"
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
                    id="audioLanguage"
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
        </Navigation.Area>
    );

}

export default Audio