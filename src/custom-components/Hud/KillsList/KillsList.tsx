import Flex from "@components/Layout/Flex/Flex";
import InlineTextBlock from "@components/Basic/InlineTextBlock/InlineTextBlock";
import { Icon } from "@components/Media/Icon/Icon";

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
            <Icon.hud.placeholder style={{ width: '3vh', height: '3vh' }} />
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
            <Icon.hud.placeholder style={{ width: '3vh', height: '3vh' }} />
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
            <Icon.hud.placeholder style={{ width: '3vh', height: '3vh' }} />
            <span style={{ color: 'lightcoral' }}>TestEnemy</span>
        </InlineTextBlock>
    </Flex>
}

export default KillsList;