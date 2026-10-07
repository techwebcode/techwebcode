/**
 * Comma Separator / List Formatter Utility
 * 100% Client-side. Converts between newline lists and delimited text with formatting options.
 */

export type SeparatorType = "comma" | "semicolon" | "pipe" | "space" | "tab" | "custom";
export type QuoteType = "none" | "single" | "double" | "backtick";
export type SortType = "none" | "asc" | "desc";
export type ConversionDirection = "list-to-delimited" | "delimited-to-list";

export interface ListFormatterOptions {
  direction: ConversionDirection;
  separatorType: SeparatorType;
  customSeparator: string;
  spaceAfterSeparator: boolean;
  quoteType: QuoteType;
  trimWhitespace: boolean;
  removeEmpty: boolean;
  removeDuplicates: boolean;
  sortOrder: SortType;
}

export interface ListFormatterResult {
  output: string;
  totalItems: number;
  characterCount: number;
  duplicatesRemoved: number;
  emptyItemsRemoved: number;
}

export function resolveSeparator(type: SeparatorType, custom: string, spaceAfter: boolean): string {
  let sep = ",";
  switch (type) {
    case "comma":
      sep = ",";
      break;
    case "semicolon":
      sep = ";";
      break;
    case "pipe":
      sep = "|";
      break;
    case "space":
      sep = " ";
      break;
    case "tab":
      sep = "\t";
      break;
    case "custom":
      sep = custom || ",";
      break;
  }

  if (spaceAfter && type !== "space" && type !== "tab") {
    return `${sep} `;
  }
  return sep;
}

export function formatList(rawInput: string, options: ListFormatterOptions): ListFormatterResult {
  if (!rawInput) {
    return {
      output: "",
      totalItems: 0,
      characterCount: 0,
      duplicatesRemoved: 0,
      emptyItemsRemoved: 0,
    };
  }

  let rawItems: string[] = [];

  if (options.direction === "list-to-delimited") {
    // Split by newlines (handling \r\n and \n)
    rawItems = rawInput.split(/\r?\n/);
  } else {
    // Split delimited text into items
    // Handle comma, semicolons, or the selected separator
    const sepChar = options.separatorType === "custom" && options.customSeparator
      ? options.customSeparator
      : options.separatorType === "semicolon"
      ? ";"
      : options.separatorType === "pipe"
      ? "|"
      : options.separatorType === "tab"
      ? "\t"
      : options.separatorType === "space"
      ? " "
      : ",";

    // If separator is comma, also support splitting on commas regardless of trailing space
    const escapedSep = sepChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rawItems = rawInput.split(new RegExp(escapedSep));
  }

  let emptyCount = 0;
  let duplicateCount = 0;
  const processedItems: string[] = [];
  const seen = new Set<string>();

  for (const item of rawItems) {
    let clean = item;

    if (options.trimWhitespace) {
      clean = clean.trim();
    }

    // Strip existing outer quotes if user was splitting delimited text
    if (options.direction === "delimited-to-list" && options.trimWhitespace) {
      if (
        (clean.startsWith("'") && clean.endsWith("'")) ||
        (clean.startsWith('"') && clean.endsWith('"')) ||
        (clean.startsWith("`") && clean.endsWith("`"))
      ) {
        clean = clean.slice(1, -1);
      }
    }

    if (!clean && options.removeEmpty) {
      emptyCount++;
      continue;
    }

    if (options.removeDuplicates) {
      const key = clean.toLowerCase();
      if (seen.has(key)) {
        duplicateCount++;
        continue;
      }
      seen.add(key);
    }

    // Apply quote wrapping
    let quoted = clean;
    if (options.direction === "list-to-delimited" && clean) {
      switch (options.quoteType) {
        case "single":
          quoted = `'${clean}'`;
          break;
        case "double":
          quoted = `"${clean}"`;
          break;
        case "backtick":
          quoted = `\`${clean}\``;
          break;
        case "none":
        default:
          quoted = clean;
          break;
      }
    }

    processedItems.push(quoted);
  }

  // Sort if requested
  if (options.sortOrder === "asc") {
    processedItems.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  } else if (options.sortOrder === "desc") {
    processedItems.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: "base" }));
  }

  let resultString = "";
  if (options.direction === "list-to-delimited") {
    const separator = resolveSeparator(
      options.separatorType,
      options.customSeparator,
      options.spaceAfterSeparator
    );
    resultString = processedItems.join(separator);
  } else {
    // Delimited to list: one item per line
    resultString = processedItems.join("\n");
  }

  return {
    output: resultString,
    totalItems: processedItems.length,
    characterCount: resultString.length,
    duplicatesRemoved: duplicateCount,
    emptyItemsRemoved: emptyCount,
  };
}

export const SAMPLE_FRUITS = `apple
banana
orange
mango
banana
kiwi

peach`;

export const SAMPLE_NUMERIC_IDS = `1001
1002
1003
1004
1005
1003
1006`;

export const SAMPLE_COMMA_TEXT = `apple, banana, orange, mango, kiwi, peach`;
