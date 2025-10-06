import Tabs from '@components/Layout/Tabs/Tabs';
import styles from './Main.module.css';
import TabLink from '@components/Layout/TabLink/TabLink';
import Flex from '@components/Layout/Flex/Flex';
import { For } from 'solid-js';
import CheckboxTest from '../../components/Checkbox/CheckboxTest';
import SegmentTest from '../../components/Segment/SegmentTest';
import RadioTest from '../../components/Radio/RadioTest';
import StepperTest from '../../components/Stepper/StepperTest';
import DropdownTest from '../../components/Dropdown/DropdownTest';
import ButtonTest from '../../components/Button/ButtonTest';
import PositionTest from '../../components/Position/PositionTest';
import Absolute from '@components/Layout/Absolute/Absolute';
import Relative from '@components/Layout/Relative/Relative';
import TransformTest from '../../components/Transform/Transform';
import ScrollTest from '../../components/Scroll/ScrollTest';
import MediaTest from '../../components/Media/MediaTest';
import BaseTest from '../../components/Base/BaseTest';
import SliderTest from '../../components/Slider/SliderTest';
import TextSliderTest from '../../components/TextSlider/TextSliderTest';
import XYSliderTest from '../../components/XYSlider/XYSliderTest';
import ToggleButtonTest from '../../components/toggleButton/ToggleButton';
import ColorPickerTest from '../../components/ColorPicker/ColorPickerTest';
import AccordionTest from '../../components/Accordion/AccordionTest';
import TextInputTest from '../../components/Input/TextInputTest';
import PasswordInputTest from '../../components/Input/PasswordInputTest';
import NumberInputTest from '../../components/Input/NumberInputTest';
import PaginationTest from '../../components/Pagination/PaginationTest';
import ModalTest from '../../components/Modal/ModalTest';
import ListTest from '../../components/List/ListTest';
import CarouselTest from '../../components/Carousel/CarouselTest';
import TooltipTest from '../../components/Tooltip/TooltipTest';
import ToasterTest from '../../components/Toaster/ToasterTest';

const Main = () => {
    const components = [
        // Basic components
        "button",
        "checkbox",
        "dropdown",
        "radio",
        "segment",
        "stepper",
        "slider",
        "text-slider",
        "xy-slider",
        "toggle",
        "pagination",

        //Feedback components
        'modal',
        'tooltip',

        // Complex components
        "color-picker",
        "carousel",
        "accordion",
        "text-input",
        "password-input",
        "number-input",

        // Layout components
        "absolute",
        "relative",
        "transform",
        "scroll",
        "list",

        // Media
        'media',
        // base
        'base',

        // Feedback
        'toaster',
    ]

    return (
        <div class={styles.Main}>
            <Tabs default={components[0]}>

                <Flex class={styles['TabLink-Container']} align-items='center' wrap='wrap'>
                    <For each={components}>
                        {(component) => (
                            <TabLink location={component} class={`${styles.TabLink} ${component}-link`} activeClass={styles['Active-Tab']}>{component}</TabLink>
                        )}
                    </For>
                </Flex>

                <BaseTest />
                <ButtonTest />
                <CheckboxTest />
                <SegmentTest />
                <RadioTest />
                <StepperTest />
                <DropdownTest />
                <PositionTest Component={Absolute} baseClass='absolute' location='absolute' />
                <PositionTest Component={Relative} baseClass='relative' location='relative' />
                <TransformTest />
                <ScrollTest />
                <MediaTest />
                <SliderTest />
                <TextSliderTest />
                <XYSliderTest />
                <ToggleButtonTest />
                <ColorPickerTest />
                <AccordionTest />
                <TextInputTest />
                <PasswordInputTest />
                <NumberInputTest />
                <PaginationTest />
                <ModalTest />
                <ListTest />
                <CarouselTest />
                <TooltipTest />
                <ToasterTest />
            </Tabs>
        </div>
    );
};

export default Main;