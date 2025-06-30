import Flex from "@components/Layout/Flex/Flex";
import Block from "@components/Layout/Block/Block";
import { createSignal, For, onMount } from "solid-js";
import ToggleButton from "@components/Basic/ToggleButton/ToggleButton";
import Checkbox from "@components/Basic/Checkbox/Checkbox";
import TextSlider, { TextSliderRef } from "@components/Basic/TextSlider/TextSlider";
import Slider from "@components/Basic/Slider/Slider";
import Dropdown from "@components/Basic/Dropdown/Dropdown";

interface MenuItemsProps {
    count: number;
}

const MenuItems = (props: MenuItemsProps) => {
    const [isSwitchOn, setSwitch] = createSignal(false);
    const [values, setValues] = createSignal(['Easy', 'Medium', 'Hard', 'test', 'test1', 'test2', 'test3', 'test4']);
    let test!: TextSliderRef;
    onMount(() => {
        setTimeout(() => {

            test?.changeValue('Medium'); // Set initial value for the TextSlider
        }, 500)

        // setInterval(() => {
        //     console.log(values())
        //     setValues((prev)=>[...prev, `test${Math.floor(Math.random() * 100)}`]); // Add a new random value every 2 seconds
        // }, 2000)

    })
    const testSettings = (number: number) => {
        return [...Array(number).map((elemnt) => (elemnt = ''))];
    };


    return <For each={testSettings(props.count)}>
        {() => {
            return (
                <Block
                    style={{
                        border: '0.1vh solid white',
                        'background-color': 'rgba(0, 0, 0, 0.3)',
                        width: '100%',
                        height: '8vh',
                        margin: '0.7vh 0',
                    }}
                >
                    <Dropdown>
                        <Dropdown.Options>
                            <Dropdown.Option value="easy">Easy</Dropdown.Option>
                            <Dropdown.Option value="medium">Medium</Dropdown.Option>
                            <Dropdown.Option value="hard">Hard</Dropdown.Option>
                            <Dropdown.Option value="test">Test</Dropdown.Option>
                        </Dropdown.Options>
                    </Dropdown>
                    {/* <Slider max={200}>
                        <Slider.Grid pols-without-text={5}></Slider.Grid>
                    </Slider>
                    <TextSlider ref={test} value="test" values={values()}>
                        <TextSlider.Grid pol-value-style={{ "font-size": '0.9vmax', "width": '1.5vmax' }}></TextSlider.Grid>
                        <TextSlider.Thumb/>
                    </TextSlider> */}

                    <Flex
                        justify-content="space-between"
                        align-items="center"
                        style={{ height: '100%', 'padding-left': '1vh' }}
                    >
                        {/* Setting Item */}
                        <Flex align-items="center" style={{ height: '100%' }}>
                            <Block
                                style={{
                                    height: '70%',
                                    width: '18vh',
                                    'background-color': 'black',
                                    border: '0.2vh solid white',
                                }}
                            >
                                <ToggleButton checked onChange={(checked) => setSwitch(checked)}>
                                    <ToggleButton.Control>
                                        {/* <ToggleButton.Handle style={{ background: 'red' }} style-checked={{ background: 'black' }}></ToggleButton.Handle>
                                        <ToggleButton.Indicator style={{ background: 'white' }}></ToggleButton.Indicator> */}
                                    </ToggleButton.Control>
                                    <ToggleButton.LabelLeft><span style={{ color: !isSwitchOn() ? 'red' : '', "font-weight": !isSwitchOn() ? 'bold' : '', transition: 'color 200ms' }}>Off</span></ToggleButton.LabelLeft>
                                    <ToggleButton.LabelRight><span style={{ color: isSwitchOn() ? 'green' : '', "font-weight": isSwitchOn() ? 'bold' : '', transition: 'color 200ms' }}>On</span></ToggleButton.LabelRight>
                                </ToggleButton>
                                {/* <TextSlider ref={test} values={['Easy', 'Medfffffium', 'Hard', 'test', 'test1', 'test2']}>
                                    <TextSlider.Grid></TextSlider.Grid>
                                </TextSlider> */}
                            </Block>
                            <Block
                                style={{
                                    height: '70%',
                                    width: '18vh',
                                    'background-color': 'black',
                                    border: '0.2vh solid white',
                                    margin: '0 2vh',
                                }}
                            ></Block>
                        </Flex>
                    </Flex>
                </Block>
            );
        }}
    </For>
}

export default MenuItems;