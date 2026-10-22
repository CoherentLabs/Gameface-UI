import { VirtualAlign, VirtualRange, VirtualScrollAlign } from './types';

export interface ResolvedSizes {
    itemHeight: number;
    /** 0 when the list is not a grid */
    itemWidth: number;
    gap: number;
    /** Overscan in px, or null to use the default */
    overscanPx: number | null;
    /** Overscan in rows, or null when given in px / defaulted */
    overscanRows: number | null;
}

export interface VirtualLayout {
    isGrid: boolean;
    columns: number;
    cellWidth: number;
    cellHeight: number;
    offsetX: number;
    /** Distance between two row tops (item height + gap) */
    pitch: number;
    rowCount: number;
    totalHeight: number;
    overscanRows: number;
    /** Rows kept rendered: viewport + 1 partial row + overscan on both sides, capped at rowCount */
    poolRows: number;
}

export function computeLayout(
    sizes: ResolvedSizes,
    contentWidth: number,
    viewportHeight: number,
    count: number,
    align: VirtualAlign,
): VirtualLayout {
    const gap = Math.max(0, sizes.gap);
    const cellHeight = Math.max(1, sizes.itemHeight);
    const pitch = cellHeight + gap;
    const isGrid = sizes.itemWidth > 0;

    let columns = 1;
    let cellWidth = contentWidth;
    let offsetX = 0;

    if (isGrid) {
        columns = Math.max(1, Math.floor((contentWidth + gap) / (sizes.itemWidth + gap)));
        cellWidth = align === 'stretch'
            ? Math.max(sizes.itemWidth, (contentWidth - gap * (columns - 1)) / columns)
            : sizes.itemWidth;

        if (align === 'center') {
            offsetX = Math.max(0, (contentWidth - (columns * (cellWidth + gap) - gap)) / 2);
        }
    }

    const rowCount = Math.ceil(count / columns);
    const totalHeight = Math.max(0, rowCount * pitch - gap);

    let overscanRows: number;
    if (sizes.overscanRows !== null) {
        overscanRows = sizes.overscanRows;
    } else {
        const px = sizes.overscanPx ?? viewportHeight / 4;
        overscanRows = Math.ceil(px / pitch);
    }
    overscanRows = Math.max(1, overscanRows);

    // Short lists don't need more slots than they have rows
    const poolRows = Math.min(rowCount, Math.ceil(viewportHeight / pitch) + 1 + 2 * overscanRows);

    return { isGrid, columns, cellWidth, cellHeight, offsetX, pitch, rowCount, totalHeight, overscanRows, poolRows };
}

export function layoutEquals(a: VirtualLayout, b: VirtualLayout) {
    return a.columns === b.columns && a.cellWidth === b.cellWidth && a.cellHeight === b.cellHeight &&
        a.offsetX === b.offsetX && a.pitch === b.pitch && a.rowCount === b.rowCount &&
        a.totalHeight === b.totalHeight && a.overscanRows === b.overscanRows && a.poolRows === b.poolRows &&
        a.isGrid === b.isGrid;
}

/** First rendered row. Clamped so the window never runs past the end and the pool size stays constant. */
export function computeStartRow(layout: VirtualLayout, scrollTop: number) {
    const first = Math.floor(Math.max(0, scrollTop) / layout.pitch) - layout.overscanRows;
    return Math.max(0, Math.min(first, layout.rowCount - layout.poolRows));
}

/** Row rendered by slot row `slotRow` - row `r` is always rendered by slot row `r % poolRows` */
export function rowForSlot(slotRow: number, startRow: number, poolRows: number) {
    return startRow + (((slotRow - (startRow % poolRows)) % poolRows) + poolRows) % poolRows;
}

export function computeVisibleRange(layout: VirtualLayout, scrollTop: number, viewportHeight: number, count: number): VirtualRange {
    if (!count) return { start: 0, end: 0 };

    let firstRow = Math.ceil(scrollTop / layout.pitch);
    let lastRow = Math.floor((scrollTop + viewportHeight - layout.cellHeight) / layout.pitch);

    // Viewport smaller than one item - report the row under the top edge
    if (lastRow < firstRow) firstRow = lastRow = Math.floor(scrollTop / layout.pitch);

    firstRow = Math.max(0, Math.min(firstRow, layout.rowCount - 1));
    lastRow = Math.max(firstRow, Math.min(lastRow, layout.rowCount - 1));

    return { start: firstRow * layout.columns, end: Math.min(count, (lastRow + 1) * layout.columns) };
}

export function rangeEquals(a: VirtualRange, b: VirtualRange) {
    return a.start === b.start && a.end === b.end;
}

export function itemX(layout: VirtualLayout, index: number) {
    return layout.offsetX + (index % layout.columns) * (layout.cellWidth + (layout.pitch - layout.cellHeight));
}

export function itemY(layout: VirtualLayout, index: number) {
    return Math.floor(index / layout.columns) * layout.pitch;
}

/** Scroll position that brings `index` into view, or null when no scroll is needed */
export function scrollTopForIndex(
    layout: VirtualLayout,
    index: number,
    align: VirtualScrollAlign,
    scrollTop: number,
    viewportHeight: number,
) {
    const top = itemY(layout, index);
    const bottom = top + layout.cellHeight;
    let target: number;

    switch (align) {
        case 'start': target = top; break;
        case 'end': target = bottom - viewportHeight; break;
        case 'center': target = top - (viewportHeight - layout.cellHeight) / 2; break;
        default:
            if (top < scrollTop) target = top;
            else if (bottom > scrollTop + viewportHeight) target = bottom - viewportHeight;
            else return null;
    }

    // Round towards showing the whole item - fractional sizes (vmin) would otherwise cut it by a sub-pixel
    const bottomAligned = align === 'end' || (align === 'nearest' && target !== top);
    const rounded = bottomAligned ? Math.ceil(target) : align === 'center' ? Math.round(target) : Math.floor(target);
    const max = Math.max(0, Math.ceil(layout.totalHeight - viewportHeight));
    return Math.max(0, Math.min(rounded, max));
}
