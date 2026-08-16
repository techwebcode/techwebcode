import { ApiContractFinding } from "./types";
import { resolveLocalRef } from "./openApiAnalyzer";

export interface SchemaValidationResult {
  isValid: boolean;
  findings: ApiContractFinding[];
  errorCount: number;
}

function getDataType(val: any): string {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

/**
 * Validates a JSON data object against a JSON Schema payload.
 */
export function validateDataAgainstJsonSchema(
  dataJsonStr: string,
  schemaJsonStr: string
): SchemaValidationResult {
  if (!dataJsonStr.trim() || !schemaJsonStr.trim()) {
    return {
      isValid: false,
      findings: [
        {
          id: "VAL-EMPTY-INPUT",
          severity: "breaking",
          changeType: "schema_violation",
          path: "$",
          title: "Empty Input Payload",
          explanation: "Both JSON Schema and Data payload must be provided.",
        },
      ],
      errorCount: 1,
    };
  }

  let dataObj: any;
  let schemaObj: any;

  try {
    dataObj = JSON.parse(dataJsonStr);
  } catch (err: any) {
    return {
      isValid: false,
      findings: [
        {
          id: "VAL-DATA-JSON-ERR",
          severity: "breaking",
          changeType: "schema_violation",
          path: "$",
          title: "Invalid Data JSON Syntax",
          explanation: err.message || "Data payload is not valid JSON.",
        },
      ],
      errorCount: 1,
    };
  }

  try {
    schemaObj = JSON.parse(schemaJsonStr);
  } catch (err: any) {
    return {
      isValid: false,
      findings: [
        {
          id: "VAL-SCHEMA-JSON-ERR",
          severity: "breaking",
          changeType: "schema_violation",
          path: "$",
          title: "Invalid Schema JSON Syntax",
          explanation: err.message || "JSON Schema document is not valid JSON.",
        },
      ],
      errorCount: 1,
    };
  }

  const findings: ApiContractFinding[] = [];

  function validateRecursive(schema: any, data: any, path: string) {
    if (!schema || typeof schema !== "object") return;

    // Handle $ref
    if (typeof schema.$ref === "string") {
      const { resolved } = resolveLocalRef(schemaObj, schema.$ref);
      if (resolved) {
        validateRecursive(resolved, data, path);
        return;
      }
    }

    const actualType = getDataType(data);
    const expectedType = schema.type;

    // 1. Type validation
    if (expectedType) {
      const expectedTypes = Array.isArray(expectedType) ? expectedType : [expectedType];
      let matches = false;

      expectedTypes.forEach((exp) => {
        if (exp === "integer" || exp === "number") {
          if (actualType === "number") matches = true;
        } else if (exp === actualType) {
          matches = true;
        }
      });

      if (!matches) {
        findings.push({
          id: `VAL-TYPE-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousType: expectedTypes.join(" | "),
          currentType: actualType,
          currentValue: String(data),
          title: `Data Type Mismatch at ${path}`,
          explanation: `JSON Schema specifies type '${expectedTypes.join(" | ") }', but data value is '${actualType}'.`,
        });
        return;
      }
    }

    // 2. Required properties check
    if (actualType === "object" && Array.isArray(schema.required)) {
      schema.required.forEach((reqKey: string) => {
        if (!(reqKey in data) || data[reqKey] === undefined) {
          const reqPath = path === "$" ? `$.${reqKey}` : `${path}.${reqKey}`;
          findings.push({
            id: `VAL-REQUIRED-${reqPath}`,
            severity: "breaking",
            changeType: "schema_violation",
            path: reqPath,
            title: `Required Field Missing '${reqKey}'`,
            explanation: `JSON Schema marks '${reqKey}' as required, but field is missing from data payload.`,
          });
        }
      });
    }

    // 3. Enum validation
    if (Array.isArray(schema.enum)) {
      const isEnumValid = schema.enum.some(
        (enumVal: any) => JSON.stringify(enumVal) === JSON.stringify(data)
      );
      if (!isEnumValid) {
        findings.push({
          id: `VAL-ENUM-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousValue: schema.enum.join(", "),
          currentValue: String(data),
          title: `Enum Value Violation at ${path}`,
          explanation: `Value '${data}' is not present in allowed enum list: [${schema.enum.join(", ")}].`,
        });
      }
    }

    // 4. String constraints (minLength, maxLength, pattern)
    if (actualType === "string") {
      const str = String(data);
      if (typeof schema.minLength === "number" && str.length < schema.minLength) {
        findings.push({
          id: `VAL-MINLEN-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousValue: `minLength: ${schema.minLength}`,
          currentValue: `length: ${str.length}`,
          title: `String Length Below Minimum (${str.length} < ${schema.minLength})`,
          explanation: `String length ${str.length} is shorter than minLength ${schema.minLength}.`,
        });
      }

      if (typeof schema.maxLength === "number" && str.length > schema.maxLength) {
        findings.push({
          id: `VAL-MAXLEN-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousValue: `maxLength: ${schema.maxLength}`,
          currentValue: `length: ${str.length}`,
          title: `String Length Exceeds Maximum (${str.length} > ${schema.maxLength})`,
          explanation: `String length ${str.length} exceeds maxLength constraint ${schema.maxLength}.`,
        });
      }

      if (typeof schema.pattern === "string") {
        try {
          const regex = new RegExp(schema.pattern);
          if (!regex.test(str)) {
            findings.push({
              id: `VAL-PATTERN-${path}`,
              severity: "breaking",
              changeType: "schema_violation",
              path,
              previousValue: `pattern: ${schema.pattern}`,
              currentValue: str,
              title: `Regex Pattern Violation at ${path}`,
              explanation: `Value '${str}' does not match pattern '${schema.pattern}'.`,
            });
          }
        } catch {
          // Ignore regex compile error
        }
      }
    }

    // 5. Numeric constraints (minimum, maximum)
    if (actualType === "number") {
      const num = Number(data);
      if (typeof schema.minimum === "number" && num < schema.minimum) {
        findings.push({
          id: `VAL-MINNUM-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousValue: `minimum: ${schema.minimum}`,
          currentValue: String(num),
          title: `Number Below Minimum Constraint (${num} < ${schema.minimum})`,
          explanation: `Numeric value ${num} is smaller than specified minimum ${schema.minimum}.`,
        });
      }

      if (typeof schema.maximum === "number" && num > schema.maximum) {
        findings.push({
          id: `VAL-MAXNUM-${path}`,
          severity: "breaking",
          changeType: "schema_violation",
          path,
          previousValue: `maximum: ${schema.maximum}`,
          currentValue: String(num),
          title: `Number Exceeds Maximum Constraint (${num} > ${schema.maximum})`,
          explanation: `Numeric value ${num} exceeds specified maximum ${schema.maximum}.`,
        });
      }
    }

    // 6. Object properties recursive validation
    if (actualType === "object" && schema.properties) {
      Object.entries(schema.properties).forEach(([propKey, propSchema]: [string, any]) => {
        if (propKey in data) {
          const propPath = path === "$" ? `$.${propKey}` : `${path}.${propKey}`;
          validateRecursive(propSchema, data[propKey], propPath);
        }
      });
    }

    // 7. Array items recursive validation
    if (actualType === "array" && schema.items && Array.isArray(data)) {
      data.forEach((item: any, idx: number) => {
        validateRecursive(schema.items, item, `${path}[${idx}]`);
      });
    }
  }

  validateRecursive(schemaObj, dataObj, "$");

  return {
    isValid: findings.length === 0,
    findings,
    errorCount: findings.length,
  };
}
