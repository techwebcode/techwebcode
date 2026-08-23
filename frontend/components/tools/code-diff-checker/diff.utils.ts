export interface DiffOptions {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  ignoreComments: boolean;
  ignoreBlankLines: boolean;
  wordDiff: boolean;
  language: string;
}

export type DiffLineType = "added" | "removed" | "modified" | "unchanged";

export interface WordChange {
  type: "added" | "removed" | "unchanged";
  value: string;
}

export interface DiffLine {
  type: DiffLineType;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
  originalContent?: string;
  modifiedContent?: string;
  content: string;
  wordChangesOriginal?: WordChange[];
  wordChangesModified?: WordChange[];
}

export interface ChangeBlock {
  id: number;
  type: "added" | "removed" | "modified";
  startLineOriginal: number;
  endLineOriginal: number;
  startLineModified: number;
  endLineModified: number;
  originalLines: string[];
  modifiedLines: string[];
  lineCount: number;
  summary: string;
  lines: DiffLine[];
}

export interface DiffStats {
  totalChanges: number;
  addedLines: number;
  removedLines: number;
  modifiedLines: number;
  originalLineCount: number;
  modifiedLineCount: number;
  charsChanged: number;
  fileSizeOriginal: string;
  fileSizeModified: string;
  isIdentical: boolean;
}

export interface DiffResult {
  lines: DiffLine[];
  changes: ChangeBlock[];
  stats: DiffStats;
}

export const SAMPLE_ORIGINAL_CODE = `function calculateSum(a, b) {
  let sum = a + b;
  return sum;
}

const num1 = 10;
const num2 = 20;
const result = calculateSum(num1, num2);

console.log("Sum:", result);`;

export const SAMPLE_MODIFIED_CODE = `function calculateSum(a, b) {
  const sum = a + b;
  return sum;
}

const num1 = 15;
const num2 = 25;
const result = calculateSum(num1, num2);

console.log("Total:", result);`;

export function detectLanguage(code: string): string {
  if (!code.trim()) return "javascript";

  const text = code.trim();
  if ((text.startsWith("{") && text.endsWith("}")) || (text.startsWith("[") && text.endsWith("]"))) {
    try {
      JSON.parse(text);
      return "json";
    } catch {}
  }

  if (
    text.includes("import ") &&
    (text.includes("from '") || text.includes('from "') || text.includes(": string") || text.includes(": number"))
  ) {
    return "typescript";
  }

  if (text.includes("SELECT ") || text.includes("FROM ") || text.includes("WHERE ")) {
    return "sql";
  }

  if (text.startsWith("<!DOCTYPE html>") || text.startsWith("<html") || text.includes("</div>")) {
    return "html";
  }

  if (text.includes("def ") && text.includes(":") && (text.includes("import ") || text.includes("print("))) {
    return "python";
  }

  if (text.includes("package main") || text.includes("func main()")) {
    return "go";
  }

  if (text.includes("apiVersion:") || text.includes("kind:")) {
    return "yaml";
  }

  return "javascript";
}

