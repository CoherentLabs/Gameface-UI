import Flex from "@components/Layout/Flex/Flex";
import Absolute from "@components/Layout/Absolute/Absolute";
import Block from "@components/Layout/Block/Block";

import { For } from "solid-js";
import Image from '@components/Media/Image/Image';

const userShieldPoints = Array.from({ length: 3 }, (_, i) => i == 2 ? 'gray' : 'white');

const StatusBar = () => {
    return <Absolute top="80vh" left="30vh">
        <Flex align-items="center">
            <Image.icons.hud.placeholder style={{ width: '7vh', height: '7vh' }} />
            <Block style={{ 'margin-left': '1vh' }}>
                <Flex>
                    <For each={userShieldPoints}>
                        {(fill) => {
                            return <Block
                                style={{
                                    width: '7vh',
                                    height: '1vh',
                                    'background-color': fill,
                                    'margin-left': '1vh',
                                }}
                            ></Block>
                        }}
                    </For>
                </Flex>
                <Block
                    style={{
                        width: '23vh',
                        height: '1vh',
                        'background-color': 'white',
                        'margin-left': '1vh',
                        'margin-top': '1vh',
                    }}
                ></Block>
            </Block>
        </Flex>
    </Absolute>
}

export default StatusBar;