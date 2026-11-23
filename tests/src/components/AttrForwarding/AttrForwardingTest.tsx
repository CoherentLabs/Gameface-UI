import { createSignal, JSX, onCleanup, onMount, ParentComponent } from 'solid-js';
import events from '../../../shared/attr-forwarding-events.json';
import Modal, { ModalRef } from '@components/Feedback/Modal/Modal';
import createTooltip from '@components/Feedback/Tooltip/tooltip';
import useToast from '@components/Feedback/Toast/toast';
import Tutorial, { TutorialRef } from '@components/Complex/Tutorial/Tutorial';
import Slider from '@components/Basic/Slider/Slider';
import TwoHandleSlider from '@components/Basic/TwoHandleSlider/TwoHandleSlider';
import XYSlider from '@components/Basic/XYSlider/XYSlider';
import TextSlider from '@components/Basic/TextSlider/TextSlider';
import ToggleButton from '@components/Basic/ToggleButton/ToggleButton';
import Checkbox from '@components/Basic/Checkbox/Checkbox';
import Radio from '@components/Basic/RadioGroup/Radio';
import Segment from '@components/Basic/Segment/Segment';
import Dropdown from '@components/Basic/Dropdown/Dropdown';
import TextInput from '@components/Basic/Input/TextInput/TextInput';
import NumberInput from '@components/Basic/Input/NumberInput/NumberInput';
import PasswordInput from '@components/Basic/Input/PasswordInput/PasswordInput';
import Accordion from '@components/Basic/Accordion/Accordion';
import Stepper from '@components/Basic/Stepper/Stepper';
import Pagination from '@components/Basic/Pagination/Pagination';
import Progress from '@components/Feedback/Progress/Progress';
import Scroll from '@components/Layout/Scroll/Scroll';
import List from '@components/Layout/List/List';
import RadialMenu from '@components/Complex/RadialMenu/RadialMenu';
import Carousel from '@components/Complex/Carousel/Carousel';
import Trackers from '@components/Performance/Trackers/Trackers';
import Grid from '@components/Layout/Grid/Grid';
import Layout from '@components/Layout/Layout/Layout';
import Column from '@components/Layout/Column/Column';

// Every slot (and every root with its own attr:* forwarding or a portal) gets `class="p-<name>"`
// and `attr:data-probe="<name>"`: the spec checks that both land on the same element, and that
// `data-tick` follows the tick signal. Props are written out, not spread from a helper: spreading
// a call onto a GFUI component makes its props a proxy that ignores `props.componentClasses = …`.

const cellStyle: JSX.CSSProperties = { width: '18vw', 'margin': '0.5vh' };
const Cell: ParentComponent = (props) => <div style={cellStyle}>{props.children}</div>;

