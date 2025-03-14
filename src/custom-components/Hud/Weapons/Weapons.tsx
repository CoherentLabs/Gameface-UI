import Flex from "@components/Layout/Flex/Flex";
import Image from "@components/Media/Image/Image";
import Block from "@components/Layout/Block/Block";
import TextBlock from "@components/Basic/TextBlock/TextBlock";

import grenade from '@assets/grenade.png';
import gun from '@assets/weapon.png';

const Weapons = () => {
    return <Block style={{ width: '50vh' }}>
        <Flex direction="column" align-items="end">
            <Flex>
                <Flex direction="column" align-items="center">
                    <TextBlock>A</TextBlock>
                    <Image src={grenade} style={{ width: '3vh', height: '3vh' }}></Image>
                </Flex>
                <Flex direction="column" align-items="center">
                    <TextBlock>E</TextBlock>
                    <Image src={grenade} style={{ width: '3vh', height: '3vh' }}></Image>
                </Flex>
            </Flex>
            <Flex align-items='end' style={{ margin: '4vh 0' }}>
                <Block style={{ 'font-size': '2.5rem' }}>23</Block>
                <Block style={{ 'font-size': '1.5rem', color: 'gray' }}>30</Block>
                <Image src={gun} style={{ width: '24vh', height: '8vh', "margin-left": '3vh' }} />
            </Flex>
            <Flex>
                <Block>BURST FIRE</Block>
                <Block style={{ "margin-left": '2vh' }}>CTRL</Block>
            </Flex>
        </Flex>
    </Block>
}

export default Weapons;