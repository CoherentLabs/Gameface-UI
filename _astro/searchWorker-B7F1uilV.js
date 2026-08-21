const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/[&<>"']/g, (c) => HTML_ESCAPE_MAP[c] ?? c);
}
function highlightExactMatches(text, term) {
  if (!term) return escapeHtml(text);
  const lowerText = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  let result = "";
  let cursor = 0;
  let idx = lowerText.indexOf(lowerTerm, cursor);
  if (idx === -1) return escapeHtml(text);
  while (idx !== -1) {
    result += escapeHtml(text.slice(cursor, idx));
    result += `<mark>${escapeHtml(text.slice(idx, idx + term.length))}</mark>`;
    cursor = idx + term.length;
    idx = lowerText.indexOf(lowerTerm, cursor);
  }
  result += escapeHtml(text.slice(cursor));
  return result;
}
function getContentWords(content) {
  if (!content) return [];
  return content.includes("​") ? content.split("​") : content.split(/[\r\n\s]+/g);
}
function buildAnchoredUrl(url, anchorId) {
  try {
    if (/^((https?:)?\/\/)/.test(url)) {
      const u2 = new URL(url);
      u2.hash = anchorId;
      return u2.toString();
    }
    const p = /^\//.test(url) ? url : `/${url}`;
    const u = new URL(`https://coherent-labs.com${p}`);
    u.hash = anchorId;
    return u.toString().replace(/^https:\/\/coherent-labs\.com/, "");
  } catch (e) {
    return url;
  }
}
function findLiteralTermWordIndex(words, term) {
  if (!term) return null;
  const joined = words.join(" ");
  const charIndex = joined.toLowerCase().indexOf(term.toLowerCase());
  if (charIndex === -1) return null;
  return joined.slice(0, charIndex).split(" ").length - 1;
}
function buildCustomSubResults(data, term, exactOnly) {
  const anchors = (data.anchors || []).filter((a) => /^h\d$/i.test(a.element) && a.text?.trim()).sort((a, b) => a.location - b.location);
  if (anchors.length === 0) return [];
  const words = getContentWords(data.content);
  const lowerTerm = (term || "").toLowerCase();
  const findOwner = (location) => {
    let owner = null;
    for (const a of anchors) {
      if (a.location <= location) owner = a;
      else break;
    }
    return owner;
  };
  const groups = /* @__PURE__ */ new Map();
  (data.weighted_locations || []).forEach((wl) => {
    const owner = findOwner(wl.location);
    if (!owner) return;
    if (!groups.has(owner)) groups.set(owner, { items: [], literalMatchLocation: null });
    groups.get(owner).items.push(wl);
  });
  const literalMatchLocation = findLiteralTermWordIndex(words, term);
  if (literalMatchLocation !== null) {
    const owner = findOwner(literalMatchLocation);
    if (owner) {
      if (!groups.has(owner)) groups.set(owner, { items: [], literalMatchLocation: null });
      groups.get(owner).literalMatchLocation = literalMatchLocation;
    }
  }
  const WINDOW = 24;
  return Array.from(groups.entries()).map(([anchor, group]) => {
    const { items, literalMatchLocation: literalMatchLocation2 } = group;
    const target = literalMatchLocation2 !== null ? { location: literalMatchLocation2 } : items.reduce((best, it) => !best || it.balanced_score > best.balanced_score ? it : best);
    const start = Math.max(0, target.location - Math.floor(WINDOW / 2));
    const end = Math.min(words.length, start + WINDOW);
    const windowWords = words.slice(start, end);
    const matchLocations = new Set(items.map((it) => it.location));
    if (literalMatchLocation2 !== null) {
      const termWordCount = term.trim().split(/\s+/).filter(Boolean).length || 1;
      for (let i = 0; i < termWordCount; i++) {
        matchLocations.add(literalMatchLocation2 + i);
      }
    }
    const windowText = windowWords.join(" ");
    const isExactMatch = Boolean(lowerTerm) && windowText.toLowerCase().includes(lowerTerm);
    const excerptHtml = exactOnly ? highlightExactMatches(windowText, term) : windowWords.map((w, i) => {
      const idx = start + i;
      const escaped = escapeHtml(w);
      return matchLocations.has(idx) ? `<mark>${escaped}</mark>` : escaped;
    }).join(" ");
    return {
      title: anchor.text,
      url: buildAnchoredUrl(data.url, anchor.id),
      weighted_locations: items,
      excerptHtml,
      isExactMatch
    };
  });
}
function pageQualifiesAsExactOnly(data, term) {
  if ((data.meta?.title || "").toLowerCase().includes(term.toLowerCase())) return true;
  return buildCustomSubResults(data, term, true).some((s) => s.isExactMatch);
}
function titleMatchScore(title, term) {
  const lowerTitle = (title || "").toLowerCase();
  const lowerTerm = term.toLowerCase();
  if (lowerTitle === lowerTerm) return 3;
  if (lowerTitle.startsWith(lowerTerm)) return 2;
  if (lowerTitle.includes(lowerTerm)) return 1;
  return 0;
}
async function classifyResult(result, term) {
  const data = await result.data();
  return {
    result,
    data,
    isExact: pageQualifiesAsExactOnly(data, term),
    titleScore: titleMatchScore(data.meta?.title, term)
  };
}
const DEPRIORITIZED_PATH_SEGMENTS = ["/changelog", "/releases", "/api_reference"];
function isDeprioritized(url) {
  const lower = url.toLowerCase();
  return DEPRIORITIZED_PATH_SEGMENTS.some((segment) => lower.includes(segment));
}
function filterAndSeparate(arr, predicate) {
  const matched = [];
  const notMatched = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) {
      matched.push(arr[i]);
    } else {
      notMatched.push(arr[i]);
    }
  }
  return [matched, notMatched];
}
function rankGroup(group, isExactGroup) {
  const [primary, deprioritized] = filterAndSeparate(group, (c) => !isDeprioritized(c.data.url));
  const sortByTitle = (a, b) => isExactGroup ? b.titleScore - a.titleScore : 0;
  return [...primary.sort(sortByTitle), ...deprioritized.sort(sortByTitle)];
}
function rankResults(exact, nonExact, onlyExact) {
  const rankedExact = rankGroup(exact, true);
  if (onlyExact) return rankedExact;
  return [...rankedExact, ...rankGroup(nonExact, false)];
}
const NESTED_SUBRESULT_LIMIT = 5;
const badgesConfig = {
  "frontend-tools.coherent-labs.com/e2e": { text: "UI Tools | Gameface E2E", color: "#007aaa" },
  "frontend-tools.coherent-labs.com/interaction-manager": { text: "UI Tools | Interaction Manager", color: "#007abb" },
  "frontend-tools.coherent-labs.com/gameface-vite-plugin": { text: "UI Tools | Gameface Vite Plugin", color: "#007acc" },
  "frontend-tools.coherent-labs.com/vite-solid-style-to-css-plugin": { text: "UI Tools | Solid Style to CSS Plugin", color: "#007add" },
  "frontend-tools.coherent-labs.com/vite-gameface-style-transformer": { text: "UI Tools | Vite Style Transformer", color: "#007add" },
  "frontend-tools.coherent-labs.com/eslint-plugin-gameface": { text: "UI Tools | ESLint Plugin", color: "#007add" },
  "frontend-tools.coherent-labs.com/data-binding-autocomplete": { text: "UI Tools | Data Binding Autocomplete", color: "#007aee" },
  "frontend-tools.coherent-labs.com": { text: "UI Tools", color: "#007aff" },
  "gameface-ui.coherent-labs.com": { text: "Gameface UI", color: "#e24a4a" },
  "guide.coherent-labs.com": { text: "UI Workflow Guide", color: "#2a8500" },
  "docs.coherent-labs.com/cpp-gameface": { text: "Gameface Custom Engine", color: "#C35A1C" },
  "docs.coherent-labs.com/cpp-prysm": { text: "Prysm Custom Engine", color: "#00897B" },
  "docs.coherent-labs.com/unity-gameface": { text: "Gameface Unity", color: "#C35A1C" },
  "docs.coherent-labs.com/unity-prysm": { text: "Prysm Unity", color: "#00897B" },
  "docs.coherent-labs.com/unreal-gameface": { text: "Gameface Unreal", color: "#C35A1C" },
  "docs.coherent-labs.com/unreal-prysm": { text: "Prysm Unreal", color: "#00897B" }
};
function getBadge(data) {
  for (const key in badgesConfig) {
    if (data.url.includes(key)) return badgesConfig[key];
  }
  const doc = data.filters?.documentation?.[0];
  const eng = data.filters?.engine?.[0];
  if (doc) return { text: eng ? `${doc} ${eng}` : doc, color: "#883aea" };
  return null;
}
function buildRenderableResult(data, term, onlyExact, isExact) {
  let nested = buildCustomSubResults(data, term, onlyExact);
  if (onlyExact) nested = nested.filter((s) => s.isExactMatch);
  const sectionScore = (s) => (s.weighted_locations || []).reduce((max, l) => Math.max(max, l.balanced_score || 0), 0);
  nested = [...nested].sort((a, b) => {
    const exactDiff = Number(b.isExactMatch) - Number(a.isExactMatch);
    if (exactDiff !== 0) return exactDiff;
    return sectionScore(b) - sectionScore(a);
  }).slice(0, NESTED_SUBRESULT_LIMIT);
  const badge = getBadge(data);
  const badgeHtml = badge ? `<span class="coh-result-badge" style="background-color:${badge.color}">${escapeHtml(badge.text)}</span>` : "";
  return {
    id: data.url,
    url: data.url,
    titleText: data.meta?.title || data.url,
    titleHtml: escapeHtml(data.meta?.title || data.url),
    badgeHtml,
    subResults: nested.map((s) => ({
      url: s.url,
      titleHtml: escapeHtml(s.title),
      excerptHtml: s.excerptHtml
    })),
    isExact
  };
}
let pagefind;
let TYPE_VALUES = [];
let latestRequestId = 0;
let retainedTail = null;
async function getTypeValues() {
  try {
    const filters = await pagefind.filters();
    return Object.keys(filters.type || {}).sort();
  } catch (e) {
    postMessage({ type: "warn", message: `Failed to fetch Pagefind type filters: ${e}` });
    return [];
  }
}
async function mergeExternalIndexes(mergeIndexes) {
  if (!mergeIndexes || mergeIndexes.length === 0) return;
  const results = await Promise.all(
    mergeIndexes.map(async (idx) => {
      try {
        const url = `${idx.bundlePath.replace(/\/$/, "")}/pagefind-entry.json`;
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
      } catch (e) {
        console.warn(`Failed to get external index - ${idx.bundlePath}: ${e}`);
        return false;
      }
    })
  );
  const validIndexes = mergeIndexes.filter((_, i) => results[i]);
  await Promise.all(
    validIndexes.map(
      (idx) => pagefind.mergeIndex(idx.bundlePath, { mergeFilter: idx.mergeFilter, indexWeight: idx.indexWeight }).catch((err) => {
        postMessage({ type: "warn", message: `Failed to merge index ${idx.bundlePath}: ${err}` });
      })
    )
  );
}
async function fetchCandidates(query, baseFilters, types) {
  if (types.length <= 1) {
    const filters = types.length === 1 ? { ...baseFilters, type: types } : baseFilters;
    const res = await pagefind.search(query, { filters });
    return res.results;
  }
  const perType = await Promise.all(types.map((t) => pagefind.search(query, { filters: { ...baseFilters, type: [t] } })));
  const byId = /* @__PURE__ */ new Map();
  perType.forEach((res) => {
    res.results.forEach((r) => {
      const existing = byId.get(r.id);
      if (!existing || r.score > existing.score) byId.set(r.id, r);
    });
  });
  return Array.from(byId.values()).sort((a, b) => b.score - a.score);
}
async function fetchExactSearchHint(query, baseFilters) {
  try {
    const res = await pagefind.search(`"${query}"`, { filters: baseFilters });
    return res.results;
  } catch (e) {
    return null;
  }
}
function reorderByExactSearchHint(results, hintResults) {
  const byId = new Map(results.map((r) => [r.id, r]));
  const prioritized = [];
  const seen = /* @__PURE__ */ new Set();
  hintResults.forEach((hint) => {
    const match = byId.get(hint.id);
    if (match && !seen.has(match.id)) {
      prioritized.push(match);
      seen.add(match.id);
    }
  });
  results.forEach((r) => {
    if (!seen.has(r.id)) {
      prioritized.push(r);
      seen.add(r.id);
    }
  });
  return prioritized;
}
async function fetchTypeCounts(query, baseFilters, documentation, typeValues) {
  if (!documentation) return {};
  const results = await Promise.all(typeValues.map((t) => pagefind.search(query, { filters: { ...baseFilters, type: [t] } })));
  const counts = {};
  typeValues.forEach((t, i) => {
    counts[t] = results[i].results.length;
  });
  return counts;
}
function buildBaseFilters(documentation, engine) {
  const filters = {};
  if (documentation) filters.documentation = [documentation];
  if (engine) filters.engine = [engine];
  return filters;
}
async function handleInit(msg) {
  try {
    pagefind = await import(
      /* @vite-ignore */
      `${msg.baseUrl}/pagefind/pagefind.js`
    );
    await pagefind.options({ basePath: `${msg.baseUrl}/pagefind/` });
    await pagefind.init();
    TYPE_VALUES = await getTypeValues();
    postMessage({ type: "ready", typeValues: TYPE_VALUES });
  } catch (err) {
    postMessage({ type: "initError", message: String(err) });
    return;
  }
  mergeExternalIndexes(msg.mergeIndexes).catch((err) => {
    postMessage({ type: "warn", message: `Failed to merge external Pagefind indexes: ${err}` });
  }).finally(async () => {
    TYPE_VALUES = await getTypeValues();
    postMessage({ type: "mergeComplete", typeValues: TYPE_VALUES });
  });
}
async function handleFacetCounts(msg) {
  const [docRes, engineResults] = await Promise.all([
    pagefind.search(msg.query, {}),
    msg.documentation ? Promise.all(
      msg.engineValues.map(
        (eng) => pagefind.search(msg.query, { filters: { documentation: [msg.documentation], engine: [eng] } })
      )
    ) : Promise.resolve(null)
  ]);
  const documentationCounts = docRes.filters?.documentation || {};
  const engineCounts = {};
  if (engineResults) {
    msg.engineValues.forEach((eng, i) => {
      engineCounts[eng] = engineResults[i].results.length;
    });
  }
  postMessage({
    type: "facetCountsResult",
    requestId: msg.requestId,
    documentationCounts,
    engineCounts
  });
}
const SCAN_CONFIDENCE_CAP = 100;
const CLASSIFY_CONCURRENCY = 16;
const LOAD_MORE_SCAN_CAP = 150;
async function classifyPrefix(candidates, term, requestId) {
  const toScan = candidates.slice(0, SCAN_CONFIDENCE_CAP);
  const exact = [];
  const nonExact = [];
  for (let i = 0; i < toScan.length; i += CLASSIFY_CONCURRENCY) {
    if (requestId !== latestRequestId) return null;
    const wave = toScan.slice(i, i + CLASSIFY_CONCURRENCY);
    const classified = await Promise.all(wave.map((r) => classifyResult(r, term)));
    classified.forEach((c) => (c.isExact ? exact : nonExact).push(c));
  }
  return { exact, nonExact, tailStubs: candidates.slice(toScan.length) };
}
async function handleSearch(msg) {
  const baseFilters = buildBaseFilters(msg.documentation, msg.engine);
  const [candidates, exactSearchHint, typeCounts] = await Promise.all([
    fetchCandidates(msg.query, baseFilters, msg.types),
    fetchExactSearchHint(msg.query, baseFilters),
    fetchTypeCounts(msg.query, baseFilters, msg.documentation, msg.typeValues)
  ]);
  const orderedCandidates = exactSearchHint ? reorderByExactSearchHint(candidates, exactSearchHint) : candidates;
  const classified = await classifyPrefix(orderedCandidates, msg.exactMatchTerm, msg.requestId);
  if (!classified) {
    postMessage({
      type: "searchResult",
      requestId: msg.requestId,
      typeCounts,
      results: [],
      tailCount: 0,
      exactMatchStatus: { count: 0, fullyScanned: true }
    });
    return;
  }
  retainedTail = {
    requestId: msg.requestId,
    term: msg.exactMatchTerm,
    onlyExact: msg.onlyExact,
    stubs: classified.tailStubs
  };
  const ranked = rankResults(classified.exact, classified.nonExact, msg.onlyExact);
  const results = ranked.map((c) => buildRenderableResult(c.data, msg.exactMatchTerm, msg.onlyExact, c.isExact));
  postMessage({
    type: "searchResult",
    requestId: msg.requestId,
    typeCounts,
    results,
    tailCount: classified.tailStubs.length,
    exactMatchStatus: { count: classified.exact.length, fullyScanned: classified.tailStubs.length === 0 }
  });
}
async function handleLoadMore(msg) {
  if (!retainedTail || retainedTail.requestId !== msg.requestId) {
    postMessage({
      type: "loadMoreResult",
      requestId: msg.requestId,
      results: [],
      tailCount: 0,
      exactMatchStatus: { count: 0, fullyScanned: true }
    });
    return;
  }
  const { term, onlyExact, stubs } = retainedTail;
  const exact = [];
  const nonExact = [];
  let consumed = 0;
  const scanCap = onlyExact ? Math.min(stubs.length, LOAD_MORE_SCAN_CAP) : Math.min(stubs.length, msg.count);
  while (consumed < scanCap) {
    if (onlyExact ? exact.length >= msg.count : consumed >= msg.count) break;
    const batchSize = Math.min(CLASSIFY_CONCURRENCY, scanCap - consumed);
    const batch = stubs.slice(consumed, consumed + batchSize);
    const classified = await Promise.all(batch.map((r) => classifyResult(r, term)));
    classified.forEach((c) => (c.isExact ? exact : nonExact).push(c));
    consumed += batch.length;
  }
  const remainingStubs = stubs.slice(consumed);
  retainedTail = { ...retainedTail, stubs: remainingStubs };
  const ranked = rankResults(exact, nonExact, onlyExact);
  const results = ranked.map((c) => buildRenderableResult(c.data, term, onlyExact, c.isExact));
  postMessage({
    type: "loadMoreResult",
    requestId: msg.requestId,
    results,
    tailCount: remainingStubs.length,
    exactMatchStatus: { count: exact.length, fullyScanned: remainingStubs.length === 0 }
  });
}
onmessage = (e) => {
  const msg = e.data;
  if (msg.type !== "init") latestRequestId = Math.max(latestRequestId, "requestId" in msg ? msg.requestId : 0);
  switch (msg.type) {
    case "init":
      handleInit(msg);
      break;
    case "facetCounts":
      handleFacetCounts(msg);
      break;
    case "search":
      handleSearch(msg);
      break;
    case "loadMore":
      handleLoadMore(msg);
      break;
  }
};
