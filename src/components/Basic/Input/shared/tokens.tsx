import { ParentProps } from "solid-js";
import { createTokenComponent, TokenBase } from "@components/utils/tokenComponents";

export const Input = createTokenComponent();
export const Placeholder = createTokenComponent<ParentProps<TokenBase>>();
export const Before = createTokenComponent<ParentProps<TokenBase>>();
export const After = createTokenComponent<ParentProps<TokenBase>>();