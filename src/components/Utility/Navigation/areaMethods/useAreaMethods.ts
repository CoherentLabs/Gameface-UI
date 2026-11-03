import { waitForFrames } from '@components/utils/waitForFrames';
import { SetStoreFunction } from 'solid-js/store';
import { NavigationConfigType } from '../types';
import { AreaMethods } from './areaMethods.types';
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import type { KeyName, NavigationEdgeHandler } from 'coherent-gameface-interaction-manager';

export default function createAreaMethods(
    areas: Set<string>,
    setConfig: SetStoreFunction<NavigationConfigType>,
    navigationEdgeHandlers: Map<string, NavigationEdgeHandler>
): AreaMethods {
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
        setConfig('scope', area);
    };

    const focusLast = (area: string) => {
        if (!isAreaValid(area)) return;

        spatialNavigation.focusLast(area);
        setConfig('scope', area);
    };

    const switchArea = (area: string) => {
        if (!isAreaValid(area)) return;

        spatialNavigation.switchArea(area);
        setConfig('scope', area);
    };

    const clearFocus = () => spatialNavigation.clearFocus();

    const changeNavigationKeys = (keys: { up?: KeyName | KeyName[], down?: KeyName | KeyName[], left?: KeyName | KeyName[], right?: KeyName | KeyName[]}, clearCurrent = false) => {
        spatialNavigation.changeKeys(keys, { clearCurrentActiveKeys: clearCurrent });
    }

    const resetNavigationKeys = () => spatialNavigation.resetKeys();

    const setEdgeHandler = (area: string, handler: NavigationEdgeHandler | null) => {
        if (handler === null) {
            navigationEdgeHandlers.delete(area);
            return;
        }

        if (navigationEdgeHandlers.has(area)) {
            console.warn(`Area: ${area} already has onEdge callback registered!`)
            return;
        }

        navigationEdgeHandlers.set(area, handler)
    }

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
        resumeNavigation,
        setEdgeHandler
    };
}
