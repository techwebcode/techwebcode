export interface JsonDiagnosticStats {
  sizeBytes: number;
  totalKeys: number;
  depth: number;
  rootType: string;
}

export interface DuplicateKeyError {
  key: string;
  line: number;
}

export interface JsonValidationResult {
  isValid: boolean | null;
  errorTitle?: string;
  errorMessage?: string;
  line?: number;
  column?: number;
  suggestion?: string;
  lineSnippet?: string;
  pointerSnippet?: string;
  duplicateKeys?: DuplicateKeyError[];
  stats?: JsonDiagnosticStats;
}

/**
 * Calculates line number and column number from a character index in text.
 */
export function getLineAndColumn(text: string, position: number): { line: number; column: number } {
  const safePos = Math.max(0, Math.min(position, text.length));
  const sub = text.substring(0, safePos);
  const lines = sub.split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

/**
 * Recursively scans JSON tokens to detect duplicate keys in objects (RFC 8259 strict compliance).
 */
export function findDuplicateKeys(text: string): DuplicateKeyError[] {
  const duplicates: DuplicateKeyError[] = [];
  const lines = text.split("\n");
  
  // Track stack of key sets per object scope
  const scopeStack: Set<string>[] = [];
  
  // Tokenize simplified string & structural tokens
  let inString = false;
  let escape = false;
  let currentString = "";
  let stringStartPos = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === '"') {
        inString = false;
        
        // Peek ahead to see if this string was an object key (followed by optional whitespace and ':')
        let j = i + 1;
        while (j < text.length && /\s/.test(text[j])) {
          j++;
        }
        if (j < text.length && text[j] === ":") {
          const keyName = currentString;
          const currentScope = scopeStack[scopeStack.length - 1];
          if (currentScope) {
            if (currentScope.has(keyName)) {
              const { line } = getLineAndColumn(text, stringStartPos);
              duplicates.push({ key: keyName, line });
            } else {
              currentScope.add(keyName);
            }
          }
        }
      } else {
        currentString += char;
      }
    } else {
      if (char === '"') {
        inString = true;
        currentString = "";
        stringStartPos = i;
      } else if (char === "{") {
        scopeStack.push(new Set<string>());
      } else if (char === "}") {
        scopeStack.pop();
      }
    }
  }

  return duplicates;
}

/**
 * Extracts line, column, and contextual suggestions from common JSON syntax errors.
 */
export function analyzeJsonSyntaxError(text: string, err: any): {
  line: number;
  column: number;
  suggestion?: string;
  lineSnippet?: string;
  pointerSnippet?: string;
} {
  const message = err?.message || String(err);
  let line = 1;
  let column = 1;

  // 1. Look for 'at position X'
  const posMatch = message.match(/position\s+(\d+)/i) || message.match(/char\s+(\d+)/i);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const loc = getLineAndColumn(text, pos);
    line = loc.line;
    column = loc.column;
  } else {
    // 2. Look for 'line X column Y'
    const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    }
  }

  // 3. Inspect common heuristic mistakes
  let suggestion = "Check for matching brackets, valid string quoting, and correct comma placement.";

  // Trailing comma check
  if (/,\s*([\]}])/i.test(text)) {
    suggestion = "Trailing comma detected before a closing bracket ']' or '}'. Standard RFC 8259 JSON does not permit trailing commas.";
  } else if (/'[^']*'\s*:/i.test(text) || /([{,]\s*)([a-zA-Z0-9_$]+)\s*:/i.test(text)) {
    suggestion = "Unquoted or single-quoted key name detected. JSON specification requires all object property keys to be enclosed in standard double quotes (\"key\").";
  } else if (/'[^']*'/i.test(text)) {
    suggestion = "Single quotes detected around a string value. JSON string values must strictly use double quotes (\").";
  } else if (/undefined|NaN/i.test(text)) {
    suggestion = "JavaScript keyword (undefined / NaN) detected. JSON only supports null, booleans, numbers, strings, arrays, and objects.";
  }

  // Extract visual line snippet and pointer
  const lines = text.split("\n");
  const targetLine = lines[line - 1] || "";
  const cleanLine = targetLine.slice(0, 120);
  const pointerIndent = " ".repeat(Math.max(0, Math.min(column - 1, 118)));
  const pointer = `${pointerIndent}^`;

  return {
    line,
    column,
    suggestion,
    lineSnippet: cleanLine,
    pointerSnippet: pointer,
  };
}

/**
 * Calculates metadata statistics for valid JSON payloads.
 */
export function calculateJsonStats(data: any, rawText: string): JsonDiagnosticStats {
  const sizeBytes = new TextEncoder().encode(rawText).length;
  let totalKeys = 0;
  let maxDepth = 0;

  function walk(node: any, currentDepth: number) {
    if (currentDepth > maxDepth) maxDepth = currentDepth;
    if (node && typeof node === "object") {
      if (Array.isArray(node)) {
        for (const item of node) {
          walk(item, currentDepth + 1);
        }
      } else {
        const keys = Object.keys(node);
        totalKeys += keys.length;
        for (const k of keys) {
          walk(node[k], currentDepth + 1);
        }
      }
    }
  }

  walk(data, 1);

  let rootType = "Object";
  if (Array.isArray(data)) {
    rootType = `Array (${data.length} items)`;
  } else if (data === null) {
    rootType = "Null";
  } else if (typeof data !== "object") {
    rootType = typeof data;
  } else {
    rootType = `Object (${Object.keys(data).length} root keys)`;
  }

  return {
    sizeBytes,
    totalKeys,
    depth: maxDepth,
    rootType,
  };
}
