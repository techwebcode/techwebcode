import {
  ApiContractFinding,
  CompatibilityReport,
  FindingSeverity,
  FindingChangeType,
} from "./types";
import { findJsonPathLineNumber } from "./jsonPathLocator";

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
      const str = JSON.stringify(val);
      return str.length > 60 ? str.slice(0, 57) + "..." : str;
    } catch {
      return "[Object]";
    }
  }
  return String(val);
}

/**
 * Compares baseline (previous) and candidate (current) JSON payloads and returns
 * a production-quality API compatibility report.
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
    parseErrorPrevious = "Previous JSON payload is empty";
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
    parseErrorCurrent = "Current JSON payload is empty";
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
      clientImpactSummary: "Invalid JSON syntax detected in inputs. Please fix syntax errors before running compatibility analysis.",
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

    const linePrev = findJsonPathLineNumber(previousJsonStr, path);
    const lineCurr = findJsonPathLineNumber(currentJsonStr, path);

    // 1. Type Mismatch / Structural Type Swap
    if (prevType !== currType) {
      // Nullability changes
      if (prevType === "null" && currType !== "null") {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "potential",
          changeType: "nullability_changed",
          path,
          previousType: "null",
          previousValue: "null",
          currentType: currType,
          currentValue: formatVal(curr),
          title: "Null Property Now Populated",
          explanation: `Field was 'null' in baseline and is now populated with type '${currType}'. Verify clients handle non-null data without unexpected behavior.`,
          recommendation: "Ensure client SDKs support optional non-null values for this field.",
          isStructural: true,
          lineNumberPrev: linePrev,
          lineNumberCurr: lineCurr,
          targetSide: "current",
        });
        return;
      }

      if (prevType !== "null" && currType === "null") {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "breaking",
          changeType: "nullability_changed",
          path,
          previousType: prevType,
          previousValue: formatVal(prev),
          currentType: "null",
          currentValue: "null",
          title: "Non-Null Property Returned as Null",
          explanation: `Field changed from '${prevType}' to 'null'. Strongly typed clients expecting a non-null '${prevType}' value may crash or throw NullPointerExceptions.`,
          recommendation: "Avoid returning null for previously required non-null response fields.",
          isStructural: true,
          lineNumberPrev: linePrev,
          lineNumberCurr: lineCurr,
          targetSide: "current",
        });
        return;
      }

      // Structure swap (Object <-> Array or Primitive <-> Object/Array)
      if (
        (prevType === "object" && currType === "array") ||
        (prevType === "array" && currType === "object") ||
        ((prevType === "object" || prevType === "array") && currType !== "object" && currType !== "array") ||
        ((currType === "object" || currType === "array") && prevType !== "object" && prevType !== "array")
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
          title: `Structural Type Swap (${prevType} ➔ ${currType})`,
          explanation: `Field structure changed from '${prevType}' to '${currType}'. Existing client JSON parsers expecting ${prevType} access will throw fatal runtime errors.`,
          recommendation: `Retain '${prevType}' layout or introduce a new endpoint version (/v2) for structured changes.`,
          isStructural: true,
          lineNumberPrev: linePrev,
          lineNumberCurr: lineCurr,
          targetSide: "both",
        });
        return;
      }

      // Primitive type change (e.g. number -> string, boolean -> string)
      findings.push({
        id: `find-${path}-${findings.length}`,
        severity: "breaking",
        changeType: "type_changed",
        path,
        previousType: prevType,
        previousValue: formatVal(prev),
        currentType: currType,
        currentValue: formatVal(curr),
        title: `Primitive Data Type Mismatch (${prevType} ➔ ${currType})`,
        explanation: `Field type changed from '${prevType}' to '${currType}'. Strongly-typed client SDKs (Swift, Kotlin, Java, C#, TypeScript) will fail deserialization.`,
        recommendation: `Maintain original type '${prevType}' or expose an additional typed field (e.g., '${path}_str').`,
        isStructural: true,
        lineNumberPrev: linePrev,
        lineNumberCurr: lineCurr,
        targetSide: "both",
      });
      return;
    }

    // 2. Objects Comparison
    if (prevType === "object") {
      const prevKeys = Object.keys(prev || {});
      const currKeys = Object.keys(curr || {});
      const removedKeys = prevKeys.filter((k) => !currKeys.includes(k));
      const addedKeys = currKeys.filter((k) => !prevKeys.includes(k));
      const matchedRenames = new Set<string>();

      // Heuristic for Renamed Fields: if a removed key and added key have the same data type or structure
      removedKeys.forEach((rKey) => {
        const rVal = prev[rKey];
        const rType = getTypeString(rVal);

        const renameCandidate = addedKeys.find((aKey) => {
          if (matchedRenames.has(aKey)) return false;
          return getTypeString(curr[aKey]) === rType;
        });

        const keyPathPrev = path === "$" ? `$.${rKey}` : `${path}.${rKey}`;

        if (renameCandidate) {
          matchedRenames.add(renameCandidate);
          const keyPathCurr = path === "$" ? `$.${renameCandidate}` : `${path}.${renameCandidate}`;

          findings.push({
            id: `find-${keyPathPrev}-${findings.length}`,
            severity: "breaking",
            changeType: "renamed_field",
            path: keyPathPrev,
            previousType: rType,
            previousValue: formatVal(rVal),
            currentType: getTypeString(curr[renameCandidate]),
            currentValue: formatVal(curr[renameCandidate]),
            title: `Possible Field Rename ('${rKey}' ➔ '${renameCandidate}')`,
            explanation: `Field '${rKey}' appears to have been renamed to '${renameCandidate}'. Clients looking for '${rKey}' will fail to parse this property.`,
            recommendation: `Retain '${rKey}' as an alias or deprecate gracefully before removing.`,
            isStructural: true,
            lineNumberPrev: findJsonPathLineNumber(previousJsonStr, keyPathPrev),
            lineNumberCurr: findJsonPathLineNumber(currentJsonStr, keyPathCurr),
            targetSide: "both",
          });
        } else {
          findings.push({
            id: `find-${keyPathPrev}-${findings.length}`,
            severity: "breaking",
            changeType: "field_removed",
            path: keyPathPrev,
            previousType: rType,
            previousValue: formatVal(rVal),
            currentType: "undefined",
            title: `Response Field Removed ('${rKey}')`,
            explanation: `Field '${rKey}' was removed from the response payload. Existing API clients depending on this property will fail.`,
            recommendation: `Keep '${rKey}' in response payload or mark as deprecated in schema.`,
            isStructural: true,
            lineNumberPrev: findJsonPathLineNumber(previousJsonStr, keyPathPrev),
            lineNumberCurr: null,
            targetSide: "previous",
          });
        }
      });

      // Added Fields
      addedKeys.forEach((aKey) => {
        if (matchedRenames.has(aKey)) return; // Already handled as rename
        const keyPathCurr = path === "$" ? `$.${aKey}` : `${path}.${aKey}`;
        const aVal = curr[aKey];
        const aType = getTypeString(aVal);

        findings.push({
          id: `find-${keyPathCurr}-${findings.length}`,
          severity: "compatible",
          changeType: "field_added",
          path: keyPathCurr,
          previousType: "undefined",
          currentType: aType,
          currentValue: formatVal(aVal),
          title: `New Optional Response Field Added ('${aKey}')`,
          explanation: `New field '${aKey}' was added to the response. Backward-compatible for clients that ignore unknown JSON properties.`,
          recommendation: "No client migration action required.",
          isStructural: true,
          lineNumberPrev: null,
          lineNumberCurr: findJsonPathLineNumber(currentJsonStr, keyPathCurr),
          targetSide: "current",
        });
      });

      // Common Keys -> Recurse
      prevKeys.forEach((key) => {
        if (currKeys.includes(key)) {
          const keyPath = path === "$" ? `$.${key}` : `${path}.${key}`;
          compareRecursive(prev[key], curr[key], keyPath);
        }
      });

      return;
    }

    // 3. Arrays Comparison
    if (prevType === "array") {
      const prevArr = prev as any[];
      const currArr = curr as any[];

      if (prevArr.length > 0 && currArr.length > 0) {
        // Compare sample item types across array elements
        const prevElemTypes = new Set(prevArr.map(getTypeString));
        const currElemTypes = new Set(currArr.map(getTypeString));

        const prevFirstType = getTypeString(prevArr[0]);
        const currFirstType = getTypeString(currArr[0]);

        if (prevFirstType !== currFirstType) {
          findings.push({
            id: `find-${path}[0]-${findings.length}`,
            severity: "breaking",
            changeType: "array_item_changed",
            path: `${path}[0]`,
            previousType: `array of ${prevFirstType}`,
            previousValue: formatVal(prevArr[0]),
            currentType: `array of ${currFirstType}`,
            currentValue: formatVal(currArr[0]),
            title: `Array Element Data Type Mismatch (${prevFirstType} ➔ ${currFirstType})`,
            explanation: `Array element data type changed from '${prevFirstType}' to '${currFirstType}'. Client list parsers will throw deserialization errors during iteration.`,
            recommendation: `Ensure array elements retain '${prevFirstType}' type.`,
            isStructural: true,
            lineNumberPrev: linePrev,
            lineNumberCurr: lineCurr,
            targetSide: "both",
          });
        } else {
          // Recurse into first item structure
          compareRecursive(prevArr[0], currArr[0], `${path}[0]`);
        }
      } else if (prevArr.length > 0 && currArr.length === 0) {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "potential",
          changeType: "array_item_changed",
          path,
          previousType: `array (${prevArr.length} items)`,
          currentType: "empty array []",
          title: "Array Payload Empty in Candidate Response",
          explanation: "Candidate array is empty. Unable to verify deep item schema compatibility against baseline sample items.",
          recommendation: "Provide sample items in candidate array payload for full schema verification.",
          isStructural: false,
          lineNumberPrev: linePrev,
          lineNumberCurr: lineCurr,
          targetSide: "current",
        });
      }

      return;
    }

    // 4. Primitive Values Comparison (Same Type)
    if (prev !== curr && (prevType === "string" || prevType === "number" || prevType === "boolean")) {
      // Check if value change represents an enum or state indicator change
      const isEnumLike =
        typeof prev === "string" &&
        (path.endsWith(".status") ||
          path.endsWith(".role") ||
          path.endsWith(".type") ||
          path.endsWith(".state") ||
          path.endsWith(".code"));

      if (isEnumLike) {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "potential",
          changeType: "enum_changed",
          path,
          previousType: prevType,
          previousValue: String(prev),
          currentType: currType,
          currentValue: String(curr),
          title: `Enum / State Property Value Shift ('${prev}' ➔ '${curr}')`,
          explanation: `Property value shifted from '${prev}' to '${curr}'. Clients using strict enum switch statements should handle this value.`,
          recommendation: "Ensure clients support this updated status/enum string.",
          isStructural: false,
          lineNumberPrev: linePrev,
          lineNumberCurr: lineCurr,
          targetSide: "both",
        });
      } else {
        findings.push({
          id: `find-${path}-${findings.length}`,
          severity: "compatible",
          changeType: "value_changed",
          path,
          previousType: prevType,
          previousValue: formatVal(prev),
          currentType: currType,
          currentValue: formatVal(curr),
          title: `Data Value Updated ('${formatVal(prev)}' ➔ '${formatVal(curr)}')`,
          explanation: `Value updated from '${formatVal(prev)}' to '${formatVal(curr)}'. Data value updates with matching data types are fully compatible.`,
          recommendation: "No client schema changes required.",
          isStructural: false,
          lineNumberPrev: linePrev,
          lineNumberCurr: lineCurr,
          targetSide: "both",
        });
      }
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

  let clientImpactSummary = "";
  if (breakingCount > 0) {
    clientImpactSummary = `🔴 BREAKING CHANGES DETECTED: Existing API clients are likely to fail during JSON deserialization or property access due to ${breakingCount} breaking change${breakingCount > 1 ? "s" : ""}.`;
  } else if (potentialCount > 0) {
    clientImpactSummary = `🟡 POTENTIAL ISSUES DETECTED: Changes are mostly compatible, but ${potentialCount} field change${potentialCount > 1 ? "s" : ""} require verification against strict client parsers.`;
  } else {
    clientImpactSummary = "🟢 BACKWARD COMPATIBLE: All changes are backward-compatible. Existing API consumers can safely consume the updated response payload.";
  }

  return {
    overallStatus,
    breakingCount,
    potentialCount,
    compatibleCount,
    findings,
    clientImpactSummary,
    isPreviousValid,
    isCurrentValid,
  };
}
