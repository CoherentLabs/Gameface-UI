import { createSignal, For, Show } from 'solid-js';
import styles from './SpriteTest.module.scss';

/**
 * Texture / asset-format benchmark. N distinct icons on screen at once, 5 pages,
 * every page a disjoint set, so paging swaps every icon.
 *
 * Mode is chosen by query param so the initial render is measured cleanly —
 * switching in place would leave both asset sets loaded.
 *
 *   ?mode=png         N distinct PNG background-images, rows destroyed/recreated
 *   ?mode=atlas       one shared atlas texture, only background-position varies
 *   ?mode=svg         N distinct SVG background-images, destroyed/recreated
 *   ?mode=svg-pooled  same SVGs, but every page is mounted once and paging only
 *                     toggles `display: none` — nothing is ever destroyed
 *   ?mode=png-pooled  the same pooling, on PNGs, as a control
 *
 *   ?n=<per page>     default 200. Use a smaller value for the pooled SVG modes:
 *                     pooling mounts n*5 elements and loads every asset up front.
 *
 *   ?nudge=1          animate every visible cell a couple of pixels, forever, so
 *                     the renderer must re-issue draw commands for all of them
 *                     every frame. This is the only mode that exercises per-frame
 *                     texture binding rather than one-off rasterisation - measure
 *                     it with frame time, not with the pagination numbers.
 *                     Driven by CSS so no per-frame JS is added to either mode.
 *
 * Compare like for like: same element count on screen, same pixels, same layout.
 */

const PAGES = 5;
const ATLAS_COLS = 32;
const ATLAS_ROWS = 32;

// Eager so URLs resolve at module load and first paint is not waiting on
// dynamic imports — we are measuring rendering, not module loading.
const pngModules = import.meta.glob('@assets/sprite-test/tiles/*.png', { eager: true }) as Record<string, { default: string }>;
const svgModules = import.meta.glob('@assets/sprite-test/svg/*.svg', { eager: true }) as Record<string, { default: string }>;

const PNG_SRC: string[] = Object.keys(pngModules).sort().map((p) => pngModules[p].default);
const SVG_SRC: string[] = Object.keys(svgModules).sort().map((p) => svgModules[p].default);

const atlasPosition = (i: number) => {
    const col = i % ATLAS_COLS;
    const row = Math.floor(i / ATLAS_COLS);
    return `${(col / (ATLAS_COLS - 1)) * 100}% ${(row / (ATLAS_ROWS - 1)) * 100}%`;
};

const param = (name: string) => new RegExp(`[?&]${name}=([^&]+)`).exec(location.search)?.[1];

const SpriteTest = () => {
    const mode = param('mode') ?? 'png';
    const perPage = Math.max(1, Number(param('n') ?? 200) || 200);
    const nudge = param('nudge') === '1';
    const [page, setPage] = createSignal(0);

    // Stagger the animation so the cells do not all move in lockstep - otherwise
    // the damage region is one uniform block and the whole point is lost.
    const nudgeStyle = (i: number) => (nudge ? { 'animation-delay': `-${(i % 20) * 5}ms` } : {});

    const pooled = mode.endsWith('-pooled');
    const src = mode.startsWith('svg') ? SVG_SRC : PNG_SRC;
    const total = Math.min(perPage * PAGES, src.length);

    // Churn modes render only the current page, so paging destroys and recreates.
    const pageIndices = () => {
        const start = page() * perPage;
        return Array.from({ length: perPage }, (_, k) => start + k).filter((i) => i < total);
    };
    // Pooled modes render every page once; paging only toggles a class.
    const allIndices = Array.from({ length: total }, (_, i) => i);

    const go = (next: string) => { location.href = `${location.pathname}?mode=${next}&n=${perPage}${nudge ? '&nudge=1' : ''}`; };
    const toggleNudge = () => { location.href = `${location.pathname}?mode=${mode}&n=${perPage}${nudge ? '' : '&nudge=1'}`; };

    return (
        <div class={styles.page}>
            <div class={styles.bar}>
                <For each={['png', 'atlas', 'svg', 'svg-pooled', 'png-pooled']}>{(m) => (
                    <div class={`${styles.btn} ${mode === m ? styles['btn-active'] : ''}`} onClick={() => go(m)}>{m}</div>
                )}</For>

                <For each={Array.from({ length: PAGES }, (_, i) => i)}>{(i) => (
                    <div
                        class={`${styles.btn} ${styles['page-btn']} ${page() === i ? styles['btn-active'] : ''}`}
                        onClick={() => setPage(i)}
                    >{i + 1}</div>
                )}</For>

                <div
                    class={`${styles.btn} ${nudge ? styles['btn-active'] : ''}`}
                    onClick={toggleNudge}
                >nudge</div>

                <div class={styles.label}>
                    {`${mode} · ${perPage}/page · ${total} total${pooled ? ' · all mounted' : ''}${nudge ? ' · repainting' : ''}`}
                </div>
            </div>

            <div class={styles.grid}>
                <Show when={pooled} fallback={
                    <Show when={mode === 'atlas'} fallback={
                        <For each={pageIndices()}>{(i) => (
                            <div
                                class={styles.cell}
                                classList={{ [styles.nudge]: nudge }}
                                style={{ 'background-image': `url(${src[i]})`, ...nudgeStyle(i) }} />
                        )}</For>
                    }>
                        <For each={pageIndices()}>{(i) => (
                            <div
                                class={styles['cell-atlas']}
                                classList={{ [styles.nudge]: nudge }}
                                style={{ 'background-position': atlasPosition(i), ...nudgeStyle(i) }} />
                        )}</For>
                    </Show>
                }>
                    {/* Pooled: every element stays mounted for the life of the page.
                        Only the class flips, so nothing is ever re-rasterised. */}
                    <For each={allIndices}>{(i) => (
                        <div
                            class={styles.cell}
                            classList={{
                                [styles.hidden]: Math.floor(i / perPage) !== page(),
                                [styles.nudge]: nudge,
                            }}
                            style={{ 'background-image': `url(${src[i]})`, ...nudgeStyle(i) }} />
                    )}</For>
                </Show>
            </div>
        </div>
    );
};

export default SpriteTest;
