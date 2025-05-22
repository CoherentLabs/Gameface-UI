import Flex from "@components/Layout/Flex/Flex";
import Block from "@components/Layout/Block/Block";
import { createSignal, For, Show } from "solid-js";
import Checkbox from "@components/Basic/Checkbox/Checkbox";
import Dropdown from "@components/Basic/Dropdown/Dropdown";

interface MenuItemsProps {
    count: number;
}

const MenuItems = (props: MenuItemsProps) => {
    const testSettings = (number: number) => {
        return [...Array(number).map((elemnt) => (elemnt = ''))];
    };
    const [show, setShow] = createSignal(false);
    const intialOptions = ['test1', 'test2', 'test3'];
    const [options, setOptions] = createSignal(intialOptions);
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
                    <Flex
                        justify-content="space-between"
                        align-items="center"
                        style={{ height: '100%', 'padding-left': '1vh' }}
                    >
                        Setting Item
                        <Flex align-items="center" style={{ height: '100%' }}>
                            <Block click={() => { setShow(!show()); setOptions((prev) => intialOptions.map((option) => option + parseInt(Math.random() * 3))) }}
                                style={{
                                    height: '70%',
                                    width: '18vh',
                                    'background-color': 'black',
                                    border: '0.2vh solid white',
                                }}
                            ></Block>
                            <Dropdown>
                                <For each={options()}>
                                    {(option) => <Dropdown.Option value={option}>{option.toLocaleUpperCase()}</Dropdown.Option>}
                                </For>
                                <Dropdown.Option value='test2'>Test2</Dropdown.Option>
                                <Dropdown.Option value='test3'>Test3</Dropdown.Option>
                            </Dropdown>
                            <Checkbox>
                                <div>test</div>
                                <Show when={show()}>
                                    <Checkbox.Label before={show()}>alabla</Checkbox.Label>
                                </Show>
                                <Checkbox.Control style={{ background: 'red' }}>
                                    <Show when={show()}>
                                        <Checkbox.Indicator style={{ background: 'blue' }}>alabala</Checkbox.Indicator>
                                    </Show>
                                </Checkbox.Control>
                            </Checkbox>
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