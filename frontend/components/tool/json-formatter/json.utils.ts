export function formatJson(value: string, indent: number | string = 2): string {
  if (!value.trim()) return "";
  const parsed = JSON.parse(value);
  const indentSpace = typeof indent === "number" ? indent : indent === "tab" ? "\t" : 2;
  return JSON.stringify(parsed, null, indentSpace);
}

export function minifyJson(value: string): string {
  if (!value.trim()) return "";
  const parsed = JSON.parse(value);
  return JSON.stringify(parsed);
}

export function validateJson(value: string): { valid: boolean; error?: string } {
  if (!value.trim()) {
    return { valid: false };
  }
  try {
    JSON.parse(value);
    return { valid: true };
  } catch (err) {
    return { valid: false, error: (err as Error).message };
  }
}

/**
 * Specifically fixes missing commas between properties, lines, array elements, and object keys.
 */
export function fixMissingCommasOnly(value: string): string {
  if (!value.trim()) return "";

  let str = value.trim();

  // 1. Remove trailing commas before closing braces } or brackets ]
  str = str.replace(/,\s*([\]}])/g, "$1");

  // 2. Add missing commas between consecutive lines (primitives, strings, objects, arrays, booleans)
  str = str.replace(
    /(?<=["\d]|true|false|null|}|\])\s*[\r\n]+\s*(?=["{\[\d]|true|false|null|[a-zA-Z0-9_$]+\s*:)/gi,
    ",\n"
  );

  // 3. Add missing commas on same line between properties
  str = str.replace(
    /(?<=["\d]|true|false|null|}|\])\s+(?="[a-zA-Z0-9_$]+"\s*:)/gi,
    ", "
  );

  const parsed = JSON.parse(str);
  return JSON.stringify(parsed, null, 2);
}

/**
 * Enhanced JSON Repair Utility
 * Flexibly repairs dirty JSON, JS Object Literals, Python dicts, missing commas,
 * unquoted keys, single quotes, and missing trailing brackets/braces.
 */
export function repairJson(value: string): string {
  if (!value.trim()) return "";

  let str = value.trim();

  // 1. Remove JS style single-line and multi-line comments
  str = str.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");

  // 2. Convert Python / JS constants (None, True, False, undefined, NaN) to valid JSON
  str = str
    .replace(/\bNone\b/g, "null")
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bundefined\b/g, "null")
    .replace(/\bNaN\b/g, "null");

  // 3. Replace single quotes with double quotes around keys and string values
  str = str.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"');

  // 4. Wrap unquoted keys in double quotes (e.g. { name: "val" } or { name : "val" })
  str = str.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');

  // 5. Fix missing quotes on keys with colon (e.g. {"name: "val"} -> {"name": "val"})
  str = str.replace(/([{,]\s*)"([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');

  // 6. Remove trailing commas before closing braces } or brackets ]
  str = str.replace(/,\s*([\]}])/g, "$1");

  // 7. Fix missing commas between properties on newlines or spaces using lookbehinds
  str = str.replace(
    /(?<=["\d]|true|false|null|}|\])\s*[\r\n]+\s*(?=["{\[\d]|true|false|null|[a-zA-Z0-9_$]+\s*:)/gi,
    ",\n"
  );

  // 8. Fix missing commas between key-value pairs on same line
  str = str.replace(
    /(?<=["\d]|true|false|null|}|\])\s+(?="[a-zA-Z0-9_$]+"\s*:)/gi,
    ", "
  );

  // 9. Auto-close missing brackets and braces if truncated at end
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const prev = i > 0 ? str[i - 1] : "";

    if (char === '"' && prev !== "\\") {
      inString = !inString;
    } else if (!inString) {
      if (char === "{") openBraces++;
      if (char === "}") openBraces--;
      if (char === "[") openBrackets++;
      if (char === "]") openBrackets--;
    }
  }

  if (inString) {
    str += '"';
  }

  str = str.replace(/,\s*$/, "");

  while (openBrackets > 0) {
    str += "]";
    openBrackets--;
  }
  while (openBraces > 0) {
    str += "}";
    openBraces--;
  }

  const parsed = JSON.parse(str);
  return JSON.stringify(parsed, null, 2);
}

export function downloadJsonFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getJsonStats(value: string): { bytes: number; keysCount: number; isArray: boolean } {
  if (!value.trim()) {
    return { bytes: 0, keysCount: 0, isArray: false };
  }
  try {
    const parsed = JSON.parse(value);
    const bytes = new Blob([value]).size;
    let keysCount = 0;

    const countKeys = (obj: unknown) => {
      if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach(countKeys);
        } else {
          const record = obj as Record<string, unknown>;
          const keys = Object.keys(record);
          keysCount += keys.length;
          keys.forEach((k) => countKeys(record[k]));
        }
      }
    };

    countKeys(parsed);
    return { bytes, keysCount, isArray: Array.isArray(parsed) };
  } catch {
    return { bytes: new Blob([value]).size, keysCount: 0, isArray: false };
  }
}