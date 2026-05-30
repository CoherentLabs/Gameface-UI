import { waitForFrames } from '@components/utils/waitForFrames';
import { NavigationConfigType } from '../types';
import { AreaMethods } from './areaMethods.types';
import { KeyName, spatialNavigation } from 'coherent-gameface-interaction-manager';
import { StoreSetter } from 'solid-js';

export default function createAreaMethods(
    areas: Set<string>,
    setConfig: StoreSetter<NavigationConfigType>
): AreaMethods {
    // helper
    const setScope = (area: string) => setConfig(s => {s.scope = area});

    const registerArea = (area: string, elements: string[] | HTMLElement[], focused?: boolean) => {
        waitForFrames(() => {
            spatialNavigation[spatialNavigation.enabled ? 'add' : 'init']([
                { area: area, elements: elements },
            ]);
            areas.add(area);
            focused && focusFirst(area);
        }, spatialNavigation.enabled ? 1 : 3)
    }

    const unregisterArea = (area: string) => {
        spatialNavigation.remove(area)
        areas.delete(area);
    }

    const pauseNavigation = () => {
        if (spatialNavigation.paused) {
            return console.warn('Navigation is already paused!')
        }

        spatialNavigation.pause();
    }

    const resumeNavigation = () => {
        if (!spatialNavigation.paused) {
            return console.warn('Navigation is not paused!')
        }

        spatialNavigation.resume();
    }

    const isAreaValid = (area: string) => {  
        if (!areas.has(area)) {  
            console.warn(`Area "${area}" not registered. Available areas:`, Array.from(areas));  
            return false;  
        }  

        return true;  
    } 

    const focusFirst = (area: string) => {
        if (!isAreaValid(area)) return;

        spatialNavigation.focusFirst(area);
        setScope(area);
    };

    const focusLast = (area: string) => {
        if (!isAreaValid(area)) return;

        spatialNavigation.focusLast(area);
        setScope(area);
    };

    const switchArea = (area: string) => {
        if (!isAreaValid(area)) return;

        spatialNavigation.switchArea(area);
        setScope(area);
    };

    const clearFocus = () => spatialNavigation.clearFocus();

    const changeNavigationKeys = (keys: { up?: KeyName | KeyName[], down?: KeyName | KeyName[], left?: KeyName | KeyName[], right?: KeyName | KeyName[]}, clearCurrent = false) => {
        spatialNavigation.changeKeys(keys, { clearCurrentActiveKeys: clearCurrent });
    }

    const resetNavigationKeys = () => spatialNavigation.resetKeys();

    return {
        registerArea,
        unregisterArea,
        focusFirst,
        focusLast,
        switchArea,
        clearFocus,
        changeNavigationKeys,
        resetNavigationKeys,
        pauseNavigation,
        resumeNavigation
    };
}
