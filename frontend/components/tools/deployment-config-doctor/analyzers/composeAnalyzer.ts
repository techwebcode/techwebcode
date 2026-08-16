import { ProjectFile, Finding } from "../types";

/**
 * Analyzes docker-compose.yml files for service networking, port exposure, and container anti-patterns.
 */
export function runComposeAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const composeFiles = files.filter((f) => f.type === "docker-compose");

  if (composeFiles.length === 0) return findings;

  composeFiles.forEach((file) => {
    const lines = file.lines;
    const assignedPorts = new Map<number, string>();

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // 1. Detect localhost networking issue between container services
      if (
        (trimmed.includes("localhost:") || trimmed.includes("127.0.0.1:")) &&
        (line.includes("API_URL") || line.includes("BACKEND_URL") || line.includes("DB_HOST") || line.includes("MYSQL_HOST") || line.includes("REDIS_HOST"))
      ) {
        const varName = trimmed.split("=")[0] || "API_URL";
        findings.push({
          id: `COMPOSE-LOCALHOST-NET-${file.path}-${idx}`,
          ruleId: "CMP-001",
          severity: "error",
          title: "Incorrect 'localhost' Container Networking",
          explanation: `Service environment variable '${varName}' uses 'localhost' or '127.0.0.1'. Inside Docker container networks, 'localhost' refers to the container itself, not other Docker Compose services.`,
          affectedFile: file.path,
          lineNumber: idx + 1,
          recommendedFix: `Change 'http://localhost:8080/api' to 'http://backend:8080/api' (using your target Compose service name).`,
        });
      }

      // 2. Detect dangerous public port exposure for databases (3306, 5432, 27017, 6379)
      if (trimmed.startsWith("-") && (trimmed.includes("3306:") || trimmed.includes("5432:") || trimmed.includes("27017:") || trimmed.includes("6379:"))) {
        const portMapping = trimmed.replace("-", "").trim().replace(/"/g, "").replace(/'/g, "");
        if (!portMapping.startsWith("127.0.0.1:")) {
          findings.push({
            id: `COMPOSE-PUBLIC-DB-PORT-${file.path}-${idx}`,
            ruleId: "CMP-002",
            severity: "warning",
            title: "Dangerous Public Database Port Exposure",
            explanation: `Database port mapping '${portMapping}' binds to all host interfaces (0.0.0.0), exposing your database directly to public internet attacks.`,
            affectedFile: file.path,
            lineNumber: idx + 1,
            recommendedFix: `Restrict host binding to localhost: '- "127.0.0.1:${portMapping}"'.`,
          });
        }
      }

      // 3. Port Collisions Check
      if (trimmed.startsWith("-") && trimmed.includes(":")) {
        const portMapping = trimmed.replace("-", "").trim().replace(/"/g, "").replace(/'/g, "");
        const hostPortStr = portMapping.split(":")[0];
        const hostPort = parseInt(hostPortStr, 10);

        if (!isNaN(hostPort) && hostPort > 0) {
          if (assignedPorts.has(hostPort)) {
            findings.push({
              id: `COMPOSE-PORT-CONFLICT-${file.path}-${idx}`,
              ruleId: "CMP-003",
              severity: "error",
              title: `Docker Host Port Collision on Port ${hostPort}`,
              explanation: `Host port ${hostPort} is mapped multiple times in ${file.name}. Container startup will fail due to port binding conflict.`,
              affectedFile: file.path,
              lineNumber: idx + 1,
              relatedFiles: [assignedPorts.get(hostPort)!],
              recommendedFix: `Change the host port mapping (e.g. '- "8081:${hostPort}"').`,
            });
          } else {
            assignedPorts.set(hostPort, `${file.path}:${idx + 1}`);
          }
        }
      }
    });

    // 4. Missing Persistent Volumes for Database Services
    const hasDbService = file.content.includes("image: mysql") || file.content.includes("image: postgres") || file.content.includes("image: mongo");
    const hasVolumes = file.content.includes("volumes:");
    if (hasDbService && !hasVolumes) {
      findings.push({
        id: `COMPOSE-MISSING-VOLUME-${file.path}`,
        ruleId: "CMP-004",
        severity: "warning",
        title: "Database Service Missing Persistent Volume Mount",
        explanation: `Database service found in ${file.name} without persistent named volume. Data will be lost when container restarts.`,
        affectedFile: file.path,
        recommendedFix: "Add a named volume mount (e.g. 'volumes:\n  - mysql_data:/var/lib/mysql').",
      });
    }
  });

  return findings;
}
