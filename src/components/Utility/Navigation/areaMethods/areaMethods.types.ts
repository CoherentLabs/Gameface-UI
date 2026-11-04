import type { KeyName, NavigationEdgeHandler, SwitchAreaOptions } from 'coherent-gameface-interaction-manager';

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
     * @returns The focused element, or `null` if nothing was focused (the scope is then unchanged)
     */
    focusFirst: (area: string) => HTMLElement | null;

    /**
     * Focuses the last focusable element in the specified area and updates the navigation scope
     * @param area - The name of the navigation area to focus
     * @returns The focused element, or `null` if nothing was focused (the scope is then unchanged)
     */
    focusLast: (area: string) => HTMLElement | null;

    /**
     * Focuses the area's last focused element (or its first if there is none) and updates the navigation scope
     * @param area - The name of the navigation area to switch to
     * @param options - `direction` focuses the closest element on entry; `fallback` is the focus strategy used if there is none
     * @returns The focused element, or `null` if nothing was focused
     */
    switchArea: (area: string, options?: SwitchAreaOptions) => HTMLElement | null;

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

    /**
     * Sets the handler called when navigation hits the edge of an area. Return `false` from it to prevent looping.
     * An area holds one handler. Pass `null` to remove it.
     * @param area - The name of the navigation area
     * @param handler - The edge handler, or `null` to remove the current one
     */
    setEdgeHandler: (area: string, handler: NavigationEdgeHandler | null) => void;
}
