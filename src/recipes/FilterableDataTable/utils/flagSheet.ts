// Position lookup for src/assets/icons/flags-sheet.png.
// ORDER is alphabetical by filename, matching how the sheet was generated —
// regenerate the sheet and this array together or the two silently drift.
const COLS = 6;
const ROWS = 4;

const ORDER = [
    'ar', 'br', 'ca', 'ci', 'cl', 'de',
    'dk', 'eg', 'eng', 'es', 'fr', 'ie',
    'it', 'jo', 'jp', 'kr', 'mx', 'ng',
    'pt', 'rs', 'se', 'us', 'vn',
];

// Percentages, not pixels: with `background-size: 600% 400%` one tile fills the
// cell exactly, so the position holds at any cell size.
const POSITION: Record<string, string> = {};
ORDER.forEach((code, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    POSITION[code] = `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;
});

export default POSITION;
