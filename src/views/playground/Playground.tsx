import Tabs from '@components/Layout/Tabs/Tabs';
import styles from './Playground.module.css';
import TabLink from '@components/Layout/TabLink/TabLink';
import Flex from '@components/Layout/Flex/Flex';
import Tab from '@components/Layout/Tab/Tab';
import { createSignal, For } from 'solid-js';
import Button from '@components/Basic/Button/Button';
import Checkbox from '@components/Basic/Checkbox/Checkbox';
import CheckboxTest from '@custom-components/Playground/Checkbox/CheckboxTest';
import SegmentTest from '@custom-components/Playground/Segment/SegmentTest';
import RadioTest from '@custom-components/Playground/Radio/RadioTest';

const Playground = () => {
    const components = [
        // Basic components
        "button",
        "segment",
        "stepper",
        "radio",
        "checkbox",
        "input",
        "label",
        "switch",
        "slider",
        "dropdown",
        "tooltip",
        "progressbar",
        "spinner",
        "badge",
        "avatar",

        // Layout components
        "absolute",
        "transform",
        "scroll"
    ]

    const [test, setTest] = createSignal('test');


    return (
        <div class={styles.Playground}>
            <Tabs default={components[0]}>

                <Flex class={styles['TabLink-Container']}  align-items='center' wrap='wrap'>
                    <For each={components}>
                        {(component)=>(
                            <TabLink location={component} class={`${styles.TabLink} ${component}-link`} activeClass={styles['Active-Tab']}>{component}</TabLink>
                        )}
                    </For>
                </Flex>

                <Tab location='button'>
                    <div class="test">Wrong boi</div>
                </Tab>

                <CheckboxTest />
                <SegmentTest />
                <RadioTest />
            </Tabs>
        </div>
    );
};

export default Playground;
