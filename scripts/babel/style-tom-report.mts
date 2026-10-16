// Dev-server report for the Style TOM plugin: which dynamic styles on
// CSSTOM-eligible properties were rewritten, and which weren't (with why).
// The Babel plugin calls recordStyle(); the Vite plugin below turns
// recording on (dev server only - adding it to `plugins` is the switch),
// writes the report file and prints one terminal line when the list of
// not-rewritten styles changes.
import fs from 'node:fs';
import path from 'node:path';
import { TraceMap, originalPositionFor } from '@jridgewell/trace-mapping';
import type { NodePath } from '@babel/traverse';
import type { Logger, Plugin } from 'vite';

type Entry = { line: number; column: number; property: string; code: string; reason?: string };

let enabled = false;
const entriesByFile = new Map<string, Entry[]>();
// Nested JSX can be visited more than once - record each value once.
const recordedNodes = new WeakSet<object>();
// Earlier Vite plugins (e.g. vite-solid-style-to-css) rewrite the file before
// Babel sees it, so Babel's line numbers are for that rewritten code. These
// maps translate them back to the file on disk.
const sourceMaps = new Map<string, TraceMap>();

// Vite ids use forward slashes (and may carry a ?query); Babel resolves the
// same file to a native path - normalize both to one key.
function fileKey(file: string): string {
  return path.resolve(file.replace(/\?.*$/, ''));
}

// Set by the plugin when it switched itself off (missing or mismatched
// runtime) - the report then shows why instead of listing styles.
let disabledReason: string | null = null;

export function setDisabledReason(reason: string | null): void {
  if (enabled) disabledReason = reason;
}

export function beginFile(filename: string): void {
  if (enabled) entriesByFile.set(filename, []);
}

export function endFile(filename: string): void {
  if (!enabled) return;
  if (entriesByFile.get(filename)?.length === 0) entriesByFile.delete(filename);
  scheduleWrite();
}

function originalPosition(filename: string, line: number, column: number): { line: number; column: number } {
  const map = sourceMaps.get(fileKey(filename));
  const original = map && originalPositionFor(map, { line, column });
  return original?.line != null ? { line: original.line, column: original.column } : { line, column };
}

// Call before the node is replaced - the replacement has no source location.
// No reason = rewritten.
export function recordStyle(valuePath: NodePath, property: string, reason?: string): void {
  if (!enabled) return;
  const file = (valuePath.hub as unknown as { file?: { opts: { filename?: string }; code: string } }).file;
  const filename = file?.opts.filename;
  const { node } = valuePath;
  if (!filename || !node.loc || node.start == null || node.end == null || recordedNodes.has(node)) return;
  recordedNodes.add(node);

  const { line, column } = originalPosition(filename, node.loc.start.line, node.loc.start.column);
  let entries = entriesByFile.get(filename);
  if (!entries) entriesByFile.set(filename, (entries = []));
  entries.push({
    line,
    column: column + 1,
    property,
    code: file.code.slice(node.start, node.end).replace(/\s+/g, ' '),
    reason,
  });
}

let reportPath = '';
let logger: Logger | undefined;
let writeTimer: ReturnType<typeof setTimeout> | undefined;
let lastNotRewrittenKey = '';

function scheduleWrite(): void {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(writeReport, 300);
}

function formatEntry(filename: string, e: Entry): string {
  const code = e.code.length > 120 ? e.code.slice(0, 117) + '...' : e.code;
  // Absolute `path:line:column` - Ctrl+click opens the file at that spot in
  // VS Code. (A file:/// link with an upper-case drive letter didn't open.)
  const link = `${fileKey(filename)}:${e.line}:${e.column}`;
  const lines = [link, `    ${e.property}: ${code}`];
  if (e.reason) lines.push(`    ${e.reason}`);
  return lines.join('\n');
}

function writeReport(): void {
  if (disabledReason) {
    fs.writeFileSync(reportPath, [
      'Style TOM report',
      `Generated ${new Date().toLocaleString()} by the Vite dev server.`,
      '',
      'THE STYLE TOM PLUGIN IS DISABLED - no styles are rewritten until this is fixed:',
      disabledReason,
      '',
    ].join('\n'));
    // The plugin already warned in the terminal; make sure the normal summary
    // line prints again once it's fixed.
    lastNotRewrittenKey = '\0disabled';
    return;
  }

  const notRewritten: string[] = [];
  const rewritten: string[] = [];

  for (const filename of [...entriesByFile.keys()].sort()) {
    const entries = [...entriesByFile.get(filename)!].sort((a, b) => a.line - b.line || a.column - b.column);
    for (const e of entries) (e.reason ? notRewritten : rewritten).push(formatEntry(filename, e));
  }

  const lines = [
    'Style TOM report',
    `Generated ${new Date().toLocaleString()} by the Vite dev server.`,
    'Covers the files compiled so far - open the views you want checked.',
    'Ctrl+click a link to open the file at that line.',
    '',
    `NOT REWRITTEN (${notRewritten.length})`,
    notRewritten.length
      ? 'These dynamic styles go through the slower string path. Each one says why and how to fix it.'
      : 'Every dynamic style on a supported property uses CSSTOM.',
    '',
    notRewritten.join('\n\n'),
    '',
    `REWRITTEN (${rewritten.length})`,
    'These dynamic styles use CSSTOM.',
    '',
    rewritten.join('\n\n'),
    '',
  ];
  fs.writeFileSync(reportPath, lines.join('\n'));

  const key = notRewritten.join('\n');
  if (key === lastNotRewrittenKey) return;
  lastNotRewrittenKey = key;
  if (notRewritten.length > 0) {
    logger?.warn(
      `[style-tom] ${notRewritten.length} dynamic style${notRewritten.length === 1 ? '' : 's'} can't use the CSSTOM fast path. Details: ${reportPath}`,
      { timestamp: true }
    );
  } else {
    logger?.info('[style-tom] All dynamic styles use the CSSTOM fast path.', { timestamp: true });
  }
}

export type StyleTomReportOptions = {
  // Report file, relative to the project root.
  file?: string;
};

// Must be placed before solidPlugin() in `plugins`, so its transform hook
// sees the code exactly as Babel will.
export function styleTomReport(options: StyleTomReportOptions = {}): Plugin {
  return {
    name: 'gameface-style-tom-report',
    apply: 'serve',
    enforce: 'pre',
    configResolved(config) {
      enabled = true;
      logger = config.logger;
      reportPath = path.resolve(process.cwd(), options.file ?? 'style-tom-report.log');
    },
    transform(_code, id) {
      if (enabled && /\.[jt]sx$/.test(id.replace(/\?.*$/, ''))) {
        sourceMaps.set(fileKey(id), new TraceMap(this.getCombinedSourcemap() as ConstructorParameters<typeof TraceMap>[0]));
      }
      return null;
    },
  };
}
