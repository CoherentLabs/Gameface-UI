# VirtualScroll — Specification

**Status:** implemented (v1) · **Scope:** vertical lists and grids · **Builds on:** `Scroll`

**Code:** `src/components/Layout/VirtualScroll/` · **Demo:** `src/custom-components/Hud/VirtualScrollTest/` · **Bench:** `src/views/virtual-scroll-bench/`

Render lists and grids of thousands of items while only keeping a screenful (plus a small buffer) of components alive, with gamepad navigation, responsive sizing and the lowest possible per-frame cost in Gameface.

## 1. Goals and non-goals

**Goals**

- Vertical lists and **fixed-size grids** (inventories, shops, leaderboards, server browsers, chat / kill feeds).
- **No component creation while scrolling** in the default mode (recycling).
- Works with `Navigation` (keyboard + gamepad) out of the box, including moving to items that are not rendered yet.
- **Responsive:** sizes in CSS units (`vmin`, `rem`, …), re-evaluated on resolution / container changes, without losing the user's place.
- Fully Solid: item content is a normal Solid component.

**Non-goals (v1)** — can be added later without breaking the API

- Horizontal direction.
- Variable item sizes, masonry, items spanning several cells.
- Native data-binding (`engine.createVirtualList`) backend.
- Static content (header, footer) inside the scroll. Place it before or after `VirtualScroll` instead.

## 2. API

### 2.1 `createVirtualization` (primary)

```tsx
const Slot = (props: VirtualItemProps<InventoryItem>) => (
    <div class={styles.slot}>
        <Image src={props.item.icon} />
        <span>{props.item.count}</span>
    </div>
);

const Inventory = () => {
    const inventory = createVirtualization({
        items: () => store.inventory,
        component: Slot,
        itemHeight: '10vmin',
        itemWidth: '10vmin',        // ← makes it a grid
        gap: '1vmin',
    });

    return (
        <>
            <Header />
            <VirtualScroll virtualization={inventory} navigation="inventory" style={{ height: '60vh' }} />
            <Footer />
        </>
    );
};

inventory.scrollToIndex(250, 'center');
inventory.focusIndex(250);
```

### 2.2 Inline shorthand

Same engine, for simple cases. Equivalent to calling `createVirtualization` internally with the render function as `component`. The shorthand props are read once, except `items`.

```tsx
<VirtualScroll items={players} itemHeight={40} style={{ height: '300px' }}>
    {(player, index) => <PlayerRow player={player()} rank={index() + 1} />}
</VirtualScroll>
```

