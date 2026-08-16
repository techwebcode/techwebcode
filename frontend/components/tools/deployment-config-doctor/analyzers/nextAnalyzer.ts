import { ProjectFile, Finding } from "../types";

/**
 * Analyzes Next.config files, package.json, and Next.js environment configurations.
 */
export function runNextAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const nextConfigFiles = files.filter((f) => f.type === "next-config");
  const packageFile = files.find((f) => f.type === "package-json");
  const dockerFiles = files.filter((f) => f.type === "dockerfile");

  const isNextApp = packageFile?.content.includes('"next"') || nextConfigFiles.length > 0;
  if (!isNextApp) return findings;

  // 1. Standalone Output Mode Check for Docker Builds
  if (dockerFiles.length > 0) {
    const hasStandalone = nextConfigFiles.some((f) => f.content.includes('output: "standalone"') || f.content.includes("output: 'standalone'"));
    if (!hasStandalone) {
      findings.push({
        id: "NEXT-MISSING-STANDALONE",
        ruleId: "NXT-001",
        severity: "warning",
        title: "Next.js Missing Standalone Output Mode for Docker",
        explanation: "Dockerfile detected for Next.js app, but next.config.js does not specify output: 'standalone'. Standalone mode reduces container bundle size by up to 80%.",
        affectedFile: nextConfigFiles[0]?.path || "next.config.js",
        relatedFiles: dockerFiles.map((d) => d.path),
        recommendedFix: "Add 'output: \"standalone\"' to your next.config.js object export.",
      });
    }
  }

  // 2. Client vs Server API URL Check
  const envFiles = files.filter((f) => f.type === "env");
  envFiles.forEach((f) => {
    const hasInternalUrl = f.content.includes("INTERNAL_API_URL=");
    const hasPublicUrl = f.content.includes("NEXT_PUBLIC_API_URL=");

    if (dockerFiles.length > 0 && hasPublicUrl && !hasInternalUrl) {
      findings.push({
        id: `NEXT-API-URL-CONTAINER-${f.path}`,
        ruleId: "NXT-002",
        severity: "info",
        title: "Next.js Server-Side API URL Strategy Notice",
        explanation: "Next.js app running inside Docker Compose uses NEXT_PUBLIC_API_URL for client requests. Server-side rendering (SSR) inside container networks requires an INTERNAL_API_URL (e.g. http://backend:8080/api).",
        affectedFile: f.path,
        recommendedFix: "Define INTERNAL_API_URL=http://backend:8080/api for Next.js SSR server requests, and NEXT_PUBLIC_API_URL for client browser requests.",
      });
    }
  });

  return findings;
}
