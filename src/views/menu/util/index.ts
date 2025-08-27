import eventBus from "@components/tools/EventBus";
import { OPTIONS } from "../Menu";
import { Accessor, createEffect, createRoot } from "solid-js";
import { on } from "events";

export const getFirstOptionOfTab = (tab: string) => {
    switch (tab) {
        case OPTIONS[0] :
            return 'difficulty';
        case OPTIONS[1] :
            return 'resolution'
        case OPTIONS[2] :
            return 'keybindPreset'
        case OPTIONS[3] :
            return 'masterVolume'
        default :
            return ''
    }
}

export const emitChange = () => {
    eventBus.emit('ui-change');
}