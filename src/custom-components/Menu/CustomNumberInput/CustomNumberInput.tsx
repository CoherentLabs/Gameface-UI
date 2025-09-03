import NumberInput from "@components/Basic/Input/NumberInput/NumberInput"
import style from './CustomNumberInput.module.scss'
import { emitChange } from "../../../views/menu/util";

interface CustomInputProps {
    min: number,
    max: number,
    value: number
}

const CustomNumberInput = (props: CustomInputProps) => {
    return (
        <NumberInput onChange={emitChange} class={style.input} min={props.min} max={props.max} value={props.value} >
            <NumberInput.IncreaseControl class={style['input-button']}></NumberInput.IncreaseControl>
            <NumberInput.DecreaseControl class={style['input-button']}></NumberInput.DecreaseControl>
            <NumberInput.Input class={style['input-element']} />
        </NumberInput>
    )
}

export default CustomNumberInput