const AttrForwardingTest = () => {
    const [tick, setTick] = createSignal(0);
    let modalRef!: ModalRef;
    let tutorialRef!: TutorialRef;
    const Tooltip = createTooltip({ action: 'hover' });
    const [Toaster] = useToast();

    const listeners: Record<string, () => void> = {
        [events.tick]: () => setTick((t) => t + 1),
        [events.openModal]: () => modalRef.open(),
        [events.closeModal]: () => modalRef.close(),
        [events.startTutorial]: () => tutorialRef.tour(),
        [events.exitTutorial]: () => tutorialRef.exit(),
    };

    onMount(() => Object.entries(listeners).forEach(([name, fn]) => document.addEventListener(name, fn)));
    onCleanup(() => Object.entries(listeners).forEach(([name, fn]) => document.removeEventListener(name, fn)));

    return (
        <Tutorial ref={tutorialRef} class="p-tutorial" attr:data-probe="tutorial" attr:data-tick={tick()}>
            <Tutorial.Spotlight class="p-tutorial-spotlight" attr:data-probe="tutorial-spotlight" attr:data-tick={tick()} />
            <Tutorial.Overlay class="p-tutorial-overlay" attr:data-probe="tutorial-overlay" attr:data-tick={tick()} />

            <div style={{ display: 'flex', 'flex-direction': 'row', 'flex-wrap': 'wrap', width: '100%' }}>
                {/* Interactive ones first, so they are on screen for gf.click. */}
                <Cell>
                    <Segment>
                        <Segment.Button selected value="a" class="p-segment-button" attr:data-probe="segment-button" attr:data-tick={tick()}>a</Segment.Button>
                        <Segment.Button value="b" class="segment-b">b</Segment.Button>
                        <Segment.Indicator class="p-segment-indicator" attr:data-probe="segment-indicator" attr:data-tick={tick()} />
                    </Segment>
                </Cell>

                <Cell>
                    <Dropdown>
                        <Dropdown.Trigger class="dropdown-scroll-trigger" />
                        {/* Fixed height so the options overflow and Scroll renders the Track/Handle. */}
                        <Dropdown.Options style={{ height: '6vh' }}>
                            <Dropdown.Option value="1">1</Dropdown.Option>
                            <Dropdown.Option value="2">2</Dropdown.Option>
                            <Dropdown.Option value="3">3</Dropdown.Option>
                            <Dropdown.Option value="4">4</Dropdown.Option>
                            <Dropdown.Option value="5">5</Dropdown.Option>
                            <Dropdown.Option value="6">6</Dropdown.Option>
                            <Dropdown.Option value="7">7</Dropdown.Option>
                            <Dropdown.Option value="8">8</Dropdown.Option>
                        </Dropdown.Options>
                        <Dropdown.Track class="p-dropdown-track" attr:data-probe="dropdown-track" attr:data-tick={tick()} />
                        <Dropdown.Handle class="p-dropdown-handle" attr:data-probe="dropdown-handle" attr:data-tick={tick()} />
                    </Dropdown>
                </Cell>

                <Cell>
                    <Tutorial.Step order={1} title="Step" content="Step">
                        <Tooltip message="tip" class="p-tooltip" attr:data-probe="tooltip" attr:data-tick={tick()}>
                            <div>tooltip target</div>
                        </Tooltip>
                    </Tutorial.Step>
                </Cell>

                <Cell>
                    <Dropdown>
                        <Dropdown.Trigger class="p-dropdown-trigger" attr:data-probe="dropdown-trigger" attr:data-tick={tick()} />
                        <Dropdown.Placeholder class="p-dropdown-placeholder" attr:data-probe="dropdown-placeholder" attr:data-tick={tick()}>pick</Dropdown.Placeholder>
                        <Dropdown.Icon class="p-dropdown-icon" attr:data-probe="dropdown-icon" attr:data-tick={tick()} />
                        <Dropdown.Options class="p-dropdown-options" attr:data-probe="dropdown-options" attr:data-tick={tick()}>
                            <Dropdown.Option value="a" class="p-dropdown-option" attr:data-probe="dropdown-option" attr:data-tick={tick()}>a</Dropdown.Option>
                        </Dropdown.Options>
                    </Dropdown>
                </Cell>

                <Cell>
                    <Slider>
                        <Slider.Track class="p-slider-track" attr:data-probe="slider-track" attr:data-tick={tick()} />
                        <Slider.Fill class="p-slider-fill" attr:data-probe="slider-fill" attr:data-tick={tick()} />
                        <Slider.Handle class="p-slider-handle" attr:data-probe="slider-handle" attr:data-tick={tick()} />
                        <Slider.Thumb class="p-slider-thumb" attr:data-probe="slider-thumb" attr:data-tick={tick()} />
                        <Slider.Grid class="p-slider-grid" attr:data-probe="slider-grid" attr:data-tick={tick()} />
                    </Slider>
                </Cell>

                <Cell>
                    <TwoHandleSlider>
                        <TwoHandleSlider.Fill class="p-two-handle-fill" attr:data-probe="two-handle-fill" attr:data-tick={tick()} />
                    </TwoHandleSlider>
                </Cell>

                <Cell>
                    <XYSlider style={{ width: '8vh', height: '8vh' }}>
                        <XYSlider.Background class="p-xy-background" attr:data-probe="xy-background" attr:data-tick={tick()} />
                        <XYSlider.Handle class="p-xy-handle" attr:data-probe="xy-handle" attr:data-tick={tick()} />
                    </XYSlider>
                </Cell>

                <Cell>
                    <TextSlider values={['Easy', 'Medium', 'Hard']}>
                        <TextSlider.Pol class="p-text-slider-pol" attr:data-probe="text-slider-pol" attr:data-tick={tick()} />
                    </TextSlider>
                </Cell>

                <Cell>
                    <ToggleButton>
                        <ToggleButton.Control class="p-toggle-control" attr:data-probe="toggle-control" attr:data-tick={tick()}>
                            <ToggleButton.Indicator class="p-toggle-indicator" attr:data-probe="toggle-indicator" attr:data-tick={tick()} />
                            <ToggleButton.Handle class="p-toggle-handle" attr:data-probe="toggle-handle" attr:data-tick={tick()} />
                        </ToggleButton.Control>
                    </ToggleButton>
                </Cell>

                <Cell>
                    <Checkbox>
                        <Checkbox.Control class="p-checkbox-control" attr:data-probe="checkbox-control" attr:data-tick={tick()}>
                            <Checkbox.Indicator class="p-checkbox-indicator" attr:data-probe="checkbox-indicator" attr:data-tick={tick()} />
                        </Checkbox.Control>
                    </Checkbox>
                </Cell>

                <Cell>
                    <Radio>
                        <Radio.Button value="a" class="p-radio-button" attr:data-probe="radio-button" attr:data-tick={tick()}>
                            <Radio.ButtonControl class="p-radio-control" attr:data-probe="radio-control" attr:data-tick={tick()}>
                                <Radio.ButtonIndicator class="p-radio-indicator" attr:data-probe="radio-indicator" attr:data-tick={tick()} />
                            </Radio.ButtonControl>
                        </Radio.Button>
                    </Radio>
                </Cell>

                <Cell>
                    <TextInput>
                        <TextInput.Before class="p-text-before" attr:data-probe="text-before" attr:data-tick={tick()}>B</TextInput.Before>
                        <TextInput.Input class="p-text-input" attr:data-probe="text-input" attr:data-tick={tick()} />
                        <TextInput.Placeholder class="p-text-placeholder" attr:data-probe="text-placeholder" attr:data-tick={tick()}>placeholder</TextInput.Placeholder>
                        <TextInput.After class="p-text-after" attr:data-probe="text-after" attr:data-tick={tick()}>A</TextInput.After>
                    </TextInput>
                </Cell>

                <Cell>
                    <NumberInput>
                        <NumberInput.IncreaseControl class="p-number-increase" attr:data-probe="number-increase" attr:data-tick={tick()} />
                        <NumberInput.DecreaseControl class="p-number-decrease" attr:data-probe="number-decrease" attr:data-tick={tick()} />
                    </NumberInput>
                </Cell>

                <Cell>
                    <PasswordInput>
                        <PasswordInput.VisibilityButton class="p-password-visibility" attr:data-probe="password-visibility" attr:data-tick={tick()} />
                    </PasswordInput>
                </Cell>

                <Cell>
                    <Accordion>
                        <Accordion.Panel title="one" class="p-accordion-panel" attr:data-probe="accordion-panel" attr:data-tick={tick()}>
                            <Accordion.Heading class="p-accordion-heading" attr:data-probe="accordion-heading" attr:data-tick={tick()}>
                                Heading
                                <Accordion.Icon class="p-accordion-icon" attr:data-probe="accordion-icon" attr:data-tick={tick()} />
                            </Accordion.Heading>
                            <Accordion.Body class="p-accordion-body" attr:data-probe="accordion-body" attr:data-tick={tick()}>Body</Accordion.Body>
                        </Accordion.Panel>
                    </Accordion>
                </Cell>

                <Cell>
                    <Stepper>
                        <Stepper.Items class="p-stepper-items" attr:data-probe="stepper-items" attr:data-tick={tick()}>
                            <Stepper.Item value="a" class="p-stepper-item" attr:data-probe="stepper-item" attr:data-tick={tick()}>a</Stepper.Item>
                        </Stepper.Items>
                        <Stepper.Control class="p-stepper-control" attr:data-probe="stepper-control" attr:data-tick={tick()} />
                    </Stepper>
                </Cell>

                <Cell>
                    <Pagination pageSize={3} pageIndex={1}>
                        <Pagination.Item class="p-pagination-item" attr:data-probe="pagination-item" attr:data-tick={tick()} />
                        <Pagination.Control class="p-pagination-control" attr:data-probe="pagination-control" attr:data-tick={tick()} />
                    </Pagination>
                </Cell>

                <Cell>
                    <Progress.Bar progress={40}>
                        <Progress.Bar.Fill class="p-progress-bar-fill" attr:data-probe="progress-bar-fill" attr:data-tick={tick()} />
                    </Progress.Bar>
                    <Progress.Circle progress={60} style={{ width: '6vh', height: '6vh' }}>
                        <Progress.Circle.Outline class="p-progress-circle-outline" attr:data-probe="progress-circle-outline" attr:data-tick={tick()} />
                        <Progress.Circle.Fill class="p-progress-circle-fill" attr:data-probe="progress-circle-fill" attr:data-tick={tick()} />
                        <Progress.Circle.Text class="p-progress-circle-text" attr:data-probe="progress-circle-text" attr:data-tick={tick()}>60%</Progress.Circle.Text>
                    </Progress.Circle>
                </Cell>

                <Cell>
                    <Scroll style={{ height: '6vh' }}>
                        <Scroll.Content class="p-scroll-content" attr:data-probe="scroll-content" attr:data-tick={tick()}>
                            <div style={{ height: '20vh' }}>tall content</div>
                        </Scroll.Content>
                        <Scroll.Bar class="p-scroll-bar" attr:data-probe="scroll-bar" attr:data-tick={tick()}>
                            <Scroll.Handle class="p-scroll-handle" attr:data-probe="scroll-handle" attr:data-tick={tick()} />
                        </Scroll.Bar>
                    </Scroll>
                </Cell>

                <Cell>
                    <List>
                        <List.Item class="p-list-item" attr:data-probe="list-item" attr:data-tick={tick()}>
                            <List.Icon class="p-list-icon" attr:data-probe="list-icon" attr:data-tick={tick()} />
                            default icon
                        </List.Item>
                        <List.Item>
                            <List.Icon class="p-list-icon-custom" attr:data-probe="list-icon-custom" attr:data-tick={tick()}>*</List.Icon>
                            custom icon
                        </List.Item>
                    </List>
                </Cell>

                <Cell>
                    <RadialMenu opened gap={0} style={{ width: '12vh', height: '12vh' }}>
                        <RadialMenu.Content class="p-radial-content" attr:data-probe="radial-content" attr:data-tick={tick()} />
                        <RadialMenu.Indicator class="p-radial-indicator" attr:data-probe="radial-indicator" attr:data-tick={tick()}>
                            <RadialMenu.Indicator.Icon class="p-radial-indicator-icon" attr:data-probe="radial-indicator-icon" attr:data-tick={tick()} />
                        </RadialMenu.Indicator>
                        <RadialMenu.Selector class="p-radial-selector" attr:data-probe="radial-selector" attr:data-tick={tick()} />
                        <RadialMenu.Item id="a" class="p-radial-item" attr:data-probe="radial-item" attr:data-tick={tick()}>a</RadialMenu.Item>
                        <RadialMenu.Item id="b">b</RadialMenu.Item>
                        <RadialMenu.Item id="c">c</RadialMenu.Item>
                    </RadialMenu>
                </Cell>

                <Cell>
                    {/* The Indicator.Icon with children renders through Absolute, a GFUI component. */}
                    <RadialMenu opened gap={0} style={{ width: '8vh', height: '8vh' }}>
                        <RadialMenu.Indicator>
                            <RadialMenu.Indicator.Icon class="p-radial-indicator-icon-custom" attr:data-probe="radial-indicator-icon-custom" attr:data-tick={tick()}>i</RadialMenu.Indicator.Icon>
                        </RadialMenu.Indicator>
                        <RadialMenu.Item id="x">x</RadialMenu.Item>
                        <RadialMenu.Item id="y">y</RadialMenu.Item>
                    </RadialMenu>
                </Cell>

                <Cell>
                    <Carousel itemWidth={30}>
                        <Carousel.Items class="p-carousel-items" attr:data-probe="carousel-items" attr:data-tick={tick()}>
                            <Carousel.Item class="p-carousel-item" attr:data-probe="carousel-item" attr:data-tick={tick()}>1</Carousel.Item>
                            <Carousel.Item>2</Carousel.Item>
                            <Carousel.Item>3</Carousel.Item>
                            <Carousel.Item>4</Carousel.Item>
                        </Carousel.Items>
                        <Carousel.Pagination class="p-carousel-pagination" attr:data-probe="carousel-pagination" attr:data-tick={tick()}>
                            <Carousel.Pagination.Item class="p-carousel-pagination-item" attr:data-probe="carousel-pagination-item" attr:data-tick={tick()} />
                        </Carousel.Pagination>
                        <Carousel.Prev class="p-carousel-prev" attr:data-probe="carousel-prev" attr:data-tick={tick()} />
                        <Carousel.Next class="p-carousel-next" attr:data-probe="carousel-next" attr:data-tick={tick()} />
                    </Carousel>
                </Cell>

                <Cell>
                    <Trackers id="attr-forwarding-trackers" style={{ position: 'relative', height: '3vh' }}>
                        <Trackers.Item id="t1" class="p-trackers-item" attr:data-probe="trackers-item" attr:data-tick={tick()} />
                    </Trackers>
                </Cell>

                <Cell>
                    <Grid rows={1} cols={2} style={{ height: '3vh' }}>
                        <Grid.Tile row={1} col={1} class="p-grid-tile" attr:data-probe="grid-tile" attr:data-tick={tick()}>tile</Grid.Tile>
                    </Grid>
                    <Layout style={{ height: '6vh' }}>
                        <Layout.Top class="p-layout-top" attr:data-probe="layout-top" attr:data-tick={tick()}>top</Layout.Top>
                        <Layout.Content class="p-layout-content" attr:data-probe="layout-content" attr:data-tick={tick()}>content</Layout.Content>
                        <Layout.Bottom class="p-layout-bottom" attr:data-probe="layout-bottom" attr:data-tick={tick()}>bottom</Layout.Bottom>
                    </Layout>
                    <Column.One class="p-column-one" attr:data-probe="column-one" attr:data-tick={tick()}>col</Column.One>
                </Cell>
            </div>

            <Modal ref={modalRef} class="p-modal" attr:data-probe="modal" attr:data-tick={tick()}>
                <Modal.Overlay class="p-modal-overlay" attr:data-probe="modal-overlay" attr:data-tick={tick()} />
                <Modal.Window class="p-modal-window" attr:data-probe="modal-window" attr:data-tick={tick()}>
                    <Modal.Close class="p-modal-close" attr:data-probe="modal-close" attr:data-tick={tick()}>Close</Modal.Close>
                </Modal.Window>
            </Modal>

            <Toaster class="p-toaster" attr:data-probe="toaster" attr:data-tick={tick()} />
        </Tutorial>
    );
};

export default AttrForwardingTest;
