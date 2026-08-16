import YAML from "yaml";
import { ProjectFile, Finding } from "../types";

/**
 * Analyzes GitHub Actions workflow files (.github/workflows/*.yml).
 */
export function runGithubActionsAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const workflowFiles = files.filter((f) => f.type === "github-actions");

  if (workflowFiles.length === 0) return findings;

  workflowFiles.forEach((file) => {
    try {
      const doc = YAML.parse(file.content);
      if (!doc || typeof doc !== "object" || !doc.jobs) return;

      const jobs = doc.jobs;
      const jobNames = new Set(Object.keys(jobs));

      // 1. Check job dependencies (needs:)
      Object.entries(jobs).forEach(([jobKey, jobObj]: [string, any]) => {
        if (jobObj.needs) {
          const neededList = Array.isArray(jobObj.needs) ? jobObj.needs : [jobObj.needs];
          neededList.forEach((neededJob: string) => {
            if (!jobNames.has(neededJob)) {
              findings.push({
                id: `GHA-INVALID-NEEDS-${file.path}-${jobKey}-${neededJob}`,
                ruleId: "GHA-001",
                severity: "error",
                confidence: "High",
                title: `Invalid Job Dependency 'needs: ${neededJob}'`,
                explanation: `Job '${jobKey}' specifies 'needs: ${neededJob}', but no job named '${neededJob}' is defined in ${file.name}.`,
                affectedFile: file.path,
                recommendedFix: `Update 'needs:' in job '${jobKey}' to reference an existing job (${Array.from(jobNames).join(", ")}).`,
              });
            }
          });
        }

        // 2. Check for missing actions/checkout step
        const steps = jobObj.steps || [];
        const hasCheckout = steps.some(
          (s: any) => typeof s.uses === "string" && s.uses.includes("actions/checkout")
        );

        if (!hasCheckout && steps.length > 0) {
          findings.push({
            id: `GHA-MISSING-CHECKOUT-${file.path}-${jobKey}`,
            ruleId: "GHA-002",
            severity: "warning",
            confidence: "High",
            title: `Missing 'actions/checkout' Step in Job '${jobKey}'`,
            explanation: `Job '${jobKey}' executes build/test steps without running 'actions/checkout' first to clone repository source code.`,
            affectedFile: file.path,
            recommendedFix: "Add '- uses: actions/checkout@v4' as the first step in your job.",
          });
        }
      });

      // 3. Cross-Check: Workflow references files that do not exist in the project
      file.lines.forEach((line, idx) => {
        if (line.includes("docker-compose.prod.yml") || line.includes("docker-compose.production.yml")) {
          const hasProdCompose = files.some(
            (f) => f.name === "docker-compose.prod.yml" || f.name === "docker-compose.production.yml"
          );
          if (!hasProdCompose) {
            findings.push({
              id: `GHA-MISSING-PROD-COMPOSE-${file.path}-${idx}`,
              ruleId: "GHA-003",
              severity: "error",
              confidence: "High",
              title: "Workflow References Missing Production Compose File",
              explanation: `GitHub Actions workflow references 'docker-compose.prod.yml' on line ${idx + 1}, but this file was not found in the project.`,
              affectedFile: file.path,
              lineNumber: idx + 1,
              recommendedFix: "Create 'docker-compose.prod.yml' or update the workflow to reference an existing compose file.",
            });
          }
        }
      });
    } catch (err) {
      // Ignore YAML parse errors
    }
  });

  return findings;
}
