export type FindingSeverity = "breaking" | "potential" | "compatible";

export type FindingChangeType =
  | "field_removed"
  | "field_added"
  | "type_changed"
  | "nullability_changed"
  | "structure_changed"
  | "array_item_changed"
  | "path_param_missing"
  | "unresolved_ref"
  | "security_mismatch"
  | "schema_violation"
  | "enum_changed"
  | "constraint_stricter"
  | "constraint_relaxed";

export interface ApiContractFinding {
  id: string;
  severity: FindingSeverity;
  changeType: FindingChangeType;
  path: string; // JSONPath or Endpoint path e.g. $.user.id or GET /users/{id}
  previousType?: string;
  previousValue?: any;
  currentType?: string;
  currentValue?: any;
  title: string;
  explanation: string;
  recommendation?: string;
}

export interface CompatibilityReport {
  overallStatus: "breaking" | "potential" | "compatible";
  breakingCount: number;
  potentialCount: number;
  compatibleCount: number;
  findings: ApiContractFinding[];
  isPreviousValid: boolean;
  isCurrentValid: boolean;
  parseErrorPrevious?: string;
  parseErrorCurrent?: string;
}

export interface OpenApiEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
  summary?: string;
  operationId?: string;
  parameters: Array<{
    name: string;
    in: "path" | "query" | "header" | "cookie";
    required?: boolean;
    schema?: any;
  }>;
  responses: Record<string, { description?: string; schema?: any; content?: any }>;
  security?: any[];
  hasAuth: boolean;
}

export interface OpenApiStats {
  version: string;
  totalEndpoints: number;
  methodCounts: {
    GET: number;
    POST: number;
    PUT: number;
    DELETE: number;
    PATCH: number;
  };
  totalSchemas: number;
  totalSecuritySchemes: number;
}

export interface OpenApiReport {
  isValid: boolean;
  version: string;
  title: string;
  stats: OpenApiStats;
  endpoints: OpenApiEndpoint[];
  findings: ApiContractFinding[];
  errorCount: number;
  warningCount: number;
  passCount: number;
  parseError?: string;
  rawSpec: any;
}

export type SchemaCompatibilityMode = "request" | "response";

export interface SchemaTreeNode {
  key: string;
  path: string;
  status: "unchanged" | "added" | "removed" | "changed";
  severity?: FindingSeverity;
  previousType?: string;
  currentType?: string;
  children?: SchemaTreeNode[];
}

export interface SchemaComparisonReport {
  mode: SchemaCompatibilityMode;
  overallStatus: "breaking" | "potential" | "compatible";
  breakingCount: number;
  potentialCount: number;
  compatibleCount: number;
  findings: ApiContractFinding[];
  treeNodes: SchemaTreeNode[];
  migrationSteps: string[];
}
