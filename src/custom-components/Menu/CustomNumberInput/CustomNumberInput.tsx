import NumberInput from "@components/Basic/Input/NumberInput/NumberInput"
import style from './CustomNumberInput.module.scss'

interface CustonInputProps {
    min: number,
    max: number,
    value: number
}

const CustomNumberInput = (props: CustonInputProps) => {
    return (
        <NumberInput class={style.input} min={props.min} max={props.max} value={props.value} >
            <NumberInput.IncreaseControl class={style['input-button']}></NumberInput.IncreaseControl>
            <NumberInput.DecreaseControl class={style['input-button']}></NumberInput.DecreaseControl>
            <NumberInput.Input class={style['input-element']} />
        </NumberInput>
    )
}

export default CustomNumberInput