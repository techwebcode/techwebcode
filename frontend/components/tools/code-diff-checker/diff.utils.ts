export interface DiffOptions {
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  ignoreComments: boolean;
  ignoreBlankLines: boolean;
  wordDiff: boolean;
  language: string;
}

export type DiffLineType = "added" | "removed" | "modified" | "unchanged";

export interface DiffLine {
  type: DiffLineType;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
  originalContent?: string;
  modifiedContent?: string;
  content: string;
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

  if (text.includes("import ") && (text.includes("from '") || text.includes('from "') || text.includes(": string") || text.includes(": number"))) {
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

export function computeDiff(
  originalStr: string,
  modifiedStr: string,
  options: DiffOptions
): DiffResult {
  const origRawLines = originalStr.split("\n");
  const modRawLines = modifiedStr.split("\n");

  const origProcessed = origRawLines.map((l) => preprocessLine(l, options));
  const modProcessed = modRawLines.map((l) => preprocessLine(l, options));

  const M = origProcessed.length;
  const N = modProcessed.length;

  const dp: number[][] = Array.from({ length: M + 1 }, () => Array(N + 1).fill(0));

  for (let i = 1; i <= M; i++) {
    for (let j = 1; j <= N; j++) {
      if (origProcessed[i - 1] === modProcessed[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = M;
  let j = N;
  const rawDiff: { type: DiffLineType; origIdx?: number; modIdx?: number; origText?: string; modText?: string }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origProcessed[i - 1] === modProcessed[j - 1]) {
      rawDiff.push({
        type: "unchanged",
        origIdx: i,
        modIdx: j,
        origText: origRawLines[i - 1],
        modText: modRawLines[j - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({
        type: "added",
        modIdx: j,
        modText: modRawLines[j - 1],
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rawDiff.push({
        type: "removed",
        origIdx: i,
        origText: origRawLines[i - 1],
      });
      i--;
    }
  }

  rawDiff.reverse();

  const lines: DiffLine[] = [];
  let k = 0;
  let addedCount = 0;
  let removedCount = 0;
  let modifiedCount = 0;

  while (k < rawDiff.length) {
    const item = rawDiff[k];

    if (
      item.type === "removed" &&
      k + 1 < rawDiff.length &&
      rawDiff[k + 1].type === "added"
    ) {
      lines.push({
        type: "modified",
        originalLineNumber: item.origIdx,
        modifiedLineNumber: rawDiff[k + 1].modIdx,
        originalContent: item.origText || "",
        modifiedContent: rawDiff[k + 1].modText || "",
        content: rawDiff[k + 1].modText || "",
      });
      modifiedCount++;
      k += 2;
    } else if (item.type === "added") {
      lines.push({
        type: "added",
        modifiedLineNumber: item.modIdx,
        content: item.modText || "",
      });
      addedCount++;
      k++;
    } else if (item.type === "removed") {
      lines.push({
        type: "removed",
        originalLineNumber: item.origIdx,
        content: item.origText || "",
      });
      removedCount++;
      k++;
    } else {
      lines.push({
        type: "unchanged",
        originalLineNumber: item.origIdx,
        modifiedLineNumber: item.modIdx,
        content: item.modText || "",
      });
      k++;
    }
  }

  // Group consecutive changes into discrete ChangeBlocks for Change Navigator & Transfer
  const changes: ChangeBlock[] = [];
  let currentBlock: DiffLine[] = [];

  lines.forEach((line) => {
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

  const isIdentical = originalStr === modifiedStr || (changes.length === 0 && addedCount === 0 && removedCount === 0 && modifiedCount === 0);

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

  return { lines, changes, stats };
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
    // Copy Modified → Original (Left receives Right)
    // Replace original lines [startLineOriginal - 1 .. endLineOriginal - 1] with block.modifiedLines
    const start = Math.max(0, block.startLineOriginal - 1);
    const deleteCount = block.type === "added" ? 0 : block.endLineOriginal - block.startLineOriginal + 1;
    origLines.splice(start, deleteCount, ...block.modifiedLines);

    return {
      newOriginal: origLines.join("\n"),
      newModified: modifiedStr,
    };
  } else {
    // Copy Original → Modified (Right receives Left)
    // Replace modified lines [startLineModified - 1 .. endLineModified - 1] with block.originalLines
    const start = Math.max(0, block.startLineModified - 1);
    const deleteCount = block.type === "removed" ? 0 : block.endLineModified - block.startLineModified + 1;
    modLines.splice(start, deleteCount, ...block.originalLines);

    return {
      newOriginal: originalStr,
      newModified: modLines.join("\n"),
    };
  }
}

export function swapFullFiles(originalStr: string, modifiedStr: string): { newOriginal: string; newModified: string } {
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
