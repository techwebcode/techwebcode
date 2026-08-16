import {
  ApiContractFinding,
  CompatibilityReport,
  FindingSeverity,
  FindingChangeType,
} from "./types";

function getTypeString(val: any): string {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

function formatVal(val: any): string {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch {
      return "[Object]";
    }
  }
  return String(val);
}

/**
 * Recursively compares two normalized JSON structures and generates API compatibility findings.
 */
export function compareApiResponses(
  previousJsonStr: string,
  currentJsonStr: string
): CompatibilityReport {
  let prevObj: any;
  let currObj: any;
  let isPreviousValid = true;
  let isCurrentValid = true;
  let parseErrorPrevious: string | undefined;
  let parseErrorCurrent: string | undefined;

  if (!previousJsonStr.trim()) {
    isPreviousValid = false;
    parseErrorPrevious = "Previous response is empty";
  } else {
    try {
      prevObj = JSON.parse(previousJsonStr);
    } catch (err: any) {
      isPreviousValid = false;
      parseErrorPrevious = err.message || "Invalid JSON syntax in Previous Response";
    }
  }

  if (!currentJsonStr.trim()) {
    isCurrentValid = false;
    parseErrorCurrent = "Current response is empty";
  } else {
    try {
      currObj = JSON.parse(currentJsonStr);
    } catch (err: any) {
      isCurrentValid = false;
      parseErrorCurrent = err.message || "Invalid JSON syntax in Current Response";
    }
  }

  if (!isPreviousValid || !isCurrentValid) {
    return {
      overallStatus: "breaking",
      breakingCount: 0,
      potentialCount: 0,
      compatibleCount: 0,
      findings: [],
      isPreviousValid,
      isCurrentValid,
      parseErrorPrevious,
      parseErrorCurrent,
    };
  }

  const findings: ApiContractFinding[] = [];

  function compareRecursive(prev: any, curr: any, path: string) {
    const prevType = getTypeString(prev);
    const currType = getTypeString(curr);

    // 1. Type mismatch or structural type swap
    if (prevType !== currType) {
      // Nullability change check
      if (prevType === "null" || currType === "null") {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "potential",
          changeType: "nullability_changed",
          path,
          previousType: prevType,
          previousValue: formatVal(prev),
          currentType: currType,
          currentValue: formatVal(curr),
          title: "Field Nullability Changed",
          explanation: `Field type changed from '${prevType}' to '${currType}'. Clients expecting non-null values may crash if null is returned unexpectedly.`,
        });
        return;
      }

      // Structure swap (e.g. Object <-> Array)
      if (
        (prevType === "object" && currType === "array") ||
        (prevType === "array" && currType === "object")
      ) {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "breaking",
          changeType: "structure_changed",
          path,
          previousType: prevType,
          previousValue: formatVal(prev),
          currentType: currType,
          currentValue: formatVal(curr),
          title: "Structural Type Swap (Object / Array)",
          explanation: `Field changed structure from '${prevType}' to '${currType}'. Existing client parsers expecting ${prevType} access will throw runtime errors.`,
        });
        return;
      }

      // Primitive type change (e.g. number -> string)
      findings.push({
        id: `find-${path}-${findings.length}`,
        severity: "breaking",
        changeType: "type_changed",
        path,
        previousType: prevType,
        previousValue: formatVal(prev),
        currentType: currType,
        currentValue: formatVal(curr),
        title: "Primitive Data Type Mismatch",
        explanation: `Field type changed from '${prevType}' to '${currType}'. Strongly-typed API client SDKs (Swift, Kotlin, Java, TypeScript) will fail deserialization.`,
      });
      return;
    }

    // 2. Objects comparison
    if (prevType === "object") {
      const prevKeys = Object.keys(prev || {});
      const currKeys = Object.keys(curr || {});
      const allKeys = new Set([...prevKeys, ...currKeys]);

      allKeys.forEach((key) => {
        const keyPath = path === "$" ? `$.${key}` : `${path}.${key}`;
        const hasPrev = Object.prototype.hasOwnProperty.call(prev, key);
        const hasCurr = Object.prototype.hasOwnProperty.call(curr, key);

        if (hasPrev && !hasCurr) {
          // Removed field -> Breaking Change
          findings.push({
            id: `find-${keyPath}-${findings.length}`,
            severity: "breaking",
            changeType: "field_removed",
            path: keyPath,
            previousType: getTypeString(prev[key]),
            previousValue: formatVal(prev[key]),
            currentType: "undefined",
            title: "Response Field Removed",
            explanation: `Field '${key}' was removed from the response payload. Existing API clients depending on this field will fail.`,
          });
        } else if (!hasPrev && hasCurr) {
          // Added field -> Compatible Change
          findings.push({
            id: `find-${keyPath}-${findings.length}`,
            severity: "compatible",
            changeType: "field_added",
            path: keyPath,
            previousType: "undefined",
            currentType: getTypeString(curr[key]),
            currentValue: formatVal(curr[key]),
            title: "New Response Field Added",
            explanation: `Field '${key}' was added to the response. New fields are backward-compatible for clients that ignore unknown JSON properties.`,
          });
        } else {
          // Recurse into object properties
          compareRecursive(prev[key], curr[key], keyPath);
        }
      });
      return;
    }

    // 3. Arrays comparison
    if (prevType === "array") {
      const prevArr = prev as any[];
      const currArr = curr as any[];

      if (prevArr.length > 0 && currArr.length > 0) {
        // Compare sample item structures
        compareRecursive(prevArr[0], currArr[0], `${path}[0]`);
      } else if (prevArr.length > 0 && currArr.length === 0) {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "potential",
          changeType: "array_item_changed",
          path,
          previousType: `array (${prevArr.length} items)`,
          currentType: "empty array []",
          title: "Array Payload Empty in Current Response",
          explanation: "Current array is empty, preventing deep item schema verification against previous sample elements.",
        });
      }
      return;
    }
  }

  compareRecursive(prevObj, currObj, "$");

  const breakingCount = findings.filter((f) => f.severity === "breaking").length;
  const potentialCount = findings.filter((f) => f.severity === "potential").length;
  const compatibleCount = findings.filter((f) => f.severity === "compatible").length;

  let overallStatus: "breaking" | "potential" | "compatible" = "compatible";
  if (breakingCount > 0) {
    overallStatus = "breaking";
  } else if (potentialCount > 0) {
    overallStatus = "potential";
  }

  return {
    overallStatus,
    breakingCount,
    potentialCount,
    compatibleCount,
    findings,
    isPreviousValid,
    isCurrentValid,
  };
}
