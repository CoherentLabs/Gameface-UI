import Stepper from "@components/Basic/Stepper/Stepper";
import ColorPreview from "@custom-components/Menu/ColorPreview/ColorPreview";
import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { createSignal, ParentComponent, Setter, Show, useContext } from "solid-js";
import SubtitleSize from "@custom-components/Menu/SubtitleSize/SubtitleSize";
import CustomSlider from "@custom-components/Menu/CustomSlider/CustomSlider";
import CustomToggle from "@custom-components/Menu/CustomToggle/CustomToggle";
import Block from "@components/Layout/Block/Block";
import CustomDropdown from "@custom-components/Menu/CustomDropdown/CustomDropdown";
import { emitChange } from "../../../../views/menu/util";
import Navigation from "@components/Navigation/Navigation/Navigation";

const Gameplay: ParentComponent = () => {
    const [showSubtitleOptions, setShowSubtitleOptions] = createSignal(true);

    return (
        <Navigation.Area name="content" selector="menu-item">
            <MenuItem id="difficulty" name='Difficulty'>
                <Stepper anchor='#difficulty' onChange={emitChange} style={{width: '15vmax'}}>
                    <Stepper.Items>
                        <Stepper.Item value='Easy'>Easy</Stepper.Item>
                        <Stepper.Item value='Normal' selected>Normal</Stepper.Item>
                        <Stepper.Item value='Hard'>Hard</Stepper.Item>
                        <Stepper.Item value='Nightmare'>Nightmare</Stepper.Item>
                    </Stepper.Items>
                    <Stepper.Control style={{"border-radius": 0}} />
                </Stepper>
            </MenuItem>
            <MenuItem id="subtitles" name='Subtitles'>
                <CustomToggle anchor="#subtitles" checked={showSubtitleOptions()} onChange={(checked) => setShowSubtitleOptions(checked)} />
            </MenuItem>
            <Show when={showSubtitleOptions()}>
                <Block style={{"padding-left": '2vmax'}}>
                    <MenuItem id="subtitleSize" name='Subtitle size'>
                        <SubtitleSize id="subtitleSize" />
                    </MenuItem>
                    <MenuItem id="subtitleColor" name='Subtitle Color'>
                        <ColorPreview id="subtitleColor" />
                    </MenuItem>
                    <MenuItem id="subtitleLanguage" name="Subtitle Language">
                        <CustomDropdown
                            anchor="#subtitleLanguage"
                            values={[
                                { value: "en", label: "English" },
                                { value: "de", label: "Deutsch" },
                                { value: "es", label: "Español" },
                                { value: "fr", label: "Français" },
                            ]}
                            default="en"
                        />
                </MenuItem>
                </Block>
            </Show>
            <MenuItem id="fov" name='Field of view'>
                <CustomSlider min={1} max={10} step={0.1} value={3.5} />
            </MenuItem>
            <MenuItem id="mouseSensitivity" name='Mouse sensitivity'>
                <CustomSlider step={0.1} min={1} max={10} value={3.3} />
            </MenuItem>
            <MenuItem id="tutorialHints" name='Tutorial Hints'>
                <CustomToggle anchor="#tutorialHints" checked={true} />
            </MenuItem>
            <MenuItem id="autoSave" name='Auto-Save'>
                <CustomToggle anchor="#autoSave" checked={false} />
            </MenuItem>
            <MenuItem id="aimAssist" name='Aim Assist'>
                <CustomToggle anchor="#aimAssist" checked={false} />
            </MenuItem>
            <MenuItem id="vibration" name='Controller Vibration'>
                <CustomToggle anchor="#vibration" checked={true} />
            </MenuItem>
        </Navigation.Area>
    )
}

export default Gameplay