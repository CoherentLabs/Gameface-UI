const versionMatch = /Cohtml\/([\d.]+)/.exec(navigator.userAgent);
const rawVersion = versionMatch ? versionMatch[1] : "0.0.0.0";

const VERSION_PARTS = rawVersion.split('.').map(part => Number(part) || 0);
export const GAMEFACE_VERSION = rawVersion;

/**
 * Checks if the current version satisfies a minimum requirement.
 * Example: isAtLeast(2, 2) returns true if version is 2.2.0 or 2.3.0
 */
export function verIsAtLeast(major: number, minor: number = 0, patch: number = 0): boolean {
  const [currMajor = 0, currMinor = 0, currPatch = 0] = VERSION_PARTS;

  if (currMajor !== major) return currMajor > major;
  if (currMinor !== minor) return currMinor > minor;
  return currPatch >= patch;
}