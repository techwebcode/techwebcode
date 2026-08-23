/**
 * Parses a JSONPath expression (e.g. "$.user.id", "$.items[0].name", "$")
 * and finds the 1-indexed line number in the JSON source string.
 */
export function parseJsonPathSegments(jsonPath: string): (string | number)[] {
  if (!jsonPath || jsonPath === "$") return [];

  // Remove leading "$." or "$"
  let path = jsonPath.startsWith("$.") ? jsonPath.slice(2) : jsonPath.startsWith("$") ? jsonPath.slice(1) : jsonPath;

  const segments: (string | number)[] = [];
  const regex = /([^\.\[\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(path)) !== null) {
    if (match[1] !== undefined) {
      segments.push(match[1]);
    } else if (match[2] !== undefined) {
      segments.push(parseInt(match[2], 10));
    }
  }

  return segments;
}

export function findJsonPathLineNumber(
  jsonStr: string,
  jsonPath: string
): number | null {
  if (!jsonStr || !jsonStr.trim()) return null;
  if (!jsonPath || jsonPath === "$") return 1;

  const segments = parseJsonPathSegments(jsonPath);
  if (segments.length === 0) return 1;

  const lines = jsonStr.split("\n");
  let currentSegmentIndex = 0;
  let targetSegment = segments[currentSegmentIndex];
  let depth = 0;
  let arrayIndexCounter = -1;
  let matchedLine: number | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check array item index context
    if (typeof targetSegment === "number") {
      if (trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.startsWith("\"") || /^\d/.test(trimmed)) {
        arrayIndexCounter++;
        if (arrayIndexCounter === targetSegment) {
          matchedLine = i + 1;
          currentSegmentIndex++;
          if (currentSegmentIndex >= segments.length) {
            return matchedLine;
          }
          targetSegment = segments[currentSegmentIndex];
          arrayIndexCounter = -1;
          continue;
        }
      }
    }

    // Check object key context
    if (typeof targetSegment === "string") {
      const keyPattern = new RegExp(`"${targetSegment.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}"\\s*:`);
      if (keyPattern.test(line)) {
        matchedLine = i + 1;
        currentSegmentIndex++;
        if (currentSegmentIndex >= segments.length) {
          return matchedLine;
        }
        targetSegment = segments[currentSegmentIndex];
        arrayIndexCounter = -1;
      }
    }
  }

  return matchedLine || 1;
}
