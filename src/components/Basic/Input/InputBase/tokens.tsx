import { createTokenComponent } from "@components/utils/tokenComponents";
import { JSX } from "solid-js";

interface InputTokenProps  {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Input = createTokenComponent<InputTokenProps>();
export const Placeholder = createTokenComponent<InputTokenProps>();
export const Before = createTokenComponent();
export const After = createTokenComponent();