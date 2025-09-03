import Button from "@components/Basic/Button/Button"
import Modal, { ModalRef } from "@components/Basic/Modal/Modal"
import Block from "@components/Layout/Block/Block"
import Bottom from "@components/Layout/Bottom/Bottom"
import Flex from "@components/Layout/Flex/Flex"
import Top from "@components/Layout/Top/Top"
import style from './CustomModal.module.scss';
import Content from "@components/Layout/Content/Content"
import TextBlock from "@components/Basic/TextBlock/TextBlock"

const CustomModal = (props: {ref: any, onClose: () => void}) => {
    return (
        <Modal onClose={props.onClose} ref={props.ref} open={false}>
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
                            <Button size='small' >Save</Button>
                        </Modal.Close>
                        <Modal.Close>
                            <Button size='small' >Cancel</Button>
                        </Modal.Close>
                    </Flex>
                </Bottom>
            </Modal.Window>
        </Modal>
    )
}

export default CustomModal;