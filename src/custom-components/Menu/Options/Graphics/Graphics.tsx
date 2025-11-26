import ColorPreview from "@custom-components/Menu/ColorPreview/ColorPreview";
import MenuItem from "@custom-components/Menu/MenuItem/MenuItem";
import { ParentComponent } from "solid-js";
import CustomSlider from "@custom-components/Menu/CustomSlider/CustomSlider";
import Checkbox from "@components/Basic/Checkbox/Checkbox";
import CustomDropdown from "@custom-components/Menu/CustomDropdown/CustomDropdown";
import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment";
import CustomNumberInput from "@custom-components/Menu/CustomNumberInput/CustomNumberInput";
import GraphicsPreset from "./GraphicsPreset";
import Navigation from "@components/Utility/Navigation/Navigation";

const RESOLUTIONS = [
  { value: "1280x720",  label: "1280x720 (HD)" },
  { value: "1366x768",  label: "1366x768" },
  { value: "1440x900",  label: "1440x900" },
  { value: "1600x900",  label: "1600x900" },
  { value: "1680x1050", label: "1680x1050" },
  { value: "1920x1080", label: "1920x1080 (Full HD)" },
  { value: "2048x1152", label: "2048x1152" },
  { value: "2560x1440", label: "2560x1440 (QHD)" },
  { value: "3440x1440", label: "3440x1440 (UltraWide QHD)" },
  { value: "3840x2160", label: "3840x2160 (4K UHD)" },
]

const Graphics: ParentComponent = () => {
    return (
        <Navigation.Area name="graphics" focused>
            <MenuItem id="resolution" name='Resolution'>
                <CustomDropdown values={RESOLUTIONS} default={"1920x1080"} />
            </MenuItem>
            <MenuItem id="display" name='Display'>
                <CustomSegment values={['full screen', 'windowed', 'borderless' ]} default="full screen" />
            </MenuItem>
            <MenuItem id="brightness" name='Brightness'>
                <CustomSlider min={0} max={100} step={1} value={50} />
            </MenuItem>
            <MenuItem id="contrast" name='Contrast'>
                <CustomSlider min={0} max={100} step={1} value={50} />
            </MenuItem>
            <MenuItem id="crosshairColor" name='Crosshair color'>
                <ColorPreview id="crosshairColor" />
            </MenuItem>
            <MenuItem id="v-sync" name='V-sync'>
                <Checkbox>
                    <Checkbox.Label>On</Checkbox.Label>
                </Checkbox>
            </MenuItem>
            <MenuItem id="hudOpacity" name='HUD Opacity'>
                <CustomNumberInput min={0} max={100} value={100} />
            </MenuItem>
            <GraphicsPreset />
        </Navigation.Area>
    )
}

export default Graphics