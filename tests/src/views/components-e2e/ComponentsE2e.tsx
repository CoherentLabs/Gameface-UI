import Tabs from '@components/Layout/Tabs/Tabs';
import styles from './ComponentsE2e.module.scss';
import TabLink from '@components/Layout/TabLink/TabLink';
import Tab from '@components/Layout/Tab/Tab';
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
import TwoHandleSliderTest from '../../components/TwoHandleSlider/TwoHandleSliderTest';
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
import KeybindsTest from '../../components/Keybinds/KeybindsTest';
import ProgressTest from '../../components/Progress';
import RadialMenuTest from '../../components/RadialMenu/RadialMenuTest';
import TutorialTest from '../../components/Tutorial/TutorialTest';
import TrackersTest from '../../components/Trackers/TrackersTest';

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
        "two-handle-slider",
        "xy-slider",
        "toggle",
        "pagination",
        'keybinds',
        "accordion",
        "text-input",
        "password-input",
        "number-input",

        //Feedback components
        'modal',
        'tooltip',
        'toaster',
        "progress-bar",
        "progress-circle",

        // Complex components
        "color-picker",
        "carousel",
        "radial-menu",
        "tutorial",

        // Performance components
        "trackers",

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

                <Tab location='base'><BaseTest /></Tab>
                <Tab location='button'><ButtonTest /></Tab>
                <Tab location='checkbox'><CheckboxTest /></Tab>
                <Tab location='segment'><SegmentTest /></Tab>
                <Tab location='radio'><RadioTest /></Tab>
                <Tab location='stepper'><StepperTest /></Tab>
                <Tab location='dropdown'><DropdownTest /></Tab>
                <Tab location='absolute'><PositionTest Component={Absolute} baseClass='absolute' /></Tab>
                <Tab location='relative'><PositionTest Component={Relative} baseClass='relative' /></Tab>
                <Tab location='transform'><TransformTest /></Tab>
                <Tab location='scroll'><ScrollTest /></Tab>
                <Tab location='media'><MediaTest /></Tab>
                <Tab location='slider'><SliderTest /></Tab>
                <Tab location='text-slider'><TextSliderTest /></Tab>
                <Tab location='two-handle-slider'><TwoHandleSliderTest /></Tab>
                <Tab location='xy-slider'><XYSliderTest /></Tab>
                <Tab location='toggle'><ToggleButtonTest /></Tab>
                <Tab location='color-picker'><ColorPickerTest /></Tab>
                <Tab location='accordion'><AccordionTest /></Tab>
                <Tab location='text-input'><TextInputTest /></Tab>
                <Tab location='password-input'><PasswordInputTest /></Tab>
                <Tab location='number-input'><NumberInputTest /></Tab>
                <Tab location='pagination'><PaginationTest /></Tab>
                <Tab location='modal'><ModalTest /></Tab>
                <Tab location='list'><ListTest /></Tab>
                <Tab location='carousel'><CarouselTest /></Tab>
                <Tab location='tooltip'><TooltipTest /></Tab>
                <Tab location='toaster'><ToasterTest /></Tab>
                <Tab location='keybinds'><KeybindsTest /></Tab>
                {/* ProgressTest renders its own progress-bar/progress-circle <Tab>s
                    internally - it shares one signal set across both locations, so
                    it can't be hoisted 1:1 like the others. */}
                <ProgressTest />
                <Tab location='radial-menu'><RadialMenuTest /></Tab>
                <Tab location='tutorial'><TutorialTest /></Tab>
                <Tab location='trackers'>
                    <TrackersTest />
                </Tab>
            </Tabs>
        </div>
    );
};

export default Main;