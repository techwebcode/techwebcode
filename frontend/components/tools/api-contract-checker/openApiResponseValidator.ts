import { ApiContractFinding } from "./types";
import { resolveLocalRef } from "./openApiAnalyzer";

export interface ResponseValidationResult {
  isValid: boolean;
  findings: ApiContractFinding[];
  errorCount: number;
}

function getTypeName(val: any): string {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

/**
 * Validates actual JSON API response payload against an OpenAPI response schema.
 */
export function validateResponseAgainstOpenApiSchema(
  actualJsonStr: string,
  targetSchema: any,
  rawDoc: any
): ResponseValidationResult {
  if (!actualJsonStr.trim()) {
    return {
      isValid: false,
      findings: [
        {
          id: "VAL-EMPTY-JSON",
          severity: "breaking",
          changeType: "schema_violation",
          path: "$",
          title: "Empty Response Payload",
          explanation: "Actual response payload is empty.",
        },
      ],
      errorCount: 1,
    };
  }

  let actualObj: any;
  try {
    actualObj = JSON.parse(actualJsonStr);
  } catch (err: any) {
    return {
      isValid: false,
      findings: [
        {
          id: "VAL-INVALID-JSON",
          severity: "breaking",
          changeType: "schema_violation",
          path: "$",
          title: "Invalid JSON Syntax",
          explanation: err.message || "Actual response payload is not valid JSON.",
        },
      ],
      errorCount: 1,
    };
  }

  if (!targetSchema || typeof targetSchema !== "object") {
    return {
      isValid: true,
      findings: [],
      errorCount: 0,
    };
  }

  const findings: ApiContractFinding[] = [];

  function validateRecursive(schema: any, data: any, path: string) {
    if (!schema) return;

    // Handle $ref
    if (schema.$ref && typeof schema.$ref === "string") {
      const { resolved } = resolveLocalRef(rawDoc, schema.$ref);
      if (resolved) {
        validateRecursive(resolved, data, path);
        return;
      }
    }

    const actualType = getTypeName(data);
    const expectedType = schema.type;

    // 1. Type validation
    if (expectedType) {
      if (expectedType === "integer" || expectedType === "number") {
        if (actualType !== "number") {
          findings.push({
            id: `VAL-TYPE-${path}`,
            severity: "breaking",
            changeType: "schema_violation",
            path,
            previousType: expectedType,
            currentType: actualType,
            currentValue: String(data),
            title: `Type Violation at ${path}`,
            explanation: `OpenAPI contract specifies type '${expectedType}', but actual response returned '${actualType}'.`,
          });
          return;
        }
      } else if (expectedType === "string" && actualType !== "string") {
        findings.push({
          id: `VAL-TYPE-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousType: "string",
          currentType: actualType,
          currentValue: String(data),
          title: `Type Violation at ${path}`,
          explanation: `OpenAPI contract specifies type 'string', but actual response returned '${actualType}'.`,
        });
        return;
      } else if (expectedType === "boolean" && actualType !== "boolean") {
        findings.push({
          id: `VAL-TYPE-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousType: "boolean",
          currentType: actualType,
          currentValue: String(data),
          title: `Type Violation at ${path}`,
          explanation: `OpenAPI contract specifies type 'boolean', but actual response returned '${actualType}'.`,
        });
        return;
      } else if (expectedType === "object" && actualType !== "object") {
        findings.push({
          id: `VAL-TYPE-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousType: "object",
          currentType: actualType,
          title: `Type Violation at ${path}`,
          explanation: `OpenAPI contract specifies object structure, but actual response returned '${actualType}'.`,
        });
        return;
      } else if (expectedType === "array" && actualType !== "array") {
        findings.push({
          id: `VAL-TYPE-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousType: "array",
          currentType: actualType,
          title: `Type Violation at ${path}`,
          explanation: `OpenAPI contract specifies array structure, but actual response returned '${actualType}'.`,
        });
        return;
      }
    }

    // 2. Required properties check
    if (actualType === "object" && Array.isArray(schema.required)) {
      schema.required.forEach((reqProp: string) => {
        if (!(reqProp in data) || data[reqProp] === undefined) {
          const reqPath = path === "$" ? `$.${reqProp}` : `${path}.${reqProp}`;
          findings.push({
            id: `VAL-REQUIRED-${reqPath}`,
            severity: "breaking",
            changeType: "schema_violation",
            path: reqPath,
            title: `Required Field Missing '${reqProp}'`,
            explanation: `OpenAPI contract marks '${reqProp}' as required, but it is missing from actual response payload.`,
          });
        }
      });
    }

    // 3. Object properties recursive check
    if (actualType === "object" && schema.properties) {
      Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
        if (propName in data) {
          const propPath = path === "$" ? `$.${propName}` : `${path}.${propName}`;
          validateRecursive(propSchema, data[propName], propPath);
        }
      });
    }

    // 4. Array items recursive check
    if (actualType === "array" && schema.items && Array.isArray(data)) {
      data.forEach((item: any, idx: number) => {
        validateRecursive(schema.items, item, `${path}[${idx}]`);
      });
    }
  }

  validateRecursive(targetSchema, actualObj, "$");

  return {
    isValid: findings.length === 0,
    findings,
    errorCount: findings.length,
  };
}
