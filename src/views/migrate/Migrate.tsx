import { createSignal, onSettled, Show } from 'solid-js';
import styles from './Migrate.module.scss';
import Flex from '@components/Layout/Flex/Flex';
import Checkbox, { CheckboxRef } from '@components/Basic/Checkbox/Checkbox';
import Block from '@components/Layout/Block/Block';
import Scroll, { ScrollComponentRef } from '@components/Layout/Scroll/Scroll';
import Segment, { SegmentRef } from '@components/Basic/Segment/Segment';
import Navigation, { NavigationRef } from '@components/Utility/Navigation/Navigation';
import { ActionMap } from '@components/Utility/Navigation/types';

const Migrate = () => {
	const [count, setCount] = createSignal(0);
		let test: HTMLDivElement | undefined;

	onSettled(() => {
		// engine.whenReady.then(() => {
		// 	engine.createJSModel("TestModel", {
		// 		count: 2,
		// 	})
		// })

		// setTimeout(() => {
		// 	TestModel.count = 200;
		// 	engine.updateWholeModel(TestModel);
		// 	engine.synchronizeModels();
		// }, 5000)

		// console.log(test);
	})

	let testRef: CheckboxRef | undefined;
	let scrollRef: ScrollComponentRef | undefined;
	let segmentRef: SegmentRef | undefined;
	const [color, setColor] = createSignal('red');

	setTimeout(() => setColor('blue'), 2000)

	const menuLeft = () => console.log('Menu left')
	const menuRight = () => console.log('Menu right')

	 const defaultActions: ActionMap = {
        'tab-left': {key: {binds: ['Q'], type: ['press']}, button: {binds: ["left-shoulder"], type: 'press'}, callback: menuLeft, global: true},
        'tab-right': {key: {binds: ['E'], type: ['press']}, button: {binds: ['right-shoulder'], type: 'press'}, callback: menuRight, global: true},
        'select': {key: {binds: ['SPACEBAR'], type: ['press']}, button: {binds: ['face-button-left'], type: 'press'}, callback: () => {},  },
        'back': {key: {binds: ['BACKSPACE'], type: ['press']}, callback: () => {}, },
    }
	let navRef!: NavigationRef;

	return (
		<div class={styles['item-container']}>
			<Navigation ref={navRef} scope="main-menu" actions={defaultActions} pollingInterval={150} >
				<Navigation.Area name="main-menu" focused>
					<button onFocus={(e) => e.currentTarget.style.border = '2px solid red'} onBlur={(e) => e.currentTarget.style.border = ''}>Start Game</button>
					<button onFocus={(e) => e.currentTarget.style.border = '2px solid red'} onBlur={(e) => e.currentTarget.style.border = ''}>Settings</button>
					<button onFocus={(e) => e.currentTarget.style.border = '2px solid red'} onBlur={(e) => e.currentTarget.style.border = ''}>Quit</button>
					<Show when={color() === 'blue'}>
						<button onFocus={(e) => e.currentTarget.style.border = '2px solid red'} onBlur={(e) => e.currentTarget.style.border = ''}>AAAAAA</button>
					</Show>
				</Navigation.Area>
			</Navigation>
			{/* <div class={styles['item-wrapper']}>
				<p class={styles['item-inspector-label']}>Count: {count()}</p>
				<div tabindex="0" class={styles.separator} />
				<Test >Test</Test>
				<Show when={count() < 10}>
					<Flex click={() => console.log('test')} data-bind-class="{{TestModel.count}}" direction='row' gap='1rem' class={`${count() < 10 ? 'hungryneegahdayo' : ""}`} style={{'margin-top': `${count() * 10}px`}}>
						<button class={styles['item-button']} onClick={() => setCount(c => c + 1)}>+</button>
						<button class={styles['item-button']} onClick={() => setCount(c => c - 1)}>-</button>
					</Flex>
				</Show>

				<Checkbox ref={testRef} value={color()} onChange={(v) => {
					setColor('blue')
					console.log(testRef);
					console.log(test);
					console.log(scrollRef?.scrollDown());
				}}>
                <Checkbox.Label>
                    <Block style={{ 'font-weight': 'bold' }}>Anti-aliasing</Block>
                </Checkbox.Label>
				<Checkbox.Control style={{'border-color': 'blueviolet', "background-color": 'black'}}>
					<Checkbox.Indicator style={{"background-color": color()}}>
					{'dsada'}
					</Checkbox.Indicator>
				</Checkbox.Control>
            </Checkbox>
			 <Scroll ref={scrollRef} style={{"max-width": '200px', "max-height": '100px',}}>
				<Scroll.Content ref={test}>
						I am a very long and dynamic text that can be scrolled - lorem Eaque, perspiciatis ad iusto expedita consectetur rerum tempora non nisi, porro tenetur repudiandae.
						Voluptatem magni dolore consequuntur officia nemo quidem minus. Possimus, quibusdam.
				</Scroll.Content>
			</Scroll>
			 <Segment ref={segmentRef}>
                <Segment.Button selected value="red">red</Segment.Button>
                <Segment.Button value="green">green</Segment.Button>
                <Segment.Button value="blue">blue</Segment.Button>
            </Segment>
			</div> */}
		</div>
	);
};

export default Migrate;