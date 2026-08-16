import { ProjectFile, Finding } from "../types";

/**
 * Performs cross-file validation across Dockerfile, docker-compose.yml, Nginx, and .env files.
 */
export function runCrossFileAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];

  const envFiles = files.filter((f) => f.type === "env");
  const composeFiles = files.filter((f) => f.type === "docker-compose");
  const dockerfiles = files.filter((f) => f.type === "dockerfile");
  const nginxFiles = files.filter((f) => f.type === "nginx");

  // 1. Cross-Check: Variables referenced in Compose (${VAR_NAME}) vs defined in .env
  if (composeFiles.length > 0 && envFiles.length > 0) {
    const definedEnvKeys = new Set<string>();
    envFiles.forEach((file) => {
      file.lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          definedEnvKeys.add(trimmed.split("=")[0].trim());
        }
      });
    });

    composeFiles.forEach((file) => {
      file.lines.forEach((line, idx) => {
        const matches = line.match(/\$\{([a-zA-Z0-9_]+)\}/g);
        if (matches) {
          matches.forEach((m) => {
            const varName = m.replace("${", "").replace("}", "");
            if (!definedEnvKeys.has(varName)) {
              findings.push({
                id: `CROSS-UNBOUND-ENV-${file.path}-${varName}-${idx}`,
                ruleId: "CRS-001",
                severity: "error",
                confidence: "High",
                title: `Undefined Environment Variable '${varName}' in Compose`,
                explanation: `Docker Compose references '\${${varName}}' on line ${idx + 1}, but '${varName}' is not defined in any loaded .env file.`,
                affectedFile: file.path,
                lineNumber: idx + 1,
                relatedFiles: envFiles.map((f) => f.path),
                recommendedFix: `Define '${varName}=your_value_here' in your .env file.`,
              });
            }
          });
        }
      });
    });
  }

  // 2. Cross-Check: Dockerfile EXPOSE port vs docker-compose port mapping
  if (dockerfiles.length > 0 && composeFiles.length > 0) {
    dockerfiles.forEach((df) => {
      df.lines.forEach((dLine) => {
        if (dLine.trim().toUpperCase().startsWith("EXPOSE ")) {
          const exposedPort = dLine.trim().split(/\s+/)[1];
          if (exposedPort) {
            composeFiles.forEach((cf) => {
              const hasPortInCompose = cf.content.includes(`:${exposedPort}`);
              if (!hasPortInCompose) {
                findings.push({
                  id: `CROSS-PORT-MISMATCH-${df.path}-${exposedPort}`,
                  ruleId: "CRS-002",
                  severity: "info",
                  confidence: "High",
                  title: `Exposed Container Port ${exposedPort} Not Mapped in Compose`,
                  explanation: `Dockerfile in ${df.name} exposes port ${exposedPort}, but ${cf.name} does not map container port :${exposedPort}.`,
                  affectedFile: cf.path,
                  relatedFiles: [df.path],
                  recommendedFix: `Ensure port mapping in ${cf.name} includes container port :${exposedPort} (e.g. '- "8080:${exposedPort}"').`,
                });
              }
            });
          }
        }
      });
    });
  }

  // 3. Cross-Check: Filesystem Media Path Mismatch between Application & Nginx Alias
  if (nginxFiles.length > 0) {
    nginxFiles.forEach((nf) => {
      nf.lines.forEach((line, idx) => {
        if (line.includes("alias /var/www/") || line.includes("root /var/www/")) {
          const nginxPath = line.trim().split(/\s+/)[1]?.replace(";", "") || "";
          envFiles.forEach((ef) => {
            ef.lines.forEach((eLine) => {
              if ((eLine.includes("UPLOAD_PATH=") || eLine.includes("MEDIA_PATH=")) && !eLine.includes(nginxPath)) {
                const appPath = eLine.split("=")[1]?.trim();
                findings.push({
                  id: `CROSS-PATH-MISMATCH-${nf.path}-${idx}`,
                  ruleId: "CRS-003",
                  severity: "error",
                  confidence: "Medium",
                  title: "Filesystem Upload Path Mismatch (Nginx vs .env)",
                  explanation: `Nginx config defines media location '${nginxPath}', but .env defines UPLOAD_PATH='${appPath}'. Host Nginx will fail to serve uploaded media files.`,
                  affectedFile: nf.path,
                  lineNumber: idx + 1,
                  relatedFiles: [ef.path],
                  recommendedFix: `Align UPLOAD_PATH in ${ef.name} and Nginx alias directive to use the exact same host directory path.`,
                });
              }
            });
          });
        }
      });
    });
  }

  return findings;
}
