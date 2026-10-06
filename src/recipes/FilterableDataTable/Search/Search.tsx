import TextInput from "@components/Basic/Input/TextInput/TextInput"
import BackgroundImage from "@components/Media/BackgroundImage/BackgroundImage"
import searchIcon from '../assets/search.svg'
import { Component } from "solid-js"
import styles from './Search.module.scss'

interface SearchProps {
    inputValue: string
    onChange: (value: string) => void
}

const Search: Component<SearchProps> = ({ inputValue, onChange }) => {
    return (
        <TextInput class={styles.search} onChange={onChange} value={inputValue} delay>
            <TextInput.Input class={styles['search-input']} />
            <TextInput.Before>
                <BackgroundImage src={searchIcon} class={styles['search-icon']} options={{ size: 'contain', position: 'center' }} />
            </TextInput.Before>
        </TextInput>
    )
}

export default Search