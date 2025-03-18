import Flex from "@components/Layout/Flex/Flex";
import Image from "@components/Media/Image/Image";
import InlineTextBlock from "@components/Basic/InlineTextBlock/InlineTextBlock";

import placeholder from '@assets/placeholder.png';

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
}

export default KillsList;