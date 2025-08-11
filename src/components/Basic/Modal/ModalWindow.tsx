import { ParentComponent, createMemo } from "solid-js";
import { TokenComponentProps } from "../../types/ComponentProps";
import styles from './Modal.module.scss';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import Layout from "@components/Layout/Layout/Layout";

export const Window = createTokenComponent<TokenBase>();

const ModalWindow: ParentComponent<TokenComponentProps> = (props) => {
    const WindowToken = useToken(Window, props.parentChildren);

    const modalWindowClasses = createMemo(() => {
        const classes = [styles['modal-window']];
        if (WindowToken?.()?.class) classes.push(WindowToken?.()?.class as string);
        return classes.join(' ');
    });

    return (
        <div class={modalWindowClasses()} style={WindowToken?.()?.style}>
            <Layout>
                {WindowToken?.()?.children}
            </Layout>
        </div >
    )
}

export default ModalWindow;