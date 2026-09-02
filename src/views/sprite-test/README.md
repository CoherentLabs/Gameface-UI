# sprite-test

A standalone benchmark view for **how image assets should be delivered in Gameface**: SVG vs PNG, separate files vs one spritesheet, and destroying elements vs pooling them.

It exists because the real recipes (`FilterableDataTable`, `ChipMultiSelect`) are too noisy to measure this in — deep flex trees, auto-sized children, framework overhead. This page is deliberately flat: explicit pixel sizes, `align-items: flex-start` everywhere, no components. The only thing that varies between runs is how the icon is sourced.

## Running it

```bash
npm run build && npx vite preview --port 4173
# then point the Player at:
#   http://localhost:4173/sprite-test/?mode=png&n=200
```

Use a **production build served by `vite preview`**, never the dev server — unbundled ES modules make load timing meaningless. Also note `localhost` resolves to `::1` first, so if a dev server is already on that port it wins the race. Check `location.href` and grep the served HTML for `/@vite/client` before trusting anything.

## URL parameters

| Param | Values | Default | Meaning |
|---|---|---|---|
| `mode` | `png` `atlas` `svg` `svg-pooled` `png-pooled` | `png` | how the icon is sourced |
| `n` | any integer | `200` | icons per page (5 pages, so `n*5` distinct assets) |
| `nudge` | `1` | off | animate every visible cell 1→3 px forever |

All three are also togglable from the buttons in the top bar.

## Modes

| Mode | What it does | Isolates |
|---|---|---|
| `png` | `n` distinct PNG `background-image`s, only the current page rendered | baseline churn |
| `atlas` | one shared 2048×2048 texture, only `background-position` varies | does texture *count* matter? |
| `svg` | `n` distinct SVG `background-image`s, only the current page rendered | does *format* matter? |
| `svg-pooled` | all `n*5` mounted once, paging toggles `display: none` | does avoiding re-assignment matter? |
| `png-pooled` | same pooling on PNGs | control for the above |

Churn modes render only the current page, so paging replaces every element. Pooled modes mount everything once and never change any image — paging only flips a class.

`nudge` is driven by a CSS keyframe, not JS, so it adds **zero** per-frame scripting to either mode. Cells are staggered via `animation-delay` so they don't move in lockstep and collapse into one damage region.

## What to measure, and how

**Churn cost** (paging) — click a page button and time the synchronous handler, then force the pending pass:

```js
const a = performance.now();
pageButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const b = performance.now();
engine.executeImmediateLayoutSync();   // forces style + layout to resolve now
const c = performance.now();
// b - a = sync JS   |   c - b = style + layout resolve
```

`executeImmediateLayoutSync` is a *proxy* for the profiler's `Wait Pending Style`, not the same number — forcing the pass changes when the work runs. It lands in the same band, so it's good for A/B, not for absolute claims.

**Repaint cost** (`nudge=1`) — measure `requestAnimationFrame` deltas, not the above.

### ⚠️ Always take a floor reading first

Frame time is **vsync-locked**. As long as the work fits inside one refresh interval, you read the interval back no matter how much work there is. So before trusting any frame-time number:

```
?mode=png&n=1        →  read the frame time
```

One cell on an empty page can't cost anything, so whatever it reports **is your vsync interval**. If it says ~16.7 ms you're at 60 Hz and have a real 16.7 ms budget. If it says ~31 ms you're at 30 Hz — the budget is doubled and the test is correspondingly less sensitive.

This is not hypothetical: a run on 2026-09-02 read 31 ms for everything from 1 cell to 1000 animated cells, and the earlier conclusion "200 elements blow the frame budget" turned out to be the refresh rate, not a cost.

Frame time only tells you something when work *exceeds* the budget and frames drop. If nothing drops, the honest conclusion is "both fit under X ms" — not "they're equally fast".

## Results so far

Measured Sep 2026, Cohtml Player 3.1.0.30. Full write-up lives in the Obsidian vault under `20 Projects/Gameface UI/Current Dev/Image performance - FINISHED`.

- **Format is what matters.** SVG costs 3–6x PNG on churn, because vector rasterisation happens every time an element is pointed at a new image. PNG is already a bitmap.
- **Texture count barely matters.** Atlas vs separate files: ~0.01 ms per icon on churn, and *nothing* on repaint — 1000 distinct textures all animating dropped no frames.
- **Pooling removes the format penalty entirely.** `display: none` does not drop the texture, so hide/show is nearly free. Pooled SVG beat un-pooled PNG.
- **Source resolution is irrelevant.** 1000×643 tiles cost the same as 84×54.
- **Element type is irrelevant.** `<img>` vs `background-image` only changes which profiler phase gets billed.

## Assets

Generated, not hand-made — `src/assets/sprite-test/`:

- `tiles/i0000.png … i0999.png` — 1000 distinct 64×64 PNGs
- `svg/i0000.svg … i0999.svg` — the same 1000 as SVGs, ~220 shapes each (~19 KB, comparable to a real detailed flag)
- `atlas.png` — 2048×2048, 32×32 grid of the PNG tiles

Regenerate with `node src/views/sprite-test/generate-assets.mjs`. Needs `sharp`, which is **not** a project dependency — `npm i --no-save sharp` first.

They live outside `src/assets/icons/` on purpose: the `Icon` component eagerly globs `@assets/icons/**/*.{png,svg}` and is not tree-shakeable, so putting 2000 test files there would bloat every bundle that imports a single icon.
