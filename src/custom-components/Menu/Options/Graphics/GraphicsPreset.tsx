import CustomSegment from "@custom-components/Menu/CustomSegment/CustomSegment"
import MenuItem from "@custom-components/Menu/MenuItem/MenuItem"
import { createSignal, For, Show } from "solid-js"
import Block from "@components/Layout/Block/Block";
import List from "@components/Layout/List/List";
import { graphicPresetContent } from "@custom-components/Menu/SidePanel/graphicsPanelContent";
import style from './GraphicsPreset.module.scss';
import CustomSlider from "@custom-components/Menu/CustomSlider/CustomSlider";
import Checkbox from "@components/Basic/Checkbox/Checkbox";
import ExtraContent from "@custom-components/Menu/SidePanel/ExtraContent";

const GraphicsPreset = () => {
    const [value, setValue] = createSignal('medium');
    return (
        <>
            <MenuItem id="graphicsPreset" name='Graphics Preset'>
                <CustomSegment 
                    onChange={(selected) => setValue(selected)} 
                    values={['low', 'medium', 'high', 'ultra', 'custom']} 
                    default={value()} />
            </MenuItem>
            <Show when={value() === 'custom'}>
                <Block class={style.nested}>
                    <MenuItem id="textureQuality" name="Texture Quality">
                        <CustomSegment custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="shadowQuality" name="Shadow Quality">
                        <CustomSegment custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="medium" />
                    </MenuItem>

                    <MenuItem id="viewDistance" name="View Distance">
                        <CustomSegment custom-class={style['segment-small']} values={['short','medium','long','ultra']} default="long" />
                    </MenuItem>

                    <MenuItem id="lodQuality" name="Level of Detail (LOD)">
                        <CustomSegment custom-class={style['segment-small']} values={['low','medium','high']} default="high" />
                    </MenuItem>

                    <MenuItem id="antiAliasing" name="Anti-Aliasing">
                        <CustomSegment 
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`} 
                            values={['off','fxaa','smaa','taa']} default="taa" />
                    </MenuItem>

                    <MenuItem id="upscaling" name="Upscaling">
                        <CustomSegment 
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`}
                            values={['off','dlss','fsr','xess']} default="off" />
                    </MenuItem>

                    <MenuItem id="upscalerSharpness" name="Upscaler Sharpness">
                        <CustomSlider min={0} max={100} step={1} value={20} />
                    </MenuItem>

                    <MenuItem id="renderScale" name="Render Scale (%)">
                        <CustomSlider min={50} max={200} step={5} value={100} />
                    </MenuItem>

                    <MenuItem id="anisotropicFiltering" name="Anisotropic Filtering">
                        <CustomSegment 
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`} 
                            values={['off','2x','4x','8x','16x']} default="16x" />
                    </MenuItem>

                    <MenuItem id="ambientOcclusion" name="Ambient Occlusion">
                        <CustomSegment 
                            custom-class={`${style['segment-small']} ${style['segment-uppercase']}`}
                            values={['off','ssao','hbao+']} default="ssao" />
                    </MenuItem>

                    <MenuItem id="globalIllumination" name="Global Illumination">
                        <CustomSegment 
                            custom-class={style['segment-small']}
                            values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="screenSpaceReflections" name="Screen-Space Reflections">
                        <CustomSegment custom-class={style['segment-small']} values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="reflectionsQuality" name="Reflections Quality">
                        <CustomSegment custom-class={style['segment-small']} values={['off','low','medium','high']} default="high" />
                    </MenuItem>

                    <MenuItem id="volumetricFog" name="Volumetrics / Fog">
                        <CustomSegment custom-class={style['segment-small']} values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="postProcessingQuality" name="Post-Processing Quality">
                        <CustomSegment custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="bloom" name="Bloom">
                        <CustomSlider min={0} max={100} step={1} value={40} />
                    </MenuItem>

                    <MenuItem id="motionBlur" name="Motion Blur">
                        <CustomSlider min={0} max={100} step={1} value={0} />
                    </MenuItem>

                    <MenuItem id="depthOfField" name="Depth of Field">
                        <CustomSegment custom-class={style['segment-small']}values={['off','low','medium','high']} default="low" />
                    </MenuItem>

                    <MenuItem id="filmGrain" name="Film Grain">
                        <CustomSlider min={0} max={100} step={1} value={0} />
                    </MenuItem>

                    <MenuItem id="chromaticAberration" name="Chromatic Aberration">
                        <Checkbox><Checkbox.Label>On</Checkbox.Label></Checkbox>
                    </MenuItem>

                    <MenuItem id="tessellation" name="Tessellation">
                        <CustomSegment custom-class={style['segment-small']} values={['off','low','medium','high']} default="medium" />
                    </MenuItem>

                    <MenuItem id="waterQuality" name="Water Quality">
                        <CustomSegment custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="foliageDensity" name="Foliage Density">
                        <CustomSegment custom-class={style['segment-small']} values={['low','medium','high','ultra']} default="high" />
                    </MenuItem>

                    <MenuItem id="hdr" name="HDR">
                        <Checkbox><Checkbox.Label>On</Checkbox.Label></Checkbox>
                    </MenuItem>
                </Block>
            </Show>

            <ExtraContent id="graphicsPreset">
                <List class={style.list} bullet-class={style['list-icon']}>
                        <For each={graphicPresetContent}>{(c) => (
                            <List.Item class={style['list-item']}>{c}</List.Item>
                        )}</For>
                    </List>
            </ExtraContent>
        </>
    )
}

export default GraphicsPreset