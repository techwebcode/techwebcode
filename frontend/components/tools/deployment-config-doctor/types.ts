export type ConfigFileType =
  | "env"
  | "docker-compose"
  | "dockerfile"
  | "nginx"
  | "next-config"
  | "kubernetes"
  | "github-actions"
  | "package-json"
  | "tsconfig"
  | "unknown";

export interface ProjectFile {
  path: string;
  name: string;
  type: ConfigFileType;
  content: string;
  lines: string[];
}

export type FindingSeverity = "error" | "warning" | "info" | "pass";
export type FindingConfidence = "High" | "Medium" | "Low";
export type FindingCategory =
  | "Docker"
  | "Kubernetes"
  | "Nginx"
  | "Environment"
  | "Next.js"
  | "CI/CD"
  | "Security";

export interface Finding {
  id: string;
  ruleId: string;
  severity: FindingSeverity;
  confidence?: FindingConfidence;
  category?: FindingCategory;
  title: string;
  explanation: string;
  whyItMatters?: string;
  affectedFile: string;
  lineNumber?: number;
  relatedFiles?: string[];
  recommendedFix?: string;
  originalSnippet?: string;
}

export interface K8sResource {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name?: string;
    namespace?: string;
    labels?: Record<string, string>;
  };
  spec?: any;
}

export interface NormalizedConfig {
  envVars: Map<string, { value: string; file: string; line: number }>;
  dockerExposedPorts: number[];
  dockerComposeServices: Map<string, any>;
  nginxUpstreams: Map<string, string[]>;
  nginxProxyPasses: string[];
  k8sResources: K8sResource[];
  nextConfig: Record<string, any>;
  packageDeps: Record<string, string>;
}

export interface RelationshipGraph {
  missingEnvInCompose: { varName: string; service: string; file: string }[];
  portMismatches: { servicePort: number; nginxPort: number; file: string }[];
  unboundPorts: { port: number; file: string }[];
  secretExposure: { key: string; file: string; line: number }[];
}

export interface AnalysisReport {
  files: ProjectFile[];
  findings: Finding[];
  errorCount: number;
  warningCount: number;
  passCount: number;
  healthScore: number;
  normalized: NormalizedConfig;
}
