import { v as verIsAtLeast, G as GAMEFACE_VERSION } from './gamefaceVersion.ACI438bm.js';

const warnedFeatures = /* @__PURE__ */ new Set();
const FEATURE_REQUIREMENTS = {
  gap: {
    minVersion: [2, 2],
    hasTrigger: (props) => !!(props.gap || props["row-gap"] || props["column-gap"])
  }
};
function warnIfUnsupported(props, feature) {
  if (warnedFeatures.has(feature)) return;
  const config = FEATURE_REQUIREMENTS[feature];
  if (!config) return;
  const isUsingFeature = config.hasTrigger(props);
  const isSupported = verIsAtLeast(...config.minVersion);
  if (isUsingFeature && !isSupported) {
    console.warn(
      `[Gameface UI] The "${feature}" feature is unsupported in Gameface v${GAMEFACE_VERSION}. Upgrade to ${config.minVersion.join(".")}+`
    );
    warnedFeatures.add(feature);
  }
}

export { warnIfUnsupported as w };
