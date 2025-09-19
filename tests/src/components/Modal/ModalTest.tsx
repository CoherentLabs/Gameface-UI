import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import selectors from "../../../shared/modal-selectors.json";
import Modal, { ModalRef } from "@components/Feedback/Modal/Modal";
import ModalCloseIcon from "@components/Feedback/Modal/ModalCloseIcon.svg?component-solid";
import Top from "@components/Layout/Top/Top";
import Flex from "@components/Layout/Flex/Flex";
import Block from "@components/Layout/Block/Block";
import { Content } from "@components/Layout/Scroll/ScrollContent";
import Button from "@components/Basic/Button/Button";
import Bottom from "@components/Layout/Bottom/Bottom";

const ModalTest = () => {
    let modalRef!: ModalRef;
    const [test, setTest] = createSignal('red');

    const scenarios = [
        { label: "Open modal with ref", action: () => { modalRef.open() } },
        { label: "Close modal with ref", action: () => { modalRef.close() } },
        { label: "Change styles", action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setTest('red');
        modalRef?.close();
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='modal'>
            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Modal style={reactiveStyle()} class={`${selectors.modal} ${reactiveClass()}`} ref={modalRef}>
                <Modal.Overlay style={reactiveStyle()} class={`${selectors.modalOverlay} ${reactiveClass()}`} />
                <Modal.Window style={reactiveStyle()} class={`${selectors.modalWindow} ${reactiveClass()}`}>
                    <Top>
                        <Flex justify-content='space-between' align-items='center'>
                            <Block>Modal title</Block>
                            <Modal.Close class={selectors.closeButton} style={{ width: '2vmax', height: '2vmax' }}>
                                <ModalCloseIcon />
                            </Modal.Close>
                        </Flex>
                    </Top>
                    <Content>
                        Content
                    </Content>
                    <Bottom>
                        <Flex justify-content='end'>
                            <Modal.Close class={selectors.acceptButton} style={{ "margin-right": '0.5vmax' }}>
                                <Button size='small' textFit={false}>Accept</Button>
                            </Modal.Close>
                            <Modal.Close class={selectors.rejectButton}>
                                <Button size='small' textFit={false}>Reject</Button>
                            </Modal.Close>
                        </Flex>
                    </Bottom>
                </Modal.Window>
            </Modal>
        </Tab>
    )
}

export default ModalTest;