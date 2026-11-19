// Records a test view's onChange calls for the e2e specs (read with the helpers in tests/shared/utils.js).
//
//   const log = createOnChangeLog('checkbox');
//   <Checkbox onChange={(v) => { log.record(v); setChecked(v); }} />
//   action: () => log.sync(() => checkboxRef.setChecked(true))   // keeps only the calls made while fn runs
//   reset:  ...; flush(); log.clear();
//
// `calls` holds every call since the last clear (a callback with several arguments is stored as an array).
// `sync` holds the calls made synchronously by the last `log.sync()` action, so a late (effect-based)
// onChange shows up as missing there.
export interface OnChangeLogData {
    calls: unknown[];
    sync: unknown[] | null;
}

export default function createOnChangeLog(name: string) {
    const logs: Record<string, OnChangeLogData> = ((window as any).__onChangeLogs ??= {});
    const data: OnChangeLogData = { calls: [], sync: null };
    logs[name] = data;

    return {
        record: (...args: unknown[]) => {
            data.calls.push(args.length > 1 ? args : args[0]);
        },
        sync: (fn: () => void) => {
            const before = data.calls.length;
            fn();
            data.sync = data.calls.slice(before);
        },
        clear: () => {
            data.calls.length = 0;
            data.sync = null;
        },
    };
}
