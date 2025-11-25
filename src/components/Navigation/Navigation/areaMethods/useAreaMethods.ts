import { waitForFrames } from '@components/utils/waitForFrames';
// @ts-ignore
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import { SetStoreFunction } from 'solid-js/store';
import { NavigationConfigType } from '../types';
import { AreaMethods } from './areaMethods.types';

export default function createAreaMethods(
    areas: Set<string>,
    config: NavigationConfigType,
    setConfig: SetStoreFunction<NavigationConfigType>
): AreaMethods {
    let lastActive: Element | null = null;
    let lastArea: string | null = null;

    const registerArea = (area: string, elements: string[] | HTMLElement[], focused?: boolean) => {
        const enabled = spatialNavigation.enabled;
        if (!enabled) setConfig('navigationEnabled', true)

        waitForFrames(() => {
            spatialNavigation[enabled ? 'add' : 'init']([
                { area: area, elements: elements },
            ]);
            areas.add(area);
            focused && focusFirst(area);
        }, enabled ? 0 : 3)
    }

    const unregisterArea = (area: string) => {
        spatialNavigation.remove(area)
        areas.delete(area);
        if (areas.size === 0) {
            spatialNavigation.deinit();
            setConfig('navigationEnabled', false)
        }
    }

    const pauseNavigation = () => {
        if (!isEnabled()) {
            return console.warn('Spatial Navigation is not currently active!')
        }
        
        lastActive = document.activeElement;
        lastArea = config.scope;
        spatialNavigation.deinit();
        setConfig('navigationEnabled', false)
    }

    const resumeNavigation = () => {
        if (isEnabled()) {
            return console.warn('Spatial Navigation is already active!')
        }

        setConfig('navigationEnabled', true)
        waitForFrames(() => {
            if (lastActive && spatialNavigation.isElementInGroup(lastActive)) {
                (lastActive as HTMLElement).focus();
                setConfig('scope', lastArea!);
            } else {
                focusFirst(config.scope)
            }
        })
    }

    const isEnabled = () => config.navigationEnabled

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
        isEnabled,
        pauseNavigation,
        resumeNavigation
    };
}
