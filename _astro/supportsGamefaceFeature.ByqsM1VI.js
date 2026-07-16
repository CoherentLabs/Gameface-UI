const versionMatch = /Cohtml\/([\d.]+)/.exec(navigator.userAgent);
const rawVersion = versionMatch ? versionMatch[1] : "0.0.0.0";
const VERSION_PARTS = rawVersion.split(".").map((part) => Number(part) || 0);
const GAMEFACE_VERSION = rawVersion;
function verIsAtLeast(major, minor = 0, patch = 0) {
  const [currMajor = 0, currMinor = 0, currPatch = 0] = VERSION_PARTS;
  if (currMajor !== major) return currMajor > major;
  if (currMinor !== minor) return currMinor > minor;
  return currPatch >= patch;
}

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
