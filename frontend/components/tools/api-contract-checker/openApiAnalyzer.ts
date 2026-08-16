import YAML from "yaml";
import {
  OpenApiReport,
  OpenApiEndpoint,
  OpenApiStats,
  ApiContractFinding,
} from "./types";

/**
 * Resolves local $ref pointers (e.g. #/components/schemas/User) inside doc.
 */
export function resolveLocalRef(doc: any, refStr: string): { resolved: any; error?: string } {
  if (!refStr || typeof refStr !== "string" || !refStr.startsWith("#/")) {
    return { resolved: null, error: `Invalid $ref string format '${refStr}'` };
  }

  const parts = refStr.replace("#/", "").split("/");
  let current = doc;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return { resolved: null, error: `Unresolved $ref reference '${refStr}'` };
    }
  }

  return { resolved: current };
}

/**
 * Parses and validates OpenAPI 3.0, 3.1, or Swagger 2.0 specifications.
 */
export function parseAndAnalyzeOpenApi(specContent: string): OpenApiReport {
  if (!specContent || !specContent.trim()) {
    return {
      isValid: false,
      version: "Unknown",
      title: "Empty Specification",
      stats: {
        version: "Unknown",
        totalEndpoints: 0,
        methodCounts: { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 },
        totalSchemas: 0,
        totalSecuritySchemes: 0,
      },
      endpoints: [],
      findings: [],
      errorCount: 0,
      warningCount: 0,
      passCount: 0,
      parseError: "Specification content is empty",
      rawSpec: null,
    };
  }

  let doc: any;
  try {
    if (specContent.trim().startsWith("{")) {
      doc = JSON.parse(specContent);
    } else {
      doc = YAML.parse(specContent);
    }
  } catch (err: any) {
    return {
      isValid: false,
      version: "Unknown",
      title: "Invalid Syntax",
      stats: {
        version: "Unknown",
        totalEndpoints: 0,
        methodCounts: { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 },
        totalSchemas: 0,
        totalSecuritySchemes: 0,
      },
      endpoints: [],
      findings: [],
      errorCount: 1,
      warningCount: 0,
      passCount: 0,
      parseError: err.message || "Failed to parse JSON/YAML spec",
      rawSpec: null,
    };
  }

  if (!doc || typeof doc !== "object") {
    return {
      isValid: false,
      version: "Unknown",
      title: "Invalid Specification",
      stats: {
        version: "Unknown",
        totalEndpoints: 0,
        methodCounts: { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 },
        totalSchemas: 0,
        totalSecuritySchemes: 0,
      },
      endpoints: [],
      findings: [],
      errorCount: 1,
      warningCount: 0,
      passCount: 0,
      parseError: "Specification payload is not a valid JSON/YAML object",
      rawSpec: null,
    };
  }

  const version = doc.openapi || doc.swagger || "3.0.0";
  const title = doc.info?.title || "API Contract Specification";
  const findings: ApiContractFinding[] = [];
  const endpoints: OpenApiEndpoint[] = [];

  const methodCounts = { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 };
  const schemasObj = doc.components?.schemas || doc.definitions || {};
  const totalSchemas = Object.keys(schemasObj).length;
  const secSchemesObj = doc.components?.securitySchemes || doc.securityDefinitions || {};
  const totalSecuritySchemes = Object.keys(secSchemesObj).length;

  // 1. Structure Analysis (Missing info or paths)
  if (!doc.info) {
    findings.push({
      id: "OPENAPI-MISSING-INFO",
      severity: "breaking",
      changeType: "structure_changed",
      path: "$.info",
      title: "Missing 'info' Object in OpenAPI Specification",
      explanation: "Specification is missing the required root 'info' object containing title and version.",
    });
  }

  if (!doc.paths || typeof doc.paths !== "object") {
    findings.push({
      id: "OPENAPI-MISSING-PATHS",
      severity: "breaking",
      changeType: "structure_changed",
      path: "$.paths",
      title: "Missing 'paths' Object in OpenAPI Specification",
      explanation: "Specification does not define any API endpoints under 'paths'.",
    });
  } else {
    // 2. Iterate Paths & Endpoints
    Object.entries(doc.paths).forEach(([pathKey, pathObj]: [string, any]) => {
      if (!pathObj || typeof pathObj !== "object") return;

      const validMethods = ["get", "post", "put", "delete", "patch", "options", "head"];
      Object.entries(pathObj).forEach(([methodKey, opObj]: [string, any]) => {
        const lowerMethod = methodKey.toLowerCase();
        if (!validMethods.includes(lowerMethod)) return;

        const upperMethod = lowerMethod.toUpperCase() as any;
        if (upperMethod in methodCounts) {
          (methodCounts as any)[upperMethod]++;
        }

        const endpointPath = `${upperMethod} ${pathKey}`;

        // Check path parameters in URL template vs parameters list
        const urlParamMatches = pathKey.match(/\{([a-zA-Z0-9_]+)\}/g) || [];
        const declaredParams = opObj.parameters || pathObj.parameters || [];

        urlParamMatches.forEach((match) => {
          const paramName = match.replace("{", "").replace("}", "");
          const isDeclared = declaredParams.some(
            (p: any) => p.name === paramName && (p.in === "path" || !p.in)
          );

          if (!isDeclared) {
            findings.push({
              id: `PARAM-MISSING-${endpointPath}-${paramName}`,
              severity: "breaking",
              changeType: "path_param_missing",
              path: endpointPath,
              title: `Undeclared Path Parameter '{${paramName}}'`,
              explanation: `URL path specifies '{${paramName}}', but no required path parameter named '${paramName}' is declared under parameters.`,
              recommendation: `Add '- name: ${paramName}, in: path, required: true' to parameter definitions.`,
            });
          }
        });

        // Check responses
        if (!opObj.responses || Object.keys(opObj.responses).length === 0) {
          findings.push({
            id: `RESP-MISSING-${endpointPath}`,
            severity: "breaking",
            changeType: "structure_changed",
            path: endpointPath,
            title: "Missing Operation Responses",
            explanation: `Endpoint '${endpointPath}' defines no HTTP response status codes under 'responses'.`,
          });
        }

        // Add to endpoints list
        endpoints.push({
          path: pathKey,
          method: upperMethod,
          summary: opObj.summary || opObj.description || "",
          operationId: opObj.operationId,
          parameters: declaredParams,
          responses: opObj.responses || {},
          security: opObj.security || doc.security || [],
          hasAuth: (opObj.security || doc.security || []).length > 0,
        });
      });
    });
  }

  // 3. $ref Resolution & Unresolved Reference Check
  function checkRefs(obj: any, currentPath: string) {
    if (!obj || typeof obj !== "object") return;

    if (typeof obj.$ref === "string") {
      const refResult = resolveLocalRef(doc, obj.$ref);
      if (refResult.error) {
        findings.push({
          id: `REF-UNRESOLVED-${currentPath}`,
          severity: "breaking",
          changeType: "unresolved_ref",
          path: currentPath,
          title: "Unresolved $ref Pointer",
          explanation: `Schema reference '${obj.$ref}' cannot be resolved in local contract document.`,
        });
      }
    } else {
      Object.entries(obj).forEach(([k, v]) => {
        checkRefs(v, currentPath === "$" ? `$.${k}` : `${currentPath}.${k}`);
      });
    }
  }

  checkRefs(doc.components || doc.definitions, "$.components");

  const breakingCount = findings.filter((f) => f.severity === "breaking").length;
  const potentialCount = findings.filter((f) => f.severity === "potential").length;
  const compatibleCount = findings.filter((f) => f.severity === "compatible").length;

  return {
    isValid: breakingCount === 0,
    version,
    title,
    stats: {
      version,
      totalEndpoints: endpoints.length,
      methodCounts,
      totalSchemas,
      totalSecuritySchemes,
    },
    endpoints,
    findings,
    errorCount: breakingCount,
    warningCount: potentialCount,
    passCount: compatibleCount + endpoints.length,
    rawSpec: doc,
  };
}
