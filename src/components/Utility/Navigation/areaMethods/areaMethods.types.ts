import { KeyName } from "coherent-gameface-interaction-manager/dist/types/utils/keyboard-mappings";

/**
 * Interface defining all area-related navigation methods
 */
export interface AreaMethods {
    /**
     * Registers a navigation area with focusable elements
     * @param area - The name of the navigation area to register
     * @param elements - Array of CSS selectors or HTML elements to include in the navigation area
     * @param focused - Whether to automatically focus the first element in this area after registration
     */
    registerArea: (area: string, elements: string[] | HTMLElement[], focused?: boolean) => void;

    /**
     * Unregisters a navigation area and removes it from spatial navigation
     * @param area - The name of the navigation area to unregister
     */
    unregisterArea: (area: string) => void;

    /**
     * Focuses the first focusable element in the specified area and updates the navigation scope
     * @param area - The name of the navigation area to focus
     */
    focusFirst: (area: string) => void;

    /**
     * Focuses the last focusable element in the specified area and updates the navigation scope
     * @param area - The name of the navigation area to focus
     */
    focusLast: (area: string) => void;

    /**
     * Switches the active navigation to the specified area by focusing the first element in it and updating the navigation scope
     * @param area - The name of the navigation area to switch to
     */
    switchArea: (area: string) => void;

    /**
     * Clears the current focus from all navigation areas
     */
    clearFocus: () => void;

    /**
     * Changes the navigation keys for spatial navigation
     * @param keys - Object containing direction keys (up, down, left, right)
     * @param clearCurrent - Whether to clear current active keys before setting new ones
     */
    changeNavigationKeys: (
        keys: { up?: KeyName | KeyName[], down?: KeyName | KeyName[], left?: KeyName | KeyName[], right?: KeyName | KeyName[]},
        clearCurrent?: boolean
    ) => void;

    /**
     * Resets navigation keys to their default values
     */
    resetNavigationKeys: () => void;

    /**
     * Pauses navigation, preventing spatial navigation actions from executing
     */
    pauseNavigation: () => void;

    /**
     * Resumes navigation, allowing spatial navigation actions to execute again
     */
    resumeNavigation: () => void;
}