function preprocessLine(line: string, options: DiffOptions): string {
  let processed = line;
  if (options.ignoreWhitespace) {
    processed = processed.replace(/\s+/g, " ").trim();
  }
  if (options.ignoreCase) {
    processed = processed.toLowerCase();
  }
  if (options.ignoreComments) {
    processed = processed.replace(/\/\/.*$/g, "").replace(/\/\*.*?\*\//g, "").trim();
  }
  return processed;
}

/**
 * Myers' O(ND) Diff Algorithm with Prefix/Suffix Optimization
 */
function myersDiff<T>(
  a: T[],
  b: T[],
  equals: (x: T, y: T) => boolean = (x, y) => x === y
): { type: "insert" | "delete" | "equal"; aItem?: T; bItem?: T; aIndex?: number; bIndex?: number }[] {
  const N = a.length;
  const M = b.length;

  // 1. Trim common prefix
  let start = 0;
  while (start < N && start < M && equals(a[start], b[start])) {
    start++;
  }

  // 2. Trim common suffix
  let endA = N - 1;
  let endB = M - 1;
  while (endA >= start && endB >= start && equals(a[endA], b[endB])) {
    endA--;
    endB--;
  }

  const prefix = a.slice(0, start).map((item, idx) => ({
    type: "equal" as const,
    aItem: item,
    bItem: b[idx],
    aIndex: idx,
    bIndex: idx,
  }));

  const suffix: { type: "equal"; aItem: T; bItem: T; aIndex: number; bIndex: number }[] = [];
  for (let idx = 0; idx < N - 1 - endA; idx++) {
    const aIdx = endA + 1 + idx;
    const bIdx = endB + 1 + idx;
    suffix.push({
      type: "equal" as const,
      aItem: a[aIdx],
      bItem: b[bIdx],
      aIndex: aIdx,
      bIndex: bIdx,
    });
  }

  const midA = a.slice(start, endA + 1);
  const midB = b.slice(start, endB + 1);
  const lenA = midA.length;
  const lenB = midB.length;

  if (lenA === 0 && lenB === 0) {
    return [...prefix, ...suffix];
  }

  if (lenA === 0) {
    const inserts = midB.map((item, idx) => ({
      type: "insert" as const,
      bItem: item,
      bIndex: start + idx,
    }));
    return [...prefix, ...inserts, ...suffix];
  }

  if (lenB === 0) {
    const deletes = midA.map((item, idx) => ({
      type: "delete" as const,
      aItem: item,
      aIndex: start + idx,
    }));
    return [...prefix, ...deletes, ...suffix];
  }

  // Myers algorithm execution on middle section
  const maxD = lenA + lenB;
  const kOffset = maxD;
  const V = new Int32Array(2 * maxD + 1);
  const trace: Int32Array[] = [];

  V[1 + kOffset] = 0;

  let finalD = maxD;
  for (let d = 0; d <= maxD; d++) {
    const vCopy = new Int32Array(V);
    trace.push(vCopy);

    let done = false;
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && V[k - 1 + kOffset] < V[k + 1 + kOffset])) {
        x = V[k + 1 + kOffset];
      } else {
        x = V[k - 1 + kOffset] + 1;
      }
      let y = x - k;

      while (x < lenA && y < lenB && equals(midA[x], midB[y])) {
        x++;
        y++;
      }

      V[k + kOffset] = x;

      if (x >= lenA && y >= lenB) {
        finalD = d;
        done = true;
        break;
      }
    }
    if (done) break;
  }

  // Backtrack Myers edit script
  const midResult: { type: "insert" | "delete" | "equal"; aItem?: T; bItem?: T; aIndex?: number; bIndex?: number }[] = [];
  let x = lenA;
  let y = lenB;

  for (let d = finalD; d > 0; d--) {
    const vPrev = trace[d];
    const k = x - y;

    let prevK: number;
    if (k === -d || (k !== d && vPrev[k - 1 + kOffset] < vPrev[k + 1 + kOffset])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = vPrev[prevK + kOffset];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      midResult.push({
        type: "equal",
        aItem: midA[x - 1],
        bItem: midB[y - 1],
        aIndex: start + x - 1,
        bIndex: start + y - 1,
      });
      x--;
      y--;
    }

    if (x === prevX) {
      midResult.push({
        type: "insert",
        bItem: midB[y - 1],
        bIndex: start + y - 1,
      });
      y--;
    } else {
      midResult.push({
        type: "delete",
        aItem: midA[x - 1],
        aIndex: start + x - 1,
      });
      x--;
    }
  }

  while (x > 0 && y > 0 && equals(midA[x - 1], midB[y - 1])) {
    midResult.push({
      type: "equal",
      aItem: midA[x - 1],
      bItem: midB[y - 1],
      aIndex: start + x - 1,
      bIndex: start + y - 1,
    });
    x--;
    y--;
  }

  midResult.reverse();

  return [...prefix, ...midResult, ...suffix];
}

/**
 * Word-level inline diff between two string lines
 */
export function computeWordDiff(
  origLine: string,
  modLine: string
): { origWords: WordChange[]; modWords: WordChange[] } {
  const tokenize = (str: string) => str.match(/\w+|\s+|[^\w\s]+/g) || [str];
  const origTokens = tokenize(origLine);
  const modTokens = tokenize(modLine);

  const diff = myersDiff(origTokens, modTokens);

  const origWords: WordChange[] = [];
  const modWords: WordChange[] = [];

  diff.forEach((item) => {
    if (item.type === "equal") {
      origWords.push({ type: "unchanged", value: item.aItem || "" });
      modWords.push({ type: "unchanged", value: item.bItem || "" });
    } else if (item.type === "delete") {
      origWords.push({ type: "removed", value: item.aItem || "" });
    } else if (item.type === "insert") {
      modWords.push({ type: "added", value: item.bItem || "" });
    }
  });

  return { origWords, modWords };
}

