import { createTokenComponent } from "@components/utils/tokenComponents";
import { JSX } from "solid-js";

interface InputTokenProps  {
    style?: JSX.CSSProperties,
    class?: string,
}

interface VisibilityButtonTokenProps extends InputTokenProps {
    position?: 'before' | 'after'
}

export const Input = createTokenComponent<InputTokenProps>();
export const Placeholder = createTokenComponent<InputTokenProps>();
export const VisibilityButton = createTokenComponent<VisibilityButtonTokenProps>();
export const Before = createTokenComponent<InputTokenProps>();
export const After = createTokenComponent<InputTokenProps>();