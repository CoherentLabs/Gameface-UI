import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment"
import MenuItem from "@custom-components/Menu/MenuItem/MenuItem"
import { createSignal, Show } from "solid-js"
import Block from "@components/Layout/Block/Block";
import { graphicPresetContent } from "@custom-components/Menu/SidePanel/graphicsPanelContent";
import style from './GraphicsPreset.module.scss';
import CustomSlider from "@custom-components/Menu/CustomSlider/CustomSlider";
import ExtraContent from "@custom-components/Menu/SidePanel/ExtraContent";
import CustomList from "@custom-components/Menu/CustomList/CustomList";
import CustomCheckbox from "@custom-components/Menu/CustomCheckbox/CustomCheckbox";

const GraphicsPreset = () => {
    const [value, setValue] = createSignal('medium');
    return (
        <>
            <MenuItem id="graphicsPreset" name='Graphics Preset'>
                <CustomSegment 
                    id="graphicsPreset"
                    onChange={(selected) => setValue(selected)} 
                    values={['low', 'medium', 'high', 'ultra', 'custom']} 
                    default={value()} />
            </MenuItem>
            <Show when={value() === 'custom'}>
                <Block class={style.nested}>
                    <MenuItem id="textureQuality" name="Texture Quality">
                        <CustomSegment id="textureQuality" custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="shadowQuality" name="Shadow Quality">
                        <CustomSegment id="shadowQuality" custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="medium" />
                    </MenuItem>

                    <MenuItem id="viewDistance" name="View Distance">
                        <CustomSegment id="viewDistance" custom-class={style['segment-small']} values={['short','medium','long','ultra']} default="long" />
                    </MenuItem>

                    <MenuItem id="lodQuality" name="Level of Detail (LOD)">
                        <CustomSegment id="lodQuality" custom-class={style['segment-small']} values={['low','medium','high']} default="high" />
                    </MenuItem>

                    <MenuItem id="antiAliasing" name="Anti-Aliasing">
                        <CustomSegment 
                            id="antiAliasing"
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`} 
                            values={['off','fxaa','smaa','taa']} default="taa" />
                    </MenuItem>

                    <MenuItem id="upscaling" name="Upscaling">
                        <CustomSegment 
                            id="upscaling"
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`}
                            values={['off','dlss','fsr','xess']} default="off" />
                    </MenuItem>

                    <MenuItem id="upscalerSharpness" name="Upscaler Sharpness">
                        <CustomSlider id="upscalerSharpness" min={0} max={100} step={1} value={20} />
                    </MenuItem>

                    <MenuItem id="renderScale" name="Render Scale (%)">
                        <CustomSlider id="renderScale" min={50} max={200} step={5} value={100} />
                    </MenuItem>

                    <MenuItem id="anisotropicFiltering" name="Anisotropic Filtering">
                        <CustomSegment 
                            id="anisotropicFiltering"
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`} 
                            values={['off','2x','4x','8x','16x']} default="16x" />
                    </MenuItem>

                    <MenuItem id="ambientOcclusion" name="Ambient Occlusion">
                        <CustomSegment 
                            id="ambientOcclusion"
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`}
                            values={['off','ssao','hbao+']} default="ssao" />
                    </MenuItem>

                    <MenuItem id="globalIllumination" name="Global Illumination">
                        <CustomSegment 
                            id="globalIllumination"
                            custom-class={style['segment-small']}
                            values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="screenSpaceReflections" name="Screen-Space Reflections">
                        <CustomSegment id="screenSpaceReflections" custom-class={style['segment-small']} values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="reflectionsQuality" name="Reflections Quality">
                        <CustomSegment id="reflectionsQuality" custom-class={style['segment-small']} values={['off','low','medium','high']} default="high" />
                    </MenuItem>

                    <MenuItem id="volumetricFog" name="Volumetrics / Fog">
                        <CustomSegment id="volumetricFog" custom-class={style['segment-small']} values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="postProcessingQuality" name="Post-Processing Quality">
                        <CustomSegment id="postProcessingQuality" custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="bloom" name="Bloom">
                        <CustomSlider id="bloom" min={0} max={100} step={1} value={40} />
                    </MenuItem>

                    <MenuItem id="motionBlur" name="Motion Blur">
                        <CustomSlider id="motionBlur" min={0} max={100} step={1} value={0} />
                    </MenuItem>

                    <MenuItem id="depthOfField" name="Depth of Field">
                        <CustomSegment id="depthOfField" custom-class={style['segment-small']} values={['off','low','medium','high']} default="low" />
                    </MenuItem>

                    <MenuItem id="filmGrain" name="Film Grain">
                        <CustomSlider id="filmGrain" min={0} max={100} step={1} value={0} />
                    </MenuItem>

                    <MenuItem id="chromaticAberration" name="Chromatic Aberration">
                        <CustomCheckbox id="chromaticAberration" />
                    </MenuItem>

                    <MenuItem id="tessellation" name="Tessellation">
                        <CustomSegment id="tessellation" custom-class={style['segment-small']} values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="waterQuality" name="Water Quality">
                        <CustomSegment id="waterQuality" custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="foliageDensity" name="Foliage Density">
                        <CustomSegment id="foliageDensity" custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="hdr" name="HDR">
                        <CustomCheckbox id="hdr" />
                    </MenuItem>
                </Block>
            </Show>

            <ExtraContent id="graphicsPreset">
                <CustomList values={graphicPresetContent} />
            </ExtraContent>
        </>
    )
}

export default GraphicsPreset