import { ComponentProps, NavigationActionsConfig } from "@components/types/ComponentProps";

export default function mergeNavigationActions(props: ComponentProps, componentActions: NavigationActionsConfig = {}): NavigationActionsConfig {
    return {
        anchor: props.anchor,
        ...componentActions,
        ...(props.onAction || {})
    };
}