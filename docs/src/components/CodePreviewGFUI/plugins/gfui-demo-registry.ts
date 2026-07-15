// Shared map: hash -> demo source code (TSX string).
// Remark plugin writes; vite plugin reads.
export const demoRegistry = new Map<string, string>();

// Simple stable hash for a code string.
export function hashDemo(code: string): string {
  let h = 0;
  for (let i = 0; i < code.length; i++) {
    h = (Math.imul(31, h) + code.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}