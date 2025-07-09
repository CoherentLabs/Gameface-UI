import { createMemo, createSignal, onMount, ParentComponent } from "solid-js";
import XYSlider, { XYSliderRef, XYSliderValue } from "@components/Basic/XYSlider/XYSlider";
import Slider, { SliderRef } from "@components/Basic/Slider/Slider";
import Segment from "@components/Basic/Segment/Segment";
import styles from './ColorPicker.module.css';
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { ComponentProps } from "@components/types/ComponentProps";
import { parseHSVAColor, RGBAOrHEXToHSVA } from "./colorPickerUtils";

export interface ColorData {
    h: number;
    s: number;
    v: number;
    a: number;
}

export interface ColorPickerRef {
    value: () => ColorData;
    changeColor: (newColor: ColorData) => void;
    element: HTMLDivElement;
}

interface ColorPickerProps extends ComponentProps {
    value?: string;
    onChange?: (value: ColorData) => void;
}

const ColorPicker: ParentComponent<ColorPickerProps> = (props) => {
    let element!: HTMLDivElement;
    let xySliderRef!: XYSliderRef;
    let hueSliderRef!: SliderRef;
    let alphaSliderRef!: SliderRef;
    let changingColorFromRef = false;

    const initialValue = RGBAOrHEXToHSVA(props.value ?? 'rgba(255, 0, 0, 1)');
    const [color, setColor] = createSignal(initialValue);
    const [selectedFormat, setSelectedFormat] = createSignal("hex");

    const updateColor = (updates: Partial<ColorData>) => {
        setColor((prev) => {
            const newColor = { ...prev, ...updates };
            props.onChange?.(newColor);
            return newColor;
        });
    }

    const handleXYChange = ({ x, y }: XYSliderValue) => {
        if (changingColorFromRef) return;

        updateColor({ s: parseFloat(x.toFixed(2)), v: parseFloat((100 - y).toFixed(2)) })
    }
    const handleHueChange = (hue: number) => {
        if (changingColorFromRef) return;

        updateColor({ h: hue })
    }
    const handleAlphaChange = (alpha: number) => {
        if (changingColorFromRef) return;

        updateColor({ a: alpha * 0.01 });
    }

    const createRGBA = (updates: Partial<ColorData> = {}) => parseHSVAColor({ ...color(), ...updates }).rgba;

    const selectedColorHue = createMemo(() => createRGBA({ s: 100, v: 100, a: 1 }));
    const selectedColor = createMemo(() => createRGBA());
    const selectedColorNonTransparent = createMemo(() => createRGBA({ a: 1 }));

    const XYSliderBackground = createMemo(() => {
        const rgba = createRGBA({ s: 100, v: 100, a: 1 });
        return { 'background-image': `linear-gradient(rgba(0,0,0,0),#000),linear-gradient(90deg,#fff, ${rgba})` };
    });

    const colorTextValue = createMemo(() => {
        const { rgba, hex } = parseHSVAColor(color());
        return selectedFormat() === "hex" ? hex : rgba;
    });

    const colorPickerClasses = createMemo(() => {
        const classes = [styles.ColorPicker];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    });

    const changeColor = (newColor: ColorData) => {
        changingColorFromRef = true;

        xySliderRef.changeValue({ x: newColor.s, y: 100 - newColor.v });
        hueSliderRef.changeValue(newColor.h);
        alphaSliderRef.changeValue(newColor.a * 100);
        updateColor(newColor);

        changingColorFromRef = false;
    }

    props.componentClasses = () => colorPickerClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            value: color,
            changeColor,
            element,
        });
    });

    return (
        <div ref={element}
            class={className()}
            style={inlineStyles()}
            use:forwardEvents={props}
            use:forwardAttrs={props}>
            <XYSlider ref={xySliderRef} value={{ x: initialValue.s, y: 100 - initialValue.v }} class={styles.XYSlider} onChange={handleXYChange}>
                <XYSlider.Background style={XYSliderBackground()} />
                <XYSlider.Handle class={styles.XYSliderHandle} style={{ "background-color": selectedColorNonTransparent() }}></XYSlider.Handle>
            </XYSlider>
            <Slider ref={hueSliderRef} min={0} max={360} value={initialValue.h} onChange={handleHueChange} class={styles.HueSlider}>
                <Slider.Track class={styles.HueSliderTrack} />
                <Slider.Fill class={styles.SliderFill}></Slider.Fill>
                <Slider.Handle class={styles.SliderHandle} style={{ background: selectedColorHue() }} />
            </Slider>
            <Slider ref={alphaSliderRef} value={initialValue.a * 100} onChange={handleAlphaChange} class={styles.AlphaSlider}>
                <Slider.Track class={styles.AlphaSliderTrack} style={{ 'background-image': `linear-gradient(to right,transparent 0% , ${selectedColorNonTransparent()} 100% )` }} />
                <Slider.Fill class={styles.SliderFill}></Slider.Fill>
                <Slider.Handle class={styles.SliderHandle} style={{ background: selectedColor() }} />
            </Slider>
            <Segment class={styles.Segment} onChange={(value) => setSelectedFormat(value)}>
                <Segment.Indicator class={styles.SegmentIndicator}></Segment.Indicator>
                <Segment.Button class={styles.SegmentButton} selected value="hex">HEX</Segment.Button>
                <Segment.Button class={styles.SegmentButton} value="rgba">RGBA</Segment.Button>
            </Segment>
            <div class={styles.ColorPreviewWrapper}>
                <div class={styles.ColorPreview}>
                    <div class={styles.ColorPreviewBox} style={{ 'background-color': selectedColor() }}></div>
                </div>
                <input readOnly class={styles.ColorPreviewText} value={colorTextValue()} />
            </div>
        </div >
    );
};

export default ColorPicker;