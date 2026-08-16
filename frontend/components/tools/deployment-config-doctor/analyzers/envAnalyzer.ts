import { ProjectFile, Finding } from "../types";

/**
 * Masks sensitive values for security (e.g. ADMIN_SECRET=••••••••••)
 */
export function maskSecretValue(value: string): string {
  if (!value) return "";
  return "••••••••••";
}

/**
 * Checks if a key or line looks like a sensitive secret.
 */
export function isSensitiveKey(key: string): boolean {
  const upper = key.toUpperCase();
  return (
    upper.includes("SECRET") ||
    upper.includes("PASSWORD") ||
    upper.includes("PASS") ||
    upper.includes("KEY") ||
    upper.includes("TOKEN") ||
    upper.includes("AUTH") ||
    upper.includes("PRIVATE") ||
    upper.includes("CREDENTIAL")
  );
}

/**
 * Analyzes .env, .env.example, .env.local, .env.production files.
 */
export function runEnvAnalyzer(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  const envFiles = files.filter((f) => f.type === "env");

  if (envFiles.length === 0) return findings;

  const exampleFile = envFiles.find(
    (f) => f.name.toLowerCase() === ".env.example" || f.name.toLowerCase() === ".env.sample"
  );
  const mainEnvFile = envFiles.find(
    (f) => f.name.toLowerCase() === ".env" || f.name.toLowerCase() === ".env.local"
  );

  // 1. Compare .env against .env.example for missing variables
  if (exampleFile && mainEnvFile) {
    const exampleKeys = new Set<string>();
    exampleFile.lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        exampleKeys.add(trimmed.split("=")[0].trim());
      }
    });

    const mainKeys = new Set<string>();
    mainEnvFile.lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        mainKeys.add(trimmed.split("=")[0].trim());
      }
    });

    exampleKeys.forEach((key) => {
      if (!mainKeys.has(key)) {
        findings.push({
          id: `ENV-MISSING-${key}`,
          ruleId: "ENV-001",
          severity: "error",
          title: `Missing Environment Variable '${key}'`,
          explanation: `Variable '${key}' is defined in ${exampleFile.name} but missing from ${mainEnvFile.name}.`,
          affectedFile: mainEnvFile.path,
          relatedFiles: [exampleFile.path],
          recommendedFix: `Add '${key}=value' to your ${mainEnvFile.name} file.`,
        });
      }
    });
  }

  // 2. Check each .env file for duplicates, exposed secrets, and inconsistent naming
  envFiles.forEach((file) => {
    const seenKeys = new Map<string, number>();

    file.lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;

      const [rawKey, ...valParts] = trimmed.split("=");
      const key = rawKey.trim();
      const val = valParts.join("=").trim();

      // Duplicate Key check
      if (seenKeys.has(key)) {
        findings.push({
          id: `ENV-DUP-${file.path}-${key}-${idx}`,
          ruleId: "ENV-002",
          severity: "warning",
          title: `Duplicate Environment Variable '${key}'`,
          explanation: `Variable '${key}' is defined multiple times in ${file.name}. The later definition overrides earlier ones.`,
          affectedFile: file.path,
          lineNumber: idx + 1,
          recommendedFix: `Remove duplicate '${key}' entry on line ${idx + 1}.`,
        });
      } else {
        seenKeys.set(key, idx + 1);
      }

      // Check NEXT_PUBLIC_ secret exposure
      if (key.startsWith("NEXT_PUBLIC_") && isSensitiveKey(key)) {
        findings.push({
          id: `ENV-NEXT-PUBLIC-SECRET-${file.path}-${idx}`,
          ruleId: "ENV-003",
          severity: "error",
          title: `Client-Exposed Secret Variable '${key}'`,
          explanation: `Variable '${key}' uses the NEXT_PUBLIC_ prefix, bundling '${key}=${maskSecretValue(val)}' into public client JavaScript.`,
          affectedFile: file.path,
          lineNumber: idx + 1,
          recommendedFix: `Remove the NEXT_PUBLIC_ prefix so '${key}' remains a server-side secret.`,
        });
      }

      // Check for unmasked hardcoded secrets in .env.example
      if (file.name.toLowerCase().includes("example") && val && !val.includes("your_") && !val.includes("<") && isSensitiveKey(key)) {
        findings.push({
          id: `ENV-EXAMPLE-HARDCODED-${file.path}-${idx}`,
          ruleId: "ENV-004",
          severity: "warning",
          title: `Hardcoded Secret in Example Environment File`,
          explanation: `Found actual secret value '${key}=${maskSecretValue(val)}' in ${file.name}. Example files should contain placeholder values.`,
          affectedFile: file.path,
          lineNumber: idx + 1,
          recommendedFix: `Replace actual secret value with a placeholder like '${key}=your_${key.toLowerCase()}_here'.`,
        });
      }
    });
  });

  return findings;
}
