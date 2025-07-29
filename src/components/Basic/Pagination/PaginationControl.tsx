import { Accessor, createMemo, JSX, ParentComponent, ParentProps, Show, useContext } from "solid-js";
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import Arrow from './Arrow.svg?component-solid';
import { PaginationContext } from "./Pagination";
import styles from './Pagination.module.css';

interface ControlTokenProps extends TokenBase {
    'hidden-class'?: string
}

interface PaginationControlProps extends TokenComponentProps {
    visible: boolean
    direction: 'prev' | 'next'
}

export const Control = createTokenComponent<ControlTokenProps>();

const ControlComponent = ({ ControlToken }: { ControlToken: Accessor<ParentProps<ControlTokenProps> | null | undefined> }) => {
    return <>
        <Show when={ControlToken()?.children}>
            {ControlToken()?.children}
        </Show>
        <Show when={!ControlToken()?.children}>
            <Arrow class={styles.arrow} />
        </Show>
    </>
}

export const PaginationControl: ParentComponent<PaginationControlProps> = (props) => {
    const pagination = useContext(PaginationContext);
    const ControlToken = useToken(Control, props.parentChildren);

    const handleClick = () => {
        return props.direction === 'next' ? pagination?.nextPage() : pagination?.previousPage(); 
    }

    const controlContainerClasses = createMemo(() => {
        const classes = [styles.control];

        classes.push(styles[props.direction]);
        if (ControlToken()?.class) classes.push(ControlToken()?.class ?? '');
        if (!props.visible) {
            if (ControlToken?.()?.["hidden-class"]) {
                classes.push(ControlToken?.()?.["hidden-class"] ?? '');
            } else {
                classes.push(styles.hidden);
            }
        }

        return classes.join(' ');
    });

    return (
        <>
            <div 
                class={controlContainerClasses()}
                style={ControlToken()?.style || {}}
                onClick={handleClick}>
                <Show when={props.direction === 'prev'}>
                    <ControlComponent ControlToken={ControlToken} />
                </Show>
                <Show when={props.direction === 'next'}>
                    <div class={styles.rotate}>
                        <ControlComponent ControlToken={ControlToken} />
                    </div>
                </Show>
            </div>
        </>

    )
}
