import Flex from "@components/Layout/Flex/Flex";
import InlineTextBlock from "@components/Basic/InlineTextBlock/InlineTextBlock";
import Image from '@components/Media/Image/Image';

const KillsList = () => {
    return <Flex
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
            <Image.icons.hud.placeholder style={{ width: '3vh', height: '3vh' }} />
            <span style={{ color: 'lightblue' }}>TestHero</span>
        </InlineTextBlock>
        <Flex
            justify-content="center"
            align-items="center"
            direction="row"
            style={{
                padding: '0.4vh',
                'background-color': 'black',
                width: '30vh',
                'text-align': 'center',
            }}
        >
            <span style={{ color: 'lightblue' }}>TestHero</span>
            <Image.icons.hud.placeholder style={{ width: '3vh', height: '3vh' }} />
            <span style={{ color: 'lightcoral' }}>TestEnemy</span>
        </Flex>
        <InlineTextBlock
            style={{
                padding: '0.4vh',
                'background-color': 'black',
                width: '30vh',
                'text-align': 'center',
            }}
        >
            <span style={{ color: 'lightblue' }}>TestHero</span>
            <Image.icons.hud.placeholder style={{ width: '3vh', height: '3vh' }} />
            <span style={{ color: 'lightcoral' }}>TestEnemy</span>
        </InlineTextBlock>
    </Flex>
}

export default KillsList;