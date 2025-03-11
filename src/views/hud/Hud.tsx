import InlineTextBlock from '../../components/Basic/InlineTextBlock/InlineTextBlock';
import TextBlock from '../../components/Basic/TextBlock/TextBlock';
import Block from '../../components/Layout/Block/Block';
import { Column4 } from '../../components/Layout/Column/Column';
import Flex from '../../components/Layout/Flex/Flex';
import Row from '../../components/Layout/Row/Row';
import Image from '../../components/Media/Image/Image';
import styles from './Hud.module.css';

import placeholder from '@assets/placeholder.png';
import crosshair from '@assets/crosshair.png';
import Absolute from '../../components/Layout/Absolute/Absolute';
import grenade from '@assets/grenade.png';
import gun from '@assets/weapon.png';

const Hud = () => {
    return (
        <div class={styles.Hud}>
            <Row style={{ height: '33%' }}>
                <Column4>
                    <Block
                        style={{
                            'border-radius': '50%',
                            'background-color': 'black',
                            border: '0.4vh solid white',
                            width: '20vh',
                            height: '20vh',
                            margin: '5vh',
                        }}
                    ></Block>
                </Column4>
                <Column4>
                    <Flex style={{ width: '100%', height: '100%' }} align-items="center" direction="column">
                        <Block
                            style={{
                                width: '80%',
                                height: '4vh',
                                'background-image': 'linear-gradient(to left, transparent, black, transparent)',
                                'border-top': '0.1vh solid white',
                                'border-bottom': '0.1vh solid white',
                                'margin-top': '3vh',
                            }}
                        ></Block>
                        <Flex justify-content="space-between" style={{ margin: '3vh 0' }}>
                            <Flex>
                                <Block class={styles.heroBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.heroBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.heroBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.heroBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.heroBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                            </Flex>
                            <Flex>
                                <Block class={styles.enemyBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.enemyBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.enemyBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.enemyBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                                <Block class={styles.enemyBadge}>
                                    <Image src={placeholder} style={{ width: '100%', height: '100%' }}></Image>
                                </Block>
                            </Flex>
                        </Flex>
                        <Flex justify-content="center">
                            <Block class={styles.counter}>9</Block>
                            <Block class={styles.counter}>1:36</Block>
                            <Block class={styles.counter}>5</Block>
                        </Flex>
                    </Flex>
                </Column4>
                <Column4>
                    <Flex
                        align-items="center"
                        justify-content="center"
                        direction="column"
                        style={{ width: '100%', height: '100%' }}
                    >
                        <InlineTextBlock
                            style={{
                                padding: '0.4vh',
                                'background-color': 'black',
                                width: '30vh',
                                'text-align': 'center',
                            }}
                        >
                            <span style={{ color: 'lightcoral' }}>TestEnemy</span>
                            <Image style={{ width: '3vh', height: '3vh' }} src={placeholder}></Image>
                            <span style={{ color: 'lightblue' }}>TestHero</span>
                        </InlineTextBlock>
                        <InlineTextBlock
                            style={{
                                padding: '0.4vh',
                                'background-color': 'black',
                                width: '30vh',
                                'text-align': 'center',
                            }}
                        >
                            <span style={{ color: 'lightblue' }}>TestHero</span>
                            <Image style={{ width: '3vh', height: '3vh' }} src={placeholder}></Image>
                            <span style={{ color: 'lightcoral' }}>TestEnemy</span>
                        </InlineTextBlock>
                        <InlineTextBlock
                            style={{
                                padding: '0.4vh',
                                'background-color': 'black',
                                width: '30vh',
                                'text-align': 'center',
                            }}
                        >
                            <span style={{ color: 'lightblue' }}>TestHero</span>
                            <Image style={{ width: '3vh', height: '3vh' }} src={placeholder}></Image>
                            <span style={{ color: 'lightcoral' }}>TestEnemy</span>
                        </InlineTextBlock>
                    </Flex>
                </Column4>
            </Row>
            <Row style={{ height: '33%' }}>
                <Column4></Column4>
                <Column4>
                    <Flex style={{ width: '100%', height: '100%' }} align-items="center" justify-content="center">
                        <Image style={{ width: '7vh', height: '7vh' }} src={crosshair}></Image>
                    </Flex>
                </Column4>
                <Column4></Column4>
            </Row>
            <Row style={{ height: '33%' }}>
                <Column4>
                    <Absolute top="80vh" left="30vh">
                        <Flex align-items="center">
                            <Image src={placeholder} style={{ width: '7vh', height: '7vh' }}></Image>
                            <Block style={{ 'margin-left': '1vh' }}>
                                <Flex>
                                    <Block
                                        style={{
                                            width: '7vh',
                                            height: '1vh',
                                            'background-color': 'white',
                                            'margin-left': '1vh',
                                        }}
                                    ></Block>
                                    <Block
                                        style={{
                                            width: '7vh',
                                            height: '1vh',
                                            'background-color': 'white',
                                            'margin-left': '1vh',
                                        }}
                                    ></Block>
                                    <Block
                                        style={{
                                            width: '7vh',
                                            height: '1vh',
                                            'background-color': 'gray',
                                            'margin-left': '1vh',
                                        }}
                                    ></Block>
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
                </Column4>
                <Column4></Column4>
                <Column4>
                    <Block style={{ width: '50vh' }}>
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
                            <Flex align-items='end' style={{margin: '4vh 0'}}>
                                <Block style={{ 'font-size': '2.5rem' }}>23</Block>
                                <Block style={{ 'font-size': '1.5rem', color: 'gray' }}>30</Block>
                                <Image src={gun} style={{width: '24vh', height: '8vh', "margin-left": '3vh'}} />
                            </Flex>
                            <Flex>
                              <Block>BURST FIRE</Block>
                              <Block style={{"margin-left": '2vh'}}>CTRL</Block>
                            </Flex>
                        </Flex>
                    </Block>
                </Column4>
            </Row>
        </div>
    );
};

export default Hud;
