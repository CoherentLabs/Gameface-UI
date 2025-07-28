import { ComponentProps } from "@components/types/ComponentProps"
import { Accessor } from "solid-js"

export interface TextInputRef {
    element: HTMLDivElement,
    input: HTMLInputElement,
    value: Accessor<string>,
    changeValue: (newValue: string) => void,
    clear: () => void,
}

export interface TextInputProps extends ComponentProps {
    value?: string
    disabled?: boolean
    readonly?: boolean
    'max-symbols'?: number
    'class-disabled'?: string
    onChange?: (value: string) => void;
}