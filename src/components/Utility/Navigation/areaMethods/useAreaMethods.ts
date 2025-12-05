import { waitForFrames } from '@components/utils/waitForFrames';
// @ts-ignore
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import { SetStoreFunction } from 'solid-js/store';
import { NavigationConfigType } from '../types';
import { AreaMethods } from './areaMethods.types';

export default function createAreaMethods(
    areas: Set<string>,
    setConfig: SetStoreFunction<NavigationConfigType>
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

    const focusFirst = (area: string) => {
        if (!areas.has(area)) {
            console.warn(`Area "${area}" not registered. Available areas:`, Array.from(areas));
            return;
        }

        spatialNavigation.focusFirst(area);
        setConfig('scope', area);
    };

    const focusLast = (area: string) => {
        if (!areas.has(area)) {
            console.warn(`Area "${area}" not registered. Available areas:`, Array.from(areas));
            return;
        }

        spatialNavigation.focusLast(area);
        setConfig('scope', area);
    };

    const switchArea = (area: string) => {
        if (!areas.has(area)) {
            console.warn(`Area "${area}" not registered. Available areas:`, Array.from(areas));
            return;
        }

        spatialNavigation.switchArea(area);
        setConfig('scope', area);
    };

    const clearFocus = () => spatialNavigation.clearFocus();

    const changeNavigationKeys = (keys: { up?: string, down?: string, left?: string, right?: string}, clearCurrent = false) => {
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
