import { createMemo, createSignal, onMount, ParentComponent } from "solid-js";
import XYSlider, { XYSliderRef, XYSliderValue } from "@components/Basic/XYSlider/XYSlider";
import Slider, { SliderRef } from "@components/Basic/Slider/Slider";
import Segment from "@components/Basic/Segment/Segment";
import styles from './ColorPicker.module.scss';
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
    value: () => { rgba: string, hex: string };
    changeColor: (newColor: string) => void;
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
        const classes = [styles['color-picker']];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    });

    const changeColor = (newColor: string) => {
        const parsedColor = RGBAOrHEXToHSVA(newColor);

        changingColorFromRef = true;
        xySliderRef.changeValue({ x: parsedColor.s, y: 100 - parsedColor.v });
        hueSliderRef.changeValue(parsedColor.h);
        alphaSliderRef.changeValue(parsedColor.a * 100);
        updateColor(parsedColor);

        changingColorFromRef = false;
    }

    props.componentClasses = () => colorPickerClasses();
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            value: () => parseHSVAColor(color()),
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
            {/**
             * XYSlider component is used for selecting color based on saturation and value.
             * If you need to customize the XYSlider, you can pass additional styles or use its slots.
             * For more information about how you can customize it you can check the XYSlider documentation - https://gameface-ui.coherent-labs.com/components/basic/xy-slider/.
             */}
            <XYSlider ref={xySliderRef} value={{ x: initialValue.s, y: 100 - initialValue.v }} class={styles.XYSlider} onChange={handleXYChange}>
                <XYSlider.Background style={XYSliderBackground()} />
                <XYSlider.Handle class={styles['XYSlider-handle']} style={{ "background-color": selectedColorNonTransparent() }}></XYSlider.Handle>
            </XYSlider>
            {/**
             * Here the slider component is used for selecting hue and alpha values.
             * If you need to customize this slider, you can pass additional styles or use its slots.
             * For more information about how you can customize it you can check the Slider documentation - https://gameface-ui.coherent-labs.com/components/basic/slider/.
             */}
            <Slider ref={hueSliderRef} min={0} max={360} value={initialValue.h} onChange={handleHueChange} class={styles['hue-slider']}>
                <Slider.Track class={styles['hue-slider-track']} />
                <Slider.Fill class={styles['slider-fill']}></Slider.Fill>
                <Slider.Handle class={styles['slider-handle']} style={{ background: selectedColorHue() }} />
            </Slider>
            {/**
             * Here the slider component is used for selecting the alpha value.
             * If you need to customize this slider, you can pass additional styles or use its slots.
             * For more information about how you can customize it you can check the Slider documentation - https://gameface-ui.coherent-labs.com/components/basic/slider/.
             */}
            <Slider ref={alphaSliderRef} value={initialValue.a * 100} onChange={handleAlphaChange} class={styles['alpha-slider']}>
                <Slider.Track class={styles['alpha-slider-track']} style={{ 'background-image': `linear-gradient(to right,transparent 0% , ${selectedColorNonTransparent()} 100% )` }} />
                <Slider.Fill class={styles['slider-fill']}></Slider.Fill>
                <Slider.Handle class={styles['slider-handle']} style={{ background: selectedColor() }} />
            </Slider>
            {/**
             * The Segment component is used for changing the color preview format between HEX and RGBA.
             * If you need to customize this segment component, you can pass additional styles or use its slots.
             * For more information about how you can customize it you can check the Segment documentation - https://gameface-ui.coherent-labs.com/components/basic/segment/.
             */}
            <Segment class={styles.segment} onChange={(value) => setSelectedFormat(value)}>
                <Segment.Indicator class={styles['segment-indicator']}></Segment.Indicator>
                <Segment.Button class={styles['segment-button']} selected value="hex">HEX</Segment.Button>
                <Segment.Button class={styles['segment-button']} value="rgba">RGBA</Segment.Button>
            </Segment>
            <div class={styles['color-preview-wrapper']}>
                <div class={styles['color-preview']}>
                    <div class={styles['color-preview-box']} style={{ 'background-color': selectedColor() }}></div>
                </div>
                <input readOnly class={styles['color-preview-text']} value={colorTextValue()} />
            </div>
        </div >
    );
};

export default ColorPicker;