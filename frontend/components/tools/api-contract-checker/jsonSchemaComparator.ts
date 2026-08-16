import {
  SchemaCompatibilityMode,
  SchemaComparisonReport,
  ApiContractFinding,
  SchemaTreeNode,
} from "./types";

/**
 * Compares two JSON Schema objects under API Request or API Response mode.
 */
export function compareJsonSchemas(
  prevSchemaStr: string,
  currSchemaStr: string,
  mode: SchemaCompatibilityMode = "response"
): SchemaComparisonReport {
  if (!prevSchemaStr.trim() || !currSchemaStr.trim()) {
    return {
      mode,
      overallStatus: "breaking",
      breakingCount: 0,
      potentialCount: 0,
      compatibleCount: 0,
      findings: [
        {
          id: "SCHEMA-EMPTY-INPUT",
          severity: "breaking",
          changeType: "structure_changed",
          path: "$",
          title: "Empty Schema Payload",
          explanation: "Both Previous and Current JSON Schema payloads must be provided.",
        },
      ],
      treeNodes: [],
      migrationSteps: ["Provide valid JSON Schema documents in both editors."],
    };
  }

  let prevSchema: any;
  let currSchema: any;

  try {
    prevSchema = JSON.parse(prevSchemaStr);
  } catch (err: any) {
    return {
      mode,
      overallStatus: "breaking",
      breakingCount: 1,
      potentialCount: 0,
      compatibleCount: 0,
      findings: [
        {
          id: "PREV-SCHEMA-PARSE-ERR",
          severity: "breaking",
          changeType: "structure_changed",
          path: "$",
          title: "Invalid Previous JSON Schema Syntax",
          explanation: err.message || "Previous schema is not valid JSON.",
        },
      ],
      treeNodes: [],
      migrationSteps: ["Fix JSON syntax error in Previous Schema."],
    };
  }

  try {
    currSchema = JSON.parse(currSchemaStr);
  } catch (err: any) {
    return {
      mode,
      overallStatus: "breaking",
      breakingCount: 1,
      potentialCount: 0,
      compatibleCount: 0,
      findings: [
        {
          id: "CURR-SCHEMA-PARSE-ERR",
          severity: "breaking",
          changeType: "structure_changed",
          path: "$",
          title: "Invalid Current JSON Schema Syntax",
          explanation: err.message || "Current schema is not valid JSON.",
        },
      ],
      treeNodes: [],
      migrationSteps: ["Fix JSON syntax error in Current Schema."],
    };
  }

  const findings: ApiContractFinding[] = [];
  const treeNodes: SchemaTreeNode[] = [];
  const migrationSteps: string[] = [];

  function compareNodes(prev: any, curr: any, path: string, keyName: string): SchemaTreeNode {
    const prevType = prev?.type || (prev?.properties ? "object" : "unknown");
    const currType = curr?.type || (curr?.properties ? "object" : "unknown");

    const treeNode: SchemaTreeNode = {
      key: keyName,
      path,
      status: "unchanged",
      previousType: prevType,
      currentType: currType,
      children: [],
    };

    // 1. Property Removed
    if (prev && !curr) {
      treeNode.status = "removed";
      const isBreaking = mode === "response";
      const sev = isBreaking ? "breaking" : "compatible";
      treeNode.severity = sev;

      findings.push({
        id: `SCH-REM-${path}`,
        severity: sev,
        changeType: "field_removed",
        path,
        previousType: prevType,
        title: `Property '${keyName}' Removed (${mode.toUpperCase()} Mode)`,
        explanation:
          mode === "response"
            ? `Property '${keyName}' was removed from API response schema. Clients expecting this property will fail.`
            : `Property '${keyName}' was removed from request schema. Server no longer accepts or requires this field.`,
        recommendation:
          mode === "response"
            ? `Keep '${keyName}' property in response or deprecate field gracefully across API releases.`
            : `Ensure servers handle legacy clients sending '${keyName}' parameter.`,
      });
      return treeNode;
    }

    // 2. Property Added
    if (!prev && curr) {
      treeNode.status = "added";
      const isRequiredInCurr = Array.isArray(curr?.parentRequired) && curr.parentRequired.includes(keyName);
      const isBreaking = mode === "request" && isRequiredInCurr;
      const sev = isBreaking ? "breaking" : "compatible";
      treeNode.severity = sev;

      findings.push({
        id: `SCH-ADD-${path}`,
        severity: sev,
        changeType: "field_added",
        path,
        currentType: currType,
        title: `Property '${keyName}' Added (${mode.toUpperCase()} Mode)`,
        explanation:
          mode === "request" && isRequiredInCurr
            ? `New REQUIRED property '${keyName}' was added to API request schema. Existing client requests omitting this property will be rejected.`
            : `New optional property '${keyName}' was added to API schema. Backward-compatible for existing clients.`,
        recommendation:
          mode === "request" && isRequiredInCurr
            ? `Make '${keyName}' optional or specify a default value server-side.`
            : `No action required. Clients will ignore unknown response fields.`,
      });
      return treeNode;
    }

    // 3. Type Changed
    if (prevType !== currType) {
      treeNode.status = "changed";
      treeNode.severity = "breaking";

      findings.push({
        id: `SCH-TYPE-${path}`,
        severity: "breaking",
        changeType: "type_changed",
        path,
        previousType: prevType,
        currentType: currType,
        title: `Schema Type Changed '${prevType}' → '${currType}'`,
        explanation: `Type changed from '${prevType}' to '${currType}'. Deserializers in client SDKs will fail.`,
        recommendation: "Maintain original data type or introduce a new field name (e.g. 'id_str').",
      });
    }

    // 4. Stricter Constraints Check (minimum, maximum, minLength, maxLength)
    if (prev && curr) {
      if (typeof prev.minimum === "number" && typeof curr.minimum === "number" && curr.minimum > prev.minimum) {
        findings.push({
          id: `SCH-MIN-STRICT-${path}`,
          severity: "breaking",
          changeType: "constraint_stricter",
          path,
          previousValue: `minimum: ${prev.minimum}`,
          currentValue: `minimum: ${curr.minimum}`,
          title: `Minimum Value Constraint Stricter (${prev.minimum} → ${curr.minimum})`,
          explanation: `Minimum constraint shifted from ${prev.minimum} to ${curr.minimum}, restricting valid input values.`,
          recommendation: "Keep lower minimum bound or verify client validation ranges.",
        });
      }

      // Enum changes
      if (Array.isArray(prev.enum) && Array.isArray(curr.enum)) {
        const removedEnumValues = prev.enum.filter((v: any) => !curr.enum.includes(v));
        if (removedEnumValues.length > 0) {
          findings.push({
            id: `SCH-ENUM-REM-${path}`,
            severity: "breaking",
            changeType: "enum_changed",
            path,
            previousValue: `[${prev.enum.join(", ")}]`,
            currentValue: `[${curr.enum.join(", ")}]`,
            title: `Enum Value Removed [${removedEnumValues.join(", ")}]`,
            explanation: `Enum values [${removedEnumValues.join(", ")}] were removed. Clients sending or receiving these enum strings will fail.`,
            recommendation: "Keep existing enum values or handle legacy enum codes gracefully.",
          });
        }
      }
    }

    // 5. Compare Object properties
    if (prev?.properties || curr?.properties) {
      const prevProps = prev?.properties || {};
      const currProps = curr?.properties || {};
      const allPropKeys = new Set([...Object.keys(prevProps), ...Object.keys(currProps)]);

      allPropKeys.forEach((pKey) => {
        const pPath = path === "$" ? `$.${pKey}` : `${path}.${pKey}`;
        const pPrev = prevProps[pKey];
        const pCurr = currProps[pKey];

        if (pCurr) pCurr.parentRequired = curr?.required;
        if (pPrev) pPrev.parentRequired = prev?.required;

        const childNode = compareNodes(pPrev, pCurr, pPath, pKey);
        treeNode.children?.push(childNode);
      });
    }

    return treeNode;
  }

  const rootTreeNode = compareNodes(prevSchema, currSchema, "$", "Root Schema");
  treeNodes.push(rootTreeNode);

  const breakingCount = findings.filter((f) => f.severity === "breaking").length;
  const potentialCount = findings.filter((f) => f.severity === "potential").length;
  const compatibleCount = findings.filter((f) => f.severity === "compatible").length;

  let overallStatus: "breaking" | "potential" | "compatible" = "compatible";
  if (breakingCount > 0) overallStatus = "breaking";
  else if (potentialCount > 0) overallStatus = "potential";

  // Build actionable migration steps
  if (breakingCount > 0) {
    migrationSteps.push("1. Retain original schema field names and types for backward compatibility.");
    migrationSteps.push("2. Deprecate legacy schema properties using 'deprecated: true' before removal.");
    migrationSteps.push("3. If breaking changes are unavoidable, release a new API major version (/v2).");
  } else {
    migrationSteps.push("1. All changes are backward-compatible. Safe to deploy!");
  }

  return {
    mode,
    overallStatus,
    breakingCount,
    potentialCount,
    compatibleCount,
    findings,
    treeNodes,
    migrationSteps,
  };
}