`item` and `index` are **accessors** in every mode (like Solid's `<Index>`), because in recycle mode the same component instance shows different items over time.

### 2.3 Options

| Option | Type | Default | Description |
|---|---|---|---|
| `items` | `T[] \| Accessor<T[]>` | – | Required. Data to render. |
| `component` | `Component<VirtualItemProps<T>>` | – | Required (`createVirtualization`). Renders one item. |
| `itemHeight` | `number \| string` | – | Required. Number = px, string = any CSS length (`'10vmin'`). |
| `itemWidth` | `number \| string` | – | If set, items are laid out as a **grid**. |
| `gap` | `number \| string` | `0` | Horizontal and vertical space between items. |
| `align` | `'start' \| 'center' \| 'stretch'` | `'start'` | Grid only. How leftover row space is used; `stretch` treats `itemWidth` as a minimum. |
| `mode` | `'recycle' \| 'unmount' \| 'append'` | `'recycle'` | See §3. |
| `overscan` | `number \| string` | `'1 screen / 4'` → min 1 row | Extra area rendered above and below the viewport. Number = rows, string = CSS length. |
| `batchSize` | `number` | `5` | `append` only. Rows loaded per batch. |
| `stickToEnd` | `boolean` | `false` | Chat / kill feed: when already at the bottom and items are added, stay at the bottom. |
| `onEndReached` | `() => void` | – | Called once when the user scrolls within `endThreshold` of the end (load more from the game). |
| `endThreshold` | `number` | `2` | Rows from the end that trigger `onEndReached`. |
| `onRangeChange` | `(range: { start, end }) => void` | – | Called when the rendered index range changes (prefetching, analytics). |
| `onNavigationEdge` | `(direction) => void` | – | Navigation moved past the first/last row or column — e.g. switch to another `Navigation.Area`. |

Options are read once when the virtualization is created; only `items` is reactive.

`VirtualScroll` props: everything `Scroll` accepts (`style`, `class`, `minHandleSize`, `onScroll`, …) plus `virtualization`, `navigation` (§5) and `fallback` (rendered when `items` is empty).

### 2.4 Item component props

```ts
interface VirtualItemProps<T> {
    item: T;            // reactive getter — always read it inside JSX / effects
    index: number;      // reactive getter
    focused: boolean;   // true when this item has navigation focus
}
```

### 2.5 Returned handle

| Member | Description |
|---|---|
| `scrollToIndex(i, align?)` | `align`: `'start' \| 'center' \| 'end' \| 'nearest'` (default `'nearest'`). Works for items that are not rendered. |
| `scrollToOffset(px)` | Scrolls to a pixel offset from the top of the list. |
| `scrollToItem(predicate, align?)` | Finds the index, then `scrollToIndex`. |
| `focusIndex(i)` | Scrolls to the item and gives it navigation focus. |
| `visibleRange()` | Signal: `{ start, end }` of fully visible items ("Showing 21–40 of 2000"). |
| `renderedRange()` | Signal: `{ start, end }` of rendered items (visible + overscan). |
| `focusedIndex()` | Signal: index of the focused item or `-1`. |
| `columns()` | Signal: current number of columns. |
| `remeasure()` | Forces re-resolving sizes (normally automatic). |

## 3. Rendering modes

### 3.1 `recycle` (default) — a fixed pool of item components

The list creates a **pool** of item components once: enough rows to cover the viewport plus overscan (e.g. 10 rows). While scrolling, **no component is created or destroyed**. When a row leaves the window, its components are reused for the row that enters, by changing which item they show and moving them with `transform`.

```
items:   0  1  2  3  4  5  6  7  8  9  10 11 12 ...
          └──────── window ────────┘

pool:   [A][B][C][D][E][F][G][H][I][J]   ← 10 slot rows, created once

scroll down one row:
  unmount mode:  destroy component of row 0, create a new one for row 10
  recycle mode:  slot A now shows row 10 → its `item` changes, transform moves it to the bottom
```

**Mapping.** Row `r` is always rendered by slot row `r % poolRows`. Moving the window by one row changes exactly one slot row; jumping far (`scrollToIndex`) changes all of them — still only prop updates, never creation.

**What updates when a slot is reused:** the `item` / `index` signals (only bindings that actually depend on them re-run) and one `transform`.

**Rules for item components (documented for users):**

- Read data from `props.item` inside JSX/effects, never copy it once:
  ```tsx
  const [count] = createSignal(props.item.count);   // ❌ shows the previous item's count after reuse
  <span>{props.item.count}</span>                    // ✅
  ```
- Local UI state (hover, expanded, animation) belongs to the slot, not the item. Reset it in an effect on `props.index`, or keep it in the data.
- Enter animations do not replay (the element is not new). Trigger them from an effect on `props.index` if needed.

Use `unmount` instead when an item component cannot follow these rules (e.g. a third-party component that captures props on creation).

### 3.2 `unmount`

Window as in recycle mode, but rows are keyed by item: leaving rows are disposed, entering rows are created. Simpler semantics (each component lives for exactly one item), higher cost per row crossed.

### 3.3 `append`

Rows are created in batches (`batchSize` rows) when the user approaches the end and are never removed. For feeds read top-to-bottom. Not suitable for jumping far (`scrollToIndex` to a far item creates every batch up to it).

### 3.4 Which mode to use

| Mode | Use when |
|---|---|
| `recycle` (default) | Items **display** data: inventory slots, leaderboard rows, kill feed lines. |
| `unmount` | Items **contain** stateful components that copy props once — e.g. `Checkbox` / `ToggleButton` (`createSignal(props.checked)`), `TextSlider`, `Tabs`, `Pagination`, `RadialMenu` — or rely on per-item `onMount` / `onCleanup`. Recycling them would show the previous item's state. |
| `append` | Short-to-medium feeds read top to bottom. Memory grows with what was loaded and is never freed. |

Memory is the same for `recycle` and `unmount` (both keep a screenful + overscan alive); `recycle` does less work per row and creates no garbage while scrolling.

### 3.5 Comparison

| | recycle | unmount | append |
|---|---|---|---|
| Components alive | pool (constant) | window (constant) | grows with scroll |
| Work per row crossed | prop updates + transform | dispose + create | none / batch create |
| Jump to far index | cheap | cheap | expensive |
| Item component rules | must be reactive | none | none |
| Navigation area | stable elements | refreshed per row | refreshed per batch |

## 4. Layout and windowing

### 4.1 DOM structure

```
Scroll.Content
└─ .virtual-list   height = totalHeight    position: relative
    └─ .virtual-window  display: simple
        └─ .virtual-slot × pool             position: absolute; width/height set; transform: translate(x, y)
```

- `display: simple` (Gameface) on the window: its direct children are all absolute, so Yoga skips layout for the container.
- Slots move **only via `transform`** (cheap `UpdateNodeTransforms` path, no Yoga solve). `width`/`height` are set only when sizes change (resize), never while scrolling.
- Static slot styles (`position`, `top: 0`, `left: 0`) live in the SCSS module, not in per-slot style bindings.
- Transforms are written directly to the slot element's `style` (no Solid style-object diffing), like `Trackers` does.
- No CSS Grid (not supported in Gameface) — the grid is pure math + absolute slots.

### 4.2 Size resolution

`itemHeight`, `itemWidth`, `gap`, string `overscan`: numbers are px; strings are resolved by applying them to a hidden 0×0 probe element inside the list and reading its size after layout (`waitForFrames`, 2 frames — Gameface lays out on the next frames). Re-resolved on every resize (§6).

### 4.3 Math

```ts
contentWidth = scrollContent.clientWidth                 // excludes scrollbar
columns      = itemWidth ? max(1, floor((contentWidth + gap) / (itemWidth + gap))) : 1
cellWidth    = align === 'stretch' ? (contentWidth - gap * (columns - 1)) / columns
             : itemWidth ?? contentWidth
offsetX      = align === 'center' ? (contentWidth - (columns * (cellWidth + gap) - gap)) / 2 : 0
rowPitch     = itemHeight + gap
rowCount     = ceil(items.length / columns)
totalHeight  = max(0, rowCount * rowPitch - gap)

startRow     = max(0, floor(scrollTop / rowPitch) - overscanRows)
poolRows     = ceil(viewportHeight / rowPitch) + 1 + 2 * overscanRows
// clamp so the window never runs past the end — the pool size stays constant
startRow     = min(startRow, max(0, rowCount - poolRows))

slot position of item i:  x = offsetX + (i % columns) * (cellWidth + gap)
                          y = floor(i / columns) * rowPitch
```

- `startRow` is a memo: scroll events that don't cross a row boundary do **no work**.
- `scrollTop` is floored to whole pixels.
- Slots whose index is `>= items.length` (last, partial row) are hidden and excluded from navigation.

## 5. Navigation (keyboard / gamepad)

Enabled with `navigation="<area name>"` inside a `<Navigation>`.

**How focus moves**

1. **Area registration** — the slots are registered as a `Navigation.Area` (the first time through `Navigation.registerArea`, so `focusFirst` / `switchArea` / scope work; later refreshes go straight to spatial navigation). Recycle mode re-registers only when the pool size changes; unmount / append re-register (at most once per frame) when the rendered items change. Slots past the end of the data get the `disabled` attribute, which spatial navigation skips.
2. **Moving inside the list is index-based.** While focus is inside the list, VirtualScroll pauses spatial navigation and handles the `move-*` actions itself: `±1` within a row, `±columns` between rows, `down` from the second-to-last row goes to the last item. This works for items that are not rendered yet: the list scrolls to the target (`'nearest'`) and the slot showing it is focused. Spatial navigation is resumed when focus leaves the list. Spatial navigation alone is not enough: when nothing is found in the pressed direction it wraps to the opposite edge of the area — at the end of the rendered window that would jump to the top rendered row.
3. **Keeping focus visible** — on `focusin`, VirtualScroll calls `scrollToIndex(focusedIndex, 'nearest')`. It replaces `Scroll`'s own `scrollIntoView`, which relies on `offsetTop` (0 for slots positioned with `transform`).
4. **Leaving the list** — at index bounds nothing moves and `onNavigationEdge(direction)` is called. Spatial navigation never crosses areas, so switching to another area is up to the app.

**Focus follows the item, not the slot.** VirtualScroll tracks `focusedIndex` as data. If the user scrolls with the mouse wheel or right stick (`pan`) so that the focused item leaves the window, its slot is about to be reused for another item; focus moves to the nearest visible item instead (configurable later: `'nearest' | 'blur'`).

**Extra actions** (not implemented yet): `page-up` / `page-down` (e.g. shoulder buttons) → `focusIndex(focused ± visibleRows * columns)`; `home` / `end`.

Gameface notes: `:focus-within` is not supported — focus is tracked with `focusin` / `focusout` events. Slots get `tabindex="0"`.

## 6. Responsiveness

Triggers: the `resize` window event (resolution change) and a `ResizeObserver` on the scroll container (container size changes from layout). Both are coalesced to one update per frame, then measured after layout (`waitForFrames`).

On each update:

1. Re-resolve CSS-unit sizes (§4.2) — `'10vmin'` items scale with the resolution.
2. Recompute `contentWidth`, `columns`, `cellWidth`, `poolRows`.
3. **Keep the user's place:** before applying, remember the first visible item index (or the focused one); after applying, scroll so that item is at the same position (`floor(index / columns) * rowPitch`). Without this, a change from 6 to 4 columns would jump to unrelated items.
4. Pool grows / shrinks only if `poolRows × columns` changed (the only time components are created / disposed in recycle mode), then the navigation area is re-registered.
5. Slot `width`/`height` are rewritten once; positions update through transforms.

Pixel numbers (`itemHeight={40}`) do **not** scale with resolution — documented recommendation: use `vmin`/`rem` strings for resolution-independent UIs.

## 7. Dynamic data

- `items` is reactive: adding / removing items updates `rowCount` and `totalHeight`; rendered slots re-read their item.
- Removing items while scrolled near the end clamps `startRow` and `scrollTop` so the list never goes blank.
- `stickToEnd`: if the scroll was at the bottom before the change, scroll to the new bottom after it.
- `onEndReached` fires once per crossing of the threshold; it re-arms when `items.length` changes.

## 8. Performance budget

| Situation | Cost |
|---|---|
| Scrolling within a row | none (memo) |
| Crossing one row (recycle) | `columns` slots: signal updates + transforms; no creation, no Yoga solve |
| Jump (`scrollToIndex` far) | all pool slots: signal updates + transforms |
| Resize, same column count | slot width/height rewrite (one layout pass) |
| Resize, columns change | above + pool resize (create/dispose difference only) |
| First render | pool creation only (screenful + overscan), not the whole list |

Measured results: §12.

## 9. Gameface constraints applied

- No `IntersectionObserver` → visibility computed from `scrollTop` math.
- No CSS Grid → absolute slots + math.
- No `:focus-within` → focus events.
- `will-change`, `contain`, `content-visibility` not implemented → not used.
- Layout is applied on the next frames → all measuring after `waitForFrames`.
- Moving elements with `transform` only; `display: simple` for the slot container.

## 10. Implementation status

| Area | Status |
|---|---|
| `createVirtualization`, shorthand, all three modes, list + grid, `align`, CSS-unit sizes | Done — positions verified in Gameface for list and grid. |
| `scrollToIndex` / `scrollToOffset` / `scrollToItem` / `focusIndex`, `visibleRange` / `renderedRange` / `focusedIndex` / `columns` | Done. |
| Navigation: index moves, edges, focus follows item | Done — verified in Gameface with keyboard events. Gamepad uses the same `move-*` actions but was not tested on a pad. |
| Responsiveness: re-resolve on `resize` + container `ResizeObserver`, anchoring | Implemented, not yet verified with a real resolution change. |
| `stickToEnd`, `onEndReached`, `onRangeChange`, `onNavigationEdge`, `fallback` | Implemented. `onEndReached` is used in the demo; the others are not tested in Gameface yet. |
| Page-up / page-down / home / end actions | Not implemented. |
| Public docs page | Not written. |

`Scroll` changes made for this: `scrollTop`, `viewportHeight`, `contentWidth` and `scrollToPosition` in `ScrollContext`; a `ResizeObserver` on the container; `minHandleSize`; `onAction` is no longer assigned back to `props` (that threw when `Scroll` received spread / getter props).

## 11. Future

- `direction: 'horizontal'` (math is already per-axis friendly: keep main/cross naming internally).
- Variable item heights (measured + cached, prefix sums).
- Native data-binding backend for very large engine-driven lists.

## 12. Benchmark results

`src/views/virtual-scroll-bench/` (automation: `__virtualScrollBench.run({ count, layout, speed, duration, rounds })` returns a promise with the results). Gameface Player, Cohtml 3.2.0.12, 1600×570 window, Vite dev build. Same item component in every mode (7 elements, 4 reactive bindings), 640×480 box; grid = 80×80 cells with an 8 px gap (7 columns); list = 40 px rows. The list is scrolled a fixed number of px per frame, bouncing between top and bottom. 1 s warmup, 5 s measured per mode, 3 rounds in alternating order (20 000 items: 1 round).

*Frame* = rAF interval (includes engine layout / paint; capped by vsync at 16.67 ms). *Script* = one scroll step including the synchronous reactive updates. All times in ms.

**Grid, 5 000 items, 40 px/frame (≈ 0.5 rows per frame)**

| Mode | FPS | Frame p95 | Script avg | Script p95 | DOM nodes |
|---|---|---|---|---|---|
| recycle | 60.0 | 17.2 | **0.31** | **0.56** | 624 |
| unmount | 60.0 | 17.2 | 0.50 | 1.17 | 624 |
| append | 59.1 | 18.2 | 0.30 | 0.36 | 9 901 |
| plain Scroll + For | 20.0 | 59.7 | 0.13 | 0.25 | 40 007 |

**Grid, 5 000 items, 160 px/frame (≈ 2 rows per frame — fast scrolling)**

| Mode | FPS | Frame p95 | Script avg | Script p95 | DOM nodes |
|---|---|---|---|---|---|
| recycle | **59.6** | **17.6** | **0.59** | **0.95** | 624 |
| unmount | 57.4 | 29.0 | 1.27 | 2.09 | 624 |
| append | 37.9 | 43.0 | 3.02 | 18.69 | 25 768 |
| plain Scroll + For | 16.4 | 68.9 | 0.10 | 0.15 | 40 007 |

**Grid, 20 000 items, 160 px/frame**

| Mode | FPS | Frame p95 | Max frame | Script avg | Script p95 | DOM nodes |
|---|---|---|---|---|---|---|
| recycle | **60.0** | **16.9** | **17.3** | **0.49** | **0.68** | 624 |
| unmount | 60.0 | 17.2 | 29.2 | 1.04 | 1.40 | 624 |
| append | 49.2 | 30.4 | 38.7 | 1.75 | 10.08 | 31 928 |
| plain Scroll + For | 5.7 | 173.5 | 824.6 | 0.08 | 0.13 | 160 007 |

**List, 5 000 items, 40 px/frame (1 row per frame)**

| Mode | FPS | Frame p95 | Script avg | Script p95 | DOM nodes |
|---|---|---|---|---|---|
| recycle | 59.9 | 16.9 | **0.19** | **0.32** | 160 |
| unmount | 59.9 | 17.0 | 0.33 | 0.47 | 160 |
| append | 59.5 | 17.0 | 0.20 | 1.05 | 3 021 |
| plain Scroll + For | 26.0 | 46.6 | 0.09 | 0.20 | 40 007 |

**Mount** (synchronous render, 5 000-item grid): recycle 2.7–3.3, unmount 1.1–3.1, append 3.3–6.5, plain 337–400 (632 for 20 000 items).

**Takeaways**

- Recycle needs about half the script time of unmount per scroll step (0.31 vs 0.50 at normal speed, 0.59 vs 1.27 when scrolling fast) and keeps p95 / max frames at vsync where unmount starts dropping frames (p95 29, max 29).
- DOM size is the same for recycle and unmount and does not depend on the list length (624 nodes for both 5 000 and 20 000 items).
- Append is as cheap as recycle while it scrolls over loaded rows, but each batch is a spike (script p95 10–19 when scrolling fast) and its DOM keeps growing.
- Plain `Scroll` + `For` is not usable at these sizes: 0.3–0.6 s to mount, 6–26 FPS while scrolling. Its low script time is not a win — its cost is in the engine's layout / paint.
- Recycle's synchronous mount is a few ms higher than unmount's (per-slot memos of the pool); both are small.

**Does `display: simple` make "everything in the DOM" viable? No.** Bench mode `simple`: all 5 000 items absolutely positioned with `transform` inside a `display: simple` container (no flex layout solve), 3 rounds:

| Mode | FPS @ 160 px/f | Frame p95 | FPS @ 40 px/f | Frame p95 |
|---|---|---|---|---|
| recycle | 60.0 | 17.0 | 60.0 | 17.0 |
| plain (flex-wrap) | 25.0 | 45.5 | 25.8 | 44.6 |
| simple (`display: simple`) | 24.1 | 46.5 | 24.2 | 46.7 |

Scrolling does not trigger a flex layout solve, so skipping it saves nothing per frame; invisible items are not skipped either. The per-frame engine cost follows the number of nodes in the scrolled subtree, and is nearly independent of the scroll speed - only fewer nodes (virtualization) helps.

**Gameface CSSTOM bug found while building this bench** (cohtml 3.2.0.12): when a `CSSTranslate` is first set through `attributeStyleMap` with **either** component at 0, the transform collapses to one axis and later writes are wrong - first `(0, 50)` then `(40, 60)` renders `translateY(60px)` (x lost); first `(30, 0)` then `(40, 60)` renders `translateX(60px)` (y lands in x). The Style TOM runtime (`gameface-dom.ts`, `hasZeroTranslate`) only guards against both being 0. VirtualScroll is not affected (it writes `el.style.transform` strings).

