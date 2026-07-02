import Scroll from '@components/Layout/Scroll/Scroll';
import Block from '@components/Layout/Block/Block';
import TextBlock from '@components/Basic/TextBlock/TextBlock';

const App = () => {
    return (
        <Scroll style={{ 'max-width': '200px', 'max-height': '100px' }}>
            <Scroll.Content>
                <TextBlock>
                    I am a very long and dynamic text that can be scrolled - lorem Eaque, perspiciatis ad iusto expedita
                    consectetur rerum tempora non nisi, porro tenetur repudiandae. Voluptatem magni dolore consequuntur
                    officia nemo quidem minus. Possimus, quibusdam.
                </TextBlock>
            </Scroll.Content>
        </Scroll>
    );
};

export default App;
