import Button from "@components/Basic/Button/Button"
import Modal, { ModalRef } from "@components/Feedback/Modal/Modal"
import Block from "@components/Layout/Block/Block"
import Bottom from "@components/Layout/Bottom/Bottom"
import Flex from "@components/Layout/Flex/Flex"
import Top from "@components/Layout/Top/Top"
import style from './CustomModal.module.scss';
import Content from "@components/Layout/Content/Content"
import TextBlock from "@components/Basic/TextBlock/TextBlock"
import CustomButton from "../CustomButton/CustomButton"

const CustomModal = (props: {ref: (ref: ModalRef) => void, onClose: () => void}) => {
    let localRef!: ModalRef;
    
    const assignRef = (ref: ModalRef) => {
        localRef = ref;
        props.ref(ref);
    }

    return (
        <Modal onClose={props.onClose} ref={assignRef} open={false} onAction={{
            'select': () => localRef.close(),
            'back': () => localRef.close(),
        }}>
            <Modal.Overlay />
            <Modal.Window class={style.modal} >
                <Top>
                    <Flex align-items='center'>
                        <h2 class={style['modal-heading']}>Save changes?</h2>
                    </Flex>
                </Top>
                <Content>
                    <TextBlock class={style['modal-content']}>
                        You have unsaved changes in your current settings. If you switch tabs now, your changes will be lost. Would you like to save before leaving this menu?
                    </TextBlock>
                </Content>
                <Bottom>
                    <Flex justify-content='end' class={style['modal-button-container']}>
                        <Modal.Close style={{ "margin-right": '0.5vmax' }}>
                            <CustomButton text="Save" variation="select" />
                        </Modal.Close>
                        <Modal.Close>
                            <CustomButton text="Cancel" variation="back" />
                        </Modal.Close>
                    </Flex>
                </Bottom>
            </Modal.Window>
        </Modal>
    )
}

export default CustomModal;