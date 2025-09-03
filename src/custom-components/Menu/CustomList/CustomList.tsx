import List from "@components/Layout/List/List";
import { For } from "solid-js";
import style from './CustomList.module.scss';
import InlineTextBlock from "@components/Basic/InlineTextBlock/InlineTextBlock";

interface CustomListProps {
    values: {heading: string, content: string}[]
}

const CustomList = (props: CustomListProps) => {
    return (
        <List class={style.list} bullet-class={style['list-icon']}>
            <For each={props.values}>{(c) => (
                <List.Item class={style['list-item']}>
                    <InlineTextBlock class={style['list-content']}>
                        <span class={style.heading}>{c.heading}</span>
                        {" - "}
                        {c.content}
                    </InlineTextBlock>
                </List.Item>
            )}</For>
        </List>
    )
}

export default CustomList;