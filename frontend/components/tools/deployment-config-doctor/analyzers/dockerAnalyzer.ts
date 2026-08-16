import { ProjectFile, Finding } from "../types";

/**
 * Analyzes Dockerfile instructions and best practices.
 */
export function runDockerAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const dockerfiles = files.filter((f) => f.type === "dockerfile");

  if (dockerfiles.length === 0) return findings;

  dockerfiles.forEach((file) => {
    let hasExpose = false;
    let hasUser = false;
    let fromCount = 0;
    let isNodeOrGo = false;

    file.lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const upper = trimmed.toUpperCase();

      // Check FROM base image
      if (upper.startsWith("FROM ")) {
        fromCount++;
        const imageTag = trimmed.split(/\s+/)[1] || "";
        if (imageTag.includes("node") || imageTag.includes("golang") || imageTag.includes("python")) {
          isNodeOrGo = true;
        }

        // Unpinned :latest image tag
        if (imageTag.endsWith(":latest") || (!imageTag.includes(":") && !imageTag.includes("@"))) {
          findings.push({
            id: `DOCKER-UNPINNED-${file.path}-${idx}`,
            ruleId: "DOC-001",
            severity: "warning",
            title: "Unpinned Docker Base Image Tag",
            explanation: `Base image '${imageTag}' uses unpinned ':latest' tag. Future builds can pull breaking base image updates.`,
            affectedFile: file.path,
            lineNumber: idx + 1,
            recommendedFix: `Pin base image to an explicit version (e.g., 'FROM ${imageTag.split(":")[0]}:22-alpine').`,
          });
        }
      }

      if (upper.startsWith("EXPOSE ")) {
        hasExpose = true;
      }

      if (upper.startsWith("USER ") && !upper.includes("ROOT")) {
        hasUser = true;
      }

      // Dangerous hardcoded secrets in ENV or ARG
      if (upper.startsWith("ENV ") || upper.startsWith("ARG ")) {
        if (upper.includes("PASSWORD=") || upper.includes("SECRET=") || upper.includes("KEY=")) {
          findings.push({
            id: `DOCKER-SECRET-ENV-${file.path}-${idx}`,
            ruleId: "DOC-002",
            severity: "error",
            title: "Hardcoded Secret in Dockerfile Directive",
            explanation: "Storing secrets in Dockerfile ENV or ARG directives bakes sensitive credentials into public Docker image layers.",
            affectedFile: file.path,
            lineNumber: idx + 1,
            recommendedFix: "Remove hardcoded secret values. Pass runtime environment variables via docker-compose.yml or container engine.",
          });
        }
      }
    });

    // Check missing EXPOSE
    if (!hasExpose) {
      findings.push({
        id: `DOCKER-MISSING-EXPOSE-${file.path}`,
        ruleId: "DOC-003",
        severity: "warning",
        title: "Missing EXPOSE Port Directive",
        explanation: `Dockerfile in ${file.name} does not explicitly EXPOSE container listening ports.`,
        affectedFile: file.path,
        recommendedFix: "Add 'EXPOSE 8080' (or your application container port) to document container networking interfaces.",
      });
    }

    // Check non-root USER
    if (!hasUser) {
      findings.push({
        id: `DOCKER-ROOT-USER-${file.path}`,
        ruleId: "DOC-004",
        severity: "warning",
        title: "Container Running as Root User",
        explanation: `Dockerfile in ${file.name} does not specify a non-root USER directive.`,
        affectedFile: file.path,
        recommendedFix: "Add a non-root user (e.g. 'USER node' or 'USER 1001') to prevent container breakout vulnerabilities.",
      });
    }

    // Check multi-stage build optimization
    if (isNodeOrGo && fromCount < 2) {
      findings.push({
        id: `DOCKER-MULTI-STAGE-${file.path}`,
        ruleId: "DOC-005",
        severity: "info",
        title: "Single-Stage Docker Build Notice",
        explanation: `Dockerfile uses a single build stage for Node/Go application. Multi-stage builds reduce final production image size significantly.`,
        affectedFile: file.path,
        recommendedFix: "Use multi-stage build ('FROM node:22-alpine AS builder' ... 'FROM node:22-alpine AS runner').",
      });
    }
  });

  return findings;
}
