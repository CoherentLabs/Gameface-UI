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

export { GAMEFACE_VERSION as G, verIsAtLeast as v };
