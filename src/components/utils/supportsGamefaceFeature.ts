import { GAMEFACE_VERSION, verIsAtLeast } from "./gamefaceVersion";

export type SupportedFeature = 'gap';


const warnedFeatures = new Set<SupportedFeature>();

const FEATURE_REQUIREMENTS: Record<SupportedFeature, { minVersion: [number, number], hasTrigger: (props: any) => boolean }> = {
    gap: {
        minVersion: [2, 2],
        hasTrigger: (props) => !!(props.gap || props["row-gap"] || props["column-gap"])
    }
};

/**
 * Evaluates component props to see if a specific Gameface UI feature is being used,
 * and logs a console warning if the current environment's Gameface version does not support it.
 * * Note: Warnings are tracked globally and will only be emitted once per feature 
 * to prevent console spam across multiple component instances.
 *
 * @param {any} props - The component properties to inspect for feature triggers.
 * @param {SupportedFeature} feature - The specific UI feature to check (e.g., 'gap').
 */
export function warnIfUnsupported(props: any, feature: SupportedFeature) {
    if (warnedFeatures.has(feature)) return;

    const config = FEATURE_REQUIREMENTS[feature];
    if (!config) return;

    const isUsingFeature = config.hasTrigger(props);
    const isSupported = verIsAtLeast(...config.minVersion);

    if (isUsingFeature && !isSupported) {
        console.warn(
            `[Gameface UI] The "${feature}" feature is unsupported in Gameface v${GAMEFACE_VERSION}. Upgrade to ${config.minVersion.join('.')}+`
        );
        warnedFeatures.add(feature);
    }
}