export function computeDiff(
  originalStr: string,
  modifiedStr: string,
  options: DiffOptions
): DiffResult {
  const origRawLines = originalStr.split("\n");
  const modRawLines = modifiedStr.split("\n");

  const origProcessed = origRawLines.map((l) => preprocessLine(l, options));
  const modProcessed = modRawLines.map((l) => preprocessLine(l, options));

  const diffScript = myersDiff(origProcessed, modProcessed);

  const lines: DiffLine[] = [];
  let k = 0;
  let addedCount = 0;
  let removedCount = 0;
  let modifiedCount = 0;

  while (k < diffScript.length) {
    const item = diffScript[k];

    if (
      item.type === "delete" &&
      k + 1 < diffScript.length &&
      diffScript[k + 1].type === "insert"
    ) {
      const origIdx = (item.aIndex ?? 0) + 1;
      const modIdx = (diffScript[k + 1].bIndex ?? 0) + 1;
      const origText = origRawLines[origIdx - 1] ?? "";
      const modText = modRawLines[modIdx - 1] ?? "";

      const { origWords, modWords } = computeWordDiff(origText, modText);

      lines.push({
        type: "modified",
        originalLineNumber: origIdx,
        modifiedLineNumber: modIdx,
        originalContent: origText,
        modifiedContent: modText,
        content: modText,
        wordChangesOriginal: origWords,
        wordChangesModified: modWords,
      });
      modifiedCount++;
      k += 2;
    } else if (item.type === "insert") {
      const modIdx = (item.bIndex ?? 0) + 1;
      lines.push({
        type: "added",
        modifiedLineNumber: modIdx,
        content: modRawLines[modIdx - 1] ?? "",
      });
      addedCount++;
      k++;
    } else if (item.type === "delete") {
      const origIdx = (item.aIndex ?? 0) + 1;
      lines.push({
        type: "removed",
        originalLineNumber: origIdx,
        content: origRawLines[origIdx - 1] ?? "",
      });
      removedCount++;
      k++;
    } else {
      const origIdx = (item.aIndex ?? 0) + 1;
      const modIdx = (item.bIndex ?? 0) + 1;
      lines.push({
        type: "unchanged",
        originalLineNumber: origIdx,
        modifiedLineNumber: modIdx,
        content: modRawLines[modIdx - 1] ?? "",
      });
      k++;
    }
  }

  // Filter out blank lines if option is enabled
  let finalLines = lines;
  if (options.ignoreBlankLines) {
    finalLines = lines.filter((l) => l.content.trim().length > 0 || (l.originalContent && l.originalContent.trim().length > 0));
  }

  // Group consecutive changes into discrete ChangeBlocks
  const changes: ChangeBlock[] = [];
  let currentBlock: DiffLine[] = [];

  finalLines.forEach((line) => {
    if (line.type !== "unchanged") {
      currentBlock.push(line);
    } else if (currentBlock.length > 0) {
      const type: "added" | "removed" | "modified" =
        currentBlock.every((l) => l.type === "added")
          ? "added"
          : currentBlock.every((l) => l.type === "removed")
          ? "removed"
          : "modified";

      const origLines = currentBlock
        .map((l) => (l.type === "modified" ? l.originalContent : l.type === "removed" ? l.content : undefined))
        .filter((l): l is string => l !== undefined);

      const modLines = currentBlock
        .map((l) => (l.type === "modified" ? l.modifiedContent : l.type === "added" ? l.content : undefined))
        .filter((l): l is string => l !== undefined);

      const origNums = currentBlock.map((l) => l.originalLineNumber).filter((n): n is number => n !== undefined);
      const modNums = currentBlock.map((l) => l.modifiedLineNumber).filter((n): n is number => n !== undefined);

      const startLineOriginal = origNums.length > 0 ? Math.min(...origNums) : 1;
      const endLineOriginal = origNums.length > 0 ? Math.max(...origNums) : startLineOriginal;

      const startLineModified = modNums.length > 0 ? Math.min(...modNums) : 1;
      const endLineModified = modNums.length > 0 ? Math.max(...modNums) : startLineModified;

      changes.push({
        id: changes.length + 1,
        type,
        startLineOriginal,
        endLineOriginal,
        startLineModified,
        endLineModified,
        originalLines: origLines,
        modifiedLines: modLines,
        lineCount: currentBlock.length,
        summary: `Line ${startLineModified || startLineOriginal}: ${type.toUpperCase()} (${currentBlock.length} line${currentBlock.length > 1 ? "s" : ""})`,
        lines: [...currentBlock],
      });
      currentBlock = [];
    }
  });

  if (currentBlock.length > 0) {
    const type: "added" | "removed" | "modified" =
      currentBlock.every((l) => l.type === "added")
        ? "added"
        : currentBlock.every((l) => l.type === "removed")
        ? "removed"
        : "modified";

    const origLines = currentBlock
      .map((l) => (l.type === "modified" ? l.originalContent : l.type === "removed" ? l.content : undefined))
      .filter((l): l is string => l !== undefined);

    const modLines = currentBlock
      .map((l) => (l.type === "modified" ? l.modifiedContent : l.type === "added" ? l.content : undefined))
      .filter((l): l is string => l !== undefined);

    const origNums = currentBlock.map((l) => l.originalLineNumber).filter((n): n is number => n !== undefined);
    const modNums = currentBlock.map((l) => l.modifiedLineNumber).filter((n): n is number => n !== undefined);

    const startLineOriginal = origNums.length > 0 ? Math.min(...origNums) : 1;
    const endLineOriginal = origNums.length > 0 ? Math.max(...origNums) : startLineOriginal;

    const startLineModified = modNums.length > 0 ? Math.min(...modNums) : 1;
    const endLineModified = modNums.length > 0 ? Math.max(...modNums) : startLineModified;

    changes.push({
      id: changes.length + 1,
      type,
      startLineOriginal,
      endLineOriginal,
      startLineModified,
      endLineModified,
      originalLines: origLines,
      modifiedLines: modLines,
      lineCount: currentBlock.length,
      summary: `Line ${startLineModified || startLineOriginal}: ${type.toUpperCase()} (${currentBlock.length} line${currentBlock.length > 1 ? "s" : ""})`,
      lines: [...currentBlock],
    });
  }

  const getByteSizeStr = (str: string) => {
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isIdentical =
    originalStr === modifiedStr ||
    (changes.length === 0 && addedCount === 0 && removedCount === 0 && modifiedCount === 0);

  const stats: DiffStats = {
    totalChanges: changes.length,
    addedLines: addedCount,
    removedLines: removedCount,
    modifiedLines: modifiedCount,
    originalLineCount: origRawLines.length,
    modifiedLineCount: modRawLines.length,
    charsChanged: Math.abs(originalStr.length - modifiedStr.length),
    fileSizeOriginal: getByteSizeStr(originalStr),
    fileSizeModified: getByteSizeStr(modifiedStr),
    isIdentical,
  };

  return { lines: finalLines, changes, stats };
}

// Git-merge-tool-style hunk transfer engine
export function applyHunkTransfer(
  originalStr: string,
  modifiedStr: string,
  block: ChangeBlock,
  direction: "takeRight" | "takeLeft"
): { newOriginal: string; newModified: string } {
  const origLines = originalStr.split("\n");
  const modLines = modifiedStr.split("\n");

  if (direction === "takeRight") {
    const start = Math.max(0, block.startLineOriginal - 1);
    const deleteCount = block.type === "added" ? 0 : block.endLineOriginal - block.startLineOriginal + 1;
    origLines.splice(start, deleteCount, ...block.modifiedLines);

    return {
      newOriginal: origLines.join("\n"),
      newModified: modifiedStr,
    };
  } else {
    const start = Math.max(0, block.startLineModified - 1);
    const deleteCount = block.type === "removed" ? 0 : block.endLineModified - block.startLineModified + 1;
    modLines.splice(start, deleteCount, ...block.originalLines);

    return {
      newOriginal: originalStr,
      newModified: modLines.join("\n"),
    };
  }
}

export function swapFullFiles(
  originalStr: string,
  modifiedStr: string
): { newOriginal: string; newModified: string } {
  return {
    newOriginal: modifiedStr,
    newModified: originalStr,
  };
}

export function takeAllHunks(
  originalStr: string,
  modifiedStr: string,
  direction: "takeRight" | "takeLeft"
): { newOriginal: string; newModified: string } {
  if (direction === "takeRight") {
    return {
      newOriginal: modifiedStr,
      newModified: modifiedStr,
    };
  } else {
    return {
      newOriginal: originalStr,
      newModified: originalStr,
    };
  }
}
