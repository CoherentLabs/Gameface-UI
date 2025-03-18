import Block from '@components/Layout/Block/Block';
import { Column4 } from '@components/Layout/Column/Column';
import Flex from '@components/Layout/Flex/Flex';
import Row from '@components/Layout/Row/Row';
import Image from '@components/Media/Image/Image';
import TopBar from '@custom-components/Hud/TopBar/TopBar';
import KillsList from '@custom-components/Hud/KillsList/KillsList';
import StatusBar from '@custom-components/Hud/StatusBar/StatusBar';
import Weapons from '@custom-components/Hud/Weapons/Weapons';
import styles from './Hud.module.css';

import crosshair from '@assets/crosshair.png';

const Hud = () => {
    return (
        <div class={styles.Hud}>
            <Row style={{ height: '33%' }}>
                <Column4>
                    <Block class={styles.miniMap}></Block>
                </Column4>
                <Column4>
                    <TopBar />
                </Column4>
                <Column4>
                    <KillsList />
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
                    <StatusBar />
                </Column4>
                <Column4></Column4>
                <Column4>
                    <Weapons />
                </Column4>
            </Row>
        </div>
    );
};

export default Hud;
