import { ComponentProps, ComponentNavigationActions, NavigationActionsConfig } from "@components/types/ComponentProps";

/**
 * Merges component navigation actions: anchor from props, default component actions, then user's onAction (highest priority).
 */
export default function mergeNavigationActions(props: ComponentProps, componentActions: ComponentNavigationActions = {}): NavigationActionsConfig {
    return {
        anchor: props.anchor,
        ...componentActions,
        ...(props.onAction || {})
    };
}