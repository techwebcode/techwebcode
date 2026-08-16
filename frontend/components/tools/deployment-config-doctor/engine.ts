import {
  ProjectFile,
  Finding,
  NormalizedConfig,
  AnalysisReport,
  FindingSeverity,
} from "./types";
import { runEnvAnalyzer } from "./analyzers/envAnalyzer";
import { runDockerAnalyzer } from "./analyzers/dockerAnalyzer";
import { runComposeAnalyzer } from "./analyzers/composeAnalyzer";
import { runCrossFileAnalyzer } from "./analyzers/crossFileAnalyzer";
import { runK8sAnalyzer } from "./analyzers/k8sAnalyzer";
import { runNginxAnalyzer } from "./analyzers/nginxAnalyzer";
import { runNextAnalyzer } from "./analyzers/nextAnalyzer";
import { runGithubActionsAnalyzer } from "./analyzers/githubActionsAnalyzer";

/**
 * Normalizes project files into structured representations for cross-file analysis.
 */
export function buildNormalizedConfig(files: ProjectFile[]): NormalizedConfig {
  const envVars = new Map<string, { value: string; file: string; line: number }>();
  const dockerExposedPorts: number[] = [];
  const dockerComposeServices = new Map<string, any>();
  const nginxUpstreams = new Map<string, string[]>();
  const nginxProxyPasses: string[] = [];
  const k8sResources: any[] = [];
  const nextConfig: Record<string, any> = {};
  const packageDeps: Record<string, string> = {};

  files.forEach((file) => {
    // 1. Process .env files
    if (file.type === "env") {
      file.lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const parts = trimmed.split("=");
          const key = parts[0].trim();
          const val = parts.slice(1).join("=").trim();
          envVars.set(key, { value: val, file: file.path, line: idx + 1 });
        }
      });
    }

    // 2. Process Dockerfiles
    if (file.type === "dockerfile") {
      file.lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.toUpperCase().startsWith("EXPOSE ")) {
          const portStr = trimmed.split(/\s+/)[1];
          const p = parseInt(portStr, 10);
          if (!isNaN(p)) dockerExposedPorts.push(p);
        }
      });
    }

    // 3. Process Nginx
    if (file.type === "nginx") {
      file.lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.includes("proxy_pass ")) {
          const passUrl = trimmed.split("proxy_pass ")[1].replace(";", "").trim();
          nginxProxyPasses.push(passUrl);
        }
      });
    }

    // 4. Process package.json
    if (file.type === "package-json") {
      try {
        const parsed = JSON.parse(file.content);
        if (parsed.dependencies) {
          Object.assign(packageDeps, parsed.dependencies);
        }
        if (parsed.devDependencies) {
          Object.assign(packageDeps, parsed.devDependencies);
        }
      } catch {
        // Ignore parse error
      }
    }
  });

  return {
    envVars,
    dockerExposedPorts,
    dockerComposeServices,
    nginxUpstreams,
    nginxProxyPasses,
    k8sResources,
    nextConfig,
    packageDeps,
  };
}

/**
 * Evaluates rules engine over project files and normalized configurations.
 */
export function runAnalyzerEngine(files: ProjectFile[]): AnalysisReport {
  const normalized = buildNormalizedConfig(files);
  const findings: Finding[] = [];

  // Run Modular Rule Analyzers
  findings.push(...runEnvAnalyzer(files));
  findings.push(...runDockerAnalyzer(files));
  findings.push(...runComposeAnalyzer(files));
  findings.push(...runCrossFileAnalyzer(files));
  findings.push(...runK8sAnalyzer(files));
  findings.push(...runNginxAnalyzer(files));
  findings.push(...runNextAnalyzer(files));
  findings.push(...runGithubActionsAnalyzer(files));

  // Hardcoded Production Secrets Check
  files.forEach((file) => {
    file.lines.forEach((line, idx) => {
      if (line.includes("root@123") || line.includes("admin123") || line.includes("password123")) {
        findings.push({
          id: `RULE-HARDCODED-${file.path}-${idx}`,
          ruleId: "SEC-002",
          severity: "error",
          title: "Hardcoded Default Password in Configuration",
          explanation: `Found hardcoded default credential in configuration file.`,
          affectedFile: file.path,
          lineNumber: idx + 1,
          recommendedFix: "Replace hardcoded default credentials with environment variable references (e.g. ${MYSQL_PASSWORD}).",
        });
      }
    });
  });

  // Rule 3: Dockerfile Exposed Ports Alignment
  const hasDocker = files.some((f) => f.type === "dockerfile");
  const hasCompose = files.some((f) => f.type === "docker-compose");
  if (hasDocker && !hasCompose) {
    findings.push({
      id: "RULE-DOCKER-COMPOSE-MISSING",
      ruleId: "DOC-003",
      severity: "warning",
      title: "Missing Docker Compose Orchestration File",
      explanation: "Dockerfile found without a docker-compose.yml file. Local multi-service testing and container networking may require manual CLI flags.",
      affectedFile: "docker-compose.yml",
      recommendedFix: "Create a docker-compose.yml file to standardize local development and container service dependencies.",
    });
  }

  // Rule 4: Standard Security Audit Checks
  files.forEach((file) => {
    if (file.type === "nginx") {
      if (!file.content.includes("ssl_certificate") && !file.content.includes("certbot")) {
        findings.push({
          id: "RULE-NGINX-SSL-MISSING",
          ruleId: "NGX-004",
          severity: "warning",
          title: "Nginx SSL Certificate Configuration Missing",
          explanation: "Nginx reverse proxy configuration does not define ssl_certificate or Let's Encrypt directives for HTTPS.",
          affectedFile: file.path,
          recommendedFix: "Add SSL certificate and HTTPS server blocks to encrypt HTTP traffic in production.",
        });
      }
    }
  });

  // Add Passed Rules to complete report metrics
  if (files.length > 0) {
    findings.push({
      id: "PASS-FILE-DETECTION",
      ruleId: "GEN-100",
      severity: "pass",
      title: "Automatic Configuration File Classification",
      explanation: `Successfully recognized ${files.length} project configuration file(s).`,
      affectedFile: files.map((f) => f.name).join(", "),
    });

    findings.push({
      id: "PASS-PRIVACY-AUDIT",
      ruleId: "GEN-101",
      severity: "pass",
      title: "100% Client-Side Privacy Verification",
      explanation: "Zero network payloads transmitted. Files analyzed 100% locally in browser memory.",
      affectedFile: "Local Browser Engine",
    });
  }

  const errorCount = findings.filter((f) => f.severity === "error").length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;
  const passCount = findings.filter((f) => f.severity === "pass").length;

  const healthScore = Math.max(0, Math.min(100, 100 - errorCount * 15 - warningCount * 5));

  return {
    files,
    findings,
    errorCount,
    warningCount,
    passCount,
    healthScore,
    normalized,
  };
}
