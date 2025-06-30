import Flex from "@components/Layout/Flex/Flex";
import Block from "@components/Layout/Block/Block";
import { For } from "solid-js";

interface MenuItemsProps {
    count: number;
}

const MenuItems = (props: MenuItemsProps) => {
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
                    <Flex
                        justify-content="space-between"
                        align-items="center"
                        style={{ height: '100%', 'padding-left': '1vh' }}
                    >
                        Setting Item
                        <Flex align-items="center" style={{ height: '100%' }}>
                            <Block
                                style={{
                                    height: '70%',
                                    width: '18vh',
                                    'background-color': 'black',
                                    border: '0.2vh solid white',
                                }}
                            ></Block>
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