import { OPTIONS } from "../Menu";

export const getFirstOptionOfTab = (tab: string) => {
    switch (tab) {
        case OPTIONS[0] :
            return 'difficulty';
        case OPTIONS[1] :
            return 'resolution'
        case OPTIONS[2] :
            return 'keybindPreset'
        default :
            return ''
    }
}